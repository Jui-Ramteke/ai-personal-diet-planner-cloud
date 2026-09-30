"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: backend/app.py
Description: Main REST API service implementing JWT authentication,
             cloud database CRUD, cloud object storage uploads,
             and AI diet recommendation integration with offline fallbacks.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Modular service imports
from ai_engine.diet_engine import DietRecommendationEngine
from cloud.database_service import CloudDatabaseService
from cloud.storage_service import CloudObjectStorageService

load_dotenv()

app = Flask(__name__)
CORS(app)

db_service = CloudDatabaseService()
storage_service = CloudObjectStorageService()
ai_engine = DietRecommendationEngine()

def authenticate_request(req):
    """
    Enforces cloud multi-tenant user isolation via Bearer Token.
    """
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "").strip()
    return db_service.verify_token(token)

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"success": False, "message": "Name, email, and password required"}), 400

    existing = db_service.get_user_by_email(email)
    if existing:
        return jsonify({"success": False, "message": "User with this email already registered"}), 409

    user_profile = db_service.create_user(data)
    token = db_service.generate_token(user_profile["id"])

    return jsonify({
        "success": True,
        "token": token,
        "user": user_profile,
        "message": "User registered successfully in Cloud Database"
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = db_service.authenticate_user(email, password)
    if not user:
        return jsonify({"success": False, "message": "Invalid cloud credentials"}), 401

    token = db_service.generate_token(user["id"])
    return jsonify({
        "success": True,
        "token": token,
        "user": user,
        "message": "Cloud authentication successful"
    }), 200

@app.route("/api/profile", methods=["GET", "PUT"])
def profile():
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized: Bearer token required"}), 401

    if request.method == "GET":
        return jsonify({"success": True, "profile": current_user}), 200

    updates = request.get_json() or {}
    updated = db_service.update_user(current_user["id"], updates)
    return jsonify({"success": True, "profile": updated, "message": "Profile updated in Cloud Database"}), 200

@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    current_user = authenticate_request(request)
    data = request.get_json() or {}
    mode = data.get("mode", "gemini")
    profile_data = data.get("profileOverride") or current_user or {}

    try:
        plan = ai_engine.generate_plan(profile_data, mode=mode)
        if current_user:
            plan["userId"] = current_user["id"]

        return jsonify({
            "success": True,
            "plan": plan,
            "engine": plan.get("generatedBy", "rule_based"),
            "message": "Diet plan generated"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/plans", methods=["GET", "POST"])
def plans():
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = current_user["id"]

    if request.method == "POST":
        payload = request.get_json() or {}
        plan_data = payload.get("plan")
        if not plan_data:
            return jsonify({"success": False, "message": "Missing plan payload"}), 400

        saved = db_service.save_plan(user_id, plan_data)
        return jsonify({"success": True, "plan": saved}), 201

    user_plans = db_service.get_user_plans(user_id)
    return jsonify({"success": True, "count": len(user_plans), "plans": user_plans}), 200

@app.route("/api/plans/<plan_id>", methods=["GET", "PUT", "DELETE"])
def plan_detail(plan_id):
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    plan = db_service.get_plan_by_id(plan_id)
    if not plan:
        return jsonify({"success": False, "message": "Plan not found"}), 404

    # Enforce multi-tenant access control
    if plan.get("userId") != current_user["id"]:
        return jsonify({"success": False, "message": "Access Denied: Cross-tenant isolation violation"}), 403

    if request.method == "PUT":
        updates = request.get_json() or {}
        plan.update(updates)
        return jsonify({"success": True, "plan": plan, "message": "Plan updated"}), 200

    if request.method == "DELETE":
        db_service.delete_plan(plan_id)
        return jsonify({"success": True, "message": "Plan deleted"}), 200

    return jsonify({"success": True, "plan": plan}), 200

@app.route("/api/users", methods=["GET"])
def list_users():
    return jsonify({"success": True, "users": list(db_service.users.values())}), 200

@app.route("/api/schema", methods=["GET"])
def get_schema():
    return jsonify({
        "success": True,
        "database": {
            "type": "NoSQL Document Store / Cloud Firestore",
            "collections": [
                {"name": "users", "primaryKey": "id", "description": "User profile & metabolic credentials"},
                {"name": "diet_plans", "primaryKey": "id", "foreignKey": "userId", "description": "Calculated meal plans"},
                {"name": "user_files", "primaryKey": "id", "foreignKey": "userId", "description": "Object storage BLOB index"}
            ]
        }
    }), 200

@app.route("/api/upload", methods=["POST"])
def upload_file():
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.get_json() or {}
    filename = data.get("filename")
    content_type = data.get("contentType")
    data_url = data.get("dataUrl")

    if not filename or not data_url:
        return jsonify({"success": False, "message": "Filename and dataUrl required"}), 400

    file_record = storage_service.upload_object(
        user_id=current_user["id"],
        filename=filename,
        content_type=content_type,
        data_url=data_url
    )

    return jsonify({"success": True, "file": file_record}), 201

@app.route("/api/files", methods=["GET"])
def list_files():
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_files = storage_service.list_user_objects(current_user["id"])
    return jsonify({"success": True, "count": len(user_files), "files": user_files}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
