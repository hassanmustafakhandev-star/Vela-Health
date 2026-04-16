import api from '@/lib/api';
import { MOCK_DOCTOR_APPOINTMENTS, MOCK_PRESCRIPTIONS, MOCK_DOCTOR_STATS } from '@/lib/mockData';

/**
 * doctorApi — Centralized REST client for all doctor-specific API calls.
 *
 * All methods use the shared `api` axios instance which:
 *  - Attaches the Firebase Bearer token automatically
 *  - Handles 401 token refresh + retry
 *  - Handles exponential backoff for 5xx errors
 *
 * Usage:
 *   import doctorApi from '@/lib/doctorApi';
 *   const result = await doctorApi.register(payload);
 */
const doctorApi = {
  /**
   * Submit doctor registration form.
   * Backend: POST /v1/auth/doctor/register
   */
  register: (payload) =>
    api.post('/auth/doctor/register', payload).then((r) => r.data),

  /**
   * Update doctor's own profile fields (bio, fees, city, etc.)
   * Backend: PUT /v1/doctors/me/profile
   */
  updateProfile: (payload) =>
    api.put('/doctors/me/profile', payload).then((r) => r.data),

  /**
   * Get the doctor's full profile from backend
   * Backend: GET /v1/doctors/{uid}
   */
  getProfile: (uid) =>
    api.get(`/doctors/${uid}`).then((r) => r.data),

  /**
   * Set availability for a single day of the week
   * Backend: PUT /v1/doctors/{uid}/availability
   */
  setAvailability: (uid, dayPayload) =>
    api.put(`/doctors/${uid}/availability`, dayPayload).then((r) => r.data),

  /**
   * Toggle available_now flag
   * Backend: PUT /v1/auth/doctor/availability
   */
  toggleAvailableNow: (available) =>
    api.put('/auth/doctor/availability', { available_now: available }).then((r) => r.data),

  /**
   * Fetch issued prescriptions for the authenticated doctor
   * Backend: GET /v1/prescriptions?role=doctor
   */
  getPrescriptions: (params = {}) =>
    api.get('/prescriptions', { params: { role: 'doctor', ...params } }).then((r) => r.data),

  /**
   * Get today's + upcoming appointments
   * Backend: GET /v1/appointments?role=doctor
   */
  getAppointments: async (params = {}) => {
    try {
      const r = await api.get('/appointments', { params: { role: 'doctor', ...params } });
      return r.data;
    } catch (_) {
      return { items: MOCK_DOCTOR_APPOINTMENTS };
    }
  },

  /**
   * Get available time slots for a doctor on a date
   * Backend: GET /v1/doctors/{uid}/slots?date=YYYY-MM-DD
   */
  getSlots: (uid, date) =>
    api.get(`/doctors/${uid}/slots`, { params: { date } }).then((r) => r.data),

  /**
   * Post a consultation end summary (SOAP notes, diagnosis)
   * Backend: POST /v1/consult/end
   */
  endConsultation: (payload) =>
    api.post('/consult/end', payload).then((r) => r.data),
};

export default doctorApi;
