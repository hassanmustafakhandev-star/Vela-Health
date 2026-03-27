'use client';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { 
  ArrowLeft, FileText, Activity, History, 
  ExternalLink, Calendar, MessageSquare,
  Clipboard, Heart, Brain, Download
} from 'lucide-react';
import { usePatientRecord } from '@/hooks/doctor/usePatientRecord';

export default function PatientDetail() {
  const { patientId } = useParams();
  const router = useRouter();
  const { patient, history, vitals, loading } = usePatientRecord(patientId);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="max-w-7xl mx-auto py-2">
      <motion.button 
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Registry View</span>
      </motion.button>

      {/* Header Profile */}
      <GlassCard className="p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-prism-cyan/5 blur-[120px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-8">
              <Avatar src={patient?.photo_url} name={patient?.name} size="xl" radius="3xl" className="border-2 border-white/10" />
              <div className="flex flex-col">
                 <h1 className="text-4xl font-display font-bold text-white mb-2">{patient?.name || 'Hassan Mustafa'}</h1>
                 <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2">
                       <Badge variant="cyan">{patient?.age || 24} Years</Badge>
                       <Badge variant="cyan" className="bg-white/5 border-white/10">{patient?.gender || 'Male'}</Badge>
                    </div>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="text-xs font-bold text-white/40">ID: VAL-2026-X99</span>
                 </div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button className="h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                 <MessageSquare size={16} /> Chat
              </button>
              <button className="h-12 px-5 rounded-2xl bg-prism-cyan text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all">
                 <Download size={16} /> Export EMR
              </button>
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Statistics & Vitals (4 cols) */}
        <motion.div variants={containerVars} initial="hidden" animate="visible" className="lg:col-span-4 flex flex-col gap-6">
           <GlassCard glowColor="emerald" className="p-6">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Health Telemetry</h4>
                 <Badge variant="emerald" className="bg-prism-emerald/10 text-[9px]">Real-time</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { label: 'BPM', val: '72', icon: Heart, color: 'rose', Heart: 'Heart' }, // Mock icons
                    { label: 'Blood Group', val: 'O+', icon: Activity, color: 'cyan', Activity: 'Activity' },
                    { label: 'SpO2', val: '98%', icon: Download, color: 'emerald', Download: 'Download' },
                    { label: 'BMI', val: '22.4', icon: FileText, color: 'amber', FileText: 'FileText' },
                 ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                       <stat.icon size={14} className={`text-prism-${stat.color}`} />
                       <span className="text-lg font-mono font-bold text-white">{stat.val}</span>
                       <span className="text-[9px] font-black uppercase text-white/20">{stat.label}</span>
                    </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-6">Known Constraints</h4>
              <div className="flex flex-wrap gap-2">
                 {['Lactose Intolerant', 'Dust Allergy', 'Type O+ Blood'].map(c => (
                    <Badge key={c} variant="rose" className="bg-prism-rose/10 h-7 border-prism-rose/20">{c}</Badge>
                 ))}
              </div>
           </GlassCard>
        </motion.div>

        {/* History & Timeline (8 cols) */}
        <motion.div variants={containerVars} initial="hidden" animate="visible" className="lg:col-span-8 flex flex-col gap-6">
           <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <History size={18} className="text-prism-cyan" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Full Clinical Timeline</h4>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sort:</span>
                    <button className="text-[10px] font-black text-white hover:text-prism-cyan">NEWEST</button>
                 </div>
              </div>

              <div className="flex flex-col gap-8 relative">
                 <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-white/5" />
                 
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-8 group">
                       <div className="w-12 h-12 rounded-2xl bg-prism-surface border border-white/10 flex items-center justify-center text-white/20 group-hover:border-prism-cyan group-hover:text-prism-cyan transition-all relative z-10 shadow-2xl">
                          <Brain size={20} />
                       </div>
                       <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                             <h5 className="font-bold text-white text-[15px]">Neural Diagnostic Session</h5>
                             <span className="text-[10px] font-black uppercase text-white/20 font-mono tracking-widest">12 Oct 2025 • 04:30 PM</span>
                          </div>
                          <p className="text-sm text-white/40 leading-relaxed mb-6">
                             Patient presented with chronic migraine. Triage analysis suggested tension-type involvement. Prescription issued: Naproxen 500mg.
                          </p>
                          <div className="flex items-center gap-4">
                             <button className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan flex items-center gap-2 hover:gap-3 transition-all">
                                View Full Rx <ExternalLink size={12} />
                             </button>
                             <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2 hover:text-white transition-all">
                                Clinical Notes <FileText size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// Helper icons (re-importing just in case of scope issues in large files)
import { Heart as HeartIcon, Activity as ActivityIcon, Download as DownloadIcon, FileText as FileTextIcon } from 'lucide-react';
