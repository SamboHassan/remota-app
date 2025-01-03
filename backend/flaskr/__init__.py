from flask import Flask, jsonify, abort, redirect, request

from flask_cors import CORS
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

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.after_request
    def after_request(response):
        """This set up cors and allow '*' for origins"""

        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.errorhandler(500)
    def unprocessable_error(error):
        return (
            jsonify(
                {"success": False, "error": 500, "message": "Internal Server error"}
            ),
            500,
        )

    # --------- Errors

    def error_response(status_code, message=None):
        payword = {"error": HTTP_STATUS_CODES.get(status_code, "unknown error")}
        if message:
            payword["message"] = message
        return payword, status_code

    def bad_request(message):
        return error_response(400, message)

    # -------- Endpoints ---------#

    @app.route("/")
    def home():
        return jsonify({"success": True, "message": "Hello world placeholder"})

    with app.app_context():
        db.create_all()

    return app
