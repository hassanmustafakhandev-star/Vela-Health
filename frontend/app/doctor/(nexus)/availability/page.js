'use client';
import { motion } from 'framer-motion';
import WeeklySchedule from '@/components/doctor/availability/WeeklySchedule';
import GlassCard from '@/components/ui/GlassCard';
import { Clock, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function DoctorAvailability() {
  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-cyan uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
             Temporal Alignment
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white font-bold italic">Schedule.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <GlassCard className="px-6 py-3 border-white/5 bg-white/5 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Sync Status</span>
              <span className="text-xs font-black uppercase tracking-widest text-prism-emerald flex items-center gap-2">
                 <ShieldCheck size={14} /> Global Active
              </span>
           </GlassCard>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <WeeklySchedule />
        </div>
        
        <div className="lg:col-span-4 flex flex-col gap-6">
           <GlassCard glowColor="rose" className="p-8 border-prism-rose/20 bg-prism-rose/[0.02]">
              <div className="w-12 h-12 rounded-xl bg-prism-rose/10 flex items-center justify-center text-prism-rose mb-6">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Emergency Block</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                Instantly suspend all upcoming bookings for a specific period. This will notify all scheduled patients via high-priority FCM.
              </p>
              <button className="w-full h-14 rounded-2xl bg-prism-rose text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 transition-all">
                Override Schedule
              </button>
           </GlassCard>

           <GlassCard className="p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Slot Density</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-white/40 mb-2">
                       <span>Utilization Pulse</span>
                       <span>82%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }} animate={{ width: '82%' }}
                        className="h-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                       />
                    </div>
                 </div>
                 <p className="text-xs text-white/30 italic leading-relaxed">
                   Based on your current windows, the system predicts high patient density on Monday and Friday mornings.
                 </p>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}