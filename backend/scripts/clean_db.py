import os
import sys

# Ensure script runs from the backend directory context
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from firebase_admin import auth as firebase_auth
from core.firebase import init_firebase, get_db

def delete_all_non_admins():
    print("=" * 50)
    print("WARNING: DELETING ALL NON-ADMIN USERS")
    print("=" * 50)
    
    init_firebase()
    db = get_db()
    
    # 1. Fetch all users from Firestore
    users_ref = db.collection("users").stream()
    
    deleted_count = 0
    admin_count = 0

    for user_doc in users_ref:
        data = user_doc.to_dict()
        uid = user_doc.id
        role = data.get("role", "patient")
        email = data.get("email", "unknown")
        
        if role == "admin":
            print(f"[KEEP] Admin user: {email} (UID: {uid})")
            admin_count += 1
            continue
            
        print(f"[DELETE] {role.upper()}: {email} (UID: {uid})")
        
        # 2. Delete from Auth
        try:
            firebase_auth.delete_user(uid)
            print("  - Removed from Firebase Auth")
        except firebase_auth.UserNotFoundError:
            print("  - Not found in Firebase Auth, proceeding...")
        except Exception as e:
            print(f"  - Auth delete failed: {e}")
            
        # 3. Delete from doctors collection if exists
        try:
            db.collection("doctors").document(uid).delete()
            print("  - Removed from doctors collection")
        except:
            pass
            
        # 4. Delete from users collection
        try:
            db.collection("users").document(uid).delete()
            print("  - Removed from users collection")
        except:
            pass
            
        deleted_count += 1
        
    print("=" * 50)
    print(f"CLEANUP COMPLETE! Kept {admin_count} admins. Deleted {deleted_count} users.")
    print("=" * 50)

if __name__ == "__main__":
    delete_all_non_admins()
