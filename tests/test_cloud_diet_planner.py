"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: tests/test_cloud_diet_planner.py
Description: Automated unit & integration tests validating authentication,
             multi-tenant data isolation, AI fallback, and cloud quota boundaries.
"""

import pytest
from ai_engine.diet_engine import DietRecommendationEngine
from cloud.database_service import CloudDatabaseService
from cloud.storage_service import CloudObjectStorageService

@pytest.fixture
def db():
    return CloudDatabaseService()

@pytest.fixture
def storage():
    return CloudObjectStorageService()

@pytest.fixture
def ai():
    return DietRecommendationEngine()

def test_tc01_new_user_registration(db):
    user = db.create_user({
        "name": "Jordan Lee",
        "email": "jordan@university.edu",
        "password": "securepassword123",
        "age": 22,
        "heightCm": 178,
        "weightKg": 74,
        "dietaryPreference": "Vegetarian",
        "goal": "Fitness-oriented demo"
    })
    assert user["id"].startswith("usr_")
    assert user["email"] == "jordan@university.edu"

def test_tc02_user_authentication(db):
    user = db.create_user({
        "name": "Alex",
        "email": "alex_test@cloud.demo",
        "password": "mypassword"
    })
    authed = db.authenticate_user("alex_test@cloud.demo", "mypassword")
    assert authed is not None
    assert authed["id"] == user["id"]

def test_tc04_invalid_credentials(db):
    failed = db.authenticate_user("alex_test@cloud.demo", "wrongpassword")
    assert failed is None

def test_tc07_diet_plan_generation(ai):
    plan = ai.generate_plan({
        "age": 24,
        "heightCm": 175,
        "weightKg": 70,
        "activityLevel": "Moderately Active",
        "dietaryPreference": "Vegetarian",
        "goal": "Weight-management demo"
    }, mode="rule_based")

    assert "breakfast" in plan
    assert "lunch" in plan
    assert "snack" in plan
    assert "dinner" in plan
    assert plan["nutritionSummary"]["calories"] > 1000

def test_tc08_vegetarian_preference(ai):
    plan = ai.generate_plan({
        "age": 25,
        "heightCm": 170,
        "weightKg": 65,
        "dietaryPreference": "Vegetarian",
        "goal": "General balanced eating"
    }, mode="rule_based")
    assert plan["dietaryPreference"] == "Vegetarian"

def test_tc11_ai_fallback_resilience(ai):
    # Simulates cloud 503 outage
    plan = ai.generate_plan({
        "age": 25,
        "heightCm": 170,
        "weightKg": 65,
        "dietaryPreference": "Vegan",
        "goal": "General balanced eating"
    }, mode="simulate_failure")
    assert plan["generatedBy"] == "rule_based_fallback"
    assert "nutritionSummary" in plan

def test_tc18_user_isolation(db):
    # User 1 creates a plan
    user1_plan = db.save_plan("usr_1", {"title": "User 1 Secret Plan"})
    # User 2 queries their plans
    user2_plans = db.get_user_plans("usr_2")
    assert not any(p["id"] == user1_plan["id"] for p in user2_plans)
