from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get user's personal statistics"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        stats = {
            'orders_count': user.orders.count(),
            'products_count': user.products.count() if user.is_seller() else 0,
            'enrollments_count': user.enrollments.count(),
            'courses_taught_count': user.courses_taught.count(),
            'wishlist_count': user.wishlists.count(),
            'playlists_count': user.playlists.count(),
            'quiz_attempts_count': user.quiz_attempts.count()
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user stats'}), 500

@user_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_user_activity():
    """Get user's recent activity"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get recent orders
        recent_orders = user.orders.order_by(
            user.orders.property.mapper.class_.created_at.desc()
        ).limit(5).all()
        
        # Get recent enrollments
        recent_enrollments = user.enrollments.order_by(
            user.enrollments.property.mapper.class_.enrolled_at.desc()
        ).limit(5).all()
        
        activity = {
            'recent_orders': [order.to_dict() for order in recent_orders],
            'recent_enrollments': [enrollment.to_dict() for enrollment in recent_enrollments]
        }
        
        return jsonify({'activity': activity}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user activity'}), 500