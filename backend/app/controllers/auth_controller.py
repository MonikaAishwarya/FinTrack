from flask import request, jsonify
from flask_jwt_extended import create_access_token

from app.models.user_model import User
from app.extensions import db


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
    user.set_password(data["password"])


    db.session.add(user)
    db.session.commit()


    return jsonify({
        "message": "User Registered Successfully"
    }), 201



def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")


    user = User.query.filter_by(
        email=email
    ).first()


    if not user or not user.check_password(password):

        return jsonify({
            "message": "Invalid credentials"
        }), 401

    print(type(user.id))
    print(str(user.id))

    token = create_access_token(
        identity=str(user.id)
    )


    return jsonify({
        "message": "Login Successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
    }
}), 200