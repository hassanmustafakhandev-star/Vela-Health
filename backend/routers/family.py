from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from typing import List

from middleware.auth import get_current_user
from core.firebase import get_db
from models.family import FamilyMemberCreate

router = APIRouter(tags=["Family Network"])

@router.post("/")
async def add_family_member(
    member: FamilyMemberCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add a dependent to the patient's family network"""
    db = get_db()
    
    doc_ref = db.collection("users").document(current_user["uid"]).collection("family").document()
    
    data = member.model_dump()
    data.update({
        "id": doc_ref.id,
        "patient_id": current_user["uid"],
        "status": "Healthy",
        "heart_rate": "--",
        "records_count": 0,
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    
    doc_ref.set(data)
    
    # Also fetch the newly created data to return safely serialized object
    # We'll omit timestamps in return to avoid serialization errors or format them
    return {
        **data,
        "created_at": None,
        "updated_at": None
    }


@router.get("/")
async def get_family_network(current_user: dict = Depends(get_current_user)):
    """Retrieve all linked dependents for a patient"""
    db = get_db()
    
    docs = (db.collection("users")
            .document(current_user["uid"])
            .collection("family")
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .stream())
            
    members = []
    for d in docs:
        item = d.to_dict()
        members.append({
            "id": d.id,
            "name": item.get("name"),
            "relation": item.get("relation"),
            "age": item.get("age"),
            "status": item.get("status", "Healthy"),
            "heart_rate": item.get("heart_rate", "--"),
            "records_count": item.get("records_count", 0),
        })
        
    return members


@router.delete("/{member_id}")
async def remove_family_member(
    member_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a dependent from the network"""
    db = get_db()
    doc_ref = db.collection("users").document(current_user["uid"]).collection("family").document(member_id)
    doc_ref.delete()
    return {"success": True, "message": f"Member {member_id} removed"}
