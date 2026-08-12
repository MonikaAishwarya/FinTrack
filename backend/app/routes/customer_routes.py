from flask import Blueprint

from app.controllers.customer_controller import (
    add_customer,
    get_customers,
    get_customer,
    update_customer,
    delete_customer,
    get_customer_analytics
)


customer_bp = Blueprint(
    "customer",
    __name__
)


# Add Customer
customer_bp.route(
    "/",
    methods=["POST"]
)(add_customer)


# Get All Customers
customer_bp.route(
    "/",
    methods=["GET"]
)(get_customers)


# Get Single Customer
customer_bp.route(
    "/<int:id>",
    methods=["GET"]
)(get_customer)


# Update Customer
customer_bp.route(
    "/<int:id>",
    methods=["PUT"]
)(update_customer)


# Delete Customer
customer_bp.route(
    "/<int:id>",
    methods=["DELETE"]
)(delete_customer)

# Customer Analytics
customer_bp.route(
    "/analytics",
    methods=["GET"]
)(get_customer_analytics)