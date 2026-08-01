from app.extensions import db


class Transaction(db.Model):

    __tablename__ = "transactions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(
        db.String(100),
        nullable=False
    )

    amount = db.Column(
        db.Float,
        nullable=False
    )

    type = db.Column(
        db.String(20),
        nullable=False
    )

    category = db.Column(
        db.String(50),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )