'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { FileText, Upload, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function DoctorVerify() {
  const router = useRouter();
  const [uploads, setUploads] = useState({
    pmdc: false,
    degree: false,
    cnic: false
  });

  const handleUpload = (type) => {
    // Simulate upload
    setUploads(prev => ({ ...prev, [type]: true }));
  };

  const isComplete = Object.values(uploads).every(v => v);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Credential Verification</h2>
        <div className="flex items-center gap-2">
           <Badge variant="rose" className="px-3">Step 2/3</Badge>
           <p className="text-white/40 font-medium text-sm">Upload your legal medical documentation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {[
          { id: 'pmdc', title: 'PMDC Certificate', desc: 'Valid registration certificate.' },
          { id: 'degree', title: 'Medical Degree', desc: 'MBBS or higher specialization.' },
          { id: 'cnic', title: 'National Identity', desc: 'CNIC or Passport (Front & Back).' }
        ].map(doc => (
          <GlassCard 
            key={doc.id}
            className={`p-6 border-dashed border-2 flex items-center justify-between transition-all ${uploads[doc.id] ? 'border-prism-emerald/50 bg-prism-emerald/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${uploads[doc.id] ? 'bg-prism-emerald/10 text-prism-emerald' : 'bg-white/5 text-white/30'}`}>
                {uploads[doc.id] ? <CheckCircle2 size={24} /> : <FileText size={24} />}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">{doc.title}</span>
                <span className="text-white/40 text-xs">{doc.desc}</span>
              </div>
            </div>
            
            {!uploads[doc.id] ? (
              <button 
                onClick={() => handleUpload(doc.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold transition-all border border-white/10"
              >
                <Upload size={14} /> Upload
              </button>
            ) : (
              <Badge variant="emerald">Verified ✓</Badge>
            )}
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6 border-prism-amber/20 bg-prism-amber/5 flex gap-4 mb-10">
        <AlertCircle size={24} className="text-prism-amber flex-shrink-0" />
        <p className="text-sm text-white/60 leading-relaxed font-medium">
          <span className="text-white font-bold">Verification Timeline:</span> Our medical board reviews credentials within 24-48 hours. You can proceed with profile setup while we verify.
        </p>
      </GlassCard>

      <Button 
        variant="rose" 
        className="w-full h-16 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        disabled={!isComplete}
        onClick={() => router.push('/doctor/setup')}
      >
        Complete Registration <ArrowRight size={18} className="ml-2" />
      </Button>
    </motion.div>
  );
}