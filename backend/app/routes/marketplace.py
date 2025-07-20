from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
import uuid
from app import db
from app.models.user import User
from app.models.marketplace import Product, Cart, CartItem, Order, OrderItem, Wishlist
from sqlalchemy import or_

marketplace_bp = Blueprint('marketplace', __name__)

# Products endpoints
@marketplace_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with filtering and pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if category:
            query = query.filter(Product.category == category)
        
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.description.ilike(f'%{search}%')
                )
            )
        
        if min_price:
            query = query.filter(Product.price >= min_price)
        
        if max_price:
            query = query.filter(Product.price <= max_price)
        
        # Apply sorting
        if sort_by in ['name', 'price', 'created_at']:
            if sort_order == 'desc':
                query = query.order_by(getattr(Product, sort_by).desc())
            else:
                query = query.order_by(getattr(Product, sort_by))
        
        # Paginate
        products = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'pages': products.pages,
                'per_page': per_page,
                'total': products.total,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch products'}), 500

@marketplace_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.query.get(product_id)
        
        if not product or not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch product'}), 500

@marketplace_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    """Create new product (sellers only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_seller():
            return jsonify({'error': 'Only sellers can create products'}), 403
        
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'price', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            quantity=data.get('quantity', 0),
            category=data['category'],
            image_url=data.get('image_url'),
            images=data.get('images', []),
            meta_description=data.get('meta_description'),
            tags=data.get('tags', []),
            seller_id=user_id
        )
        
        # Generate slug from name
        product.slug = data['name'].lower().replace(' ', '-') + '-' + str(uuid.uuid4())[:8]
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product'}), 500

# Cart endpoints
@marketplace_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Get user's cart"""
    try:
        user_id = get_jwt_identity()
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            # Create empty cart if it doesn't exist
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()
        
        return jsonify({'cart': cart.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch cart'}), 500

@marketplace_bp.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        # Check if product exists and is active
        product = Product.query.get(product_id)
        if not product or not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get or create cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.flush()
        
        # Check if item already in cart
        cart_item = CartItem.query.filter_by(
            cart_id=cart.id, 
            product_id=product_id
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Item added to cart',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item to cart'}), 500

@marketplace_bp.route('/cart/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        user_id = get_jwt_identity()
        
        cart_item = CartItem.query.join(Cart).filter(
            CartItem.id == item_id,
            Cart.user_id == user_id
        ).first()
        
        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove item from cart'}), 500

# Orders endpoints
@marketplace_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    """Create order from cart"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart or not cart.items.count():
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate total
        total_amount = cart.get_total()
        
        # Create order
        order = Order(
            order_number=f'ORD-{datetime.utcnow().strftime("%Y%m%d")}-{str(uuid.uuid4())[:8]}',
            customer_id=user_id,
            total_amount=total_amount,
            shipping_address=data.get('shipping_address'),
            billing_address=data.get('billing_address'),
            shipping_method=data.get('shipping_method', 'standard')
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Create order items from cart items
        for cart_item in cart.items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            db.session.add(order_item)
        
        # Clear cart
        cart.items.delete()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create order'}), 500

@marketplace_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    """Get user's orders"""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        orders = Order.query.filter_by(customer_id=user_id).order_by(
            Order.created_at.desc()
        ).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
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

# Wishlist endpoints
@marketplace_bp.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    """Get user's wishlist"""
    try:
        user_id = get_jwt_identity()
        
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'wishlist': [item.to_dict() for item in wishlist_items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch wishlist'}), 500

@marketplace_bp.route('/wishlist/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    """Add product to wishlist"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        product_id = data.get('product_id')
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if already in wishlist
        existing = Wishlist.query.filter_by(
            user_id=user_id, 
            product_id=product_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Product already in wishlist'}), 400
        
        wishlist_item = Wishlist(
            user_id=user_id,
            product_id=product_id
        )
        
        db.session.add(wishlist_item)
        db.session.commit()
        
        return jsonify({
            'message': 'Product added to wishlist',
            'item': wishlist_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add to wishlist'}), 500

@marketplace_bp.route('/wishlist/remove/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    """Remove product from wishlist"""
    try:
        user_id = get_jwt_identity()
        
        wishlist_item = Wishlist.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()
        
        if not wishlist_item:
            return jsonify({'error': 'Item not found in wishlist'}), 404
        
        db.session.delete(wishlist_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from wishlist'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove from wishlist'}), 500