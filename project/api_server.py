from flask import Flask, request, jsonify
from utils import get_python_info
import random

app = Flask(__name__)

# In-memory example data
data = {"1": {"key": "value"}}

PYTHON_FUN_FACTS = [
    "Python was named after Monty Python, not the snake!",
    "Python supports multiple programming paradigms.",
    "The Zen of Python can be accessed by typing 'import this' in a Python shell.",
    "Python's creator is Guido van Rossum.",
    "List comprehensions are a powerful feature in Python.",
    "Python is one of the most popular languages for AI and data science.",
    "Whitespace matters in Python!",
    "Python 3 was released in 2008.",
    "You can use underscores in numeric literals for readability (e.g., 1_000_000)."
]

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

@app.route('/api/python-info', methods=['GET'])
def python_info():
    return jsonify(get_python_info()), 200

@app.route('/api/python-fun-fact', methods=['GET'])
def python_fun_fact():
    return jsonify({"fact": random.choice(PYTHON_FUN_FACTS)}), 200

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    expr = data.get('expression', '')
    try:
        # Only allow safe built-ins
        allowed_builtins = {'abs': abs, 'min': min, 'max': max, 'sum': sum, 'len': len, 'round': round}
        result = eval(expr, {"__builtins__": allowed_builtins}, {})
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=3000, debug=True)
