'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import VideoRoomDoctor from '@/components/doctor/consultation/VideoRoomDoctor';
import ClinicalPanel from '@/components/doctor/consultation/ClinicalPanel';
import PrescriptionBuilder from '@/components/doctor/prescription/PrescriptionBuilder';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ShieldCheck, Crosshair, Cpu, Maximize2, Minimize2, ChevronRight, X } from 'lucide-react';

export default function ConsultationRoom() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [layout, setLayout] = useState('standard'); // standard, focus-video

  const handleEnd = () => {
    setShowSummary(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-prism-bg flex flex-col md:flex-row overflow-hidden">
      {/* 3-COLUMN SPATIAL LAYOUT */}
      
      {/* LEFT: Clinical Data (Obs & Vitals) */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-[340px] flex-col border-r border-white/5 bg-prism-surface/50 backdrop-blur-3xl p-6"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <Avatar size="sm" radius="xl" name="Hassan K" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-white">Hassan K.</span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Active Node</span>
              </div>
           </div>
           <Badge variant="emerald" className="animate-pulse">Live</Badge>
        </div>
        
        <ClinicalPanel patientId="placeholder" />
      </motion.div>

      {/* CENTER: High-Fidelity Video Feed */}
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <h2 className="text-xl font-display font-medium text-white tracking-tight">Tele-Consultation Session</h2>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck size={12} className="text-prism-emerald" />
                  <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em]">End-to-End Encrypted Tunnel</span>
                </div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setLayout(layout === 'standard' ? 'focus-video' : 'standard')}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all"
              >
                {layout === 'standard' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
           </div>
        </div>

        <div className="flex-1 min-h-0">
          <VideoRoomDoctor sessionId={sessionId} onEnd={handleEnd} />
        </div>

        {/* Real-time Triage Bar (Bottom Overlay) */}
        <div className="absolute bottom-10 left-10 right-10 flex items-center justify-center pointer-events-none">
           <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-prism-fuchsia/20 flex items-center gap-6 shadow-2xl pointer-events-auto"
           >
              <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                 <div className="w-8 h-8 rounded-lg bg-prism-fuchsia/10 flex items-center justify-center text-prism-fuchsia">
                    <Cpu size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">A.I. Analysis</span>
                    <span className="text-[10px] font-bold text-white">Sepsis Risk: 4.2%</span>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-prism-cyan/10 flex items-center justify-center text-prism-cyan">
                    <Crosshair size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Signal Latency</span>
                    <span className="text-[10px] font-bold text-white">42ms</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* RIGHT: Prescription & Templates */}
      <motion.div 
        initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="hidden xl:flex w-[400px] flex-col border-l border-white/5 bg-prism-surface/50 backdrop-blur-3xl p-6"
      >
        <PrescriptionBuilder />
      </motion.div>

      {/* Post-Call Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <GlassCard className="max-w-xl w-full p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-prism-emerald/10 blur-3xl" />
               <div className="w-20 h-20 rounded-[32px] bg-prism-emerald/10 text-prism-emerald flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ShieldCheck size={40} />
               </div>
               <h2 className="text-3xl font-display font-bold text-white mb-3">Session Securely Closed</h2>
               <p className="text-white/40 font-medium mb-10">Clinical data has been archived to the decentralized vault. The patient will receive the prescription via FCM and SMS.</p>
               
               <div className="flex flex-col gap-4">
                 <Button 
                    variant="emerald" 
                    className="h-16 w-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    onClick={() => router.push('/doctor/dashboard')}
                 >
                    Finalize & Return to Nexus
                 </Button>
                 <button className="text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    Download Local Clinical Log
                 </button>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
