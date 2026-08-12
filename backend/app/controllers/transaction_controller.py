from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.fraud_service import check_transaction_for_fraud

from app.extensions import db
from app.models.transaction_model import Transaction


# --------------------------------------------------
# ADD TRANSACTION
# --------------------------------------------------

@jwt_required()
def add_transaction():

    data = request.get_json()

    transaction = Transaction(
        user_id=int(get_jwt_identity()),
        customer_id=data.get("customer_id"),
        title=data["title"],
        amount=data["amount"],
        type=data["type"],
        category=data["category"],
        payment_method=data.get("payment_method"),
        status=data.get("status", "Success")
    )

    db.session.add(transaction)
    db.session.commit()

    fraud_alerts = check_transaction_for_fraud(
        transaction
    )

    return jsonify({
        "message": "Transaction Added Successfully",
        "fraud_alerts": fraud_alerts
    }), 201


# --------------------------------------------------
# GET TRANSACTIONS
# --------------------------------------------------

@jwt_required()
def get_transactions():

    user_id = int(get_jwt_identity())

    query = Transaction.query.filter_by(
        user_id=user_id
    )

    # -----------------------------
    # Search
    # -----------------------------

    search = request.args.get("search")

    if search:

        query = query.filter(
            Transaction.title.ilike(f"%{search}%")
        )

    # -----------------------------
    # Type Filter
    # -----------------------------

    transaction_type = request.args.get("type")

    if transaction_type:

        query = query.filter(
            Transaction.type == transaction_type
        )

    # -----------------------------
    # Status Filter
    # -----------------------------

    status = request.args.get("status")

    if status:

        query = query.filter(
            Transaction.status == status
        )

    # -----------------------------
    # Date Filter
    # -----------------------------

    date = request.args.get("date")

    if date:

        query = query.filter(
            db.func.date(Transaction.created_at) == date
        )

    # -----------------------------
    # Pagination
    # -----------------------------

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        10,
        type=int
    )

    pagination = query.order_by(
        Transaction.created_at.desc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    result = []

    for transaction in pagination.items:

        result.append({

            "id": transaction.id,

            "customer_id": transaction.customer_id,

            "title": transaction.title,

            "amount": transaction.amount,

            "type": transaction.type,

            "category": transaction.category,

            "payment_method": transaction.payment_method,

            "status": transaction.status,

            "created_at": transaction.created_at

        })

    return jsonify({

        "transactions": result,

        "page": pagination.page,

        "per_page": pagination.per_page,

        "total": pagination.total,

        "pages": pagination.pages

    })


# --------------------------------------------------
# GET SINGLE TRANSACTION
# --------------------------------------------------

@jwt_required()
def get_transaction(id):

    user_id = int(get_jwt_identity())

    transaction = Transaction.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not transaction:

        return jsonify({
            "message": "Transaction not found"
        }), 404

    return jsonify({

        "id": transaction.id,

        "title": transaction.title,

        "amount": transaction.amount,

        "type": transaction.type,

        "category": transaction.category,

        "status": transaction.status,

        "created_at": transaction.created_at,

        "customer_id": transaction.customer_id,

        "payment_method": transaction.payment_method

    })


# --------------------------------------------------
# UPDATE TRANSACTION
# --------------------------------------------------

@jwt_required()
def update_transaction(id):

    user_id = int(get_jwt_identity())

    transaction = Transaction.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not transaction:

        return jsonify({
            "message": "Transaction not found"
        }), 404

    data = request.get_json()

    transaction.title = data.get(
        "title",
        transaction.title
    )

    transaction.amount = data.get(
        "amount",
        transaction.amount
    )

    transaction.type = data.get(
        "type",
        transaction.type
    )

    transaction.category = data.get(
        "category",
        transaction.category
    )

    transaction.status = data.get(
        "status",
        transaction.status
    )

    transaction.customer_id = data.get(
        "customer_id",
        transaction.customer_id
    )

    transaction.payment_method = data.get(
        "payment_method",
        transaction.payment_method
    )

    db.session.commit()

    return jsonify({

        "message": "Transaction Updated Successfully"

    })


# --------------------------------------------------
# DELETE TRANSACTION
# --------------------------------------------------

@jwt_required()
def delete_transaction(id):

    user_id = int(get_jwt_identity())

    transaction = Transaction.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not transaction:

        return jsonify({
            "message": "Transaction not found"
        }), 404

    db.session.delete(transaction)

    db.session.commit()

    return jsonify({

        "message": "Transaction Deleted Successfully"

    })