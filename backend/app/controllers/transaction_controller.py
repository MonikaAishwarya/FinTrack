from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.transaction_model import Transaction


@jwt_required()
def add_transaction():

    data = request.get_json()

    transaction = Transaction(
        user_id=int(get_jwt_identity()),
        title=data["title"],
        amount=data["amount"],
        type=data["type"],
        category=data["category"]
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction Added Successfully"
    }), 201


@jwt_required()
def get_transactions():

    user_id = int(get_jwt_identity())

    transactions = Transaction.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for transaction in transactions:

        result.append({
            "id": transaction.id,
            "title": transaction.title,
            "amount": transaction.amount,
            "type": transaction.type,
            "category": transaction.category,
            "created_at": transaction.created_at
        })

    return jsonify(result)


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

    transaction.title = data["title"]
    transaction.amount = data["amount"]
    transaction.type = data["type"]
    transaction.category = data["category"]

    db.session.commit()

    return jsonify({
        "message": "Transaction Updated Successfully"
    })


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