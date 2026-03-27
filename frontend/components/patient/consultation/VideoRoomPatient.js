'use client';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Info } from 'lucide-react';
import VelaVideoRoom from '@/components/shared/VelaVideoRoom';

export default function VideoRoomPatient({ sessionId, onEnd }) {
  return (
    <div className="relative h-[60vh] md:h-full flex flex-col gap-4">
      <div className="flex-1 relative rounded-[32px] overflow-hidden border border-white/10 shadow-huge bg-black">
         <VelaVideoRoom 
           sessionId={sessionId} 
           role="patient" 
           onEnd={onEnd} 
         />
         
         {/* Premium Overlay: Vitals */}
         <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3"
            >
               <Activity size={14} className="text-prism-rose animate-pulse" />
               <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Bio-Telemetry</p>
                 <p className="text-xs font-bold text-white uppercase tracking-wider">Pulse: 72 BPM</p>
               </div>
            </motion.div>
         </div>

         {/* Premium Overlay: Security */}
         <div className="absolute top-6 right-6 z-10">
            <div className="px-3 py-1.5 rounded-lg bg-prism-emerald/10 backdrop-blur-md border border-prism-emerald/20 flex items-center gap-2">
               <ShieldCheck size={12} className="text-prism-emerald" />
               <span className="text-[10px] font-bold text-prism-emerald uppercase tracking-widest">E2EE Verified</span>
            </div>
         </div>
      </div>

      {/* Connection Info */}
      <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-prism-emerald animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Secure Neural Link Established</span>
         </div>
         <div className="flex items-center gap-2 text-white/30">
            <Info size={14} />
            <span className="text-[10px] uppercase font-bold">Standard Bitrate</span>
         </div>
      </div>
    </div>
  );
}
