from flask import Flask
from flask_cors import CORS

from app.routes.auth_routes import auth_bp
from app.routes.transaction_routes import transaction_bp
from app.routes.dashboard_routes import dashboard_bp

from app.config.config import Config
from app.extensions import db, jwt

from app.models.user_model import User
from app.models.transaction_model import Transaction


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Create database tables
    with app.app_context():
        db.create_all()

    # Test Route
    @app.route("/")
    def home():
        return {
            "message": "Fintech Dashboard Backend Running Successfully!"
        }

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app