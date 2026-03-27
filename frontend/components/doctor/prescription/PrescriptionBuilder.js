'use client';
import { usePrescriptionStore } from '@/store/doctor/prescriptionStore';
import MedicineRow from './MedicineRow';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, FileText, Send, Layers, Eye } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function PrescriptionBuilder() {
  const { 
    diagnosis, setDiagnosis, 
    medicines, addMedicine, removeMedicine, updateMedicine,
    advice, setAdvice,
    status 
  } = usePrescriptionStore();

  const handleAdd = () => {
    addMedicine({ name: '', dosage: '', frequency: '1-0-1', duration: '', instructions: '' });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-prism-fuchsia" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Prescription Nexus</h4>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'sent' ? 'bg-prism-emerald/10 text-prism-emerald' : 'bg-prism-amber/10 text-prism-amber'}`}>
          {status}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-fuchsia ml-2">Clinical Diagnosis</label>
          <Input 
            placeholder="E.g. Acute Viral Bronchitis" 
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="md:h-14 font-medium"
          />
        </div>

        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between px-2">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-fuchsia">Medications</label>
             <button onClick={handleAdd} className="text-[10px] font-bold text-prism-fuchsia hover:underline flex items-center gap-1">
               <Plus size={12} /> Add Medicine
             </button>
           </div>
           
           <div className="flex flex-col gap-4">
             {medicines.map((m) => (
               <MedicineRow 
                 key={m.id} 
                 medicine={m} 
                 onUpdate={(updates) => updateMedicine(m.id, updates)}
                 onRemove={() => removeMedicine(m.id)}
               />
             ))}
             {medicines.length === 0 && (
               <div className="p-8 text-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02]">
                  <p className="text-[11px] font-bold text-white/20 italic">No medicinal payloads specified.</p>
               </div>
             )}
           </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-fuchsia ml-2">Clinical Advice</label>
          <textarea 
            placeholder="General advice, follow-up, etc."
            className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-prism-fuchsia transition-all resize-none italic"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button variant="ghost" className="h-12 text-xs font-bold border-white/10">
           <Layers size={14} className="mr-2" /> Templates
        </Button>
        <Button variant="fuchsia" className="h-12 text-xs font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]">
           <Send size={14} className="mr-2" /> Send Rx
        </Button>
      </div>
    </div>
  );
}