from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

from app.models.user_model import User
from app.models.fraud_alert_model import FraudAlert
from app.extensions import db


# ==========================================================
# REGISTER
# ==========================================================

def register():

    data = request.get_json()

    # Check if user already exists
    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    # Create new user
    user = User(
        name=data["name"],
        email=data["email"]
    )

    # Hash password before storing
    user.set_password(
        data["password"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User Registered Successfully"
    }), 201


# ==========================================================
# LOGIN
# ==========================================================

def login():

    data = request.get_json()

    location = data.get(
        "location",
        "Unknown"
    )

    email = data.get("email")
    password = data.get("password")

    # ------------------------------------------------------
    # Find user
    # ------------------------------------------------------

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    # ------------------------------------------------------
    # Verify password
    # ------------------------------------------------------

    if not check_password_hash(
        user.password,
        password
    ):
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    # ------------------------------------------------------
    # FRAUD RULE:
    # MULTIPLE LOGIN LOCATIONS
    # ------------------------------------------------------

    previous_location = user.last_login_location

    location_changed = (
        previous_location is not None
        and previous_location != location
    )

    if location_changed:

        fraud_alert = FraudAlert(
            user_id=user.id,
            transaction_id=None,
            alert_type="Multiple Login Locations",
            severity="High",
            message=(
                f"Login location changed from "
                f"{previous_location} to {location}."
            )
        )

        db.session.add(
            fraud_alert
        )

    # ------------------------------------------------------
    # Update latest login location
    # ------------------------------------------------------

    user.last_login_location = location

    db.session.commit()

    # ------------------------------------------------------
    # Generate JWT token
    # ------------------------------------------------------

    token = create_access_token(
        identity=str(user.id)
    )

    # ------------------------------------------------------
    # Response
    # ------------------------------------------------------

    return jsonify({

        "message": "Login Successful",

        "token": token,

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }

    }), 200