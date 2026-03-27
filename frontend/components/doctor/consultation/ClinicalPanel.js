'use client';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import { Clipboard, Heart, Thermometer, Droplets, Mic, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ClinicalPanel({ patientId }) {
  const [symptoms, setSymptoms] = useState([]);
  const [vitals, setVitals] = useState({
    bp: '120/80',
    temp: '98.6',
    hr: '72',
    spo2: '99',
  });

  const quickSymptoms = ['Fever', 'Cough', 'Fatigue', 'Headache', 'Nausea', 'Dyspnea'];

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      {/* Live Notes */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Clipboard size={14} className="text-prism-emerald" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Clinical Observations</h4>
          </div>
          <button className="text-[10px] text-white/30 hover:text-white flex items-center gap-1">
            <Mic size={12} /> Live Capture
          </button>
        </div>
        <textarea 
          placeholder="Recording clinical observations..."
          className="w-full flex-1 min-h-[150px] bg-white/5 border border-white/5 rounded-2xl p-4 text-white text-[13px] outline-none focus:border-prism-emerald focus:bg-white/[0.08] transition-all resize-none shadow-inner"
        />
        <div className="flex items-center gap-2 px-2">
           <div className="w-1.5 h-1.5 rounded-full bg-prism-emerald animate-pulse" />
           <span className="text-[9px] font-black uppercase text-white/20 tracking-wider font-mono">Synced to Nexus Vault • {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Symptoms Checklist */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white px-2">Physical Markers</h4>
        <div className="flex flex-wrap gap-2 px-1">
          {quickSymptoms.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${symptoms.includes(s) ? 'bg-prism-emerald text-white border-prism-emerald shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Vitals Entry */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
          <Heart size={14} className="text-prism-rose" /> Vital Telemetry Entry
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="BP (e.g. 120/80)" 
            className="h-11 font-mono text-xs bg-transparent border-white/5" 
            value={vitals.bp}
            onChange={(e) => setVitals({...vitals, bp: e.target.value})}
          />
          <Input 
            placeholder="Temp (°F)" 
            className="h-11 font-mono text-xs bg-transparent border-white/5" 
            value={vitals.temp}
            onChange={(e) => setVitals({...vitals, temp: e.target.value})}
          />
          <Input 
            placeholder="HR (BPM)" 
            className="h-11 font-mono text-xs bg-transparent border-white/5" 
            value={vitals.hr}
            onChange={(e) => setVitals({...vitals, hr: e.target.value})}
          />
          <Input 
            placeholder="SpO2 (%)" 
            className="h-11 font-mono text-xs bg-transparent border-white/5" 
            value={vitals.spo2}
            onChange={(e) => setVitals({...vitals, spo2: e.target.value})}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 px-1">
           <CheckCircle2 size={12} className="text-prism-emerald" />
           <span className="text-[9px] font-bold text-white/30 uppercase italic">Vitals broadcasted to patient monitor</span>
        </div>
      </div>
    </div>
  );
}