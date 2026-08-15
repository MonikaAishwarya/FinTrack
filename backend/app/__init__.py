from flask import Flask
from flask_cors import CORS

from app.routes.auth_routes import auth_bp
from app.routes.transaction_routes import transaction_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.customer_routes import customer_bp
from app.routes.report_routes import report_bp
from app.routes.fraud_routes import fraud_bp
from app.routes.analytics_routes import analytics_bp

from app.config.config import Config
from app.extensions import db, jwt

from app.models.user_model import User
from app.models.transaction_model import Transaction
from app.models.customer_model import Customer
from app.models.fraud_alert_model import FraudAlert


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
    app.register_blueprint(customer_bp, url_prefix="/api/customers")
    app.register_blueprint(report_bp, url_prefix="/api/reports")
    app.register_blueprint(fraud_bp, url_prefix="/api/fraud")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    return app