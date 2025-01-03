from flask import Flask, jsonify, abort, request

from werkzeug.http import HTTP_STATUS_CODES
from flask_jwt_extended import jwt_required
from passlib.hash import pbkdf2_sha256


from models import db, UserModel, JobModel


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///portal.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    db.app = app

    # -------- Endpoints ---------#

    @app.route("/")
    def home():
        return jsonify({"success": True, "message": "Hello world placeholder"})

    @app.route("/users", methods=["POST"])
    def register():
        user_data = request.get_json()
        if UserModel.query.filter(UserModel.username == user_data["username"]).first():
            abort(409)

        user = UserModel(
            username=user_data["username"],
            password=pbkdf2_sha256.hash(user_data["password"]),
            email=user_data["email"],
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"id": user.id, "password": user.password})

    with app.app_context():
        db.create_all()

    return app
