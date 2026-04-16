/**
 * mockData.js
 * Realistic seed data for all Vela modules.
 * Used as a fallback when the backend is unreachable.
 */

export const MOCK_USER = {
  uid: 'demo-user-001',
  displayName: 'Hassan Khan',
  email: 'hassan@velahealth.com',
  photoURL: 'https://i.pravatar.cc/150?u=hassan',
};

export const MOCK_APPOINTMENTS = {
  appointments: [
    {
      id: 'appt-001',
      doctor_id: 'dr-001',
      doctor: {
        name: 'Dr. Sarah Chen',
        specialization: 'Cardiologist',
        photo: 'https://i.pravatar.cc/150?img=44',
      },
      date: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-GB'),
      time: '10:30 AM',
      type: 'video',
      status: 'confirmed',
      reason: 'Routine cardiac checkup',
    },
    {
      id: 'appt-002',
      doctor_id: 'dr-002',
      doctor: {
        name: 'Dr. Ahmed Raza',
        specialization: 'Neurologist',
        photo: 'https://i.pravatar.cc/150?img=11',
      },
      date: new Date(Date.now() + 86400000 * 5).toLocaleDateString('en-GB'),
      time: '3:00 PM',
      type: 'video',
      status: 'confirmed',
      reason: 'Persistent migraine evaluation',
    },
  ],
};

export const MOCK_DOCTORS = [
  {
    uid: 'dr-001',
    name: 'Dr. Sarah Chen',
    specialization: 'Cardiologist',
    city: 'Karachi',
    experience_years: 14,
    rating: 4.9,
    review_count: 312,
    consultation_fee: 2500,
    photo: 'https://i.pravatar.cc/150?img=44',
    available_now: true,
    bio: 'Harvard-trained cardiologist specializing in preventive cardiology and cardiac imaging.',
    pmdc_number: 'PMDC-54321',
    languages: ['English', 'Urdu'],
  },
  {
    uid: 'dr-002',
    name: 'Dr. Ahmed Raza',
    specialization: 'Neurologist',
    city: 'Lahore',
    experience_years: 18,
    rating: 5.0,
    review_count: 498,
    consultation_fee: 3000,
    photo: 'https://i.pravatar.cc/150?img=11',
    available_now: false,
    bio: 'Senior neurologist with expertise in epilepsy, stroke management, and neuro-oncology.',
    pmdc_number: 'PMDC-12345',
    languages: ['English', 'Urdu', 'Punjabi'],
  },
  {
    uid: 'dr-003',
    name: 'Dr. Emily Watson',
    specialization: 'Pediatrician',
    city: 'Islamabad',
    experience_years: 9,
    rating: 4.8,
    review_count: 201,
    consultation_fee: 1800,
    photo: 'https://i.pravatar.cc/150?img=9',
    available_now: true,
    bio: 'Child health specialist focused on developmental pediatrics and neonatology.',
    pmdc_number: 'PMDC-67890',
    languages: ['English', 'Urdu'],
  },
  {
    uid: 'dr-004',
    name: 'Dr. Fatima Malik',
    specialization: 'Dermatologist',
    city: 'Karachi',
    experience_years: 11,
    rating: 4.7,
    review_count: 156,
    consultation_fee: 2200,
    photo: 'https://i.pravatar.cc/150?img=5',
    available_now: true,
    bio: 'Dermatologist and cosmetologist with expertise in chronic skin conditions and aesthetic procedures.',
    pmdc_number: 'PMDC-34567',
    languages: ['English', 'Urdu'],
  },
  {
    uid: 'dr-005',
    name: 'Dr. Zain ul Abideen',
    specialization: 'General Physician',
    city: 'Lahore',
    experience_years: 7,
    rating: 4.6,
    review_count: 89,
    consultation_fee: 1200,
    photo: 'https://i.pravatar.cc/150?img=3',
    available_now: false,
    bio: 'General physician specializing in primary care, chronic disease management, and preventive medicine.',
    pmdc_number: 'PMDC-98765',
    languages: ['English', 'Urdu', 'Sindhi'],
  },
  {
    uid: 'dr-006',
    name: 'Dr. Ayesha Siddiqui',
    specialization: 'Gynecologist',
    city: 'Rawalpindi',
    experience_years: 15,
    rating: 4.9,
    review_count: 274,
    consultation_fee: 2800,
    photo: 'https://i.pravatar.cc/150?img=10',
    available_now: true,
    bio: 'OBGYN specialist in maternal health, high-risk pregnancies, and minimally invasive surgery.',
    pmdc_number: 'PMDC-11223',
    languages: ['English', 'Urdu'],
  },
];

export const MOCK_VITALS = [
  { id: 'v1', type: 'heart_rate', value: 72, unit: 'BPM', issued_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'v2', type: 'heart_rate', value: 75, unit: 'BPM', issued_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'v3', type: 'heart_rate', value: 68, unit: 'BPM', issued_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'v4', type: 'sugar', value: 98, unit: 'mg/dL', issued_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'v5', type: 'sugar', value: 105, unit: 'mg/dL', issued_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'v6', type: 'blood_pressure', value: '120/80', unit: 'mmHg', issued_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'v7', type: 'temperature', value: 36.8, unit: '°C', issued_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'v8', type: 'weight', value: 72, unit: 'kg', issued_at: new Date(Date.now() - 86400000 * 7).toISOString() },
];

export const MOCK_DOCUMENTS = [
  { id: 'd1', filename: 'CBC_Report_March2026.pdf', type: 'lab_report', url: '#', uploaded_at: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: 'd2', filename: 'Echo_Cardiogram_Q1.pdf', type: 'scan', url: '#', uploaded_at: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: 'd3', filename: 'Prescription_DrChen.pdf', type: 'prescription', url: '#', uploaded_at: new Date(Date.now() - 86400000 * 7).toISOString() },
];

export const MOCK_HEALTH_SUMMARY = {
  latest_vitals: MOCK_VITALS,
  latest_insight: {
    text: 'Your heart rate and blood glucose levels are within normal range. Consider increasing daily physical activity to 30 minutes.',
    generated_at: new Date(Date.now() - 86400000).toISOString(),
  },
};

export const MOCK_PRESCRIPTIONS = [
  {
    id: 'rx-20260301-a1b2',
    patient_name: 'Hassan Khan',
    diagnosis: 'Acute Upper Respiratory Tract Infection',
    status: 'sent',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 days' },
      { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-1-1', duration: '7 days' },
    ],
  },
  {
    id: 'rx-20260215-c3d4',
    patient_name: 'Hassan Khan',
    diagnosis: 'Seasonal Allergic Rhinitis',
    status: 'sent',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    medicines: [
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: '0-0-1', duration: '14 days' },
      { name: 'Loratadine 10mg', dosage: '10mg', frequency: '1-0-0', duration: '7 days' },
    ],
  },
];

export const MOCK_FAMILY_MEMBERS = [
  {
    id: 'fm-001',
    name: 'Amna Khan',
    relationship: 'Spouse',
    age: 32,
    bloodGroup: 'B+',
    photo: 'https://i.pravatar.cc/150?img=5',
    conditions: ['Mild Hypertension'],
    lastCheckup: '2026-03-15',
  },
  {
    id: 'fm-002',
    name: 'Zaid Khan',
    relationship: 'Son',
    age: 8,
    bloodGroup: 'O+',
    photo: 'https://i.pravatar.cc/150?img=8',
    conditions: [],
    lastCheckup: '2026-02-28',
  },
];

export const MOCK_PHARMACY_PRODUCTS = [
  { id: 'p1', name: 'Panadol Extra', brand: 'GSK', category: 'Pain Relief', price: 45, unit: 'Strip of 10', inStock: true, img: null },
  { id: 'p2', name: 'Augmentin 625mg', brand: 'GSK', category: 'Antibiotic', price: 380, unit: 'Strip of 14', inStock: true, img: null },
  { id: 'p3', name: 'Brufen 400mg', brand: 'Abbott', category: 'NSAID', price: 65, unit: 'Strip of 10', inStock: true, img: null },
  { id: 'p4', name: 'Nexium 40mg', brand: 'AstraZeneca', category: 'Antacid', price: 340, unit: 'Strip of 7', inStock: false, img: null },
  { id: 'p5', name: 'Vitamin D3 5000IU', brand: 'Nutrifactor', category: 'Supplement', price: 850, unit: '60 Capsules', inStock: true, img: null },
  { id: 'p6', name: 'Glucophage 500mg', brand: 'Merck', category: 'Antidiabetic', price: 280, unit: 'Strip of 20', inStock: true, img: null },
];

export const MOCK_LAB_TESTS = [
  { id: 'l1', name: 'Complete Blood Count (CBC)', category: 'Haematology', price: 850, duration: '4-6 hours', homeCollection: true },
  { id: 'l2', name: 'Lipid Profile', category: 'Biochemistry', price: 1200, duration: '24 hours', homeCollection: true },
  { id: 'l3', name: 'HbA1c (Glycated Haemoglobin)', category: 'Endocrinology', price: 1500, duration: '24 hours', homeCollection: true },
  { id: 'l4', name: 'Thyroid Profile (TSH, T3, T4)', category: 'Endocrinology', price: 2800, duration: '48 hours', homeCollection: true },
  { id: 'l5', name: 'Liver Function Tests (LFT)', category: 'Hepatology', price: 1800, duration: '24 hours', homeCollection: false },
  { id: 'l6', name: 'Urine Complete Examination', category: 'Nephrology', price: 450, duration: '4-6 hours', homeCollection: true },
];

// Doctor dashboard mock data
export const MOCK_DOCTOR_STATS = {
  total_appointments: 124,
  todays_appointments: 8,
  pending_appointments: 3,
  total_patients: 89,
  monthly_earnings: 185000,
  weekly_earnings: 46250,
  rating: 4.8,
  review_count: 67,
};

export const MOCK_DOCTOR_APPOINTMENTS = [
  {
    id: 'da-001',
    patient_id: 'p-001',
    patient_name: 'Ali Hassan',
    patient_photo: 'https://i.pravatar.cc/150?img=3',
    patient_age: 45,
    date: new Date().toLocaleDateString('en-GB'),
    time: '09:00 AM',
    type: 'video',
    status: 'scheduled',
    reason: 'Follow-up for hypertension management',
  },
  {
    id: 'da-002',
    patient_id: 'p-002',
    patient_name: 'Maryam Iqbal',
    patient_photo: 'https://i.pravatar.cc/150?img=5',
    patient_age: 32,
    date: new Date().toLocaleDateString('en-GB'),
    time: '10:30 AM',
    type: 'video',
    status: 'scheduled',
    reason: 'Chest pain and shortness of breath',
  },
  {
    id: 'da-003',
    patient_id: 'p-003',
    patient_name: 'Omar Farooq',
    patient_photo: 'https://i.pravatar.cc/150?img=4',
    patient_age: 58,
    date: new Date().toLocaleDateString('en-GB'),
    time: '02:00 PM',
    type: 'video',
    status: 'completed',
    reason: 'Routine cardiac checkup post-stenting',
  },
];
