'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Search, FileText, Download, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePrescriptions } from '@/hooks/doctor/usePrescriptions';

export default function IssuedPrescriptions() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const { filterPrescriptions, loading } = usePrescriptions();
  const displayedPrescriptions = filterPrescriptions(search, statusFilter);

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-sm font-black text-prism-fuchsia uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-prism-fuchsia shadow-[0_0_10px_rgba(217,70,239,1)] animate-pulse" />
           Clinical Record Archive
        </h2>
        <h1 className="text-4xl font-display font-medium text-white tracking-tight">
          Issued <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-fuchsia to-white font-bold italic">Prescriptions.</span>
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="w-full md:w-96">
           <Input 
            placeholder="Search by patient or RX ID..." 
            icon={<Search size={18} />} 
            className="h-14 bg-white/5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold outline-none cursor-pointer focus:border-prism-fuchsia focus:text-white transition-all appearance-none"
           >
             <option value="All">All Statuses</option>
             <option value="sent">Sent</option>
             <option value="draft">Draft</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-white/40">
           <Loader2 className="animate-spin text-prism-fuchsia" size={32} />
        </div>
      ) : displayedPrescriptions.length === 0 ? (
        <GlassCard className="p-10 text-center text-white/40 italic font-medium">
          No prescriptions found matching your criteria.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedPrescriptions.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-6 group hover:bg-white/[0.03] transition-all">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-xl bg-prism-fuchsia/10 text-prism-fuchsia flex items-center justify-center border border-prism-fuchsia/20">
                          <FileText size={22} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-white/20 uppercase tracking-widest mb-1">
                            {rx.id?.split('-')[0] || rx.id?.substring(0,8) || 'RX----'}
                          </span>
                          <h4 className="text-lg font-bold text-white uppercase">{rx.patient_name || 'Unknown Patient'}</h4>
                       </div>
                    </div>

                    <div className="flex-1 border-x border-white/5 px-8 hidden lg:block">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Diagnosis</p>
                       <p className="text-xs font-bold text-white/60">{rx.diagnosis || 'Standard Consultation'}</p>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="flex flex-col items-end whitespace-nowrap">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Issue Date</span>
                          <span className="text-xs font-bold text-white/40">
                             {new Date(rx.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                       </div>
                       <Badge variant={rx.status === 'sent' ? 'emerald' : 'amber'}>{rx.status || 'sent'}</Badge>
                       <div className="flex items-center gap-2">
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                             <Eye size={16} />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                             <Download size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}