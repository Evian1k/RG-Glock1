import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe

app = Flask(__name__)
CORS(app)

# In-memory store for demo (replace with DB in production)
PRODUCTS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Artisan Leather Wallet",
        "category": "Accessories",
        "price": 49.99,
        "description": "Handcrafted leather wallet with stitching detail",
        "type": "physical",
        "imageUrl": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
        "discount": "15%"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Organic Coffee Beans (1kg)",
        "category": "Groceries",
        "price": 22.50,
        "description": "Bag of freshly roasted organic coffee beans",
        "type": "physical",
        "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "discount": None
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Smart LED Desk Lamp",
        "category": "Home Office",
        "price": 79.00,
        "description": "Modern LED desk lamp with adjustable brightness",
        "type": "physical",
        "imageUrl": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        "discount": None
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Yoga Mat Premium",
        "category": "Fitness",
        "price": 35.00,
        "description": "Eco-friendly premium yoga mat rolled up",
        "type": "physical",
        "imageUrl": "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
        "discount": None
    }
]
ORDERS = []

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_test_...")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "pk_test_...")
stripe.api_key = STRIPE_SECRET_KEY

@app.route("/api/products", methods=["GET", "POST"])
def products():
    if request.method == "POST":
        data = request.json
        product = {
            "id": str(uuid.uuid4()),
            "name": data["name"],
            "category": data["category"],
            "price": float(data["price"]),
            "description": data.get("description", ""),
            "type": data.get("type", "physical"),
            "imageUrl": data.get("imageUrl", ""),
            "discount": data.get("discount", None)
        }
        PRODUCTS.append(product)
        return jsonify(product), 201
    return jsonify(PRODUCTS)

@app.route("/api/orders", methods=["GET"])
def orders():
    return jsonify(ORDERS)

@app.route("/api/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.json
    product_id = data["product_id"]
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    # Apply 3% fee
    price_cents = int(product["price"] * 1.03 * 100)
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
        # Save order (pending)
        ORDERS.append({
            "id": str(uuid.uuid4()),
            "product_id": product_id,
            "session_id": session.id,
            "status": "pending"
        })
        return jsonify({"checkout_url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
