from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_python_info
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Post, Transaction
import random
import os
from payment_api import payment_bp  # Import the payment blueprint

app = Flask(__name__)
CORS(app)

# Register the payment blueprint
app.register_blueprint(payment_bp)

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

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
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
