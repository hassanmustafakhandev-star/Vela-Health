'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { 
  Users, CheckCircle, XCircle, Clock, 
  Search, FileText, Filter, MoreHorizontal 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);

  const { token } = useAuthStore();
  
  useEffect(() => {
    if (!token) return;
    
    const fetchAllDoctors = async () => {
      try {
        const [doctorsRes, diagnosticsRes] = await Promise.all([
          api.get('/admin/doctors/all'),
          api.get('/admin/diagnostics'),
        ]);
        setDoctors(doctorsRes.data);
        setDiagnostics(diagnosticsRes.data);
      } catch (e) {
        console.error("Registry Sync Failure", e);
        toast.error("Failed to synchronize provider registry");
      } finally {
        setLoading(false);
      }
    };
    fetchAllDoctors();
  }, [token]);

  const purgeDoctors = async () => {
    if (!window.confirm('Delete ALL doctor accounts from this API environment? This cannot be undone.')) {
      return;
    }
    setPurging(true);
    try {
      const res = await api.delete('/admin/doctors/purge');
      toast.success(`Purged ${res.data?.targeted_uids ?? 0} doctor account(s)`);
      const [doctorsRes, diagnosticsRes] = await Promise.all([
        api.get('/admin/doctors/all'),
        api.get('/admin/diagnostics'),
      ]);
      setDoctors(doctorsRes.data);
      setDiagnostics(diagnosticsRes.data);
    } catch (e) {
      toast.error('Failed to purge doctors');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div className="flex flex-col gap-1">
             <h3 className="text-2xl font-display font-medium text-white">Full Provider Fleet</h3>
             <p className="text-white/20 text-xs font-black uppercase tracking-widest">Global registry of all medical entities</p>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
               API Project: {diagnostics?.firebase_project_id || '...'}
             </span>
             <Button
               variant="rose"
               onClick={purgeDoctors}
               disabled={purging || loading}
               className="h-10 text-xs px-4"
             >
               {purging ? 'Purging...' : 'Delete All Doctors'}
             </Button>
             <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 h-10 w-64">
               <Search size={16} className="text-white/30 mr-3" />
               <input type="text" placeholder="Search providers..." className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30 w-full" />
             </div>
             <Button variant="cyan" className="h-10 w-10 p-0 flex items-center justify-center bg-white/5 border-white/10 text-white"><Filter size={16} /></Button>
           </div>
        </div>

        <GlassCard className="overflow-hidden border-white/5 bg-white/[0.02]">
           <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Doctor Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Credentials</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
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
                            <p className="text-[11px] text-white/30">{dr.specialty || dr.specialties?.join(', ')}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                         <span className="text-[11px] font-mono text-white/50">{dr.pmdc || dr.pmdc_number}</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1">
                           <FileText size={10} /> Profile Indexed
                         </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {dr.status === 'verified' ? (
                         <Badge variant="emerald">Live & Active</Badge>
                       ) : dr.status === 'suspended' ? (
                         <Badge variant="rose">Suspended</Badge>
                       ) : (
                         <Badge variant="amber">Pending</Badge>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center ml-auto transition-colors">
                          <MoreHorizontal size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
           {doctors.length === 0 && !loading && (
             <div className="p-20 text-center">
                <p className="text-white/20 text-sm font-medium italic">No providers located in the global registry.</p>
             </div>
           )}
           {loading && (
             <div className="p-20 text-center flex justify-center">
                <div className="w-6 h-6 border-2 border-prism-cyan border-t-transparent rounded-full animate-spin" />
             </div>
           )}
        </GlassCard>
      </section>
    </div>
  );
}
