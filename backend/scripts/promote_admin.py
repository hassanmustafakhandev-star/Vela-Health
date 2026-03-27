import sys
import os

# Add parent dir to path to import core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from firebase_admin import auth as firebase_auth
from core.firebase import init_firebase, get_db

def promote_to_admin(email):
    init_firebase()
    db = get_db()
    
    try:
        user = firebase_auth.get_user_by_email(email)
        uid = user.uid
        
        # 1. Update Custom Claims
        firebase_auth.set_custom_user_claims(uid, {"vela_role": "admin"})
        
        # 2. Update Firestore
        db.collection("users").document(uid).update({"role": "admin"})
        
        print(f"SUCCESS: User {email} (UID: {uid}) promoted to ADMIN.")
        print("Please ask the user to sign out and sign back in for the changes to take effect.")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        promote_to_admin(sys.argv[1])
