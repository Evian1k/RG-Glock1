from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models.user import User
from app.models.marketplace import Product, Order
from app.models.education import Course
from app.models.admin import AdminLog
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    """Decorator to ensure only admins can access certain routes"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        stats = {
            'users': {
                'total': User.query.count(),
                'active': User.query.filter_by(is_active=True).count(),
                'sellers': User.query.filter_by(role='seller').count(),
                'admins': User.query.filter_by(role='admin').count()
            },
            'products': {
                'total': Product.query.count(),
                'active': Product.query.filter_by(is_active=True).count(),
                'featured': Product.query.filter_by(is_featured=True).count()
            },
            'orders': {
                'total': Order.query.count(),
                'pending': Order.query.filter_by(status='pending').count(),
                'completed': Order.query.filter_by(status='delivered').count()
            },
            'courses': {
                'total': Course.query.count(),
                'published': Course.query.filter_by(is_published=True).count(),
                'featured': Course.query.filter_by(is_featured=True).count()
            }
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')
        role = request.args.get('role')
        
        query = User.query
        
        if search:
            query = query.filter(
                (User.username.ilike(f'%{search}%')) |
                (User.email.ilike(f'%{search}%'))
            )
        
        if role:
            query = query.filter(User.role == role)
        
        users = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict(include_sensitive=True) for user in users.items],
            'pagination': {
                'page': page,
                'pages': users.pages,
                'per_page': per_page,
                'total': users.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@admin_bp.route('/users/<int:user_id>/toggle-active', methods=['POST'])
@admin_required
def toggle_user_active(user_id):
    """Activate or deactivate a user"""
    try:
        admin_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_admin() and user_id != admin_id:
            return jsonify({'error': 'Cannot deactivate other admins'}), 403
        
        user.is_active = not user.is_active
        db.session.commit()
        
        # Log admin action
        AdminLog.log_action(
            admin_id=admin_id,
            action='toggle_user_active',
            target_type='user',
            target_id=user_id,
            description=f'User {user.username} {"activated" if user.is_active else "deactivated"}'
        )
        
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user status'}), 500

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(user_id):
    """Update user role"""
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)
        user = User.query.get(user_id)
        data = request.json
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        new_role = data.get('role')
        if new_role not in ['user', 'seller', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400
        
        old_role = user.role
        user.role = new_role
        db.session.commit()
        
        # Log admin action
        AdminLog.log_action(
            admin_id=admin_id,
            action='update_user_role',
            target_type='user',
            target_id=user_id,
            description=f'User {user.username} role changed from {old_role} to {new_role}'
        )
        
        return jsonify({
            'message': 'User role updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update user role'}), 500

@admin_bp.route('/products', methods=['GET'])
@admin_required
def get_all_products():
    """Get all products for admin"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        products = Product.query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'pages': products.pages,
                'per_page': per_page,
                'total': products.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch products'}), 500

@admin_bp.route('/products/<int:product_id>/toggle-active', methods=['POST'])
@admin_required
def toggle_product_active(product_id):
    """Activate or deactivate a product"""
    try:
        admin_id = get_jwt_identity()
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        product.is_active = not product.is_active
        db.session.commit()
        
        # Log admin action
        AdminLog.log_action(
            admin_id=admin_id,
            action='toggle_product_active',
            target_type='product',
            target_id=product_id,
            description=f'Product {product.name} {"activated" if product.is_active else "deactivated"}'
        )
        
        return jsonify({
            'message': f'Product {"activated" if product.is_active else "deactivated"} successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product status'}), 500

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    """Get all orders for admin"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = Order.query
        
        if status:
            query = query.filter(Order.status == status)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': page,
                'pages': orders.pages,
                'per_page': per_page,
                'total': orders.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch orders'}), 500

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    """Update order status"""
    try:
        admin_id = get_jwt_identity()
        order = Order.query.get(order_id)
        data = request.json
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        new_status = data.get('status')
        valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
        
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        old_status = order.status
        order.status = new_status
        
        # Update timestamps based on status
        if new_status == 'shipped' and not order.shipped_at:
            order.shipped_at = datetime.utcnow()
        elif new_status == 'delivered' and not order.delivered_at:
            order.delivered_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log admin action
        AdminLog.log_action(
            admin_id=admin_id,
            action='update_order_status',
            target_type='order',
            target_id=order_id,
            description=f'Order {order.order_number} status changed from {old_status} to {new_status}'
        )
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update order status'}), 500

@admin_bp.route('/logs', methods=['GET'])
@admin_required
def get_admin_logs():
    """Get admin action logs"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        logs = AdminLog.query.order_by(AdminLog.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'logs': [log.to_dict() for log in logs.items],
            'pagination': {
                'page': page,
                'pages': logs.pages,
                'per_page': per_page,
                'total': logs.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch admin logs'}), 500