'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import VideoRoomPatient from '@/components/patient/consultation/VideoRoomPatient';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ShieldCheck, MessageSquare, Info, Star } from 'lucide-react';

export default function PatientConsultationPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleEnd = () => {
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-prism-bg flex flex-col p-4 md:p-8 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-display font-bold text-white italic">Live Consultation</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-prism-emerald animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Tunnel: {sessionId?.slice(0, 8)}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
           <ShieldCheck size={14} className="text-prism-emerald" />
           E2EE Active
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Video feed */}
        <div className="flex-[2] flex flex-col">
          <VideoRoomPatient sessionId={sessionId} onEnd={handleEnd} />
        </div>

        {/* Right: Info & Chat (Side Panel) */}
        <div className="flex-1 flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-prism-cyan/10 flex items-center justify-center text-prism-cyan">
                  <Info size={20} />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">Active Session</h3>
                  <p className="text-xs text-white/40 font-medium">Please stay on this page to continue the call.</p>
               </div>
            </div>
            
            <div className="h-[300px] rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center p-8 text-center gap-4 group">
               <MessageSquare size={32} className="text-white/10 group-hover:text-prism-fuchsia transition-colors" />
               <p className="text-xs text-white/20 font-medium uppercase tracking-widest leading-relaxed">Secure Chat Tunnel Initializing...</p>
            </div>
          </GlassCard>

          <div className="mt-auto p-4 rounded-2xl border border-prism-rose/20 bg-prism-rose/10 flex items-center gap-4">
             <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-prism-rose/20 flex items-center justify-center text-prism-rose">
                <ShieldCheck size={20} />
             </div>
             <p className="text-[10px] text-white/60 leading-relaxed font-medium">This session is recorded for medical record purposes and stored in your decentralized vault.</p>
          </div>
        </div>
      </div>

      {/* Post-Call Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <GlassCard className="max-w-md w-full p-10 text-center relative overflow-hidden">
               <div className="w-20 h-20 rounded-[32px] bg-prism-fuchsia/10 text-prism-fuchsia flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Star size={40} />
               </div>
               <h2 className="text-2xl font-display font-bold text-white mb-2">Consultation Ended</h2>
               <p className="text-white/40 font-medium mb-8">How was your experience with the doctor?</p>
               
               <div className="flex flex-col gap-4">
                 <Button 
                    variant="fuchsia" 
                    className="h-14 w-full"
                    onClick={() => router.push('/dashboard')}
                 >
                    Submit Feedback
                 </Button>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
