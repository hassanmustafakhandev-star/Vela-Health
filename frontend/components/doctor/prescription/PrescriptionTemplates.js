'use client';
import { motion } from 'framer-motion';
import { Layers, X, ChevronRight } from 'lucide-react';
import { usePrescriptionStore } from '@/store/doctor/prescriptionStore';

// Built-in clinical templates for common conditions
const TEMPLATES = [
  {
    id: 'upper_resp',
    name: 'Upper Respiratory Tract Infection',
    diagnosis: 'Acute Upper Respiratory Tract Infection (URTI)',
    advice: 'Rest, increase fluid intake. Avoid cold drinks. Return if fever persists beyond 3 days or breathing difficulty occurs.',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' },
      { name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-1-1', duration: '7 days', instructions: 'After meals' },
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: '0-0-1', duration: '5 days', instructions: 'At bedtime' },
    ],
  },
  {
    id: 'hypertension',
    name: 'Hypertension Management',
    diagnosis: 'Essential Hypertension (Stage 1)',
    advice: 'Low-salt diet. Regular morning walk (30 min). Avoid stress. Monitor BP daily. Return for follow-up in 2 weeks.',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '5mg', frequency: '1-0-0', duration: '30 days', instructions: 'Morning with water' },
      { name: 'Losartan 50mg', dosage: '50mg', frequency: '1-0-0', duration: '30 days', instructions: 'Morning with water' },
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: '0-0-1', duration: '30 days', instructions: 'After dinner' },
    ],
  },
  {
    id: 'gastritis',
    name: 'Gastritis / Dyspepsia',
    diagnosis: 'Acute Gastritis / Peptic Dyspepsia',
    advice: 'Avoid spicy food, NSAIDs, and alcohol. Eat small meals. Avoid lying down immediately after eating.',
    medicines: [
      { name: 'Omeprazole 40mg', dosage: '40mg', frequency: '1-0-0', duration: '14 days', instructions: '30 min before breakfast' },
      { name: 'Metronidazole 400mg', dosage: '400mg', frequency: '1-1-1', duration: '7 days', instructions: 'After meals' },
      { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: '0-0-1', duration: '14 days', instructions: 'Before dinner' },
    ],
  },
  {
    id: 'diabetes_t2',
    name: 'Type 2 Diabetes — Initial',
    diagnosis: 'Type 2 Diabetes Mellitus (Newly Diagnosed)',
    advice: 'Low-carb diet. Daily exercise. Monitor blood sugar fasting and postprandial. Avoid sugar. Foot care daily.',
    medicines: [
      { name: 'Metformin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '30 days', instructions: 'After meals' },
      { name: 'Vitamin B12 500mcg', dosage: '500mcg', frequency: '0-0-1', duration: '30 days', instructions: 'At bedtime' },
    ],
  },
  {
    id: 'urinary_tract',
    name: 'Urinary Tract Infection (UTI)',
    diagnosis: 'Uncomplicated Lower Urinary Tract Infection',
    advice: 'Increase water intake (2-3L/day). Avoid caffeine. Complete the full antibiotic course.',
    medicines: [
      { name: 'Ciprofloxacin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '7 days', instructions: 'After meals' },
      { name: 'Ibuprofen 400mg', dosage: '400mg', frequency: '1-1-1', duration: '3 days', instructions: 'After meals for pain relief' },
    ],
  },
];

/**
 * PrescriptionTemplates
 * Shows a drawer/modal with saved clinical templates.
 * On selection, applies the template to the prescription store.
 * Props:
 *  - onClose: fn() — called to dismiss the panel
 */
export default function PrescriptionTemplates({ onClose }) {
  const { setDiagnosis, setAdvice, addMedicine, clearMedicines } = usePrescriptionStore();

  const applyTemplate = (template) => {
    setDiagnosis(template.diagnosis);
    setAdvice(template.advice);
    clearMedicines?.();
    template.medicines.forEach((med) => {
      addMedicine({ ...med });
    });
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed right-0 top-0 h-full w-full max-w-sm bg-prism-surface border-l border-white/10 z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-prism-fuchsia/20 border border-prism-fuchsia/30 flex items-center justify-center text-prism-fuchsia">
            <Layers size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Templates</h3>
            <p className="text-[10px] text-white/30 mt-0.5">Clinical prescription presets</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
        >
          <X size={14} />
        </button>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {TEMPLATES.map((template, i) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => applyTemplate(template)}
            className="w-full text-left bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:bg-prism-fuchsia/[0.06] hover:border-prism-fuchsia/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white group-hover:text-prism-fuchsia transition-colors leading-tight">
                {template.name}
              </h4>
              <ChevronRight size={16} className="text-white/20 group-hover:text-prism-fuchsia flex-shrink-0 transition-colors" />
            </div>
            <p className="text-[11px] text-white/40 italic mb-3">{template.diagnosis}</p>
            <div className="flex flex-wrap gap-1">
              {template.medicines.map((med, j) => (
                <span
                  key={j}
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-prism-fuchsia/10 border border-prism-fuchsia/20 text-prism-fuchsia/60"
                >
                  {med.name.split(' ')[0]}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-[10px] text-white/20 text-center uppercase tracking-widest">
          Selecting a template will replace current Rx
        </p>
      </div>
    </motion.div>
  );
}