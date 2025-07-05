import os
from flask import Blueprint, request, jsonify
import stripe

payment_bp = Blueprint('payment', __name__)

# Enforce Stripe keys from environment variables only
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')

if not STRIPE_SECRET_KEY or not STRIPE_PUBLISHABLE_KEY:
    raise RuntimeError("Stripe keys must be set in environment variables.")

stripe.api_key = STRIPE_SECRET_KEY

@payment_bp.route('/api/payment/config', methods=['GET'])
def get_payment_config():
    return jsonify({
        'publishableKey': STRIPE_PUBLISHABLE_KEY
    })

@payment_bp.route('/api/payment/create-intent', methods=['POST'])
def create_payment_intent():
    data = request.get_json()
    try:
        amount = int(data.get('amount'))
        currency = data.get('currency', 'usd')
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            automatic_payment_methods={"enabled": True},
        )
        return jsonify({'clientSecret': intent.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
