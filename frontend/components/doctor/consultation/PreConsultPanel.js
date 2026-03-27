'use client';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { 
  Brain, Activity, Thermometer, Droplets, 
  Heart, Clipboard, History, AlertCircle 
} from 'lucide-react';

export default function PreConsultPanel({ patient, record }) {
  if (!patient) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Identity */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-5">
          <Avatar src={patient.photo_url} name={patient.name} size="lg" radius="2xl" />
          <div className="flex flex-col">
            <h3 className="text-xl font-display font-bold text-white">{patient.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="cyan">{patient.age}y</Badge>
              <Badge variant="cyan" className="bg-white/5 border-white/10">{patient.blood_group || 'O+'}</Badge>
              {patient.allergies?.length > 0 && <Badge variant="rose">Allergic</Badge>}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI Triage Brief */}
      <GlassCard glowColor="fuchsia" className="p-6 border-prism-fuchsia/20 bg-prism-fuchsia/[0.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-prism-fuchsia/10 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-xl bg-prism-fuchsia/10 border border-prism-fuchsia/30 flex items-center justify-center text-prism-fuchsia shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <Brain size={20} />
           </div>
           <h4 className="text-sm font-black uppercase tracking-widest text-white">Neural Triage Summary</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-prism-fuchsia">Primary Complaint</span>
            <p className="text-sm text-white font-medium italic">"{record?.ai_summary?.complaint || 'Patient reports persistent headache and fatigue.'}"</p>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
             <span className="text-xs font-bold text-white/40">Risk Assessment</span>
             <Badge variant={record?.ai_summary?.urgency === 'high' ? 'rose' : 'emerald'}>
               {record?.ai_summary?.urgency || 'Low'}
             </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Latest Vitals */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
           <Activity size={18} className="text-prism-emerald" />
           <h4 className="text-sm font-black uppercase tracking-widest text-white">Vital Telemetry</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
             <span className="text-[10px] font-black text-white/20 uppercase">BPM</span>
             <span className="text-lg font-mono font-bold text-white">72</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
             <span className="text-[10px] font-black text-white/20 uppercase">Temp</span>
             <span className="text-lg font-mono font-bold text-white">98.6°F</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
             <span className="text-[10px] font-black text-white/20 uppercase">SpO2</span>
             <span className="text-lg font-mono font-bold text-white">99%</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
             <span className="text-[10px] font-black text-white/20 uppercase">BP</span>
             <span className="text-lg font-mono font-bold text-white">120/80</span>
          </div>
        </div>
      </GlassCard>

      {/* Medical History Ticker */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
           <History size={18} className="text-prism-cyan" />
           <h4 className="text-sm font-black uppercase tracking-widest text-white">Recent Encounters</h4>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">General Checkup</span>
                <span className="text-[10px] text-white/30 font-medium">12 Oct 2025 • Dr. Sarah</span>
              </div>
              <Badge variant="cyan" className="bg-white/5 text-[9px] uppercase">Record</Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}