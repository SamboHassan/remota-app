from flask import request
from flask_login import login_user
from flask_smorest import Blueprint, abort

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_jwt,
    jwt_required,
    get_jwt_identity,
)
from flask import jsonify
from werkzeug.http import HTTP_STATUS_CODES

from passlib.hash import pbkdf2_sha256

from db import db
from models import UserModel
from schemas import UserSchema, LoginSchema

from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError
from blocklist import BLOCKLIST


blp = Blueprint("Users", "users", description="Operations on users")


# -------- Endpoints ---------#


# @blp.route("/users")
# @blp.arguments(UserSchema)  # Validate request payload with schema
# def index():
#     try:
#         users = UserModel.query.all()
#         return jsonify({"users": users})
#     except Exception as e:
#         print(f'Exception "{e}"')
#         flash("An Error had occurred, users could not be fetched")


@blp.route("/users", methods=["POST"])
@blp.arguments(UserSchema)  # Validate request payload with schema
@blp.response(201, UserSchema)  # Validate response with schema
def register(user_data):
    try:
        # if UserModel.query.filter(UserModel.username == user_data["username"]).first():
        #     abort(409, message="A user with that username already exists.")
        user = UserModel(
            username=user_data["username"],
            password=pbkdf2_sha256.hash(user_data["password"]),
            email=user_data["email"],
            is_admin=user_data["is_admin"],
        )
        db.session.add(user)
        db.session.commit()
        return user

    except IntegrityError as e:
        db.session.rollback()  # Rollback transaction on failure
        return {"message": "Username or email already exists."}, 400

    except Exception as e:
        db.session.rollback()  # Rollback transaction on other errors
        return {"message": "An unexpected error occurred."}, 500


@blp.route("/login", methods=["POST"])
@blp.arguments(LoginSchema)  # Use LoginSchema for validation
def login(user_data):
    user = UserModel.query.filter(UserModel.email == user_data["email"]).first()
    if user and pbkdf2_sha256.verify(user_data["password"], user.password):
        login_user(user)  # Log the user in
        access_token = create_access_token(identity=str(user.id), fresh=True)
        refresh_token = create_refresh_token(str(user.id))

        return (
            jsonify(
                {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }
            ),
            200,
        )
    abort(401, message="Invalid credentials.")


@blp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    print(request.headers)  # Debugging: Log headers
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    return {"message": "Successfully logged out"}, 200


@blp.route("/refresh")
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    # Make it clear that when to add the refresh token to the blocklist will
    # depend on the app design
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    return {"access_token": new_token}, 200
