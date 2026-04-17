'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, UserPlus, Loader2, ChevronRight, Activity, Heart, User } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PatientRegistry() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctor/patients/');
        setPatients(res.data || []);
      } catch (err) {
        toast.error("Cloud synchronization failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = (patients || []).filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-cyan uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
             Neural Patient Archive
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Vanguard <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white font-bold italic">Registry.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <GlassCard className="px-6 py-3 border-white/5 bg-white/5 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Linked Identity Nodes</span>
              <span className="text-2xl font-mono font-bold text-white">{loading ? '...' : patients.length}</span>
           </GlassCard>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="w-full md:w-96">
           <Input 
            placeholder="Search identity by name or ID..." 
            icon={Search}
            className="h-14 bg-white/5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold flex items-center justify-center gap-2 hover:text-white transition-all">
             <Filter size={18} /> Type
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
           <Loader2 className="animate-spin text-prism-cyan" size={32} />
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.map(p => (
            <motion.div key={p.id} whileHover={{ y: -5 }}>
              <GlassCard 
                glowColor="cyan" 
                className="p-6 cursor-pointer group"
                onClick={() => router.push(`/doctor/patients/${p.id}`)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-0.5">
                    <img 
                      src={p.photo_url || `https://i.pravatar.cc/100?u=${p.id}`} 
                      className="w-full h-full object-cover rounded-[14px] contrast-125 saturate-150"
                    />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">System ID</span>
                    <span className="text-[10px] font-mono text-white/60">{p.id.substring(0, 8)}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-bold text-white mb-0.5">{p.name || 'Anonymous Patient'}</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-white/30">{p.age}y · {p.gender}</p>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-4">
                  <div className="text-center">
                    <p className="font-mono text-xs font-bold text-white">--</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1 flex items-center gap-1"><Heart size={10} className="text-prism-rose" /> Pulse</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs font-bold text-white">0</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1 flex items-center gap-1"><Activity size={10} className="text-prism-emerald" /> EMR Docs</p>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-prism-cyan group-hover:gap-2 transition-all">
                    View <ChevronRight size={12} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full p-20 text-center rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.02]">
                <p className="text-white/20 italic">No biographical matches discovered in this sector.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
