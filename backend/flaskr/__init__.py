# ----------------------------------------------------------------------------#
# Imports
# ----------------------------------------------------------------------------#

from flask import Flask, jsonify, abort, request, url_for, flash, redirect
from werkzeug.http import HTTP_STATUS_CODES
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token
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

        finally:
            db.session.close()

        if not insert_error:
            flash("You are successfully registred!")
            return user.format()
            # return redirect(url_for("index"))
        else:
            flash("could not be listed.")
            abort(500)
            return redirect(url_for("index"))

    with app.app_context():
        db.create_all()

    return app
