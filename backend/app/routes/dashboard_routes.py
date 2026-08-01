from flask import Blueprint

from app.controllers.dashboard_controller import (
    get_dashboard_summary,
    get_category_summary,
    get_monthly_summary,
    get_recent_transactions
)

dashboard_bp = Blueprint("dashboard", __name__)

dashboard_bp.route("/summary", methods=["GET"])(get_dashboard_summary)
dashboard_bp.route("/category-summary", methods=["GET"])(get_category_summary)
dashboard_bp.route("/monthly-summary", methods=["GET"])(get_monthly_summary)
dashboard_bp.route("/recent-transactions", methods=["GET"])(get_recent_transactions)