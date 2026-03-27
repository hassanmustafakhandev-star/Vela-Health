'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import EarningsChart from '@/components/doctor/earnings/EarningsChart';
import { Banknote, TrendingUp, Calendar, ArrowUpRight, DollarSign, Wallet, ArrowDownLeft, ChevronRight, Loader2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useEarnings } from '@/hooks/doctor/useEarnings';

export default function DoctorEarnings() {
  const { earnings, loading } = useEarnings();

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-white/40">
         <Loader2 className="animate-spin text-prism-emerald" size={32} />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', val: `Rs. ${earnings.total.toLocaleString()}`, icon: Wallet, color: 'emerald' },
    { label: 'This Month', val: `Rs. ${earnings.thisMonth.toLocaleString()}`, icon: Calendar, color: 'cyan' },
    { label: 'Avg / Consult', val: `Rs. ${earnings.avgPerConsult.toLocaleString()}`, icon: TrendingUp, color: 'fuchsia' },
  ];

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-sm font-black text-prism-emerald uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-prism-emerald shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
           Financial Intelligence
        </h2>
        <h1 className="text-4xl font-display font-medium text-white tracking-tight">
          Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-emerald to-white font-bold italic">Analytics.</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard glowColor={stat.color} className="p-6 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl bg-prism-${stat.color}/10 border border-prism-${stat.color}/30 flex items-center justify-center text-prism-${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                {/* Real-time sync badge instead of hardcoded trends */}
                <Badge variant={stat.color} className="h-6">Live</Badge>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-white tracking-tight">{stat.val}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlassCard className="p-8 h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Yield Performance</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 text-[10px] font-bold text-white/40 hover:text-white transition-all">30D</button>
                 <button className="px-3 py-1 text-[10px] font-bold text-white bg-white/10 rounded-lg">All Time</button>
              </div>
            </div>
            <EarningsChart />
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-8 h-full flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8">Recent Payouts</h3>
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {earnings.recentTransactions.length === 0 ? (
                <p className="text-white/30 text-xs italic text-center py-10">No recent transactions to display.</p>
              ) : (
                earnings.recentTransactions.map((tx, idx) => (
                  <div key={tx.id || idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-prism-emerald/10 text-prism-emerald flex items-center justify-center">
                        <ArrowUpRight size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">
                           {tx.patient_name || 'Consultation'}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 uppercase">
                           {tx.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-white group-hover:text-prism-emerald transition-colors">
                      Rs. {tx.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button className="mt-8 w-full h-14 rounded-2xl border border-white/10 text-white/40 text-xs font-bold flex items-center justify-center gap-2 hover:text-white transition-all pointer-events-none">
               Ledger Synchronized
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}