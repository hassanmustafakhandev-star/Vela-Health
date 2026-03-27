'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { Stethoscope, ArrowRight, User, Mail, Phone, Lock, Hash } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

const specialties = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic'];

export default function DoctorRegister() {
  const router = useRouter();
  const { signUpWithEmail } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pmdcNumber: '',
    phone: '',
    specialty: '',
  });

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialty) {
      toast.error('Please select a specialty');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Create a real Firebase account via the main store
      await signUpWithEmail(formData.email, formData.password, formData.name);
      toast.success('Identity created — now complete your clinical profile');
      navigateToSetup(formData.pmdcNumber, formData.specialty, formData.name);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.loading('Existing Identity Located — Fetching clinical status...');
        try {
          // Attempt to sign in to see if they can continue setup
          await useAuthStore.getState().signInWithEmail(formData.email, formData.password);
          const currentRole = useAuthStore.getState().role;
          
          if (currentRole === 'doctor') {
            toast.error('This account is already a verified provider. Please use the dashboard.');
            router.push('/doctor/dashboard');
          } else {
            toast.success('Resuming identity setup...');
            navigateToSetup(formData.pmdcNumber, formData.specialty, formData.name);
          }
        } catch (signInErr) {
          toast.error('This email is already registered. Please log in with your password to continue setup.');
          setLoading(false);
        }
      } else {
        toast.error(error.message || 'Registration failed');
        setLoading(false);
      }
    }
  };

  const navigateToSetup = (pmdc, specialty, name) => {
    const params = new URLSearchParams({ pmdc, specialty, name });
    router.push(`/doctor/setup?${params.toString()}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Professional Registry</h2>
        <div className="flex items-center gap-2">
          <Badge variant="rose" className="px-3">Step 1/2</Badge>
          <p className="text-white/40 font-medium text-sm">Initialize your medical signature.</p>
        </div>
      </div>

      <GlassCard className="p-8 md:p-10 border-white/5 bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Full Name</label>
              <Input placeholder="Dr. Hassan Mustafa" icon={User} value={formData.name} onChange={handleChange('name')} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Email Address</label>
              <Input type="email" placeholder="doctor@vela.com" icon={Mail} value={formData.email} onChange={handleChange('email')} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">PMDC Reg Number</label>
              <Input placeholder="12345" icon={Hash} value={formData.pmdcNumber} onChange={handleChange('pmdcNumber')} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Phone Number</label>
              <Input placeholder="+92 3XX XXXXXXX" icon={Phone} value={formData.phone} onChange={handleChange('phone')} required />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Primary Specialty</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, specialty: spec }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.specialty === spec ? 'bg-prism-rose text-white border-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Access Credentials</label>
            <Input type="password" placeholder="Min. 6 characters" icon={Lock} value={formData.password} onChange={handleChange('password')} required />
          </div>

          <Button type="submit" variant="rose" className="w-full h-16 mt-4 shadow-[0_0_20px_rgba(244,63,94,0.3)]" disabled={loading}>
            {loading ? 'Creating Identity...' : 'Initialize Credentials'} <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
      </GlassCard>

      <p className="text-center mt-8 text-white/30 text-sm font-medium">
        Already registered? <Link href="/login" className="text-prism-rose hover:underline">Log in to Nexus</Link>
      </p>
    </motion.div>
  );
}