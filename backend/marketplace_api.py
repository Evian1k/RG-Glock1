import os
import uuid
from flask import Blueprint, request, jsonify, render_template
from flask_cors import CORS
import stripe

marketplace_bp = Blueprint('marketplace', __name__)
CORS_kwargs = {}
CORS(marketplace_bp, **CORS_kwargs)

# Demo product list (in-memory, not for production)
PRODUCTS = [
    # Electronics
    {"id": str(uuid.uuid4()), "name": "iPhone 15 Pro Max", "category": "Electronics", "price": 1299.00, "description": "Apple iPhone 15 Pro Max, 256GB, Space Black, Unlocked.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", "discount": "5%"},
    {"id": str(uuid.uuid4()), "name": "Samsung Galaxy S24 Ultra", "category": "Electronics", "price": 1199.00, "description": "Samsung Galaxy S24 Ultra, 512GB, Phantom Black, Unlocked.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Sony WH-1000XM5 Headphones", "category": "Electronics", "price": 399.99, "description": "Industry-leading noise canceling wireless headphones.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", "discount": "10%"},
    {"id": str(uuid.uuid4()), "name": "Dell XPS 13 Laptop", "category": "Electronics", "price": 999.00, "description": "Dell XPS 13, 16GB RAM, 512GB SSD, 13.4'' FHD+.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "discount": None},
    {"id": str(uuid.uuid4()), "name": "GoPro HERO12 Black", "category": "Electronics", "price": 399.00, "description": "GoPro HERO12 Black 5.3K60 Ultra HD Waterproof Action Camera.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca", "discount": None},
    # Books
    {"id": str(uuid.uuid4()), "name": "Atomic Habits", "category": "Books", "price": 16.99, "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353", "discount": None},
    {"id": str(uuid.uuid4()), "name": "The Body Keeps the Score", "category": "Books", "price": 18.99, "description": "Brain, Mind, and Body in the Healing of Trauma by Bessel van der Kolk.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Harry Potter Box Set", "category": "Books", "price": 89.99, "description": "Harry Potter Complete Collection 7 Books Box Set.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794", "discount": "12%"},
    {"id": str(uuid.uuid4()), "name": "Sapiens: A Brief History of Humankind", "category": "Books", "price": 22.00, "description": "By Yuval Noah Harari.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353", "discount": None},
    # Home & Kitchen
    {"id": str(uuid.uuid4()), "name": "Nespresso Vertuo Coffee Maker", "category": "Home & Kitchen", "price": 249.99, "description": "Nespresso Vertuo Coffee and Espresso Machine by De'Longhi.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb", "discount": "8%"},
    {"id": str(uuid.uuid4()), "name": "Amazon Basics Sheet Set", "category": "Home & Kitchen", "price": 29.99, "description": "Lightweight Super Soft Easy Care Microfiber 3 Piece Bed Sheet Set.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519864600265-abb23847ef2c", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Instant Pot Duo 7-in-1", "category": "Home & Kitchen", "price": 99.99, "description": "Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker, and Warmer.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836", "discount": "15%"},
    # Gift Cards
    {"id": str(uuid.uuid4()), "name": "Amazon eGift Card", "category": "Gift Cards", "price": 50.00, "description": "Amazon eGift Card - Celebration - (Instant Email or Text Delivery)", "type": "digital", "imageUrl": "https://images.unsplash.com/photo-1464983953574-0892a716854b", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Apple Gift Card", "category": "Gift Cards", "price": 25.00, "description": "Apple Gift Card - App Store, iTunes, iPhone, iPad, AirPods, MacBook, accessories and more (eGift)", "type": "digital", "imageUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", "discount": None},
    # Accessories
    {"id": str(uuid.uuid4()), "name": "Artisan Leather Wallet", "category": "Accessories", "price": 49.99, "description": "Handcrafted leather wallet with stitching detail", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", "discount": "15%"},
    {"id": str(uuid.uuid4()), "name": "Ray-Ban Aviator Sunglasses", "category": "Accessories", "price": 159.00, "description": "Classic Ray-Ban Aviator Sunglasses with Gold Frame.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", "discount": None},
    # Groceries
    {"id": str(uuid.uuid4()), "name": "Organic Coffee Beans (1kg)", "category": "Groceries", "price": 22.50, "description": "Bag of freshly roasted organic coffee beans", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Almond Milk (6-pack)", "category": "Groceries", "price": 18.00, "description": "Organic unsweetened almond milk, 6 x 1L cartons.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836", "discount": None},
    # Home Office
    {"id": str(uuid.uuid4()), "name": "Smart LED Desk Lamp", "category": "Home Office", "price": 79.00, "description": "Modern LED desk lamp with adjustable brightness", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Ergonomic Office Chair", "category": "Home Office", "price": 299.00, "description": "High-back ergonomic office chair with lumbar support.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2", "discount": "10%"},
    # Fitness
    {"id": str(uuid.uuid4()), "name": "Yoga Mat Premium", "category": "Fitness", "price": 35.00, "description": "Eco-friendly premium yoga mat rolled up", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519864600265-abb23847ef2c", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Adjustable Dumbbells (Pair)", "category": "Fitness", "price": 199.00, "description": "Adjustable dumbbells, 5-52.5 lbs each.", "type": "physical", "imageUrl": "https://images.unsplash.com/photo-1519864600265-abb23847ef2c", "discount": "7%"},
    # Digital Assets
    {"id": str(uuid.uuid4()), "name": "Digital Art Pack Vol.1", "category": "Digital Assets", "price": 15.00, "description": "A collection of high-res digital artworks for personal and commercial use.", "type": "digital", "imageUrl": "https://images.unsplash.com/photo-1464983953574-0892a716854b", "discount": None},
    {"id": str(uuid.uuid4()), "name": "Ebook: Productivity Hacks", "category": "Digital Assets", "price": 8.99, "description": "Downloadable PDF ebook with actionable productivity tips.", "type": "digital", "imageUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353", "discount": None},
    # Freelance Services
    {"id": str(uuid.uuid4()), "name": "Logo Design Service", "category": "Freelance Services", "price": 120.00, "description": "Professional logo design delivered in 3 days. Includes 3 concepts.", "type": "service", "imageUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", "discount": "10%"},
    {"id": str(uuid.uuid4()), "name": "Website Audit (Freelance)", "category": "Freelance Services", "price": 75.00, "description": "Detailed website audit and improvement report by a web expert.", "type": "service", "imageUrl": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", "discount": None},
]
ORDERS = []  # Store orders in memory for demo

# Stripe API keys (use environment variables in production)
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_test_...")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "pk_test_...")
stripe.api_key = STRIPE_SECRET_KEY

@marketplace_bp.route("/", methods=["GET"])
def index():
    """Health check endpoint."""
    return "RG Fling Marketplace API is running. See /api/products for product data.", 200

@marketplace_bp.route("/api/products", methods=["GET", "POST"])
def products():
    """Get all products or add a new product."""
    if request.method == "POST":
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        data = request.json
        required_fields = ["name", "category", "price"]
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({"error": f"Missing required field: {field}"}), 400
        try:
            price = float(data["price"])
        except (ValueError, TypeError):
            return jsonify({"error": "Price must be a number"}), 400
        product = {
            "id": str(uuid.uuid4()),
            "name": data["name"],
            "category": data["category"],
            "price": price,
            "description": data.get("description", ""),
            "type": data.get("type", "physical"),
            "imageUrl": data.get("imageUrl", ""),
            "discount": data.get("discount", None)
        }
        PRODUCTS.append(product)
        return jsonify(product), 201
    return jsonify(PRODUCTS)

@marketplace_bp.route("/api/orders", methods=["GET"])
def orders():
    """Return all orders."""
    return jsonify(ORDERS)

@marketplace_bp.route("/api/create-checkout-session", methods=["POST"])
def create_checkout_session():
    """Create a Stripe checkout session for a product purchase."""
    data = request.json
    product_id = data.get("product_id")
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    price_cents = int(product["price"] * 1.03 * 100)  # Add 3% fee
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": product["name"]},
                    "unit_amount": price_cents,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=data["success_url"],
            cancel_url=data["cancel_url"],
        )
        ORDERS.append({
            "id": str(uuid.uuid4()),
            "product_id": product_id,
            "session_id": session.id,
            "status": "pending"
        })
        return jsonify({"checkout_url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@marketplace_bp.route("/api/products/physical", methods=["GET"])
def get_physical_products():
    """Return only physical products."""
    physical_products = [p for p in PRODUCTS if p["type"] == "physical"]
    return jsonify(physical_products)

@marketplace_bp.route("/api/products/digital", methods=["GET"])
def get_digital_products():
    """Return only digital products."""
    digital_products = [p for p in PRODUCTS if p["type"] == "digital"]
    return jsonify(digital_products)

@marketplace_bp.route("/api/products/services", methods=["GET"])
def get_service_products():
    """Return only service products."""
    service_products = [p for p in PRODUCTS if p["type"] == "service"]
    return jsonify(service_products)

@marketplace_bp.route("/api/products/by-category", methods=["GET"])
def get_products_by_category():
    """Filter products by category."""
    category = request.args.get("category")
    if not category:
        return jsonify({"error": "Category query parameter is required."}), 400
    filtered_products = [p for p in PRODUCTS if p["category"].lower() == category.lower()]
    return jsonify(filtered_products)

@marketplace_bp.route("/api/products/search", methods=["GET"])
def search_products():
    """Search products by query string."""
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify(PRODUCTS)
    results = [
        p for p in PRODUCTS
        if query in p["name"].lower() or query in p["description"].lower() or query in p["category"].lower()
    ]
    if not results:
        return jsonify(PRODUCTS)
    return jsonify(results)

@marketplace_bp.route("/products", methods=["GET"])
def products_html():
    """Render the product list as an HTML page using Jinja2."""
    return render_template("products.html", products=PRODUCTS)
