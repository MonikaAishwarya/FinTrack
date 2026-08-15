from flask import Blueprint

from app.controllers.analytics_controller import (
    get_revenue_trend,
    get_daily_transactions,
    get_monthly_transactions,
    get_expense_analysis,
    get_customer_growth,
    get_payment_method_distribution
)


analytics_bp = Blueprint(
    "analytics",
    __name__
)


# Revenue Trend
analytics_bp.route(
    "/revenue-trend",
    methods=["GET"]
)(get_revenue_trend)


# Daily Transactions
analytics_bp.route(
    "/daily-transactions",
    methods=["GET"]
)(get_daily_transactions)


# Monthly Transactions
analytics_bp.route(
    "/monthly-transactions",
    methods=["GET"]
)(get_monthly_transactions)


# Expense Analysis
analytics_bp.route(
    "/expense-analysis",
    methods=["GET"]
)(get_expense_analysis)


# Customer Growth
analytics_bp.route(
    "/customer-growth",
    methods=["GET"]
)(get_customer_growth)


# Payment Method Distribution
analytics_bp.route(
    "/payment-method-distribution",
    methods=["GET"]
)(get_payment_method_distribution)