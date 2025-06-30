from flask import Flask
from marketplace_api import app as marketplace_app
from payment_api import app as payment_app
from project.api_server import app as api_server_app

# Create a new Flask app
app = Flask(__name__)

# Register blueprints or mount apps
app.register_blueprint(marketplace_app.blueprint if hasattr(marketplace_app, 'blueprint') else marketplace_app, url_prefix="/marketplace")
app.register_blueprint(payment_app.blueprint if hasattr(payment_app, 'blueprint') else payment_app, url_prefix="/payment")
app.register_blueprint(api_server_app.blueprint if hasattr(api_server_app, 'blueprint') else api_server_app, url_prefix="/api")

# Optionally, add a root route
@app.route("/")
def index():
    return "Unified Flask API is running!"

if __name__ == "__main__":
    app.run(debug=False)
