import sys
import os

# Add parent dir to path to import core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from firebase_admin import auth as firebase_auth
from core.firebase import init_firebase, get_db

def create_admin(email, password):
    init_firebase()
    db = get_db()
    
    try:
        # Try to find existing
        try:
            user = firebase_auth.get_user_by_email(email)
            print(f"Existing user found for {email}. Promoting...")
        except firebase_auth.UserNotFoundError:
            # Create new
            user = firebase_auth.create_user(email=email, password=password)
            print(f"Created NEW user {email}.")
            
        uid = user.uid
        
        # 1. Update Custom Claims
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "admin"})
        
        # 2. Update Firestore
        db.collection("users").document(uid).set({
            "uid": uid,
            "email": email,
            "role": "admin",
            "name": "System Admin"
        }, merge=True)
        
        print(f"SUCCESS: {email} (UID: {uid}) is now an ADMIN.")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password>")
    else:
        create_admin(sys.argv[1], sys.argv[2])
