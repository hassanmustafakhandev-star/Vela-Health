'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, AlertCircle, CheckCircle2, ChevronRight, Loader2, Download } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const statusMap = {
  active: { icon: CheckCircle2, label: 'Active', textClass: 'text-prism-emerald', bgClass: 'bg-prism-emerald/10 border-prism-emerald/20', color: 'emerald' },
  completed: { icon: CheckCircle2, label: 'Completed', textClass: 'text-prism-cyan', bgClass: 'bg-prism-cyan/10 border-prism-cyan/20', color: 'cyan' },
  expired: { icon: AlertCircle, label: 'Expired', textClass: 'text-prism-rose', bgClass: 'bg-prism-rose/10 border-prism-rose/20', color: 'rose' },
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/prescriptions/me');
        setPrescriptions(res.data.prescriptions || []);
      } catch (err) {
        toast.error("Failed to fetch medical archive.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleDownload = async (rxId) => {
    try {
      const res = await api.get(`/prescriptions/${rxId}/pdf`);
      if (res.data.pdf_url) {
        window.open(res.data.pdf_url, '_blank');
      } else {
        toast.error("PDF is being generated. Please wait.");
      }
    } catch (err) {
      toast.error("Could not retrieve secure PDF link.");
    }
  };

  return (
    <div className="py-8 min-h-screen">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-prism-cyan/20 border border-prism-cyan/40 flex items-center justify-center text-prism-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-white tracking-tight">Digital Directives</h1>
          <p className="text-sm font-medium text-white/40">Your encrypted prescription archive.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
           <Loader2 className="animate-spin text-prism-cyan" size={32} />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center p-20 border border-white/5 bg-white/5 rounded-3xl">
          <p className="text-white/40 italic">No directives found in your node.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prescriptions.map((rx, i) => {
            const rxStatus = rx.status || 'active';
            const status = statusMap[rxStatus] || statusMap.active;
            const StatusIcon = status.icon;
            // Get first medication name as title
            const mainMed = rx.medications?.[0]?.name || 'Medical Prescription';
            const medCount = rx.medications?.length || 0;
            const medSubtitle = medCount > 1 ? `+ ${medCount - 1} more medications` : 'Single Directive';

            return (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard glowColor={status.color} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer" onClick={() => handleDownload(rx.id)}>
                  <div className="flex items-center gap-5 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-prism-${status.color} bg-prism-${status.color}/10 border border-prism-${status.color}/20 shadow-[0_0_12px_currentColor] flex-shrink-0 group-hover:bg-prism-${status.color} group-hover:text-white transition-all`}>
                      <FileText size={22} />
                    </div>

                    <div>
                      <p className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">{mainMed}</p>
                      <p className="text-xs text-white/40 font-medium mt-0.5">{rx.diagnosis || 'Diagnostic Session'} · <span className="font-bold text-white/60">{medSubtitle}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center sm:justify-end gap-4 pl-16 sm:pl-0">
                    <div className="flex items-center gap-2 text-white/30 text-xs font-medium">
                      <Clock size={14} />
                      <span>{new Date(rx.issued_at).toLocaleDateString()}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${status.bgClass} ${status.textClass}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(rx.id); }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all ml-2"
                    >
                       <Download size={18} />
                    </button>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all hidden sm:block" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
