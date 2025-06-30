# Flask API server for backend
from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

data = {"1": {"key": "value"}}

@app.route('/')
def index():
    return 'Welcome to the Python Flask API backend! Try /api/example.'

@app.route('/api/example', methods=['GET'])
def get_example():
    return jsonify(list(data.values())), 200

@app.route('/api/example', methods=['POST'])
def post_example():
    new_data = request.get_json()
    new_id = str(len(data) + 1)
    data[new_id] = new_data
    return jsonify({"id": new_id, **new_data}), 201

@app.route('/api/example/<id>', methods=['PUT'])
def put_example(id):
    if id in data:
        data[id] = request.get_json()
        return jsonify({"id": id, **data[id]}), 200
    return jsonify({"error": "Not found"}), 404

@app.route('/api/example/<id>', methods=['DELETE'])
def delete_example(id):
    if id in data:
        del data[id]
        return '', 204
    return jsonify({"error": "Not found"}), 404

# Serve React static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.join(app.root_path, '../public'), filename)

# Serve React index.html for all other routes (SPA)
@app.route('/<path:path>')
def serve_react(path):
    if os.path.exists(os.path.join(app.root_path, '../public', path)):
        return send_from_directory(os.path.join(app.root_path, '../public'), path)
    return send_from_directory(os.path.join(app.root_path, '../public'), 'index.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=True)
