'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LogOut, Settings, CreditCard, Clock, ChevronRight, Edit2, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setProfile(res.data);
      setFormData({
         name: res.data.name || '',
         date_of_birth: res.data.date_of_birth || '',
         blood_group: res.data.blood_group || '',
         city: res.data.city || '',
         emergency_contact_name: res.data.emergency_contact_name || '',
      });
    } catch (err) {
      toast.error('Failed to sync Biometric Profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', formData);
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      toast.success('Biometric Identity Updated');
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setSaving(false);
    }
  };

  const userName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'Sovereign User';
  const userPhoto = profile?.photo_url || user?.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=06B6D4&color=fff`;
  const abbreviatedHash = user?.uid ? `${user.uid.slice(0, 6)}...${user.uid.slice(-4)}` : '0x000...0000';

  return (
    <div className="py-8 max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-sm font-black text-prism-cyan uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
             <ShieldCheck size={16} /> Identity Vault
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">Profile & Access</h1>
        </div>
        <button 
          onClick={async () => {
            await logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-prism-rose hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-prism-rose/10 px-4 py-2 rounded-lg border border-prism-rose/20"
        >
          <LogOut size={16} /> Terminate
        </button>
      </div>

      {loading ? (
        <div className="text-center text-white/40 py-10">Synchronizing Vault...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Core ID Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3 lg:col-span-2"
          >
            <GlassCard glowColor="cyan" className="p-8 relative overflow-hidden h-full flex flex-col justify-between group">
               <button 
                 onClick={() => setEditMode(true)}
                 className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-prism-cyan hover:border-prism-cyan/30 hover:bg-prism-cyan/10 transition-all opacity-0 group-hover:opacity-100"
               >
                 <Edit2 size={18} />
               </button>

               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-prism-cyan/10 blur-[100px] pointer-events-none" />
               
               <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
                 <div className="relative group/avatar">
                   <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-prism-cyan/50 p-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                     <img src={userPhoto} alt={userName} className="w-full h-full object-cover rounded-xl filter grayscale transition-all group-hover/avatar:grayscale-0" />
                   </div>
                   <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-prism-cyan flex items-center justify-center text-black shadow-lg border-2 border-prism-bg">
                     <ShieldCheck size={18} />
                   </div>
                 </div>

                 <div className="flex flex-col gap-2 flex-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sovereign Entity</p>
                   <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2 leading-tight">{userName}</h2>
                   <div className="flex flex-wrap gap-2 text-xs font-mono mt-1">
                      <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-white/50">{profile?.date_of_birth ? `DOB: ${profile.date_of_birth}` : 'DOB: UNKNOWN'}</span>
                      <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-white/50">{profile?.blood_group ? `BLOOD: ${profile.blood_group}` : 'BLOOD: UNKNOWN'}</span>
                   </div>
                 </div>
               </div>

               <div className="mt-12 bg-prism-bg/50 rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10 w-full">
                  <div className="w-full">
                    <p className="text-xs font-black uppercase tracking-widest text-prism-cyan mb-2">Node Status</p>
                    <p className="text-xl font-bold text-white flex items-center gap-3">
                      {profile?.role === 'patient' ? 'Pro verified' : profile?.role?.toUpperCase()} 
                      <span className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                    </p>
                  </div>
                  <div className="w-full pb-3 border-b border-white/10 sm:border-0 sm:pb-0 sm:border-l sm:pl-6">
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Hash ID</p>
                    <p className="text-sm font-mono text-white/60">{abbreviatedHash}</p>
                  </div>
               </div>
            </GlassCard>
          </motion.div>

          {/* Quick Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-1 flex flex-col gap-4"
          >
             <ActionLink icon={Settings} label="System Prefs" theme="cyan" />
             <ActionLink icon={CreditCard} label="Billing Node" theme="amber" />
             <ActionLink icon={Clock} label="Session Logs" theme="fuchsia" />
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
             <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-prism-surface border border-white/10 rounded-[32px] p-8 relative shadow-2xl"
             >
                <button onClick={() => setEditMode(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
                <h3 className="text-2xl font-display font-medium text-white mb-6">Modify Directives</h3>
                <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                   <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Display Name</label>
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Date of Birth</label>
                        <Input value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} placeholder="DD.MM.YYYY" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Blood Group</label>
                        <select 
                          value={formData.blood_group} 
                          onChange={e => setFormData({...formData, blood_group: e.target.value})}
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm outline-none focus:border-prism-cyan appearance-none"
                        >
                           <option className="bg-prism-bg" value="">Select</option>
                           <option className="bg-prism-bg" value="A+">A+</option>
                           <option className="bg-prism-bg" value="A-">A-</option>
                           <option className="bg-prism-bg" value="B+">B+</option>
                           <option className="bg-prism-bg" value="B-">B-</option>
                           <option className="bg-prism-bg" value="O+">O+</option>
                           <option className="bg-prism-bg" value="O-">O-</option>
                           <option className="bg-prism-bg" value="AB+">AB+</option>
                           <option className="bg-prism-bg" value="AB-">AB-</option>
                        </select>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">City</label>
                        <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Location" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Emergency Contact</label>
                        <Input value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} placeholder="Name" />
                      </div>
                   </div>
                   <Button type="submit" variant="cyan" className="h-14 mt-4" disabled={saving}>
                     {saving ? 'Synchronizing...' : 'Commit Changes'}
                   </Button>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionLink({ icon: Icon, label, theme }) {
  const colors = {
    cyan: 'text-prism-cyan group-hover:bg-prism-cyan',
    amber: 'text-prism-amber group-hover:bg-prism-amber',
    fuchsia: 'text-prism-fuchsia group-hover:bg-prism-fuchsia',
  };

  return (
    <GlassCard glowColor={theme} className="p-6 cursor-pointer group flex items-center justify-between hover:bg-white/[0.05]">
       <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:text-white ${colors[theme]}`}>
           <Icon size={18} />
         </div>
         <span className="font-bold text-white/80 group-hover:text-white transition-colors">{label}</span>
       </div>
       <ChevronRight size={18} className="text-white/30 group-hover:text-white transition-colors" />
    </GlassCard>
  );
}
