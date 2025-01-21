from db import db
from datetime import datetime
import json
from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash


class UserModel(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    is_admin = db.Column(db.Boolean, default=False)  # Admin flag
    jobs_posted = db.relationship("JobModel", backref="poster", lazy="dynamic")

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<User: {self.username}>"
