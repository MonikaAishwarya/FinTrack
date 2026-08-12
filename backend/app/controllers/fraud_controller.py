from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.fraud_alert_model import FraudAlert


# ==========================================================
# GET ALL FRAUD ALERTS
# ==========================================================

@jwt_required()
def get_fraud_alerts():

    user_id = int(get_jwt_identity())

    alerts = FraudAlert.query.filter_by(
        user_id=user_id
    ).order_by(
        FraudAlert.created_at.desc()
    ).all()

    result = []

    for alert in alerts:

        result.append({
            "id": alert.id,
            "transaction_id": alert.transaction_id,
            "alert_type": alert.alert_type,
            "severity": alert.severity,
            "message": alert.message,
            "created_at": alert.created_at
        })

    return jsonify(result)


# ==========================================================
# GET SINGLE FRAUD ALERT
# ==========================================================

@jwt_required()
def get_fraud_alert(id):

    user_id = int(get_jwt_identity())

    alert = FraudAlert.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not alert:

        return jsonify({
            "message": "Fraud alert not found"
        }), 404

    return jsonify({
        "id": alert.id,
        "transaction_id": alert.transaction_id,
        "alert_type": alert.alert_type,
        "severity": alert.severity,
        "message": alert.message,
        "created_at": alert.created_at
    })