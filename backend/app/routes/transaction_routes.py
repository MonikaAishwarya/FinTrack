from flask import Blueprint

from app.controllers.transaction_controller import (
    add_transaction,
    get_transactions,
    update_transaction,
    delete_transaction
)

transaction_bp = Blueprint("transaction", __name__)

# Add Transaction
transaction_bp.route("/", methods=["POST"])(add_transaction)

# Get All Transactions
transaction_bp.route("/", methods=["GET"])(get_transactions)

# Update Transaction
transaction_bp.route("/<int:id>", methods=["PUT"])(update_transaction)

# Delete Transaction
transaction_bp.route("/<int:id>", methods=["DELETE"])(delete_transaction)