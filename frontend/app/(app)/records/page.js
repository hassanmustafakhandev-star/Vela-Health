'use client';
import { motion } from 'framer-motion';
import { FileText, Download, Activity, FilePlus, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

const records = [
  { id: 1, title: 'Complete Blood Count', date: 'Oct 12, 2026', type: 'Lab Result', doctor: 'Dr. Sarah Chen' },
  { id: 2, roz: 'MRI Brain Scan', date: 'Sep 28, 2026', type: 'Imaging', doctor: 'Dr. Ahmed Raza' },
  { id: 3, title: 'Cardiology Report', date: 'Aug 15, 2026', type: 'Clinical Note', doctor: 'Dr. John Davies' },
];

export default function RecordsPage() {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-emerald/20 border border-prism-emerald/40 flex items-center justify-center text-prism-emerald shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity size={20} />
            </div>
            Telemetry Vault
          </h2>
          <p className="text-sm font-medium text-white/40 mt-2">End-to-end encrypted medical archives.</p>
        </div>
        <Button variant="emerald" className="h-[46px] px-6 text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
           <FilePlus size={16} className="mr-2" /> Upload Protocol
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Telemetry Chart Mockup */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
           <GlassCard glowColor="emerald" hover={false} className="p-8 h-64 md:h-96 relative flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-black uppercase tracking-widest text-prism-emerald mb-1">Vital Trajectory</p>
                   <p className="text-white text-2xl font-display font-medium">Hemoglobin Levels</p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-mono font-bold text-white">14.2 <span className="text-sm font-sans text-white/40">g/dL</span></p>
                   <p className="text-xs font-bold text-prism-emerald flex items-center justify-end gap-1">+1.2% <ChevronRight size={12} className="-rotate-90" /></p>
                 </div>
              </div>

              {/* Minimal Chart representation */}
              <div className="absolute inset-x-0 bottom-0 top-32 overflow-hidden flex items-end opacity-60">
                <svg viewBox="0 0 1000 200" className="w-full h-full preserve-ratio-none drop-shadow-[0_−10px_20px_rgba(16,185,129,0.5)]">
                  <path d="M0 150 C 200 150, 300 50, 500 100 C 700 150, 800 20, 1000 80 L1000 200 L0 200 Z" fill="url(#emerald_grad)"/>
                  <path d="M0 150 C 200 150, 300 50, 500 100 C 700 150, 800 20, 1000 80" fill="none" stroke="#10b981" strokeWidth="3"/>
                  <defs>
                    <linearGradient id="emerald_grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(16,185,129,0.2)"/>
                      <stop offset="100%" stopColor="rgba(16,185,129,0)"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
           </GlassCard>
        </motion.div>

        {/* Right: Docs List */}
        <div className="flex flex-col gap-4">
          {records.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard glowColor="emerald" className="p-5 flex items-center justify-between group cursor-pointer">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-prism-emerald group-hover:bg-prism-emerald group-hover:text-white transition-all">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold group-hover:text-prism-emerald transition-colors">{rec.title || rec.roz}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{rec.type} • {rec.date}</p>
                    </div>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:border-prism-emerald group-hover:text-prism-emerald transition-all shadow-lg">
                   <Download size={14} />
                 </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
