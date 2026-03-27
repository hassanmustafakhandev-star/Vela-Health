'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { 
  Users, Search, UserX, Eye, 
  Filter, Calendar, Heart, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { token } = useAuthStore();
  
  useEffect(() => {
    if (!token) return;
    
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (e) {
        console.error('Patient Registry Fetch Failed', e);
        toast.error('Failed to synchronize patient registry');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const deleteUser = async (uid, name) => {
    if (!confirm(`Permanently remove ${name} from the Vela network?`)) return;
    try {
       const res = await api.delete(`/admin/users/${uid}`);
       if (res.status === 200) {
        toast.success(`Identity ${name} purged from registry`);
        setUsers(prev => prev.filter(u => u.uid !== uid));
      } else {
        toast.error('Purge operation failed');
      }
    } catch {
      toast.error('Network Error: Operation Failed');
    }
  };

  const filtered = users.filter(u =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="text-2xl font-display font-medium text-white">Patient Registry</h3>
          <p className="text-white/20 text-xs font-black uppercase tracking-widest">Global identity vault — {users.length} entities</p>
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 h-10 w-72">
          <Search size={16} className="text-white/30 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Scan by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30 w-full"
          />
        </div>
      </div>

      <GlassCard className="overflow-hidden border-white/5 bg-white/[0.02]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Identity</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Blood Group</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">City</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Role</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u) => (
              <motion.tr
                key={u.uid}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="hover:bg-white/[0.03] transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-prism-cyan/10 border border-prism-cyan/20 flex items-center justify-center text-prism-cyan flex-shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{u.name || 'Anonymous Patient'}</p>
                      <p className="text-[11px] text-white/30 font-mono">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <Heart size={12} className="text-prism-rose" />
                    <span className="text-sm font-bold text-white/70">{u.blood_group || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm text-white/50">{u.city || '—'}</span>
                </td>
                <td className="px-8 py-5">
                  <Badge variant={u.role === 'doctor' ? 'rose' : 'cyan'}>
                    {u.role || 'patient'}
                  </Badge>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 rounded-xl bg-prism-cyan/10 border border-prism-cyan/20 text-prism-cyan flex items-center justify-center hover:bg-prism-cyan hover:text-white transition-all">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteUser(u.uid, u.name || u.email)}
                      className="w-9 h-9 rounded-xl bg-prism-rose/10 border border-prism-rose/20 text-prism-rose flex items-center justify-center hover:bg-prism-rose hover:text-white transition-all"
                    >
                      <UserX size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-white/20 text-sm font-medium italic">
              {search ? 'No entities match your search parameters.' : 'Patient registry is empty.'}
            </p>
          </div>
        )}
        {loading && (
          <div className="p-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-prism-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </GlassCard>
    </div>
  );
}
