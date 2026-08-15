from datetime import datetime

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.customer_model import Customer
from app.models.transaction_model import Transaction


# --------------------------------------------------
# ADD CUSTOMER
# --------------------------------------------------

@jwt_required()
def add_customer():

    data = request.get_json()

    user_id = int(get_jwt_identity())

    customer = Customer(
        user_id=user_id,
        customer_name=data["customer_name"],
        phone=data.get("phone"),
        email=data.get("email")
    )

    db.session.add(customer)
    db.session.commit()

    return jsonify({
        "message": "Customer Added Successfully",
        "customer": {
            "id": customer.id,
            "customer_name": customer.customer_name,
            "phone": customer.phone,
            "email": customer.email
        }
    }), 201


# --------------------------------------------------
# GET ALL CUSTOMERS
# --------------------------------------------------

@jwt_required()
def get_customers():

    user_id = int(get_jwt_identity())

    customers = Customer.query.filter_by(
        user_id=user_id
    ).order_by(
        Customer.created_at.desc()
    ).all()

    result = []

    for customer in customers:

        result.append({
            "id": customer.id,
            "customer_name": customer.customer_name,
            "phone": customer.phone,
            "email": customer.email,
            "created_at": customer.created_at
        })

    return jsonify(result), 200


# --------------------------------------------------
# GET SINGLE CUSTOMER
# --------------------------------------------------

@jwt_required()
def get_customer(id):

    user_id = int(get_jwt_identity())

    customer = Customer.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not customer:

        return jsonify({
            "message": "Customer not found"
        }), 404

    return jsonify({
        "id": customer.id,
        "customer_name": customer.customer_name,
        "phone": customer.phone,
        "email": customer.email,
        "created_at": customer.created_at
    }), 200


# --------------------------------------------------
# UPDATE CUSTOMER
# --------------------------------------------------

@jwt_required()
def update_customer(id):

    user_id = int(get_jwt_identity())

    customer = Customer.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not customer:

        return jsonify({
            "message": "Customer not found"
        }), 404

    data = request.get_json()

    customer.customer_name = data.get(
        "customer_name",
        customer.customer_name
    )

    customer.phone = data.get(
        "phone",
        customer.phone
    )

    customer.email = data.get(
        "email",
        customer.email
    )

    db.session.commit()

    return jsonify({
        "message": "Customer Updated Successfully"
    }), 200


# --------------------------------------------------
# DELETE CUSTOMER
# --------------------------------------------------

# --------------------------------------------------
# DELETE CUSTOMER
# --------------------------------------------------

@jwt_required()
def delete_customer(id):

    user_id = int(get_jwt_identity())

    customer = Customer.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not customer:

        return jsonify({
            "message": "Customer not found"
        }), 404

    # --------------------------------------------------
    # Keep transactions but remove customer association
    # --------------------------------------------------

    Transaction.query.filter_by(
        customer_id=customer.id,
        user_id=user_id
    ).update(
        {
            "customer_id": None
        },
        synchronize_session=False
    )

    # --------------------------------------------------
    # Delete customer
    # --------------------------------------------------

    db.session.delete(customer)

    db.session.commit()

    return jsonify({
        "message": "Customer Deleted Successfully. Transactions were preserved."
    }), 200

# --------------------------------------------------
# CUSTOMER ANALYTICS — TOTAL CUSTOMERS
# --------------------------------------------------

@jwt_required()
def get_customer_analytics():

    user_id = int(get_jwt_identity())

    # --------------------------------------------------
    # TOTAL CUSTOMERS
    # --------------------------------------------------

    total_customers = Customer.query.filter_by(
        user_id=user_id
    ).count()

    # --------------------------------------------------
    # NEW CUSTOMERS THIS MONTH
    # --------------------------------------------------

    now = datetime.now()

    new_customers = Customer.query.filter(
        Customer.user_id == user_id,
        db.extract("year", Customer.created_at) == now.year,
        db.extract("month", Customer.created_at) == now.month
    ).count()

    # --------------------------------------------------
    # ACTIVE CUSTOMERS
    # A customer is active if they have at least
    # one successful transaction.
    # --------------------------------------------------

    active_customers = db.session.query(
        func.count(
            func.distinct(Transaction.customer_id)
        )
    ).join(
        Customer,
        Transaction.customer_id == Customer.id
    ).filter(
        Customer.user_id == user_id,
        Transaction.status == "Success"
    ).scalar()

    # --------------------------------------------------
    # TOP CUSTOMERS
    # Ranked by total successful transaction amount
    # --------------------------------------------------

    top_customers = db.session.query(
        Customer.id,
        Customer.customer_name,
        func.sum(Transaction.amount).label("total_amount")
    ).join(
        Transaction,
        Transaction.customer_id == Customer.id
    ).filter(
        Customer.user_id == user_id,
        Transaction.status == "Success"
    ).group_by(
        Customer.id,
        Customer.customer_name
    ).order_by(
        func.sum(Transaction.amount).desc()
    ).limit(5).all()

    # Convert SQLAlchemy results to JSON-friendly format

    top_customers_result = []

    for customer in top_customers:

        top_customers_result.append({
            "id": customer.id,
            "customer_name": customer.customer_name,
            "total_amount": float(customer.total_amount)
        })

    # --------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------

    return jsonify({

        "total_customers": total_customers,

        "new_customers": new_customers,

        "active_customers": active_customers,

        "top_customers": top_customers_result

    }), 200