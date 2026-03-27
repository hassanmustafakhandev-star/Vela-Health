'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    city: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-prism-surface/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-prism-cyan/50 to-transparent opacity-50" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-prism-cyan/10 border border-prism-cyan/20 flex items-center justify-center text-prism-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <User size={24} />
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Identity Setup</h2>
      </div>

      <p className="text-[15px] font-medium text-white/40 mb-10 leading-relaxed">
        Your medical soul needs a vessel. Configure your biometric identity to gain full access to the medical nexus.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Human Name</label>
            <Input 
              placeholder="E.g. Hassan Mustafa Khan" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Origin Date</label>
              <Input 
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Biological Sex</label>
              <select 
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-prism-cyan focus:bg-white/10 transition-all font-medium appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="" className="bg-prism-bg">Select...</option>
                <option value="male" className="bg-prism-bg">Male</option>
                <option value="female" className="bg-prism-bg">Female</option>
                <option value="other" className="bg-prism-bg">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Current Location</label>
            <Input 
              placeholder="E.g. Karachi, Pakistan" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="cyan" 
          className="w-full h-16 mt-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          disabled={loading}
        >
          {loading ? 'Initializing...' : 'Confirm Identity'} <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>
    </motion.div>
  );
}
