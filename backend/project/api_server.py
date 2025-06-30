from flask import Flask, request, jsonify
from .utils import get_python_info
from .models import User
from .security import hash_password, check_password
import random

app = Flask(__name__)

# In-memory example data for demonstration
example_data = {"1": {"key": "value"}}

# In-memory user store (username: User instance, password hash)
users = {
    "testuser": {
        "user": User("1", "testuser", "test@example.com"),
        "password_hash": hash_password("password123")
    }
}

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
    """Return example data."""
    return jsonify(list(example_data.values())), 200

@app.route('/api/example', methods=['POST'])
def post_example():
    """Add new example data."""
    new_data = request.get_json()
    new_id = str(len(example_data) + 1)
    example_data[new_id] = new_data
    return jsonify({"id": new_id, **new_data}), 201

@app.route('/api/example/<id>', methods=['PUT'])
def put_example(id):
    """Update example data by ID."""
    if id in example_data:
        example_data[id] = request.get_json()
        return jsonify({"id": id, **example_data[id]}), 200
    return jsonify({"error": "Not found"}), 404

@app.route('/api/example/<id>', methods=['DELETE'])
def delete_example(id):
    """Delete example data by ID."""
    if id in example_data:
        del example_data[id]
        return '', 204
    return jsonify({"error": "Not found"}), 404

@app.route('/api/python-info', methods=['GET'])
def python_info():
    """Return Python environment info."""
    return jsonify(get_python_info()), 200

@app.route('/api/python-fun-fact', methods=['GET'])
def python_fun_fact():
    """Return a random Python fun fact."""
    return jsonify({"fact": random.choice(PYTHON_FUN_FACTS)}), 200

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    """Evaluate a simple Python expression (safe built-ins only)."""
    data = request.get_json()
    expr = data.get('expression', '')
    try:
        allowed_builtins = {'abs': abs, 'min': min, 'max': max, 'sum': sum, 'len': len, 'round': round}
        result = eval(expr, {"__builtins__": allowed_builtins}, {})
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate a user."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_entry = users.get(username)
    if user_entry and check_password(password, user_entry['password_hash']):
        return jsonify({"success": True, "user": user_entry['user'].to_dict()}), 200
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    """Register a new user."""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({"success": False, "error": "All fields are required."}), 400
    if username in users:
        return jsonify({"success": False, "error": "Username already exists."}), 409
    user_id = str(len(users) + 1)
    new_user = User(user_id, username, email)
    users[username] = {
        "user": new_user,
        "password_hash": hash_password(password)
    }
    return jsonify({"success": True, "user": new_user.to_dict()}), 201

if __name__ == '__main__':
    # Run the API server
    app.run(port=3000, debug=True)
