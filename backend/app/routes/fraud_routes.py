from flask import Blueprint

from app.controllers.fraud_controller import (
    get_fraud_alerts,
    get_fraud_alert
)


fraud_bp = Blueprint(
    "fraud",
    __name__
)


# Get all fraud alerts
fraud_bp.route(
    "/alerts",
    methods=["GET"]
)(get_fraud_alerts)


# Get single fraud alert
fraud_bp.route(
    "/alerts/<int:id>",
    methods=["GET"]
)(get_fraud_alert)