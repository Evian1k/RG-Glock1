from flask import Flask
from marketplace_api import marketplace_bp
from payment_api import payment_bp
from project.api_server import api_server_bp

app = Flask(__name__)

app.register_blueprint(marketplace_bp, url_prefix="/marketplace")
app.register_blueprint(payment_bp, url_prefix="/payment")
app.register_blueprint(api_server_bp, url_prefix="/api")

@app.route("/")
def index():
    return "Unified Flask API is running!"

if __name__ == "__main__":
    app.run(debug=False)
