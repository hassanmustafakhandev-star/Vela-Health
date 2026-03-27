'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  Users, CheckCircle, XCircle, Clock, 
  ExternalLink, FileText, Filter, MoreHorizontal 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useAuthStore();
  
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [statsRes, pendingRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/auth/doctors/pending'),
        ]);
        
        setStats(statsRes.data);
        setDoctors(pendingRes.data);
      } catch (e) {
        console.error("Registry Sync Failure", e);
        toast.error("Failed to sync with Medical Registry");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const verifyDoctor = async (uid, status) => {
    try {
      const res = await api.put(`/auth/doctor/verify/${uid}`, { status });

      if (res.status === 200) {
        toast.success(`Entity ${uid} status updated to ${status}`);
        setDoctors(prev => prev.filter(d => d.uid !== uid));
      } else {
        toast.error('Failed to override entity status');
      }
    } catch (error) {
       toast.error('Network Error: Sync Failed');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Patients" value={stats?.total_patients ?? '—'} icon={Users} color="cyan" />
        <StatCard label="Pending Approval" value={stats?.pending_doctors ?? doctors.length} icon={Clock} color="rose" />
        <StatCard label="Active Providers" value={stats?.active_doctors ?? '—'} icon={CheckCircle} color="emerald" />
        <StatCard label="Today's Appointments" value={stats?.todays_appointments ?? '—'} icon={Filter} color="amber" />
      </div>

      {/* Main Verification Queue */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <div className="flex flex-col gap-1">
             <h3 className="text-2xl font-display font-medium text-white">Verification Queue</h3>
             <p className="text-white/20 text-xs font-black uppercase tracking-widest">High Priority Registry Entities</p>
           </div>
           <div className="flex gap-3">
             <Button variant="cyan" className="h-10 text-xs px-6 bg-white/5 border-white/10 hover:bg-white/10 text-white/60">Export Registry</Button>
           </div>
        </div>

        <GlassCard className="overflow-hidden border-white/5 bg-white/[0.02]">
           <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Doctor Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Credentials</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {doctors.map((dr) => (
                  <tr key={dr.uid} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                             <Users size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{dr.name}</p>
                            <p className="text-[11px] text-white/30">{dr.specialty}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                         <span className="text-[11px] font-mono text-white/50">{dr.pmdc || dr.pmdc_number}</span>
                         <div className="flex gap-3">
                           {dr.degree_url && (
                             <a href={dr.degree_url} target="_blank" className="text-[9px] font-black uppercase tracking-widest text-prism-cyan flex items-center gap-1 hover:text-white transition-colors">
                               <FileText size={10} /> Degree Vault
                             </a>
                           )}
                           {dr.pmdc_card_url && (
                             <a href={dr.pmdc_card_url} target="_blank" className="text-[9px] font-black uppercase tracking-widest text-prism-rose flex items-center gap-1 hover:text-white transition-colors">
                               <ExternalLink size={10} /> PMDC Card
                             </a>
                           )}
                           {!dr.degree_url && !dr.pmdc_card_url && (
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/10 flex items-center gap-1 text-nowrap">
                               <XCircle size={10} /> No Files Linked
                             </span>
                           )}
                         </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <Badge variant="rose">Pending Verification</Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => verifyDoctor(dr.uid, 'verified')}
                            className="w-10 h-10 rounded-xl bg-prism-emerald/10 border border-prism-emerald/20 text-prism-emerald flex items-center justify-center hover:bg-prism-emerald hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          >
                             <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => verifyDoctor(dr.uid, 'rejected')}
                            className="w-10 h-10 rounded-xl bg-prism-rose/10 border border-prism-rose/20 text-prism-rose flex items-center justify-center hover:bg-prism-rose hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                          >
                             <XCircle size={18} />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center">
                             <MoreHorizontal size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
           {doctors.length === 0 && (
             <div className="p-20 text-center">
                <p className="text-white/20 text-sm font-medium italic">Internal Registry Clear. No pending entities located.</p>
             </div>
           )}
        </GlassCard>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    cyan: 'text-prism-cyan bg-prism-cyan/10 border-prism-cyan/20',
    rose: 'text-prism-rose bg-prism-rose/10 border-prism-rose/20',
    emerald: 'text-prism-emerald bg-prism-emerald/10 border-prism-emerald/20',
    amber: 'text-prism-amber bg-prism-amber/10 border-prism-amber/20',
  };

  return (
    <GlassCard className="p-6 border-white/5 bg-white/[0.03]">
       <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
             <Icon size={20} />
          </div>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-3xl font-display font-medium text-white">{value}</p>
    </GlassCard>
  );
}
