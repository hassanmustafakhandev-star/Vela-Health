'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import { Brain, Stethoscope, Activity, Users, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import useAuthStore from '@/store/authStore';
import { useMyAppointments } from '@/hooks/useAppointments';
import { Video, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { useHealthSummary } from '@/hooks/useHealthRecords';

export default function Dashboard() {
  const { user } = useAuthStore();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const router = useRouter();

  const { data, isLoading } = useMyAppointments();
  const { data: summary, isLoading: summaryLoading } = useHealthSummary();
  const upcoming = data?.appointments || [];

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="py-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative"
      >
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-prism-emerald/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-sm font-black text-prism-emerald uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-emerald shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
             Telemetry Active
          </h2>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">
            Welcome back, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-emerald to-prism-cyan font-bold italic">{userName}.</span>
          </h1>
        </div>

        <div className="flex gap-4 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-3xl shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Latest Pulse</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">
               {summary?.latest_vitals?.find(v => v.type === 'heart_rate')?.value || '--'}<span className="text-sm text-prism-rose ml-1">BPM</span>
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-3xl shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Blood Glucose</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">
               {summary?.latest_vitals?.find(v => v.type === 'sugar')?.value || '--'}<span className="text-sm text-prism-cyan ml-1">MG/DL</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active Appointments Section */}
      <AnimatePresence>
        {isLoading ? (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-[40px]" />
            <Skeleton className="h-40 w-full rounded-[40px]" />
          </div>
        ) : upcoming.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6 flex items-center gap-3 ml-2">
               <div className="w-1.5 h-1.5 rounded-full bg-prism-rose" />
               Active Horizon Appointments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((appt) => (
                <GlassCard key={appt.id} glowColor="rose" className="p-6 group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-0.5">
                        <img 
                          src={appt.doctor?.photo || `https://i.pravatar.cc/150?u=${appt.doctor_id}`} 
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-prism-rose mb-0.5">{appt.doctor?.name || 'Vanguard Specialist'}</p>
                        <p className="text-xs font-medium text-white/40 italic">"{appt.reason}"</p>
                      </div>
                    </div>
                    {appt.type === 'video' && (
                       <div className="w-10 h-10 rounded-full bg-prism-rose/10 flex items-center justify-center text-prism-rose border border-prism-rose/20">
                         <Video size={18} />
                       </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-white/60 text-xs font-bold">
                       <span className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-prism-rose" /> {appt.date}</span>
                       <span className="flex items-center gap-1.5"><ClockIcon size={14} className="text-prism-cyan" /> {appt.time}</span>
                    </div>
                    {appt.type === 'video' && (
                      <Button 
                        variant="rose" 
                        size="sm" 
                        className="h-10 px-6 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        onClick={() => router.push(`/consultation/${appt.id}`)}
                      >
                        Join Video Call
                      </Button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spatial Grid */}
      <motion.div 
        variants={containerVars} initial="hidden" animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
      >
        {/* Core AI Node (Fuchsia) */}
        <motion.div variants={itemVars} className="lg:col-span-2">
          <Link href="/ai/symptoms">
            <GlassCard glowColor="fuchsia" className="h-full p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-prism-fuchsia/20 blur-[80px] group-hover:bg-prism-fuchsia/30 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-prism-fuchsia/20 border border-prism-fuchsia/40 flex items-center justify-center text-prism-fuchsia mb-8 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                <Brain size={28} />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-3">Sehat AI Insight</h3>
              <p className="text-white/50 font-medium max-w-sm mb-8 leading-relaxed italic">
                {summary?.latest_insight?.text || "Synchronize your medical records for an AI health trajectory analysis."}
              </p>
              <div className="flex items-center gap-2 text-sm font-black text-prism-fuchsia uppercase tracking-widest group-hover:gap-4 transition-all">
                Access Triage Core <ChevronRight size={18} />
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Identity Node (Cyan) */}
        <motion.div variants={itemVars}>
          <Link href="/profile">
            <GlassCard glowColor="cyan" className="h-full p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-prism-cyan/20 border border-prism-cyan/40 flex items-center justify-center text-prism-cyan mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Biometric Profile</h3>
                <p className="text-sm text-white/40 font-medium leading-relaxed">Identity vault secured via cryptographic passkeys.</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                 <span className="text-xs font-black uppercase tracking-widest text-white/40">Status</span>
                 <span className="text-xs font-black uppercase tracking-widest text-prism-cyan">Verified</span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Doctors Node (Rose) */}
        <motion.div variants={itemVars}>
          <Link href="/doctors">
            <GlassCard glowColor="rose" className="h-full p-8 group relative overflow-hidden">
               <div className="w-12 h-12 rounded-xl bg-prism-rose/20 border border-prism-rose/40 flex items-center justify-center text-prism-rose mb-6 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <Stethoscope size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Vanguard Directory</h3>
               <p className="text-sm text-white/40 font-medium mb-8">Access the top 1% PMDC specialists via UHD video.</p>
               <div className="text-xs font-black text-prism-rose uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Find Specialist <ChevronRight size={16} />
               </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Records Node (Emerald) */}
        <motion.div variants={itemVars}>
          <Link href="/records">
            <GlassCard glowColor="emerald" className="h-full p-8 group">
               <div className="w-12 h-12 rounded-xl bg-prism-emerald/20 border border-prism-emerald/40 flex items-center justify-center text-prism-emerald mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <FileText size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Medical Archive</h3>
               <p className="text-sm text-white/40 font-medium mb-8">Decentralized vault for labs, prescriptions, and scans.</p>
               <div className="text-xs font-black text-prism-emerald uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Access Vault <ChevronRight size={16} />
               </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Family Node (Amber) */}
        <motion.div variants={itemVars}>
          <Link href="/family">
            <GlassCard glowColor="amber" className="h-full p-8 group">
               <div className="w-12 h-12 rounded-xl bg-prism-amber/20 border border-prism-amber/40 flex items-center justify-center text-prism-amber mb-6 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Users size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Family Network</h3>
               <p className="text-sm text-white/40 font-medium mb-8">Unified command center for dependents and seniors.</p>
               <div className="text-xs font-black text-prism-amber uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Manage Nodes <ChevronRight size={16} />
               </div>
            </GlassCard>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
