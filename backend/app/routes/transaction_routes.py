from flask import Blueprint

from app.controllers.transaction_controller import (
    add_transaction,
    get_transactions,
    get_transaction,
    update_transaction,
    delete_transaction
)


transaction_bp = Blueprint(
    "transaction",
    __name__
)


# -----------------------------------------
# Add Transaction
# -----------------------------------------

transaction_bp.route(
    "/",
    methods=["POST"]
)(add_transaction)


# -----------------------------------------
# Get Transactions
# Supports:
# ?search=coffee
# ?type=expense
# ?status=Success
# ?date=2026-08-03
# ?page=1
# ?per_page=10
# -----------------------------------------

transaction_bp.route(
    "/",
    methods=["GET"]
)(get_transactions)


# -----------------------------------------
# Get Single Transaction
# -----------------------------------------

transaction_bp.route(
    "/<int:id>",
    methods=["GET"]
)(get_transaction)


# -----------------------------------------
# Update Transaction
# -----------------------------------------

transaction_bp.route(
    "/<int:id>",
    methods=["PUT"]
)(update_transaction)


# -----------------------------------------
# Delete Transaction
# -----------------------------------------

transaction_bp.route(
    "/<int:id>",
    methods=["DELETE"]
)(delete_transaction)