from flask import Blueprint, request, jsonify
import os
import requests

payment_bp = Blueprint('payment', __name__)

# Set your Flutterwave secret key as an environment variable for security
FLUTTERWAVE_SECRET_KEY = os.environ.get("FLUTTERWAVE_SECRET_KEY")

@payment_bp.route("/api/verify-payment", methods=["POST"])
def verify_payment():
    """Verify a payment using Flutterwave API."""
    data = request.get_json()
    tx_ref = data.get("tx_ref")
    user_id = data.get("user_id")  # Optional: for associating payment with user
    if not tx_ref:
        return jsonify({"success": False, "message": "Missing tx_ref"}), 400

    # Verify payment with Flutterwave
    url = f"https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref={tx_ref}"
    headers = {
        "Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        return jsonify({"success": False, "message": "Failed to verify payment"}), 500
    result = resp.json()
    status = result.get("status")
    payment_data = result.get("data", {})
    if status == "success" and payment_data.get("status") == "successful":
        # Here you would update the user's VIP status in your database
        return jsonify({"success": True, "message": "Payment verified, VIP activated."})
    return jsonify({"success": False, "message": "Payment not successful."}), 400
