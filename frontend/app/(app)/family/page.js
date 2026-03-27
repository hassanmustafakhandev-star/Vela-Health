'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Heart, Activity, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const statusConfig = {
  'Healthy': { color: 'text-prism-emerald', bg: 'bg-prism-emerald/10 border-prism-emerald/20', dot: 'bg-prism-emerald' },
  'Mild Fever': { color: 'text-prism-amber', bg: 'bg-prism-amber/10 border-prism-amber/20', dot: 'bg-prism-amber' },
  'Monitored': { color: 'text-prism-fuchsia', bg: 'bg-prism-fuchsia/10 border-prism-fuchsia/20', dot: 'bg-prism-fuchsia' },
};

export default function FamilyPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', relation: '', age: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const res = await api.get('/family/');
      setMembers(res.data);
    } catch (err) {
      toast.error('Failed to sync family network');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = {
        name: formData.name,
        relation: formData.relation,
        age: parseInt(formData.age) || 0,
      };
      const res = await api.post('/family/', payload);
      setMembers([res.data, ...members]);
      toast.success('Family Node Initialized');
      setShowModal(false);
      setFormData({ name: '', relation: '', age: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const removeMember = async (id) => {
    if(!confirm("Are you sure you want to disconnect this node?")) return;
    try {
      await api.delete(`/family/${id}`);
      setMembers(members.filter(m => m.id !== id));
      toast.success('Node disconnected successfully');
    } catch (err) {
      toast.error('Failed to remove node');
    }
  };

  return (
    <div className="py-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prism-amber/20 border border-prism-amber/40 flex items-center justify-center text-prism-amber shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Users size={20} />
            </div>
            Family Network
          </h2>
          <p className="text-sm font-medium text-white/40 mt-2">Unified command center for your health nodes.</p>
        </div>
        <Button variant="amber" className="h-[46px] px-6 text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)]" onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" /> Add Member
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-white/40 py-10">Synchronizing network...</div>
      ) : (
        <>
          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Active Nodes', value: members.length, color: 'cyan' },
              { label: 'Total Records', value: members.reduce((acc, m) => acc + (m.records_count||0), 0), color: 'amber' },
              { label: 'Alerts', value: members.filter(m => m.status !== 'Healthy').length, color: 'rose' },
            ].map((stat) => (
              <GlassCard key={stat.label} glowColor={stat.color} hover={false} className="p-5 text-center">
                <p className={`text-3xl font-mono font-bold text-prism-${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => {
              const statusStr = member.status || 'Healthy';
              const config = statusConfig[statusStr] || statusConfig['Healthy'];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard glowColor="amber" className="p-6 group flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-prism-amber/20 bg-prism-amber/10 flex items-center justify-center text-prism-amber font-display font-medium text-xl shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg leading-tight">{member.name}</p>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40">{member.relation} · Age {member.age}</p>
                          </div>
                        </div>
                        <button onClick={() => removeMember(member.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-prism-rose hover:border-prism-rose/50 hover:bg-prism-rose/10 transition-colors">
                          <X size={14} />
                        </button>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mb-6 ${config.bg} ${config.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
                        {statusStr}
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-white/5 pt-4">
                      <div className="text-center">
                        <p className="font-mono text-sm font-bold text-white">{member.heart_rate || '--'}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1 flex items-center gap-1"><Heart size={10} className="text-prism-rose" /> Pulse</p>
                      </div>
                      <div className="text-center">
                        <p className="font-mono text-sm font-bold text-white">{member.records_count || 0}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1 flex items-center gap-1"><Activity size={10} className="text-prism-emerald" /> Records</p>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-prism-amber hover:gap-2 transition-all">
                        View <ChevronRight size={12} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}

            {/* Add Member Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlassCard 
               hover={false} 
               onClick={() => setShowModal(true)}
               className="p-6 group flex flex-col items-center justify-center text-center gap-4 cursor-pointer border-dashed border-white/10 hover:border-prism-amber/40 hover:bg-prism-amber/5 transition-all h-full min-h-[200px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-prism-amber/10 border border-dashed border-prism-amber/30 flex items-center justify-center text-prism-amber group-hover:bg-prism-amber group-hover:text-black group-hover:border-prism-amber transition-all">
                  <Plus size={24} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-white/30 group-hover:text-prism-amber transition-colors">Add Family Node</p>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-prism-surface border border-white/10 rounded-[32px] p-8 relative shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                 <X size={20} />
              </button>
              <h3 className="text-2xl font-display font-medium text-white mb-6">Initialize Node</h3>
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-amber ml-2">Full Name</label>
                   <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ibrahim Khan" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-amber ml-2">Relation</label>
                       <Input value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} placeholder="Son, Wife..." required />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-amber ml-2">Age</label>
                       <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="8" required />
                    </div>
                 </div>
                 <Button type="submit" variant="amber" className="h-14 mt-4" disabled={adding}>
                   {adding ? 'Initializing...' : 'Connect Identity'}
                 </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
