from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)
    
    # Import models to ensure they are registered with SQLAlchemy
    from app.models import user, marketplace, education, entertainment, admin
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.marketplace import marketplace_bp
    from app.routes.education import education_bp
    from app.routes.entertainment import entertainment_bp
    from app.routes.admin import admin_bp
    from app.routes.user import user_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
    app.register_blueprint(education_bp, url_prefix='/api/education')
    app.register_blueprint(entertainment_bp, url_prefix='/api/entertainment')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    
    return app