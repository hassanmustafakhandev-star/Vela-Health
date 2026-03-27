'use client';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  User, Award, ShieldCheck, Mail, 
  MapPin, Phone, Edit3, Globe,
  Briefcase, GraduationCap, Link as LinkIcon, AlertCircle, Save, X
} from 'lucide-react';
import { useDoctorAuthContext } from '@/context/DoctorAuthContext';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import doctorApi from '@/lib/doctorApi';

export default function DoctorProfile() {
  const { doctorProfile } = useDoctorAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: doctorProfile?.bio || '',
    city: doctorProfile?.city || '',
    phone: doctorProfile?.phone || '',
    fee: doctorProfile?.fee || 1500,
  });

  const achievements = [
    { label: 'Rank', val: 'Gold Specialist', icon: Award, color: 'fuchsia' },
    { label: 'Status', val: doctorProfile?.status === 'verified' ? 'Verified' : 'Pending', icon: ShieldCheck, color: doctorProfile?.status === 'verified' ? 'emerald' : 'amber' },
    { label: 'Trust Score', val: '98%', icon: Globe, color: 'cyan' },
  ];

  const handleSave = async () => {
    setSaving(true);
    const tid = toast.loading('Updating clinical profile...');
    try {
      await doctorApi.updateProfile(formData);
      toast.success('Profile updated successfully.', { id: tid });
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile.', { id: tid });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h2 className="text-sm font-black text-prism-cyan uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-prism-cyan shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse" />
             Professional Identity
          </h2>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white font-bold italic">Nexus.</span>
          </h1>
        </div>
        {!isEditing ? (
          <Button variant="cyan" className="h-12 px-6" onClick={() => setIsEditing(true)}>
             <Edit3 size={16} className="mr-2" /> Edit Portfolio
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6" onClick={() => setIsEditing(false)}>
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button variant="cyan" className="h-12 px-6" loading={saving} onClick={handleSave}>
               <Save size={16} className="mr-2" /> Save Changes
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Identity Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <GlassCard className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-prism-cyan/5 blur-3xl pointer-events-none" />
              <img 
                src={doctorProfile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorProfile?.name || 'Dr')}&background=0d1117&color=fff&size=120`}
                className="w-24 h-24 rounded-3xl mx-auto mb-6 border-2 border-white/10 object-cover" 
                alt="Profile"
              />
              <h3 className="text-2xl font-display font-bold text-white mb-2">Dr. {doctorProfile?.name || 'Practitioner'}</h3>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-prism-cyan mb-8">
                {doctorProfile?.specialties?.[0] || 'General Physician'}
              </p>

              <div className="flex flex-col gap-4 text-left">
                 <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <Mail size={14} className="text-white/20" />
                    <span className="text-xs text-white/60 font-medium truncate">{doctorProfile?.email || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <Phone size={14} className="text-white/20" />
                    {isEditing ? (
                       <input 
                         className="bg-transparent text-xs text-white font-medium outline-none w-full"
                         value={formData.phone}
                         onChange={e => setFormData({ ...formData, phone: e.target.value })}
                         placeholder="+92 300 1234567"
                       />
                    ) : (
                       <span className="text-xs text-white/60 font-medium">{doctorProfile?.phone || 'No phone set'}</span>
                    )}
                 </div>
                 <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <MapPin size={14} className="text-white/20" />
                    {isEditing ? (
                       <input 
                         className="bg-transparent text-xs text-white font-medium outline-none w-full"
                         value={formData.city}
                         onChange={e => setFormData({ ...formData, city: e.target.value })}
                         placeholder="Karachi, Pakistan"
                       />
                    ) : (
                       <span className="text-xs text-white/60 font-medium">{doctorProfile?.city || 'No city set'}</span>
                    )}
                 </div>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 gap-4">
              {achievements.map((a, i) => (
                <GlassCard key={a.label} glowColor={a.color} className="p-5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-prism-${a.color}/10 text-prism-${a.color} flex items-center justify-center`}>
                         <a.icon size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">{a.label}</span>
                         <span className="text-sm font-bold text-white">{a.val}</span>
                      </div>
                   </div>
                   <Badge variant={a.color} className="h-5">Live</Badge>
                </GlassCard>
              ))}
           </div>
        </div>

        {/* Right: Credentials & Bio (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <GlassCard className="p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                 <Briefcase size={14} className="text-prism-cyan" /> Clinical Biography
              </h4>
              {isEditing ? (
                 <textarea 
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[13px] text-white outline-none focus:border-prism-cyan transition-all min-h-[120px] resize-none"
                   value={formData.bio}
                   onChange={e => setFormData({ ...formData, bio: e.target.value })}
                   placeholder="Enter your clinical biography..."
                 />
              ) : (
                 <p className="text-[15px] text-white/40 leading-relaxed font-medium italic mb-2">
                   "{doctorProfile?.bio || 'Dedicated medical professional with expertise in telemedicine and preventive care.'}"
                 </p>
              )}
              
              {isEditing && (
                 <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                     <Banknote size={14} className="text-prism-emerald" /> Consultation Fee (PKR)
                   </h4>
                   <Input 
                     type="number"
                     min="100"
                     max="10000"
                     value={formData.fee}
                     onChange={e => setFormData({ ...formData, fee: parseInt(e.target.value) || 0 })}
                     className="bg-white/5 border-white/10"
                   />
                 </div>
              )}
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-8 flex items-center gap-2">
                    <GraduationCap size={16} className="text-prism-fuchsia" /> Academic Tenure
                 </h4>
                 <div className="space-y-8">
                    <div className="relative pl-6 border-l border-white/10">
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-prism-fuchsia shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                       <h5 className="text-sm font-bold text-white mb-1">Bachelor of Medicine (MBBS)</h5>
                       <p className="text-[11px] text-white/30 font-bold uppercase">Medical University • Verified</p>
                    </div>
                 </div>
              </GlassCard>

              <GlassCard className="p-8 border-prism-emerald/20">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-8 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-prism-emerald" /> PMDC Validations
                 </h4>
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-prism-emerald/10 flex items-center justify-center text-prism-emerald mb-4">
                       <ShieldCheck size={32} />
                    </div>
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Registry ID</p>
                    <p className="text-xl font-mono font-bold text-prism-emerald">{doctorProfile?.pmdc_number || 'N/A'}</p>
                    <div className="mt-4 flex flex-col gap-2 w-full">
                       <button className="w-full py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-400 pointer-events-none flex items-center justify-center gap-2">
                          <LinkIcon size={12} /> Board Verified
                       </button>
                    </div>
                 </div>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
}