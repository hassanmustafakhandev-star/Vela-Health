'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import {
  FileText, User, Plus, Trash2, Send, Save, ArrowLeft, Stethoscope, 
  Activity, Clock, RotateCw, ShieldCheck, FileCheck, CheckCircle
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

function PrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient_id') || '';
  const appointmentId = searchParams.get('appointment_id') || '';
  const patientName = searchParams.get('patient_name') || 'Patient';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDays, setFollowUpDays] = useState('');
  const [labTests, setLabTests] = useState('');
  
  const [medications, setMedications] = useState([
    { id: Date.now(), name: '', dose: '', frequency: '', duration: '', instructions: '' }
  ]);

  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: '', dose: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (id) => {
    if(medications.length === 1) return;
    setMedications(medications.filter(m => m.id !== id));
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async () => {
    if (!patientId) {
      return toast.error("No patient ID provided. Return to appointments.");
    }
    if (!diagnosis) {
      return toast.error("Please enter a primary diagnosis");
    }

    const cleanMeds = medications.filter(m => m.name.trim() !== '');
    if (cleanMeds.length === 0) {
      return toast.error("Please add at least one medication");
    }

    setLoading(true);
    try {
      const payload = {
        patient_id: patientId,
        appointment_id: appointmentId || null,
        diagnosis,
        advice: advice || null,
        follow_up_days: followUpDays ? parseInt(followUpDays) : null,
        lab_tests: labTests ? labTests.split(',').map(t => t.trim()) : null,
        medications: cleanMeds.map(m => ({
          name: m.name,
          dose: m.dose,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions || null
        }))
      };

      await api.post('/prescriptions/', payload);
      toast.success('Digital RX Issued & Signed');
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/doctor/prescriptions');
      }, 3000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to issue prescription");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 rounded-full bg-prism-emerald/10 border border-prism-emerald/30 flex items-center justify-center text-prism-emerald mb-8"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h2 className="text-3xl font-display font-medium text-white mb-4">Encrypted RX Issued</h2>
        <p className="text-white/40 mb-6 max-w-sm">The digital directive has been securely transmitted to {patientName}'s medical vault.</p>
        <p className="text-xs font-black uppercase tracking-widest text-prism-emerald animate-pulse">Redirecting to Archive...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Nexus
          </button>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-emerald/20 border border-prism-emerald/40 flex items-center justify-center text-prism-emerald">
              <FileText size={20} />
            </div>
            Digital Directive (RX)
          </h1>
        </div>
        
        {patientId && (
          <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 p-3 pr-6 rounded-full">
            <div className="w-10 h-10 rounded-full bg-prism-rose/20 text-prism-rose flex items-center justify-center border border-prism-rose/40">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-0.5">Patient Cipher</p>
              <p className="text-sm font-bold text-white">{patientName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main RX Form */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-prism-cyan flex items-center gap-2 mb-6">
              <Activity size={14} /> Clinical Assessment
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">Primary Diagnosis</label>
                <Input 
                  placeholder="e.g. Acute Bronchitis" 
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">Required Diagnostics (comma separated)</label>
                <Input 
                  placeholder="e.g. CBC, Chest X-Ray" 
                  value={labTests}
                  onChange={(e) => setLabTests(e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-prism-emerald flex items-center gap-2">
                <FileCheck size={14} /> Pharmacological Directives
              </h3>
              <Badge variant="emerald" className="px-3 py-1">RX</Badge>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence>
                {medications.map((med, idx) => (
                  <motion.div 
                    key={med.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 relative group"
                  >
                    <div className="absolute top-4 right-4 text-white/10 text-4xl font-display font-medium select-none pointer-events-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    {medications.length > 1 && (
                      <button 
                        onClick={() => removeMedication(med.id)}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-prism-rose/20 text-prism-rose flex items-center justify-center border border-prism-rose/40 hover:bg-prism-rose hover:text-white transition-all z-10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">Medication Name</label>
                        <Input placeholder="Acetaminophen 500mg" value={med.name} onChange={(e) => updateMedication(med.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">Dosage</label>
                        <Input placeholder="1 Tablet" value={med.dose} onChange={(e) => updateMedication(med.id, 'dose', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">Frequency</label>
                        <Input placeholder="2x Daily (SOS)" value={med.frequency} onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">Duration</label>
                        <Input placeholder="5 Days" value={med.duration} onChange={(e) => updateMedication(med.id, 'duration', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 ml-1">Instructions (Optional)</label>
                        <Input placeholder="After meals" value={med.instructions} onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-6 h-14 border border-white/10 hover:border-prism-emerald/50 hover:bg-prism-emerald/10 text-prism-emerald text-xs font-bold tracking-widest"
              onClick={addMedication}
            >
              <Plus size={16} className="mr-2" /> Append Medication Clause
            </Button>
          </GlassCard>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2 mb-6">
              <RotateCw size={14} /> Follow-Up Plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">Review After (Days)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 7" 
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">General Advice</label>
                <textarea
                  placeholder="Rest, hydration, avoid cold water..."
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-prism-emerald transition-all resize-none placeholder:text-white/20"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-prism-emerald/5 border-prism-emerald/20">
            <h3 className="text-xs font-black uppercase tracking-widest text-prism-emerald flex items-center gap-2 mb-4">
              <ShieldCheck size={14} /> Cryptographic Sign
            </h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              By issuing this directive, you cryptographically sign these medical parameters onto the Vela network. A PDF will be automatically generated and transmitted to the patient's vault.
            </p>
            <Button 
              variant="emerald" 
              className="w-full h-16 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Encrypting...' : 'Issue & Sign Directive'} <Send size={18} className="ml-2" />
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={
       <div className="flex items-center justify-center p-20">
         <div className="w-10 h-10 border-4 border-prism-emerald/20 border-t-prism-emerald rounded-full animate-spin" />
       </div>
    }>
      <PrescriptionForm />
    </Suspense>
  );
}
