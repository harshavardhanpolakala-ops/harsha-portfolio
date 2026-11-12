
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import re
from pathlib import Path

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "messages.db"

# Allow requests from your own website.
# Local development is allowed for testing.
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://127.0.0.1:5000",
            "http://localhost:5000",
            "https://harshavardhanpolakala-ops.github.io"
        ]
    }
})


# Create the database
def create_database():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL
            )
        """)


# Display the portfolio homepage
@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


# Serve only public website files
@app.route("/style.css")
@app.route("/script.js")
def public_files():
    filename = request.path.lstrip("/")
    return send_from_directory(BASE_DIR, filename)


# Receive contact form submissions
@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request"}), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    if len(name) > 100 or len(email) > 254 or len(message) > 5000:
        return jsonify({"error": "One or more fields are too long"}), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    with sqlite3.connect(DATABASE) as connection:
        connection.execute(
            "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
            (name, email, message)
        )

    return jsonify({"success": "Message received successfully!"}), 201


create_database()

if __name__ == "__main__":
    app.run(debug=False)
