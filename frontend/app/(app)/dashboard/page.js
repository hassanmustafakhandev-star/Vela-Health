'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Brain, Stethoscope, Activity, Users, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import useAuthStore from '@/store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

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
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Heart Rate</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter shadow-prism-rose/50">72<span className="text-sm text-prism-rose ml-1">BPM</span></p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-3xl shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Protection</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">100<span className="text-sm text-prism-cyan ml-1">%</span></p>
          </div>
        </div>
      </motion.div>

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
              <h3 className="text-3xl font-display font-bold text-white mb-3">Sehat AI Core</h3>
              <p className="text-white/50 font-medium max-w-sm mb-8 leading-relaxed">
                Initiate a neural diagnostic session. Describe symptoms in any language for immediate triage.
              </p>
              <div className="flex items-center gap-2 text-sm font-black text-prism-fuchsia uppercase tracking-widest group-hover:gap-4 transition-all">
                Initialize Connect <ChevronRight size={18} />
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
