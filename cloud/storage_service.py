"""
AI-Powered Personal Diet Planner with Cloud Storage
Module: cloud/storage_service.py
"""

import time
import uuid
import base64
from typing import Dict, List, Any

BUCKET_NAME = "cloud-diet-storage-ap-southeast"
MAX_QUOTA_BYTES = 5 * 1024 * 1024  # 5 MB Free Tier Simulator

class CloudObjectStorageService:
    def __init__(self):
        self.objects: Dict[str, Dict[str, Any]] = {}

    def upload_object(self, user_id: str, filename: str, content_type: str, data_url: str) -> Dict[str, Any]:
        raw_b64 = data_url.split(",")[1] if "," in data_url else data_url
        size_bytes = len(base64.b64decode(raw_b64))

        current_used = sum(obj["sizeBytes"] for obj in self.objects.values())
        if current_used + size_bytes > MAX_QUOTA_BYTES:
            raise Exception("Cloud Object Storage quota limit exceeded (5MB free tier).")

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
        return [obj for obj in self.objects.values() if obj.get("userId") == user_id]

    def delete_object(self, file_id: str):
        if file_id in self.objects:
            del self.objects[file_id]
