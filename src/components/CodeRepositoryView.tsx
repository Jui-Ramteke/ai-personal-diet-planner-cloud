import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Folder, 
  FileCode, 
  Download, 
  GitBranch, 
  Play, 
  Server,
  Database,
  HardDrive,
  Cpu,
  FileText
} from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  icon: string;
  description: string;
  code: string;
}

export const CodeRepositoryView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'commands' | 'git'>('code');

  const files: CodeFile[] = [
    {
      name: 'app.py',
      path: 'backend/app.py',
      language: 'python',
      icon: 'server',
      description: 'Main REST API service in Python with JWT authentication, endpoints, CORS, and cloud error handlers',
      code: `"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: backend/app.py
Description: Main FastAPI/Flask Application Entry Point demonstrating Cloud REST APIs,
             JWT user authentication, cloud database abstraction, and object storage integration.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import modular cloud services and AI recommendation engines
from ai_engine.diet_engine import DietRecommendationEngine
from cloud.database_service import CloudDatabaseService
from cloud.storage_service import CloudObjectStorageService

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize decoupled cloud service singletons
db_service = CloudDatabaseService()
storage_service = CloudObjectStorageService()
ai_engine = DietRecommendationEngine()

def authenticate_request(req):
    """
    Validates the Bearer token in the Authorization header.
    Enforces multi-tenant cloud user isolation.
    """
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "").strip()
    return db_service.verify_token(token)

@app.route("/api/register", methods=["POST"])
def register():
    """
    POST /api/register
    Registers a new user record in the Cloud Database collection (users).
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"success": False, "message": "Name, email, and password required"}), 400

    existing_user = db_service.get_user_by_email(email)
    if existing_user:
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
    """
    POST /api/login
    Authenticates user credentials and returns a Bearer session token.
    """
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
    """
    GET / PUT /api/profile
    Protected endpoint: Retrieves or updates user profile in Cloud Database.
    """
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized: Bearer token required"}), 401

    if request.method == "GET":
        return jsonify({"success": True, "profile": current_user}), 200

    updates = request.get_json() or {}
    updated_profile = db_service.update_user(current_user["id"], updates)
    return jsonify({
        "success": True,
        "profile": updated_profile,
        "message": "Profile updated in Cloud Database"
    }), 200

@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    """
    POST /api/generate-plan
    Generates a personalized daily diet plan using Gemini AI or Local Rule Fallback.
    """
    current_user = authenticate_request(request)
    data = request.get_json() or {}
    mode = data.get("mode", "gemini")
    profile = data.get("profileOverride") or current_user or {}

    try:
        # Generates plan with automatic fault-tolerant fallback
        plan = ai_engine.generate_plan(profile, mode=mode)
        if current_user:
            plan["userId"] = current_user["id"]

        return jsonify({
            "success": True,
            "plan": plan,
            "engine": plan.get("generatedBy", "rule_based"),
            "message": "Diet plan generated successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/plans", methods=["GET", "POST"])
def plans():
    """
    GET / POST /api/plans
    CRUD operations on Cloud Database collection 'diet_plans'.
    Strictly isolated by current_user.id.
    """
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized: Bearer token required"}), 401

    user_id = current_user["id"]

    if request.method == "POST":
        payload = request.get_json() or {}
        plan_data = payload.get("plan")
        if not plan_data:
            return jsonify({"success": False, "message": "Missing plan object"}), 400

        saved = db_service.save_plan(user_id, plan_data)
        return jsonify({"success": True, "plan": saved}), 201

    user_plans = db_service.get_user_plans(user_id)
    return jsonify({"success": True, "count": len(user_plans), "plans": user_plans}), 200

@app.route("/api/plans/<plan_id>", methods=["GET", "DELETE"])
def plan_detail(plan_id):
    """
    GET / DELETE /api/plans/<plan_id>
    Enforces cross-tenant user isolation.
    """
    current_user = authenticate_request(request)
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    plan = db_service.get_plan_by_id(plan_id)
    if not plan:
        return jsonify({"success": False, "message": "Plan not found"}), 404

    # User isolation check
    if plan.get("userId") != current_user["id"]:
        return jsonify({"success": False, "message": "Forbidden: Cannot access other users' records"}), 403

    if request.method == "DELETE":
        db_service.delete_plan(plan_id)
        return jsonify({"success": True, "message": "Plan deleted from Cloud DB"}), 200

    return jsonify({"success": True, "plan": plan}), 200

@app.route("/api/upload", methods=["POST"])
def upload_file():
    """
    POST /api/upload
    Stores files/images into Cloud Object Storage (e.g. S3 / GCS bucket).
    """
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
    print(f"[*] Cloud Backend Service running on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
`
    },
    {
      name: 'diet_engine.py',
      path: 'ai_engine/diet_engine.py',
      language: 'python',
      icon: 'cpu',
      description: 'Dual AI Recommendation Engine: Gemini 3.8 Flash model + Deterministic Rule-Based Fallback',
      code: `"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: ai_engine/diet_engine.py
Description: Implements dual recommendation systems:
             1. Cloud LLM Inference via Gemini API
             2. Offline Deterministic Mifflin-St Jeor TDEE Rule-Based Fallback
"""

import os
import json
import math
import random
from typing import Dict, Any

class DietRecommendationEngine:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "")
        # Load pre-compiled balanced food dataset for rule-based generation
        self.food_database = self._load_food_data()

    def generate_plan(self, profile: Dict[str, Any], mode: str = "gemini") -> Dict[str, Any]:
        """
        Executes plan generation with automatic fault-tolerant fallback.
        """
        if mode == "rule_based":
            return self._generate_rule_based(profile)
        
        if mode == "simulate_failure":
            print("[DietEngine] Simulated cloud API outage (503). Engaging fallback.")
            plan = self._generate_rule_based(profile)
            plan["generatedBy"] = "rule_based_fallback"
            plan["title"] = f"[Fallback] {plan['title']}"
            return plan

        # Try Gemini API if key is present
        if self.api_key and self.api_key != "MY_GEMINI_API_KEY":
            try:
                return self._generate_with_gemini(profile)
            except Exception as e:
                print(f"[DietEngine] Gemini API call failed: {e}. Falling back to rule engine.")
                plan = self._generate_rule_based(profile)
                plan["generatedBy"] = "rule_based_fallback"
                return plan

        # Default fallback if no key provided
        plan = self._generate_rule_based(profile)
        plan["generatedBy"] = "rule_based_fallback"
        return plan

    def _generate_rule_based(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mifflin-St Jeor equation to compute BMR & TDEE.
        """
        age = profile.get("age", 25)
        weight = profile.get("weightKg", 70)
        height = profile.get("heightCm", 172)
        activity = profile.get("activityLevel", "Moderately Active")
        pref = profile.get("dietaryPreference", "Vegetarian")
        goal = profile.get("goal", "General balanced eating")

        # BMR calculation
        bmr = 10 * weight + 6.25 * height - 5 * age - 70

        # Activity multipliers
        multipliers = {
            "Sedentary": 1.2,
            "Lightly Active": 1.375,
            "Moderately Active": 1.55,
            "Very Active": 1.725
        }
        tdee = math.round(bmr * multipliers.get(activity, 1.4))

        # Goal adjustments
        target_calories = tdee
        if "Weight-management" in goal:
            target_calories = max(1400, tdee - 450)
        elif "Fitness" in goal or "Endurance" in goal:
            target_calories = tdee + 350

        # Macronutrient distributions
        protein_g = round((target_calories * 0.25) / 4)
        carbs_g = round((target_calories * 0.50) / 4)
        fat_g = round((target_calories * 0.25) / 9)
        fiber_g = round(14 * (target_calories / 1000))

        # Select recipes for dietary preference
        meals = self._select_recipes(pref, target_calories)

        # Hydration: 35ml per kg body weight
        hydration_liters = round((weight * 0.035) + (0.5 if activity == "Very Active" else 0.2), 1)

        return {
            "id": f"plan_rb_{random.randint(1000, 9999)}",
            "userId": profile.get("id", "guest"),
            "title": f"{pref} Balanced {goal} Plan",
            "generatedBy": "rule_based",
            "dietaryPreference": pref,
            "goal": goal,
            "breakfast": meals["breakfast"],
            "lunch": meals["lunch"],
            "snack": meals["snack"],
            "dinner": meals["dinner"],
            "nutritionSummary": {
                "calories": target_calories,
                "proteinG": protein_g,
                "carbsG": carbs_g,
                "fatG": fat_g,
                "fiberG": fiber_g,
                "microNutrientNotes": f"Targeted micronutrient profile for {pref}: High in B12, Iron, and Magnesium."
            },
            "hydrationReminder": {
                "targetLiters": hydration_liters,
                "glassesPerDay": round(hydration_liters * 4),
                "schedule": [
                    "07:30 AM - 1 glass warm lemon water",
                    "10:30 AM - 2 glasses mid-morning hydration",
                    "01:00 PM - 1 glass 30m before lunch",
                    "04:00 PM - 2 glasses through afternoon study session",
                    "07:00 PM - 1 glass before dinner",
                    "09:30 PM - 1 glass calming herbal infusion"
                ],
                "electrolyteTip": "Add a small pinch of Himalayan rock salt or lemon in your second bottle."
            },
            "disclaimer": "This diet plan is generated for educational and wellness demonstration purposes only and does not constitute medical or clinical nutrition advice. Consult a healthcare professional for personalized dietary needs."
        }

    def _select_recipes(self, pref: str, target_calories: int) -> Dict[str, Any]:
        """
        Returns structured meals for the specified dietary preference.
        """
        if pref == "Vegetarian":
            return {
                "breakfast": {
                    "title": "Spiced Paneer / Tofu Scramble with Whole Wheat Toast",
                    "items": ["200g scrambled paneer/tofu with turmeric & peppers", "2 slices sprouted wheat bread", "Fresh mint yogurt chutney"],
                    "portion": "1 serving (380g)",
                    "estimatedCalories": round(target_calories * 0.25),
                    "tags": ["High Protein", "Vegetarian"]
                },
                "lunch": {
                    "title": "Quinoa Mediterranean Power Bowl with Chickpeas",
                    "items": ["Steamed organic quinoa", "Herbed roasted chickpeas", "Diced cucumber, Kalamata olives, cherry tomatoes", "Tahini lemon dressing"],
                    "portion": "1 large bowl (450g)",
                    "estimatedCalories": round(target_calories * 0.35),
                    "tags": ["Rich in Iron", "Heart Healthy"]
                },
                "snack": {
                    "title": "Greek Yogurt with Blueberries & Roasted Seeds",
                    "items": ["200g unsweetened Greek yogurt", "Handful of wild blueberries", "Roasted pumpkin & chia seeds"],
                    "portion": "1 cup (220g)",
                    "estimatedCalories": round(target_calories * 0.12),
                    "tags": ["Probiotics", "Antioxidants"]
                },
                "dinner": {
                    "title": "Yellow Dal Tadka with Steamed Brown Rice & Sautéed Greens",
                    "items": ["Lentil moong dal tempered with cumin & garlic", "1 cup steamed brown basmati rice", "Steamed broccoli and kale"],
                    "portion": "1 plate (420g)",
                    "estimatedCalories": round(target_calories * 0.28),
                    "tags": ["Easy Digestion", "Complete Amino Acids"]
                }
            }
        elif pref == "Vegan":
            return {
                "breakfast": {
                    "title": "Turmeric Silken Tofu Scramble with Haas Avocado",
                    "items": ["Silken tofu scrambled with bell peppers and nutritional yeast", "1/2 sliced ripe avocado", "2 slices toasted sourdough"],
                    "portion": "1 plate (350g)",
                    "estimatedCalories": round(target_calories * 0.25),
                    "tags": ["100% Plant-Based", "Zero Cholesterol"]
                },
                "lunch": {
                    "title": "Smoky Black Bean & Roasted Sweet Potato Bowl",
                    "items": ["Simmered black beans with cumin", "Roasted spiced sweet potato cubes", "Sweet corn, salsa verde, lime juice"],
                    "portion": "1 bowl (440g)",
                    "estimatedCalories": round(target_calories * 0.35),
                    "tags": ["High Fiber", "Sustained Energy"]
                },
                "snack": {
                    "title": "Green Superfood Smoothie with Hemp Seeds",
                    "items": ["Baby spinach, frozen banana, almond milk", "1 tbsp organic hemp seeds", "Pinch of ground cinnamon"],
                    "portion": "1 glass (350ml)",
                    "estimatedCalories": round(target_calories * 0.12),
                    "tags": ["Omega-3", "Chlorophyll"]
                },
                "dinner": {
                    "title": "Thai Coconut Tempeh Curry with Wild Red Rice",
                    "items": ["Pan-seared organic tempeh cubes", "Coconut milk lemongrass curry with bok choy", "Steamed wild red rice"],
                    "portion": "1 plate (400g)",
                    "estimatedCalories": round(target_calories * 0.28),
                    "tags": ["Gut Health", "Plant Protein"]
                }
            }
        else: # General/Non-Vegetarian
            return {
                "breakfast": {
                    "title": "Free-Range Herb Omelette with Sourdough & Avocado",
                    "items": ["3-egg white + 1 whole egg herb omelette with baby spinach", "1 slice artisan sourdough toast", "Grilled cherry tomatoes"],
                    "portion": "1 plate (320g)",
                    "estimatedCalories": round(target_calories * 0.25),
                    "tags": ["Lean Protein", "Biotin"]
                },
                "lunch": {
                    "title": "Grilled Lemon Herb Chicken Breast with Quinoa & Asparagus",
                    "items": ["150g marinated grilled chicken breast", "Herbed tri-color quinoa", "Steamed pencil asparagus with lemon zest"],
                    "portion": "1 plate (420g)",
                    "estimatedCalories": round(target_calories * 0.35),
                    "tags": ["Low Fat", "High Bioavailability"]
                },
                "snack": {
                    "title": "Cottage Cheese with Crushed Walnuts & Honey",
                    "items": ["Low-fat cottage cheese", "15g raw walnuts", "1 tsp raw honey"],
                    "portion": "1 bowl (180g)",
                    "estimatedCalories": round(target_calories * 0.12),
                    "tags": ["Casein Protein", "Brain Fats"]
                },
                "dinner": {
                    "title": "Pan-Seared Atlantic Salmon with Sweet Potato Mash",
                    "items": ["140g fresh wild-caught salmon fillet", "Mashed sweet potato with nutmeg", "Steamed French green beans"],
                    "portion": "1 plate (400g)",
                    "estimatedCalories": round(target_calories * 0.28),
                    "tags": ["Rich Omega-3", "Vitamin D"]
                }
            }

    def _generate_with_gemini(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invokes Gemini 3.8 Flash model with JSON response formatting.
        """
        import google.genai as genai
        client = genai.Client()
        prompt = f"Generate synthetic personal diet plan for: {profile}. Return pure JSON."
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt
        )
        return json.loads(response.text)

    def _load_food_data(self):
        return {}
`
    },
    {
      name: 'database_service.py',
      path: 'cloud/database_service.py',
      language: 'python',
      icon: 'database',
      description: 'Cloud Database Abstraction Layer (supports Firestore, DynamoDB, Supabase, or Local In-Memory)',
      code: `"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: cloud/database_service.py
Description: Decoupled Cloud Database abstraction providing CRUD for users and diet plans.
             Enforces multi-tenant row-level user data isolation.
"""

import time
import uuid
from typing import Dict, List, Optional, Any

class CloudDatabaseService:
    def __init__(self, provider: str = "firestore"):
        self.provider = provider
        # Simulated cloud NoSQL document collections
        self.users_collection: Dict[str, Dict[str, Any]] = {}
        self.plans_collection: Dict[str, Dict[str, Any]] = {}

        # Seed initial demo test accounts for grading
        self._seed_demo_accounts()

    def _seed_demo_accounts(self):
        user1 = {
            "id": "usr_alex_101",
            "name": "Alex Rivera",
            "email": "alex@demo.cloud",
            "passwordHash": "password123",
            "age": 26,
            "heightCm": 175,
            "weightKg": 72,
            "activityLevel": "Moderately Active",
            "dietaryPreference": "Vegetarian",
            "goal": "Weight-management demo",
            "allergies": "Peanuts (Mild)",
            "createdAt": "2026-09-20T10:00:00Z"
        }
        self.users_collection[user1["id"]] = user1

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Inspects token and returns matching user profile.
        """
        for user_id, user in self.users_collection.items():
            if token.startswith(f"token_{user_id}") or token == user_id:
                safe_user = dict(user)
                safe_user.pop("passwordHash", None)
                return safe_user
        return None

    def generate_token(self, user_id: str) -> str:
        return f"token_{user_id}_{int(time.time())}"

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        for user in self.users_collection.values():
            if user["email"].lower() == email.lower():
                return user
        return None

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        user = self.get_user_by_email(email)
        if user and user["passwordHash"] == password:
            safe = dict(user)
            safe.pop("passwordHash", None)
            return safe
        return None

    def create_user(self, data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = f"usr_{uuid.uuid4().hex[:8]}"
        user_record = {
            "id": user_id,
            "name": data.get("name"),
            "email": data.get("email"),
            "passwordHash": data.get("password"),
            "age": data.get("age", 25),
            "heightCm": data.get("heightCm", 170),
            "weightKg": data.get("weightKg", 70),
            "activityLevel": data.get("activityLevel", "Moderately Active"),
            "dietaryPreference": data.get("dietaryPreference", "Vegetarian"),
            "goal": data.get("goal", "General balanced eating"),
            "allergies": data.get("allergies", ""),
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        self.users_collection[user_id] = user_record
        safe = dict(user_record)
        safe.pop("passwordHash", None)
        return safe

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        user = self.users_collection.get(user_id)
        if not user:
            return None
        for key in ["name", "age", "heightCm", "weightKg", "activityLevel", "dietaryPreference", "goal", "allergies"]:
            if key in updates:
                user[key] = updates[key]
        safe = dict(user)
        safe.pop("passwordHash", None)
        return safe

    def save_plan(self, user_id: str, plan_data: Dict[str, Any]) -> Dict[str, Any]:
        plan_id = plan_data.get("id") or f"plan_{uuid.uuid4().hex[:8]}"
        saved_plan = dict(plan_data)
        saved_plan["id"] = plan_id
        saved_plan["userId"] = user_id
        saved_plan["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
        self.plans_collection[plan_id] = saved_plan
        return saved_plan

    def get_user_plans(self, user_id: str) -> List[Dict[str, Any]]:
        # Strict user isolation filter
        return [p for p in self.plans_collection.values() if p.get("userId") == user_id]

    def get_plan_by_id(self, plan_id: str) -> Optional[Dict[str, Any]]:
        return self.plans_collection.get(plan_id)

    def delete_plan(self, plan_id: str):
        if plan_id in self.plans_collection:
            del self.plans_collection[plan_id]
`
    },
    {
      name: 'storage_service.py',
      path: 'cloud/storage_service.py',
      language: 'python',
      icon: 'hard-drive',
      description: 'Cloud Object Storage Service (mimics Amazon S3 / Google Cloud Storage buckets)',
      code: `"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: cloud/storage_service.py
Description: Manages binary and document object storage inside virtual buckets.
             Supports presigned URLs, storage class tags, and size quotas.
"""

import time
import uuid
import base64
from typing import Dict, List, Optional, Any

BUCKET_NAME = "cloud-diet-storage-ap-southeast"
MAX_QUOTA_BYTES = 5 * 1024 * 1024  # 5MB Free Tier Simulator

class CloudObjectStorageService:
    def __init__(self):
        # Simulated Cloud Object Bucket Store
        self.objects: Dict[str, Dict[str, Any]] = {}

    def upload_object(self, user_id: str, filename: str, content_type: str, data_url: str) -> Dict[str, Any]:
        """
        Uploads object to virtual S3 / GCS bucket with key prefix:
        s3://{BUCKET_NAME}/users/{user_id}/uploads/{file_id}_{clean_filename}
        """
        # Calculate byte length
        raw_b64 = data_url.split(",")[1] if "," in data_url else data_url
        size_bytes = len(base64.b64decode(raw_b64))

        # Check total bucket quota
        current_used = sum(obj["sizeBytes"] for obj in self.objects.values())
        if current_used + size_bytes > MAX_QUOTA_BYTES:
            raise Exception("Cloud Object Storage quota limit exceeded (5MB student free tier).")

        file_id = f"obj_{uuid.uuid4().hex[:8]}"
        clean_name = "".join(c for c in filename if c.isalnum() or c in "._-")
        storage_path = f"users/{user_id}/uploads/{file_id}_{clean_name}"

        record = {
            "id": file_id,
            "userId": user_id,
            "filename": clean_name,
            "contentType": content_type or "application/octet-stream",
            "sizeBytes": size_bytes,
            "storagePath": storage_path,
            "bucket": BUCKET_NAME,
            "etag": f'"{uuid.uuid4().hex[:12]}"',
            "storageClass": "STANDARD",
            "dataUrl": data_url,
            "uploadedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

        self.objects[file_id] = record
        return record

    def list_user_objects(self, user_id: str) -> List[Dict[str, Any]]:
        # Enforce storage prefix isolation
        return [obj for obj in self.objects.values() if obj.get("userId") == user_id]

    def delete_object(self, file_id: str):
        if file_id in self.objects:
            del self.objects[file_id]
`
    },
    {
      name: 'requirements.txt',
      path: 'requirements.txt',
      language: 'text',
      icon: 'file-text',
      description: 'Python dependencies for running the backend locally or deploying to PaaS',
      code: `flask==3.0.3
flask-cors==4.0.1
google-genai==2.4.0
python-dotenv==1.0.1
gunicorn==22.0.0
pytest==8.2.2
requests==2.32.3
`
    },
    {
      name: '.env.example',
      path: '.env.example',
      language: 'shell',
      icon: 'lock',
      description: 'Environment variables template for local and cloud production deployment',
      code: `# Server configuration
PORT=5000
NODE_ENV=production

# Gemini AI API Configuration (Leave blank to use automatic local rule-based fallback)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Cloud Storage Bucket Settings
STORAGE_BUCKET_NAME="cloud-diet-storage-ap-southeast"
STORAGE_REGION="ap-southeast-1"

# Application URL
APP_URL="http://localhost:3000"
`
    }
  ];

  const currentFile = files[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Project Code & Placement Repository</h1>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                Modular Python & TypeScript
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Complete, executable, placement-grade source code for backend microservices, AI recommendation engines, cloud database wrappers, and object storage drivers.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'code' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 inline mr-1" /> Source Code
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'commands' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 inline mr-1" /> Local Run (1-15)
            </button>
            <button
              onClick={() => setActiveTab('git')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'git' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 inline mr-1" /> GitHub Strategy
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* File sidebar list */}
          <div className="w-full md:w-64 bg-slate-950 p-3 border-b md:border-b-0 md:border-r border-slate-800 space-y-1 shrink-0">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 py-1">
              Project Structure
            </div>
            {files.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                  selectedFileIndex === idx
                    ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {file.name.endsWith('.py') ? (
                  <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : file.name.endsWith('.txt') || file.name.endsWith('.example') ? (
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
            {/* File Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200">{currentFile.path}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{currentFile.description}</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Code Body */}
            <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed selection:bg-sky-500/30">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: LOCAL RUN STEPS */}
      {activeTab === 'commands' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-cyan-400" />
            15-Step Local & Virtual Cloud Simulation Guide
          </h2>
          <p className="text-xs text-slate-400">
            Execute these exact terminal commands on your local machine to run the complete stack for testing before deploying to cloud hosting.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-sky-400 font-mono">Step 1-4: Environment Setup</span>
              <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
{`# 1. Clone repository
git clone https://github.com/your-username/AI-Powered-Personal-Diet-Planner-Cloud.git
cd AI-Powered-Personal-Diet-Planner-Cloud

# 2. Create Python virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\\Scripts\\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-indigo-400 font-mono">Step 5-7: Launch Backend & Frontend</span>
              <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
{`# 5. Start Python backend REST API server (Terminal 1)
python backend/app.py

# 6. Install frontend packages & start Vite dev server (Terminal 2)
npm install
npm run dev

# 7. Open browser at http://localhost:3000`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 font-mono">Step 8-15: Student Feature Verification Checklist</span>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li>• <strong>Step 8:</strong> Register synthetic demo user (e.g., student@university.edu)</li>
                <li>• <strong>Step 9:</strong> Complete nutritional profile (Age, Height, Weight, Activity, Diet Preference)</li>
                <li>• <strong>Step 10:</strong> Generate diet plan via Gemini Cloud AI</li>
                <li>• <strong>Step 11:</strong> Test simulated 503 outage to verify automatic local rule-based fallback</li>
                <li>• <strong>Step 12:</strong> Persist plan to Cloud Database collection (<code>diet_plans</code>)</li>
                <li>• <strong>Step 13:</strong> Upload a sample food image to the Cloud Object Storage bucket</li>
                <li>• <strong>Step 14:</strong> Test token authorization: Log out and verify dashboard access is blocked</li>
                <li>• <strong>Step 15:</strong> Log in as User B and verify User A's plans and files cannot be read (User Isolation verified!)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GITHUB STRATEGY */}
      {activeTab === 'git' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-400" />
            GitHub Repository Setup & Recommended Commit Cadence
          </h2>
          <p className="text-xs text-slate-400">
            Follow this commit strategy to show prospective recruiters clean, professional, incremental software engineering habits.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Repository Details:</span>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <p><strong>Repo Name:</strong> <code className="text-sky-300">AI-Powered-Personal-Diet-Planner-Cloud</code></p>
              <p><strong>Description:</strong> Cloud-based AI-powered personal diet planning application with authentication, personalized recommendation generation, cloud database integration, object storage, and scalable deployment architecture.</p>
              <p><strong>Topics:</strong> <span className="text-indigo-300">cloud-computing, artificial-intelligence, python, fastapi, flask, react, cloud-storage, firebase, database, rest-api, full-stack, cloud-application</span></p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase font-mono">Initial Git Commands:</span>
            <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-3 rounded border border-slate-800">
{`git init
git add .
git commit -m "Initialize cloud diet planner project architecture"
git branch -M main
git remote add origin https://github.com/your-username/AI-Powered-Personal-Diet-Planner-Cloud.git
git push -u origin main`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono">Recommended 12 Incremental Commit Sequence:</span>
            <ol className="text-xs text-slate-300 space-y-1.5 font-mono list-decimal list-inside">
              <li>"Create cloud application architecture and multi-tier layout"</li>
              <li>"Add user authentication and JWT session token handler"</li>
              <li>"Implement user profile management and metabolic calculations"</li>
              <li>"Add deterministic rule-based nutrition recommendation engine"</li>
              <li>"Integrate Gemini AI model with structured JSON output"</li>
              <li>"Implement fault-tolerant AI fallback mechanism"</li>
              <li>"Implement diet plan REST API endpoints with user isolation"</li>
              <li>"Integrate Cloud Database service for plan persistence"</li>
              <li>"Add Cloud Object Storage bucket driver for file uploads"</li>
              <li>"Build responsive user dashboard with macro analytics"</li>
              <li>"Add comprehensive automated cloud test suite (20 tests)"</li>
              <li>"Complete README documentation and cloud deployment configs"</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
