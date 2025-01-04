# ----------------------------------------------------------------------------#
# Imports
# ----------------------------------------------------------------------------#

from flask import Flask, jsonify, abort, request, url_for, flash, redirect
from werkzeug.http import HTTP_STATUS_CODES
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    create_refresh_token,
    JWTManager,
)
from passlib.hash import pbkdf2_sha256
from models import db, UserModel, JobModel


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///portal.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = "super secret key"
    app.config["JWT_SECRET_KEY"] = "jose"
    jwt = JWTManager(app)

    db.init_app(app)
    db.app = app

    # -------- Endpoints ---------#

    @app.route("/")
    def index():
        try:
            users = UserModel.query.all().sort_by(UserModel.username)
            return jsonify({"users": users})
        except Exception as e:
            print(f'Exception "{e}"')
            flash("An Error had occurred, users could not be fetched")

    @app.route("/users", methods=["POST"])
    def register():
        insert_error = False
        try:
            user_data = request.get_json()
            if UserModel.query.filter(
                UserModel.username == user_data["username"]
            ).first():
                abort(409)
            user = UserModel(
                username=user_data["username"],
                password=pbkdf2_sha256.hash(user_data["password"]),
                email=user_data["email"],
                is_admin=user_data["is_admin"],
            )
            db.session.add(user)
            db.session.commit()

        except Exception as e:
            insert_error = True
            print(f'Exception "{e}"')
            db.session.rollback()

        if not insert_error:
            flash("You are successfully registred!")
            return user.format()
            # return redirect(url_for("index"))
        else:
            flash("could not be listed.")
            abort(500)
            return redirect(url_for("index"))

    @app.route("/login")
    def login(user_data):
        user_data = request.get_json()
        # clinet will send  json payload
        # with email and password combination
        # in order to login
        user = UserModel.query.filter(UserModel.email == user_data["email"]).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=str(user.id), fresh=True)
            refresh_token = create_refresh_token(str(user.id))
            return {"access_token": access_token, "refresh_token": refresh_token}, 200

    with app.app_context():
        db.create_all()

    return app
