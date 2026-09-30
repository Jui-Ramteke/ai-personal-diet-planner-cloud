"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: cloud/database_service.py
"""

import time
import uuid
from typing import Dict, List, Optional, Any

class CloudDatabaseService:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.plans: Dict[str, Dict[str, Any]] = {}
        self._seed_demo()

    def _seed_demo(self):
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
        self.users[user1["id"]] = user1

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        for user_id, user in self.users.items():
            if token.startswith(f"token_{user_id}") or token == user_id:
                safe = dict(user)
                safe.pop("passwordHash", None)
                return safe
        return None

    def generate_token(self, user_id: str) -> str:
        return f"token_{user_id}_{int(time.time())}"

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        for user in self.users.values():
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
        self.users[user_id] = user_record
        safe = dict(user_record)
        safe.pop("passwordHash", None)
        return safe

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        user = self.users.get(user_id)
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
        saved = dict(plan_data)
        saved["id"] = plan_id
        saved["userId"] = user_id
        saved["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
        self.plans[plan_id] = saved
        return saved

    def get_user_plans(self, user_id: str) -> List[Dict[str, Any]]:
        return [p for p in self.plans.values() if p.get("userId") == user_id]

    def get_plan_by_id(self, plan_id: str) -> Optional[Dict[str, Any]]:
        return self.plans.get(plan_id)

    def delete_plan(self, plan_id: str):
        if plan_id in self.plans:
            del self.plans[plan_id]
