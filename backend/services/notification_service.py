from firebase_admin import messaging


def send_push(token: str, title: str, body: str, data: dict = None):
    """Send FCM push notification (free — unlimited via Firebase)"""
    if not token:
        return

    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        data={k: str(v) for k, v in (data or {}).items()},  # FCM requires string values
        token=token,
        android=messaging.AndroidConfig(
            priority="high",
            notification=messaging.AndroidNotification(
                icon="ic_notification",
                color="#6C63FF"
            )
        )
    )
    try:
        result = messaging.send(message)
        return result
    except messaging.UnregisteredError:
        # Token no longer valid — clean up in Firestore
        print(f"FCM: Unregistered token — {token[:20]}...")
    except Exception as e:
        print(f"FCM error: {e}")  # Non-fatal — notifications should never break the main flow


def notify_doctor_new_appointment(doctor_fcm: str, patient_name: str, date: str, time: str):
    send_push(
        doctor_fcm,
        title="New Appointment Booked",
        body=f"{patient_name} booked a consultation on {date} at {time}",
        data={"type": "new_appointment"}
    )


def notify_patient_prescription(patient_fcm: str, doctor_name: str, rx_id: str):
    send_push(
        patient_fcm,
        title="Prescription Ready",
        body=f"Dr. {doctor_name} has issued your prescription",
        data={"type": "prescription", "prescription_id": rx_id}
    )


def notify_appointment_reminder(user_fcm: str, doctor_name: str, time: str):
    send_push(
        user_fcm,
        title="Appointment Reminder",
        body=f"Your appointment with Dr. {doctor_name} is at {time}",
        data={"type": "reminder"}
    )


def notify_consult_started(patient_fcm: str, doctor_name: str, session_id: str):
    send_push(
        patient_fcm,
        title="Doctor is Ready",
        body=f"Dr. {doctor_name} has joined the consultation",
        data={"type": "consult_started", "session_id": session_id}
    )
