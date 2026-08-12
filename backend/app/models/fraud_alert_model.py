from app.extensions import db


class FraudAlert(db.Model):

    __tablename__ = "fraud_alerts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    transaction_id = db.Column(
        db.Integer,
        db.ForeignKey("transactions.id"),
        nullable=True
    )

    alert_type = db.Column(
        db.String(100),
        nullable=False
    )

    severity = db.Column(
        db.String(20),
        nullable=False,
        default="Medium"
    )

    message = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )