from firebase_admin import auth as firebase_auth
from core.firebase import init_firebase, get_db

def check_doctor(email):
    init_firebase()
    db = get_db()
    try:
        user = firebase_auth.get_user_by_email(email)
        print(f"UID: {user.uid}")
        print(f"Custom Claims: {user.custom_claims}")
        
        doc_ref = db.collection("doctors").document(user.uid)
        doc = doc_ref.get()
        if doc.exists:
            print(f"Firestore Status: {doc.to_dict().get('status')}")
        else:
            print("Firestore Document: MISSING")
            
        user_doc = db.collection("users").document(user.uid).get()
        if user_doc.exists:
            print(f"User Role: {user_doc.to_dict().get('role')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_doctor("amirkhan@vela.com")
