<<<<<<< HEAD:project/api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_python_info
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Post, Transaction
=======
from flask import Blueprint, request, jsonify
from .utils import get_python_info
from .models import User
from .security import hash_password, check_password
>>>>>>> 3a3dced608da4e1c7c7706a88b74a2b92885f236:backend/project/api_server.py
import random
import os
from payment_api import payment_bp  # Import the payment blueprint

<<<<<<< HEAD:project/api_server.py
app = Flask(__name__)
CORS(app)

# Register the payment blueprint
app.register_blueprint(payment_bp)
=======
api_server_bp = Blueprint('api_server', __name__)

# In-memory example data for demonstration
example_data = {"1": {"key": "value"}}
>>>>>>> 3a3dced608da4e1c7c7706a88b74a2b92885f236:backend/project/api_server.py

# Configure SQLAlchemy and JWT
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret')
db.init_app(app)
jwt = JWTManager(app)

# Create the database tables
with app.app_context():
    db.create_all()

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

<<<<<<< HEAD:project/api_server.py
@app.route('/api/python-info', methods=['GET'])
=======
@api_server_bp.route('/api/example', methods=['GET'])
def get_example():
    """Return example data."""
    return jsonify(list(example_data.values())), 200

@api_server_bp.route('/api/example', methods=['POST'])
def post_example():
    """Add new example data."""
    new_data = request.get_json()
    new_id = str(len(example_data) + 1)
    example_data[new_id] = new_data
    return jsonify({"id": new_id, **new_data}), 201

@api_server_bp.route('/api/example/<id>', methods=['PUT'])
def put_example(id):
    """Update example data by ID."""
    if id in example_data:
        example_data[id] = request.get_json()
        return jsonify({"id": id, **example_data[id]}), 200
    return jsonify({"error": "Not found"}), 404

@api_server_bp.route('/api/example/<id>', methods=['DELETE'])
def delete_example(id):
    """Delete example data by ID."""
    if id in example_data:
        del example_data[id]
        return '', 204
    return jsonify({"error": "Not found"}), 404

@api_server_bp.route('/api/python-info', methods=['GET'])
>>>>>>> 3a3dced608da4e1c7c7706a88b74a2b92885f236:backend/project/api_server.py
def python_info():
    """Return Python environment info."""
    return jsonify(get_python_info()), 200

@api_server_bp.route('/api/python-fun-fact', methods=['GET'])
def python_fun_fact():
    """Return a random Python fun fact."""
    return jsonify({"fact": random.choice(PYTHON_FUN_FACTS)}), 200

@api_server_bp.route('/api/evaluate', methods=['POST'])
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

<<<<<<< HEAD:project/api_server.py
@app.route('/api/signup', methods=['POST'])
=======
@api_server_bp.route('/api/login', methods=['POST'])
def login():
    """Authenticate a user."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_entry = users.get(username)
    if user_entry and check_password(password, user_entry['password_hash']):
        return jsonify({"success": True, "user": user_entry['user'].to_dict()}), 200
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@api_server_bp.route('/api/signup', methods=['POST'])
>>>>>>> 3a3dced608da4e1c7c7706a88b74a2b92885f236:backend/project/api_server.py
def signup():
    """Register a new user."""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
<<<<<<< HEAD:project/api_server.py
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'success': True, 'user': user.to_dict()})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({'success': True, 'user': user.to_dict(), 'access_token': access_token})

@app.route('/api/posts', methods=['GET'])
@jwt_required()
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts])

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')
    image_url = data.get('image_url')
    if not content:
        return jsonify({'error': 'Content required'}), 400
    post = Post(user_id=user_id, content=content, image_url=image_url)
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    txs = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).all()
    return jsonify([t.to_dict() for t in txs])

@app.route('/api/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    tx = Transaction(user_id=user_id, type=data['type'], amount=data['amount'], description=data.get('description'))
    db.session.add(tx)
    db.session.commit()
    return jsonify(tx.to_dict()), 201

if __name__ == '__main__':
    app.run(port=3000, debug=True)
=======
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
>>>>>>> 3a3dced608da4e1c7c7706a88b74a2b92885f236:backend/project/api_server.py
