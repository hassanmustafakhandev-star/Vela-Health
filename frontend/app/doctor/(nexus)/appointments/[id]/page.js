'use client';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import PreConsultPanel from '@/components/doctor/consultation/PreConsultPanel';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Clock, ArrowLeft, Video, Files, MessageSquare, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppointmentBriefing() {
  const { id } = useParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Queue</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Triage & Bio (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-prism-rose/5 blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                 <div className="flex items-center gap-6">
                    <Avatar size="xl" radius="2xl" name="Hassan Mustafa" />
                    <div className="flex flex-col">
                       <h1 className="text-3xl font-display font-bold text-white mb-2">Hassan Mustafa</h1>
                       <div className="flex items-center gap-3">
                          <Badge variant="rose">Priority Case</Badge>
                          <span className="text-xs text-white/30 font-bold">VAL-2026-X99</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Session Window</span>
                    <div className="flex items-center gap-2 text-prism-rose">
                       <Clock size={16} />
                       <span className="text-xl font-mono font-bold">10:30 AM</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-black uppercase text-white/20 mb-1">Age / Gender</p>
                    <p className="text-sm font-bold text-white">24 Yrs / Male</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-black uppercase text-white/20 mb-1">Blood Group</p>
                    <p className="text-sm font-bold text-white">O Positive</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-black uppercase text-white/20 mb-1">Last Visit</p>
                    <p className="text-sm font-bold text-white">12 Oct 2025</p>
                 </div>
              </div>

              <PreConsultPanel />
           </GlassCard>

           <div className="grid grid-cols-2 gap-6">
              <button className="h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold">
                 <Files size={20} /> Medical Archive
              </button>
              <button className="h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold">
                 <MessageSquare size={20} /> Patient Chat
              </button>
           </div>
        </div>

        {/* Right: Actions & Readiness (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <GlassCard glowColor="rose" className="p-8 border-prism-rose/20 bg-prism-rose/[0.03]">
              <div className="text-center mb-10">
                 <div className="w-20 h-20 rounded-[32px] bg-prism-rose/10 flex items-center justify-center text-prism-rose mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    <Video size={36} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Initialize Session</h3>
                 <p className="text-xs text-white/40 italic">Deployment clock is active.</p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 mb-10">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Auto-Start in</span>
                    <span className="text-xs font-bold text-prism-rose">LIVE NOW</span>
                 </div>
                 <div className="text-4xl font-mono font-bold text-white text-center py-2">
                    {formatTime(countdown)}
                 </div>
              </div>

              <button 
               onClick={() => router.push(`/doctor/consult/${id}`)}
               className="w-full h-16 rounded-2xl bg-prism-rose text-white text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                 Enter Consultation <ChevronRight size={18} />
              </button>
           </GlassCard>

           <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                 <ShieldCheck size={14} className="text-prism-emerald" /> Telemetry Readiness
              </h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Camera Protocol</span>
                    <Badge variant="emerald" className="h-5">Active</Badge>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Encrypted Tunnel</span>
                    <Badge variant="emerald" className="h-5">Secure</Badge>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Latency Sync</span>
                    <span className="text-[10px] font-mono font-bold text-white/60">42ms</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
