from datetime import datetime, timedelta

from app.extensions import db
from app.models.fraud_alert_model import FraudAlert
from app.models.transaction_model import Transaction


# ==========================================================
# FRAUD DETECTION
# ==========================================================

def check_transaction_for_fraud(transaction):

    alerts = []

    # ------------------------------------------------------
    # RULE 1: HIGH-VALUE TRANSACTION
    # ------------------------------------------------------

    if transaction.amount >= 50000:

        alerts.append({
            "alert_type": "High Value Transaction",
            "severity": "High",
            "message": (
                f"High-value transaction detected: "
                f"₹{transaction.amount:,.2f}"
            )
        })

    # ------------------------------------------------------
    # RULE 2: MULTIPLE FAILED ATTEMPTS
    # ------------------------------------------------------

    if transaction.status == "Failed":

        failed_count = Transaction.query.filter(
            Transaction.user_id == transaction.user_id,
            Transaction.status == "Failed"
        ).count()

        if failed_count >= 3:

            alerts.append({
                "alert_type": "Multiple Failed Attempts",
                "severity": "High",
                "message": (
                    "Multiple failed transactions detected "
                    "for this user."
                )
            })

    # ------------------------------------------------------
    # RULE 3: MULTIPLE TRANSACTIONS IN SHORT DURATION
    # ------------------------------------------------------

    time_limit = transaction.created_at - timedelta(
        minutes=5
    )

    recent_transactions = Transaction.query.filter(
        Transaction.user_id == transaction.user_id,
        Transaction.created_at >= time_limit,
        Transaction.id != transaction.id
    ).count()

    if recent_transactions >= 3:

        alerts.append({
            "alert_type": "Multiple Transactions In Short Duration",
            "severity": "Medium",
            "message": (
                "Multiple transactions detected "
                "within a short time period."
            )
        })

    # ------------------------------------------------------
    # SAVE ALERTS
    # ------------------------------------------------------

    for alert in alerts:

        fraud_alert = FraudAlert(
            user_id=transaction.user_id,
            transaction_id=transaction.id,
            alert_type=alert["alert_type"],
            severity=alert["severity"],
            message=alert["message"]
        )

        db.session.add(fraud_alert)

    if alerts:
        db.session.commit()

    return alerts