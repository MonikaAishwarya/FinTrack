from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract
from datetime import datetime

from app.models.transaction_model import Transaction
from app.models.customer_model import Customer
from app.models.fraud_alert_model import FraudAlert
from app.extensions import redis_client


# ==========================================================
# DASHBOARD SUMMARY
# ==========================================================

@jwt_required()
def get_dashboard_summary():

    user_id = int(get_jwt_identity())

    # ------------------------------------------------------
    # CHECK REDIS CACHE
    # ------------------------------------------------------

    cache_key = f"dashboard_summary:{user_id}"

    cached_data = redis_client.get(cache_key)

    if cached_data:

        import json

        return jsonify(json.loads(cached_data))

    # ------------------------------------------------------
    # TOTAL INCOME
    # ------------------------------------------------------

    total_income = (
        Transaction.query.with_entities(
            func.sum(Transaction.amount)
        )
        .filter_by(
            user_id=user_id,
            type="income"
        )
        .scalar()
    ) or 0

    # ------------------------------------------------------
    # TOTAL EXPENSE
    # ------------------------------------------------------

    total_expense = (
        Transaction.query.with_entities(
            func.sum(Transaction.amount)
        )
        .filter_by(
            user_id=user_id,
            type="expense"
        )
        .scalar()
    ) or 0

    # ------------------------------------------------------
    # TOTAL TRANSACTIONS
    # ------------------------------------------------------

    total_transactions = (
        Transaction.query
        .filter_by(user_id=user_id)
        .count()
    )

    # ------------------------------------------------------
    # TOTAL REVENUE
    #
    # For this personal-finance application,
    # revenue is treated as total income.
    # ------------------------------------------------------

    total_revenue = total_income

    # ------------------------------------------------------
    # DAILY REVENUE
    # ------------------------------------------------------

    today = datetime.now().date()

    daily_revenue = (
        Transaction.query.with_entities(
            func.sum(Transaction.amount)
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "income",
            func.date(Transaction.created_at) == today
        )
        .scalar()
    ) or 0

    # ------------------------------------------------------
    # MONTHLY REVENUE
    # ------------------------------------------------------

    current_month = datetime.now().month
    current_year = datetime.now().year

    monthly_revenue = (
        Transaction.query.with_entities(
            func.sum(Transaction.amount)
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "income",
            extract("month", Transaction.created_at) == current_month,
            extract("year", Transaction.created_at) == current_year
        )
        .scalar()
    ) or 0

    # ------------------------------------------------------
    # ACTIVE CUSTOMERS
    #
    # Customers who have at least one transaction.
    # ------------------------------------------------------

    active_customers = (
        db_query := (
            Customer.query
            .join(
                Transaction,
                Transaction.customer_id == Customer.id
            )
            .filter(
                Customer.user_id == user_id,
                Transaction.user_id == user_id
            )
            .distinct()
            .count()
        )
    )

    # ------------------------------------------------------
    # PENDING TRANSACTIONS
    # ------------------------------------------------------

    pending_transactions = (
        Transaction.query
        .filter_by(
            user_id=user_id,
            status="Pending"
        )
        .count()
    )

    # ------------------------------------------------------
    # FAILED TRANSACTIONS
    # ------------------------------------------------------

    failed_transactions = (
        Transaction.query
        .filter_by(
            user_id=user_id,
            status="Failed"
        )
        .count()
    )

    # ------------------------------------------------------
    # FRAUD ALERTS
    # ------------------------------------------------------

    fraud_alerts = (
        FraudAlert.query
        .filter_by(user_id=user_id)
        .count()
    )

    # ------------------------------------------------------
    # BALANCE
    # ------------------------------------------------------

    balance = total_income - total_expense

    # ------------------------------------------------------
    # FINAL RESULT
    # ------------------------------------------------------

    result = {

        "total_income": float(total_income),

        "total_expense": float(total_expense),

        "total_revenue": float(total_revenue),

        "daily_revenue": float(daily_revenue),

        "monthly_revenue": float(monthly_revenue),

        "balance": float(balance),

        "total_transactions": total_transactions,

        "active_customers": active_customers,

        "pending_transactions": pending_transactions,

        "failed_transactions": failed_transactions,

        "fraud_alerts": fraud_alerts
    }

    # ------------------------------------------------------
    # STORE IN REDIS
    # ------------------------------------------------------

    import json

    redis_client.setex(
        cache_key,
        60,
        json.dumps(result)
    )

    return jsonify(result)


# ==========================================================
# CATEGORY SUMMARY
# ==========================================================

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


# ==========================================================
# MONTHLY SUMMARY
# ==========================================================

@jwt_required()
def get_monthly_summary():

    user_id = int(get_jwt_identity())

    monthly_data = (
        Transaction.query.with_entities(
            extract(
                "year",
                Transaction.created_at
            ).label("year"),

            extract(
                "month",
                Transaction.created_at
            ).label("month"),

            Transaction.type,

            func.sum(Transaction.amount)
        )
        .filter_by(user_id=user_id)
        .group_by(
            extract(
                "year",
                Transaction.created_at
            ),

            extract(
                "month",
                Transaction.created_at
            ),

            Transaction.type
        )
        .order_by(
            extract(
                "year",
                Transaction.created_at
            ),

            extract(
                "month",
                Transaction.created_at
            )
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

    for year, month, transaction_type, amount in monthly_data:

        year = int(year)
        month = int(month)

        key = f"{year}-{month}"

        if key not in result:

            result[key] = {

                "year": year,

                "month": months[month],

                "income": 0,

                "expense": 0
            }

        result[key][transaction_type] = float(amount)

    return jsonify(list(result.values()))


# ==========================================================
# RECENT TRANSACTIONS
# ==========================================================

@jwt_required()
def get_recent_transactions():

    user_id = int(get_jwt_identity())

    transactions = (
        Transaction.query
        .filter_by(user_id=user_id)
        .order_by(
            Transaction.created_at.desc()
        )
        .limit(5)
        .all()
    )

    result = []

    for transaction in transactions:

        result.append({

            "id": transaction.id,

            "title": transaction.title,

            "amount": float(transaction.amount),

            "type": transaction.type,

            "category": transaction.category,

            "status": transaction.status,

            "created_at": transaction.created_at
        })

    return jsonify(result)