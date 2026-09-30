"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: ai_engine/diet_engine.py
"""

import os
import json
import math
import random
from typing import Dict, Any

class DietRecommendationEngine:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "")

    def generate_plan(self, profile: Dict[str, Any], mode: str = "gemini") -> Dict[str, Any]:
        if mode == "rule_based":
            return self._generate_rule_based(profile)

        if mode == "simulate_failure":
            plan = self._generate_rule_based(profile)
            plan["generatedBy"] = "rule_based_fallback"
            plan["title"] = f"[Fallback] {plan['title']}"
            return plan

        if self.api_key and self.api_key != "MY_GEMINI_API_KEY":
            try:
                import google.genai as genai
                client = genai.Client()
                prompt = (
                    f"Generate a personal diet plan for: {profile}. Output pure JSON matching schema: "
                    "{title, breakfast:{title, items, portion, estimatedCalories}, lunch:{title, items, portion, estimatedCalories}, "
                    "snack:{title, items, portion, estimatedCalories}, dinner:{title, items, portion, estimatedCalories}, "
                    "nutritionSummary:{calories, proteinG, carbsG, fatG, fiberG, microNutrientNotes}, "
                    "hydrationReminder:{targetLiters, glassesPerDay, schedule, electrolyteTip}}"
                )
                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                )
                return json.loads(response.text)
            except Exception as e:
                print(f"[AI Fallback] Caught exception {e}, executing local rule engine")
                plan = self._generate_rule_based(profile)
                plan["generatedBy"] = "rule_based_fallback"
                return plan

        plan = self._generate_rule_based(profile)
        plan["generatedBy"] = "rule_based_fallback"
        return plan

    def _generate_rule_based(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        age = profile.get("age", 25)
        weight = profile.get("weightKg", 70)
        height = profile.get("heightCm", 172)
        activity = profile.get("activityLevel", "Moderately Active")
        pref = profile.get("dietaryPreference", "Vegetarian")
        goal = profile.get("goal", "General balanced eating")

        bmr = 10 * weight + 6.25 * height - 5 * age - 70
        multipliers = {
            "Sedentary": 1.2,
            "Lightly Active": 1.375,
            "Moderately Active": 1.55,
            "Very Active": 1.725
        }
        tdee = round(bmr * multipliers.get(activity, 1.4))

        target_calories = tdee
        if "Weight-management" in goal:
            target_calories = max(1400, tdee - 450)
        elif "Fitness" in goal or "Endurance" in goal:
            target_calories = tdee + 350

        protein_g = round((target_calories * 0.25) / 4)
        carbs_g = round((target_calories * 0.50) / 4)
        fat_g = round((target_calories * 0.25) / 9)
        fiber_g = round(14 * (target_calories / 1000))

        hydration_liters = round((weight * 0.035) + (0.5 if activity == "Very Active" else 0.2), 1)

        meals = {
            "breakfast": {
                "title": f"Nutritious {pref} Morning Fuel",
                "items": ["Wholesome sprouted whole grains", "Fresh seasonal fruit and berries", "High-protein seed mix"],
                "portion": "1 bowl (350g)",
                "estimatedCalories": round(target_calories * 0.25)
            },
            "lunch": {
                "title": f"Balanced {pref} Nourish Bowl",
                "items": ["Tri-color steamed quinoa or brown rice", "Roasted garden vegetables with olive oil", "Herb seasoned legumes / lean protein"],
                "portion": "1 large plate (450g)",
                "estimatedCalories": round(target_calories * 0.35)
            },
            "snack": {
                "title": "Protein & Mineral Boost Snack",
                "items": ["Raw walnuts and pumpkin seeds", "Fresh organic pear or green apple", "Herbal green tea"],
                "portion": "1 serving (150g)",
                "estimatedCalories": round(target_calories * 0.12)
            },
            "dinner": {
                "title": f"Restorative {pref} Evening Plate",
                "items": ["Simmered spiced lentil dal or grilled protein", "Steamed cruciferous vegetables", "Sweet potato mash"],
                "portion": "1 serving (420g)",
                "estimatedCalories": round(target_calories * 0.28)
            }
        }

        return {
            "id": f"plan_rb_{random.randint(1000, 9999)}",
            "userId": profile.get("id", "guest"),
            "title": f"{pref} {goal} Blueprint",
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
                "microNutrientNotes": f"Balanced micronutrients formulated for {pref} lifestyle."
            },
            "hydrationReminder": {
                "targetLiters": hydration_liters,
                "glassesPerDay": round(hydration_liters * 4),
                "schedule": [
                    "07:30 AM - 1 glass warm lemon water",
                    "10:30 AM - 2 glasses during morning session",
                    "01:00 PM - 1 glass 30 min before lunch",
                    "04:00 PM - 2 glasses through mid-afternoon",
                    "07:00 PM - 1 glass before dinner",
                    "09:30 PM - 1 glass calming herbal infusion"
                ],
                "electrolyteTip": "Add a small pinch of rock salt or lime to your second water bottle."
            },
            "disclaimer": "This diet plan is generated for educational and wellness demonstration purposes only and does not constitute medical or clinical nutrition advice. Consult a healthcare professional for personalized dietary needs."
        }
