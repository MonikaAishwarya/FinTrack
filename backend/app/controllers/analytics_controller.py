from datetime import datetime, timedelta

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract

from app.models.transaction_model import Transaction
from app.models.customer_model import Customer


# ==========================================================
# REVENUE TREND
# ==========================================================

@jwt_required()
def get_revenue_trend():

    user_id = int(get_jwt_identity())

    data = (
        Transaction.query.with_entities(
            func.date(Transaction.created_at).label("date"),
            Transaction.type,
            func.sum(Transaction.amount).label("amount")
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.status == "Success"
        )
        .group_by(
            func.date(Transaction.created_at),
            Transaction.type
        )
        .order_by(
            func.date(Transaction.created_at)
        )
        .all()
    )

    result = {}

    for date, transaction_type, amount in data:

        date = str(date)

        if date not in result:

            result[date] = {
                "date": date,
                "income": 0,
                "expense": 0
            }

        result[date][transaction_type] = float(amount)

    return jsonify(list(result.values())), 200


# ==========================================================
# DAILY TRANSACTIONS
# ==========================================================

@jwt_required()
def get_daily_transactions():

    user_id = int(get_jwt_identity())

    data = (
        Transaction.query.with_entities(
            func.date(Transaction.created_at).label("date"),
            func.count(Transaction.id).label("count")
        )
        .filter(
            Transaction.user_id == user_id
        )
        .group_by(
            func.date(Transaction.created_at)
        )
        .order_by(
            func.date(Transaction.created_at)
        )
        .all()
    )

    result = []

    for date, count in data:

        result.append({
            "date": str(date),
            "count": int(count)
        })

    return jsonify(result), 200


# ==========================================================
# MONTHLY TRANSACTIONS
# ==========================================================

@jwt_required()
def get_monthly_transactions():

    user_id = int(get_jwt_identity())

    data = (
        Transaction.query.with_entities(
            extract(
                "year",
                Transaction.created_at
            ).label("year"),

            extract(
                "month",
                Transaction.created_at
            ).label("month"),

            func.count(Transaction.id).label("count")
        )
        .filter(
            Transaction.user_id == user_id
        )
        .group_by(
            extract("year", Transaction.created_at),
            extract("month", Transaction.created_at)
        )
        .order_by(
            extract("year", Transaction.created_at),
            extract("month", Transaction.created_at)
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

    result = []

    for year, month, count in data:

        month = int(month)
        year = int(year)

        result.append({
            "month": months[month],
            "year": year,
            "label": f"{months[month]} {year}",
            "count": int(count)
        })

    return jsonify(result), 200


# ==========================================================
# EXPENSE ANALYSIS
# ==========================================================

@jwt_required()
def get_expense_analysis():

    user_id = int(get_jwt_identity())

    data = (
        Transaction.query.with_entities(
            Transaction.category,
            func.sum(Transaction.amount).label("amount")
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.status == "Success"
        )
        .group_by(
            Transaction.category
        )
        .order_by(
            func.sum(Transaction.amount).desc()
        )
        .all()
    )

    result = []

    for category, amount in data:

        result.append({
            "category": category,
            "amount": float(amount)
        })

    return jsonify(result), 200


# ==========================================================
# CUSTOMER GROWTH
# ==========================================================

@jwt_required()
def get_customer_growth():

    user_id = int(get_jwt_identity())

    data = (
        Customer.query.with_entities(
            extract(
                "year",
                Customer.created_at
            ).label("year"),

            extract(
                "month",
                Customer.created_at
            ).label("month"),

            func.count(Customer.id).label("count")
        )
        .filter(
            Customer.user_id == user_id
        )
        .group_by(
            extract("year", Customer.created_at),
            extract("month", Customer.created_at)
        )
        .order_by(
            extract("year", Customer.created_at),
            extract("month", Customer.created_at)
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

    result = []

    for year, month, count in data:

        year = int(year)
        month = int(month)

        result.append({
            "month": months[month],
            "year": year,
            "label": f"{months[month]} {year}",
            "count": int(count)
        })

    return jsonify(result), 200


# ==========================================================
# PAYMENT METHOD DISTRIBUTION
# ==========================================================

@jwt_required()
def get_payment_method_distribution():

    user_id = int(get_jwt_identity())

    data = (
        Transaction.query.with_entities(
            Transaction.payment_method,
            func.count(Transaction.id).label("count")
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.status == "Success"
        )
        .group_by(
            Transaction.payment_method
        )
        .order_by(
            func.count(Transaction.id).desc()
        )
        .all()
    )

    result = []

    for payment_method, count in data:

        result.append({
            "payment_method":
                payment_method or "Unknown",
            "count": int(count)
        })

    return jsonify(result), 200