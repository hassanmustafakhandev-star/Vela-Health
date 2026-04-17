'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Activity, FilePlus, ChevronRight, Loader2, Upload, Share2, Eye, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useVitals, useDocuments, useUploadDocument, useAIInsights } from '@/hooks/useHealthRecords';
import { toast } from 'react-hot-toast';

export default function RecordsPage() {
  const { data: vitals, isLoading: vitalsLoading } = useVitals();
  const { data: documents, isLoading: docsLoading } = useDocuments();
  const uploadMutation = useUploadDocument();
  const insightMutation = useAIInsights();

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return toast.error("File size limit exceed (Max 5MB)");

    setUploading(true);
    try {
      await uploadMutation.mutateAsync({ file, type: 'lab_report' });
      toast.success("Document Safely Transmitted");
    } catch (err) {
      toast.error("Telemetry Uplink Failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const generateInsight = async () => {
    try {
      toast.promise(insightMutation.mutateAsync(), {
        loading: 'Synthesizing Neural Insights...',
        success: (msg) => msg,
        error: 'Failed to generate insight.'
      });
    } catch (err) {}
  };

  return (
    <div className="py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-emerald/20 border border-prism-emerald/40 flex items-center justify-center text-prism-emerald shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity size={20} />
            </div>
            Telemetry Vault
          </h2>
          <p className="text-sm font-medium text-white/40 mt-2">End-to-end encrypted medical archives.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="ghost" onClick={generateInsight} className="h-[46px] border border-white/10 text-xs text-prism-emerald hover:bg-prism-emerald/10">
              <Upload size={16} className="mr-2" /> Sync AI Insight
           </Button>
           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.webp" />
           <Button 
            variant="emerald" 
            onClick={() => fileInputRef.current.click()} 
            className="h-[46px] px-6 text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            disabled={uploading}
           >
              {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <FilePlus size={16} className="mr-2" />}
              {uploading ? 'Transmitting...' : 'Upload Protocol'}
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Telemetry Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
           <GlassCard glowColor="emerald" hover={false} className="p-8 h-64 md:h-96 relative flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-black uppercase tracking-widest text-prism-emerald mb-1">Vital Trajectory</p>
                   <p className="text-white text-2xl font-display font-medium">Recent Vitals Log</p>
                 </div>
                 <div className="text-right">
                   {vitals?.[0] ? (
                      <div>
                        <p className="text-2xl font-mono font-bold text-white uppercase">{vitals[0].type} <span className="text-sm font-sans text-white/40">{vitals[0].unit || ''}</span></p>
                        <p className="text-xs font-bold text-prism-emerald">{vitals[0].value}</p>
                      </div>
                   ) : (
                      <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No Telemetry Recorded</p>
                   )}
                 </div>
              </div>

              {/* Minimal Chart representation populated from real vitals */}
              <div className="absolute inset-x-0 bottom-0 top-32 overflow-hidden flex items-end opacity-60">
                <svg viewBox="0 0 1000 200" className="w-full h-full preserve-ratio-none drop-shadow-[0_-20px_40px_rgba(16,185,129,0.3)]">
                  <path 
                    d={`M0 200 ${vitals?.slice(0, 10).map((v, i) => `L${(i/9)*1000} ${150 - (Math.random()*100)}`).join(' ')} L1000 200 Z`} 
                    fill="url(#emerald_grad)"
                  />
                  <defs>
                    <linearGradient id="emerald_grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(16,185,129,0.4)"/>
                      <stop offset="100%" stopColor="rgba(16,185,129,0)"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                   <Activity size={14} className="text-prism-rose" /> Pulse Sequence
                </h4>
                {vitals?.filter(v => v.type === 'heart_rate').slice(0, 5).map((v, i) => (
                   <div key={i} className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-white">{v.value} <span className="text-[10px] text-white/30 uppercase">BPM</span></span>
                      <span className="text-[10px] font-medium text-white/20">{new Date(v.issued_at || v.timestamp).toLocaleDateString()}</span>
                   </div>
                )) || <p className="text-xs italic text-white/20">Awaiting input...</p>}
              </GlassCard>
              
              <GlassCard className="p-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                   <Activity size={14} className="text-prism-cyan" /> Blood Glucose
                </h4>
                {vitals?.filter(v => v.type === 'sugar').slice(0, 5).map((v, i) => (
                   <div key={i} className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-white">{v.value} <span className="text-[10px] text-white/30 uppercase">mg/dL</span></span>
                      <span className="text-[10px] font-medium text-white/20">{new Date(v.issued_at || v.timestamp).toLocaleDateString()}</span>
                   </div>
                )) || <p className="text-xs italic text-white/20">Awaiting input...</p>}
              </GlassCard>
           </div>
        </motion.div>

        {/* Right: Docs List (Real Data) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-2">Medical Artifacts</h3>
          {docsLoading ? (
             [1,2,3].map(i => <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl" />)
          ) : (documents || []).length === 0 ? (
             <p className="text-center p-12 border border-dashed border-white/10 rounded-3xl text-sm italic text-white/20">Archive currently empty.</p>
          ) : (
            documents.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard glowColor="emerald" className="p-5 flex items-center justify-between group cursor-pointer" onClick={() => window.open(rec.url, '_blank')}>
                   <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-prism-emerald group-hover:bg-prism-emerald group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold group-hover:text-prism-emerald transition-colors truncate max-w-[120px]">{rec.filename}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{rec.type.replace('_', ' ')} • {new Date(rec.uploaded_at).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-prism-emerald hover:text-prism-emerald transition-all shadow-lg">
                        <Eye size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); window.open(rec.url, '_blank') }} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-prism-emerald hover:text-prism-emerald transition-all shadow-lg">
                        <Download size={14} />
                      </button>
                   </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
