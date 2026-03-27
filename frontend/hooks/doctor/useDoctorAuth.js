/**
 * useDoctorAuth — Deprecated Shim
 *
 * This hook is now a NO-OP. The Firestore listener has been moved to
 * DoctorAuthProvider (context/DoctorAuthContext.js) to ensure only ONE
 * listener runs per session.
 *
 * For availability toggle: use useDoctorAuthContext() from DoctorAuthContext.
 * For profile data: use useDoctorAuthStore() directly.
 *
 * @deprecated Do not call this hook. It exists only to avoid import errors
 * during the transition. Will be removed in the next cleanup pass.
 */
export function useDoctorAuth() {
  // Intentionally empty — listener is owned by DoctorAuthProvider.
  // Returning empty object for backward compat with any remaining references.
  return {};
}
