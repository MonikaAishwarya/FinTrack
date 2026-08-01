from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract

from app.models.transaction_model import Transaction


@jwt_required()
def get_dashboard_summary():

    user_id = int(get_jwt_identity())

    # Total Income
    total_income = (
        Transaction.query.with_entities(func.sum(Transaction.amount))
        .filter_by(user_id=user_id, type="income")
        .scalar()
    ) or 0

    # Total Expense
    total_expense = (
        Transaction.query.with_entities(func.sum(Transaction.amount))
        .filter_by(user_id=user_id, type="expense")
        .scalar()
    ) or 0

    # Total Transactions
    total_transactions = (
        Transaction.query.filter_by(user_id=user_id)
        .count()
    )

    # Current Balance
    balance = total_income - total_expense

    return jsonify({
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "balance": float(balance),
        "total_transactions": total_transactions
    })

@jwt_required()
def get_category_summary():

    user_id = int(get_jwt_identity())

    categories = (
        Transaction.query.with_entities(
            Transaction.category,
            func.sum(Transaction.amount)
        )
        .filter_by(
            user_id=user_id,
            type="expense"
        )
        .group_by(Transaction.category)
        .all()
    )

    result = []

    for category, amount in categories:

        result.append({
            "category": category,
            "amount": float(amount)
        })

    return jsonify(result)

@jwt_required()
def get_monthly_summary():

    user_id = int(get_jwt_identity())

    monthly_data = (
        Transaction.query.with_entities(
            extract("month", Transaction.created_at).label("month"),
            Transaction.type,
            func.sum(Transaction.amount)
        )
        .filter_by(user_id=user_id)
        .group_by(
            extract("month", Transaction.created_at),
            Transaction.type
        )
        .all()
    )

    months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    result = {}

    for month, transaction_type, amount in monthly_data:

        month = int(month)

        if month not in result:
            result[month] = {
                "month": months[month],
                "income": 0,
                "expense": 0
            }

        result[month][transaction_type] = float(amount)

    return jsonify(list(result.values()))

@jwt_required()
def get_recent_transactions():

    user_id = int(get_jwt_identity())

    transactions = (
        Transaction.query
        .filter_by(user_id=user_id)
        .order_by(Transaction.created_at.desc())
        .limit(5)
        .all()
    )

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