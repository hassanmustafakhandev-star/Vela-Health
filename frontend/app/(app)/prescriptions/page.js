'use client';
import { motion } from 'framer-motion';
import { FileText, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const prescriptions = [
  { id: 1, name: 'Amoxicillin 500mg', doctor: 'Dr. Sarah Chen', date: 'Oct 12, 2026', duration: '7 days', status: 'Active', dosage: '3× Daily', color: 'emerald' },
  { id: 2, name: 'Panadol CF', doctor: 'Dr. Ahmed Raza', date: 'Oct 08, 2026', duration: '3 days', status: 'Completed', dosage: '2× Daily', color: 'cyan' },
  { id: 3, name: 'Metformin 850mg', doctor: 'Dr. John Davies', date: 'Sep 20, 2026', duration: 'Ongoing', status: 'Active', dosage: '1× Daily', color: 'emerald' },
  { id: 4, name: 'Claritin 10mg', doctor: 'Dr. Emily Watson', date: 'Sep 01, 2026', duration: '14 days', status: 'Expired', dosage: '1× at Night', color: 'rose' },
];

const statusMap = {
  Active: { icon: CheckCircle2, label: 'Active', textClass: 'text-prism-emerald', bgClass: 'bg-prism-emerald/10 border-prism-emerald/20' },
  Completed: { icon: CheckCircle2, label: 'Completed', textClass: 'text-prism-cyan', bgClass: 'bg-prism-cyan/10 border-prism-cyan/20' },
  Expired: { icon: AlertCircle, label: 'Expired', textClass: 'text-prism-rose', bgClass: 'bg-prism-rose/10 border-prism-rose/20' },
};

export default function PrescriptionsPage() {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-prism-cyan/20 border border-prism-cyan/40 flex items-center justify-center text-prism-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-white tracking-tight">Digital Directives</h1>
          <p className="text-sm font-medium text-white/40">Your encrypted prescription archive.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {prescriptions.map((rx, i) => {
          const status = statusMap[rx.status];
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard glowColor={rx.color} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-prism-${rx.color} bg-prism-${rx.color}/10 border border-prism-${rx.color}/20 shadow-[0_0_12px_currentColor] flex-shrink-0 group-hover:bg-prism-${rx.color} group-hover:text-white transition-all`}>
                    <FileText size={22} />
                  </div>

                  <div>
                    <p className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">{rx.name}</p>
                    <p className="text-xs text-white/40 font-medium mt-0.5">{rx.doctor} · <span className="font-bold text-white/60">{rx.dosage}</span></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center sm:justify-end gap-4 pl-16 sm:pl-0">
                  <div className="flex items-center gap-2 text-white/30 text-xs font-medium">
                    <Clock size={14} />
                    <span>{rx.date} · {rx.duration}</span>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${status.bgClass} ${status.textClass}`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </div>

                  <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all hidden sm:block" />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
