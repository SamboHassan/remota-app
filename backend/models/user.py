from db import db
from datetime import datetime
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func


class UserModel(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    is_admin = db.Column(db.Boolean, default=False)  # Admin flag

    def __repr__(self):
        return f"<User: {self.username}>"
