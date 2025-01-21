# # Utility functions
# def create_admin(username, email, password):
#     hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
#     admin = User(
#         username=username, email=email, password=hashed_password, is_admin=True
#     )
#     db.session.add(admin)
#     db.session.commit()
#     print(f"Admin user {username} created.")

#     # Command to initialize the database (run once)


# @app.before_first_request
# def create_tables():
#     db.create_all()


# if __name__ == "__main__":
#     app.run(debug=True)


# from flask import request, jsonify
# from flask_bcrypt import generate_password_hash


# @app.route("/register", methods=["POST"])
# def register_user():
#     data = request.json  # Expecting JSON input
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")

#     # Check if user already exists
#     if User.query.filter_by(email=email).first():
#         return jsonify({"message": "Email already registered"}), 400

#     hashed_password = generate_password_hash(password).decode("utf-8")
#     new_user = User(username=username, email=email, password=hashed_password)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"message": f"User {username} registered successfully!"}), 201
