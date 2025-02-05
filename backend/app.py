from flask import Flask, jsonify, request
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from datetime import timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename

from models import UserModel
from db import db
import os

from resources.user import blp as UserBlueprint
from resources.job import blp as JobBlueprint

# from resources.application import blp as ApplicationBlueprint

# from werkzeug.http import HTTP_STATUS_CODES
from passlib.hash import pbkdf2_sha256
from blocklist import BLOCKLIST


def create_app(db_url=None):
    app = Flask(__name__)
    app.config["API_TITLE"] = "Remota REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = (
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///jobapp.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["JWT_ERROR_MESSAGE_KEY"] = "message"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
    # Enable CORS for all routes and origins
    # CORS(app)
    # CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    CORS(app, supports_credentials=True)
    UPLOAD_FOLDER = "uploads"
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)

    # Configure Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "Users.login"  # Route name for login
    # login_manager.login_view = (
    #     "UserBlueprint.login"  # Redirect to login if not authenticated
    # )

    # Define the user_loader function
    @login_manager.user_loader
    def load_user(user_id):
        return UserModel.query.get(int(user_id))  # Load user by ID

    # Authentication Middleware - 01/02/2025
    # @app.before_request
    # def require_login():
    #     if request.endpoint and request.endpoint.startswith("public_"):
    #         return  # Skip authentication for public routes

    #     if not request.headers.get("Authorization"):
    #         return jsonify({"code": 401, "status": "Unauthorized"}), 401

    # JWT token blocklist loader
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has expired.", "error": "token_expired"}),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Signature verification failed.", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required",
                }
            ),
            401,
        )

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {
                    "description": "The token is not fresh.",
                    "error": "fresh_token_required",
                }
            ),
            401,
        )

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {"description": "The token has been revoked.", "error": "token_revoked"}
            ),
            401,
        )

    with app.app_context():
        import models  # noqa: F401

        db.create_all()

    api.register_blueprint(UserBlueprint)
    api.register_blueprint(JobBlueprint)

    return app
