'use client';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { ShieldAlert, Activity, Key, Globe, Lock } from 'lucide-react';

export default function SecurityLogs() {
  const mockLogs = [
    { id: 1, type: 'AUTH', action: 'Failed Admin Login', detail: 'Invalid credentials from IP 192.168.1.45', time: '2 mins ago', severity: 'high' },
    { id: 2, type: 'SYSTEM', action: 'Provider Verification', detail: 'Admin granted clearance to uid:dr-j7xx0', time: '14 mins ago', severity: 'low' },
    { id: 3, type: 'NETWORK', action: 'DDoS Mitigation', detail: 'Cloudflare blocked volumetric attack on /api/ai/symptoms', time: '1 hour ago', severity: 'medium' },
    { id: 4, type: 'DATA', action: 'Vault Sync Complete', detail: 'Encrypted patient records backed up to remote secure server', time: '3 hours ago', severity: 'low' },
    { id: 5, type: 'AUTH', action: 'Oversight Protocol', detail: 'Admin access granted to System Administrator', time: '5 hours ago', severity: 'low' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'AUTH': return <Key size={18} />;
      case 'SYSTEM': return <Activity size={18} />;
      case 'NETWORK': return <Globe size={18} />;
      case 'DATA': return <Lock size={18} />;
      default: return <ShieldAlert size={18} />;
    }
  };

  const getColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-prism-rose bg-prism-rose/10 border-prism-rose/20';
      case 'medium': return 'text-prism-amber bg-prism-amber/10 border-prism-amber/20';
      case 'low': return 'text-prism-cyan bg-prism-cyan/10 border-prism-cyan/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1 mb-2">
         <h3 className="text-2xl font-display font-medium text-white flex items-center gap-3">
            <ShieldAlert className="text-prism-rose" /> Global Security Logs
         </h3>
         <p className="text-white/20 text-xs font-black uppercase tracking-widest">Immune system telemetry & oversight</p>
      </div>

      <GlassCard className="overflow-hidden border-white/5 bg-white/[0.02] p-8">
        <div className="flex flex-col gap-6">
          {mockLogs.map((log, index) => (
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={log.id} 
                className="flex items-start md:items-center justify-between gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
             >
                <div className="flex items-center gap-5 flex-1">
                   <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${getColor(log.severity)}`}>
                      {getIcon(log.type)}
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-white">{log.action}</span>
                         {log.severity === 'high' && <Badge variant="rose" className="h-5 px-2 text-[9px] uppercase">Critical</Badge>}
                      </div>
                      <p className="text-[11px] text-white/40">{log.detail}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-1"><Clock size={10} /> {log.time}</span>
                   <span className="text-[9px] font-mono text-white/10">{log.type}_EVENT</span>
                </div>
             </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
