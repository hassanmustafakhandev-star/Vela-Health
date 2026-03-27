"""
scripts/index_knowledge.py
──────────────────────────
Run ONCE to populate ChromaDB with medical knowledge.
Command: python scripts/index_knowledge.py

This data is used by Sehat AI for RAG (retrieval-augmented generation)
before each Groq call — gives Pakistan-specific context to the AI.
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from core.chroma import init_chroma
from services.ai.embeddings_service import add_to_knowledge_base

MEDICAL_KNOWLEDGE = [
    {
        "id": "pk_fever_001",
        "text": "Fever above 103F (39.4C) lasting more than 3 days requires immediate medical attention in Pakistan. Paracetamol (Panadol) is first-line treatment. Dengue fever very common in Pakistan — watch for rash, severe joint pain, eye pain alongside fever. Avoid aspirin in children under 12.",
        "metadata": {"category": "fever", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_chest_001",
        "text": "Chest pain with shortness of breath, sweating, or pain radiating to arm or jaw is a cardiac emergency. Call 1122 immediately. Do NOT wait or drive to hospital. This may indicate a heart attack (myocardial infarction). Chew aspirin 300mg if available.",
        "metadata": {"category": "emergency_cardiac", "source": "WHO_guidelines"}
    },
    {
        "id": "pk_diabetes_001",
        "text": "Blood sugar above 200 mg/dL after meals or above 126 mg/dL fasting indicates diabetes mellitus. Common Pakistani symptoms: increased thirst (piyaas), frequent urination (bar bar peshab), blurred vision, fatigue. Diabetes is very prevalent in Pakistan — requires doctor consultation for diagnosis and treatment.",
        "metadata": {"category": "diabetes", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_bp_001",
        "text": "Blood pressure above 140/90 mmHg is high (hypertension). If above 180/120 mmHg — hypertensive crisis — seek emergency care immediately. Lifestyle: reduce salt, exercise daily, reduce stress. Pakistan has high hypertension prevalence. Most patients need medication long-term.",
        "metadata": {"category": "hypertension", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_throat_001",
        "text": "Sore throat with white patches or severe pain may indicate strep throat requiring antibiotics. Plain sore throat with runny nose is usually viral — no antibiotics needed. Rest, warm liquids, and honey-ginger tea help. Pakistani gargle: salt water (namak pani). See doctor if fever above 38.5C.",
        "metadata": {"category": "ent", "source": "WHO_guidelines"}
    },
    {
        "id": "pk_stomach_001",
        "text": "Diarrhea and vomiting (gastroenteritis) very common in Pakistan due to water quality. First priority: ORS (Oral Rehydration Salts) — available at all pharmacies. Drink plenty of clean water. See doctor if blood in stool, severe dehydration, or lasts more than 3 days. Typhoid common — laboratory test needed.",
        "metadata": {"category": "gastro", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_dengue_001",
        "text": "Dengue fever symptoms: sudden high fever, severe headache, pain behind eyes, joint and muscle pain, skin rash. Very common in Pakistan especially during monsoon season (July-October). No specific antiviral treatment. Rest, fluids, paracetamol only — NO aspirin or ibuprofen. Platelet count monitoring needed. Seek hospital if platelet drops below 100,000.",
        "metadata": {"category": "fever_dengue", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_headache_001",
        "text": "Headache: tension headache is most common — stress, dehydration, screen time. Migraine: one-sided throbbing pain with nausea. Red flags requiring emergency: sudden worst headache of life, headache with fever and stiff neck (meningitis), headache after head injury. Paracetamol or ibuprofen for mild headache. Rest in dark quiet room for migraine.",
        "metadata": {"category": "neurology", "source": "WHO_guidelines"}
    },
    {
        "id": "pk_skin_001",
        "text": "Common skin conditions in Pakistan: ringworm (fungal), scabies (khaarish — very contagious), eczema, heat rash (ghamauria). Ringworm and athlete's foot: antifungal cream (clotrimazole). Scabies: permethrin cream — treat whole household. Heat rash: cool water, loose cotton clothing, calamine lotion. See dermatologist if no improvement in 2 weeks.",
        "metadata": {"category": "dermatology", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_covid_001",
        "text": "COVID-19 symptoms: fever, dry cough, loss of taste/smell, fatigue, shortness of breath. Isolation required for 5 days minimum. Paracetamol for fever, rest, fluids. Seek emergency if: oxygen saturation below 94%, severe breathing difficulty, persistent chest pain. High-risk: elderly, diabetics, hypertensives — contact doctor immediately.",
        "metadata": {"category": "infectious", "source": "WHO_guidelines"}
    },
    {
        "id": "pk_mental_001",
        "text": "Mental health in Pakistan: depression and anxiety are common but often undiagnosed. Symptoms of depression: sadness lasting 2+ weeks, loss of interest, sleep changes, hopelessness. Do not ignore mental health — it is a real medical condition. Speak to a doctor. In crisis: call Umang helpline 0317-4288665 (Pakistan). Regular exercise, social support, and professional help are effective treatments.",
        "metadata": {"category": "mental_health", "source": "WHO_guidelines"}
    },
    {
        "id": "pk_asthma_001",
        "text": "Asthma: wheezing, shortness of breath, chest tightness. Use inhaler (blue reliever) immediately during attack. Sit upright, stay calm. If no improvement in 15 minutes — call emergency or go to hospital. Avoid triggers: dust, smoke, cold air (very common in Pakistani winters). Lahore and Karachi air pollution worsens asthma.",
        "metadata": {"category": "respiratory", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_hepatitis_001",
        "text": "Hepatitis C very prevalent in Pakistan — one of highest rates worldwide. Often asymptomatic for years. Symptoms: jaundice (yellow skin/eyes), fatigue, abdominal pain. Transmitted through contaminated needles — avoid unsterilized injections. Hepatitis B: get vaccinated. Hepatitis C: now curable with antiviral medications — see gastroenterologist.",
        "metadata": {"category": "hepatology", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_malaria_001",
        "text": "Malaria common in Pakistan especially in Balochistan and rural areas. Symptoms: fever with chills (especially every 2-3 days), sweating, headache, body aches. Must do blood test for diagnosis. Treatment with antimalarials prescribed by doctor. Prevention: mosquito nets, repellent, eliminate standing water. P. falciparum malaria is dangerous — seek immediate treatment.",
        "metadata": {"category": "infectious_malaria", "source": "PMDC_guidelines"}
    },
    {
        "id": "pk_pregnancy_001",
        "text": "Pregnancy warning signs requiring immediate hospital visit: heavy bleeding, severe abdominal pain, no fetal movement after 28 weeks, severe headache with blurred vision (preeclampsia), fever above 38C. Regular antenatal checkups every 4 weeks. Iron and folic acid supplements essential in Pakistan. Safe delivery: go to hospital or trained midwife (dai).",
        "metadata": {"category": "obstetrics", "source": "WHO_guidelines"}
    },
]

MEDICINES_KNOWLEDGE = [
    {
        "id": "med_paracetamol",
        "text": "Paracetamol (Panadol, Calpol) — pain reliever and fever reducer. Standard adult dose: 500-1000mg every 4-6 hours. Maximum: 4000mg/day. Do not exceed — liver damage risk. Safe in pregnancy. Pakistan brands: Panadol, Calpol, Disprol.",
        "metadata": {"type": "medicine", "generic": "paracetamol", "category": "analgesic"}
    },
    {
        "id": "med_amoxicillin",
        "text": "Amoxicillin — antibiotic for bacterial infections. Common use: throat infections, ear infections, pneumonia. Requires doctor prescription. Complete full course even if feeling better. Common Pakistan brands: Amoxil, Trimox. Penicillin allergy — do NOT use.",
        "metadata": {"type": "medicine", "generic": "amoxicillin", "category": "antibiotic"}
    },
    {
        "id": "med_metformin",
        "text": "Metformin — first-line diabetes medication. Taken with meals to reduce stomach upset. Common brands in Pakistan: Glucophage, Diaformin. Do not take if kidney disease. Monitor blood sugar regularly. Never stop without doctor advice.",
        "metadata": {"type": "medicine", "generic": "metformin", "category": "diabetes"}
    },
    {
        "id": "med_ors",
        "text": "ORS (Oral Rehydration Salts) — for diarrhea and dehydration. Mix one sachet in 1 litre clean water. Drink slowly. Pakistan brands: Pedialyte, Glucolyte, WHO-ORS. Freely available at all pharmacies without prescription. Essential first aid for gastroenteritis.",
        "metadata": {"type": "medicine", "generic": "ORS", "category": "gastro"}
    },
]


def main():
    print("📝 Initializing ChromaDB...")
    init_chroma()

    print(f"\n📚 Indexing {len(MEDICAL_KNOWLEDGE)} medical knowledge chunks...")
    medical_texts = [k["text"] for k in MEDICAL_KNOWLEDGE]
    medical_ids = [k["id"] for k in MEDICAL_KNOWLEDGE]
    medical_meta = [k["metadata"] for k in MEDICAL_KNOWLEDGE]
    count = add_to_knowledge_base(medical_texts, medical_ids, medical_meta, "medical")
    print(f"✅ Indexed {count} medical knowledge chunks")

    print(f"\n💊 Indexing {len(MEDICINES_KNOWLEDGE)} medicine entries...")
    med_texts = [k["text"] for k in MEDICINES_KNOWLEDGE]
    med_ids = [k["id"] for k in MEDICINES_KNOWLEDGE]
    med_meta = [k["metadata"] for k in MEDICINES_KNOWLEDGE]
    count2 = add_to_knowledge_base(med_texts, med_ids, med_meta, "medicines")
    print(f"✅ Indexed {count2} medicine entries")

    print("\n🎉 Knowledge base ready! Sehat AI has Pakistan-specific medical context.")


if __name__ == "__main__":
    main()
