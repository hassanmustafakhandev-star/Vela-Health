'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import {
  User, Mail, Phone, Hash, Lock, 
  GraduationCap, Briefcase, MapPin, 
  Clock, ArrowRight, Upload, ChevronLeft
} from 'lucide-react';

import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';
const specialtiesList = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic'];

export default function DoctorRegister() {
  const router = useRouter();
  const { signUpWithEmail } = useAuthStore();
  
  const [step, setStep] = useState('credentials'); // credentials -> profile -> practice -> finish
  const [loading, setLoading] = useState(false);

  // Unified Form State — ZERO network requested until 'finish'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pmdcNumber: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience_years: '',
    city: '',
    bio: '',
    consultation_fee_video: '',
    consultation_fee_clinic: '',
    session_duration: 30,
  });

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  // Network Submission ONLY happens here
  const handleFinalSubmit = async () => {
    setLoading(true);
    let userIdentityCreated = false;

    try {
      // 1. Create Auth Identity (which triggers backend to create basic user doc)
      await signUpWithEmail(formData.email, formData.password, formData.name);
      userIdentityCreated = true;

      const token = await auth.currentUser.getIdToken();

      // 2. Submit Doctor Profile to backend
      const payload = {
        name: formData.name,
        pmdc_number: String(formData.pmdcNumber),
        specialties: formData.specialty ? [formData.specialty] : ['General Physician'],
        qualification: formData.qualification || 'MBBS',
        experience_years: parseInt(formData.experience_years) || 0,
        city: formData.city || 'Karachi',
        consultation_fee_video: parseInt(formData.consultation_fee_video) || 2000,
        consultation_fee_clinic: parseInt(formData.consultation_fee_clinic) || null,
        bio: formData.bio || '',
        session_duration: formData.session_duration,
        degree_url: 'pending_upload',
        pmdc_card_url: 'pending_upload',
      };

      const res = await fetch(`${API_URL}/auth/doctor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        let errorMessage = 'Registration failed';
        if (Array.isArray(err.detail)) {
          errorMessage = err.detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
        } else if (err.detail) {
          errorMessage = err.detail;
        }
        throw new Error(errorMessage);
      }

      toast.success('Clinical Profile submitted — pending admin verification ✓');
      
      // Force token refresh to fetch the `vela_role: pending_doctor` custom claim immediately
      await auth.currentUser.getIdToken(true);
      
      // Redirect to dashboard (which will show the Pending terminal screen)
      window.location.href = '/doctor/dashboard';

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please log in.');
        router.push('/login');
      } else {
        toast.error(error.message || 'Setup failed');
        // Critical: If the doctor profile failed (e.g. duplicate PMDC), 
        // they are stuck as a "patient" because Auth succeeded but Doc init failed.
        // We delete their auth to rollback if they failed step 2 instantly.
        if (userIdentityCreated && auth.currentUser) {
           await auth.currentUser.delete().catch(() => {});
           toast.error('Identity rolled back. Please try again with valid data.');
        }
      }
      setLoading(false);
    }
  };

  const renderCredentials = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
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
          {specialtiesList.map(spec => (
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

      <Button
        variant="rose"
        className="w-full h-16 mt-4 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        onClick={() => {
          if (!formData.name || !formData.email || !formData.password || !formData.pmdcNumber) {
            toast.error('Please fill all required credentials');
            return;
          }
          if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
          }
          setStep('profile');
        }}
      >
        Next: Clinical Profile <ArrowRight size={18} className="ml-2" />
      </Button>
      
      <p className="text-center mt-4 text-white/30 text-sm font-medium">
        Already registered? <Link href="/login" className="text-prism-rose hover:underline">Log in to Nexus</Link>
      </p>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Qualification</label>
          <Input placeholder="MBBS, FCPS, MD…" icon={GraduationCap} value={formData.qualification} onChange={handleChange('qualification')} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Experience (Years)</label>
          <Input type="number" placeholder="10" icon={Briefcase} value={formData.experience_years} onChange={handleChange('experience_years')} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">City</label>
        <Input placeholder="Karachi, Lahore…" icon={MapPin} value={formData.city} onChange={handleChange('city')} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Bio / Professional Summary</label>
        <textarea
          placeholder="e.g. Senior Consultant with 15+ years in…"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-prism-rose transition-all resize-none placeholder:text-white/20"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="ghost" className="h-14 w-14 p-0 shrink-0 border-white/10 text-white" onClick={() => setStep('credentials')}>
          <ChevronLeft size={18} />
        </Button>
        <Button variant="rose" className="h-14 w-full" onClick={() => setStep('practice')}>
          Next: Practice Settings <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderPractice = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <h4 className="text-sm font-bold text-white mb-6">Consultation Fees (Rs.)</h4>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-prism-cyan/10 text-prism-cyan flex items-center justify-center"><Clock size={20} /></div>
              <span className="text-sm font-bold text-white">Video Consultation</span>
            </div>
            <div className="w-36">
              <Input placeholder="2000" type="number" value={formData.consultation_fee_video} onChange={handleChange('consultation_fee_video')} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-prism-rose/10 text-prism-rose flex items-center justify-center"><Briefcase size={20} /></div>
              <span className="text-sm font-bold text-white">Clinic Visit</span>
            </div>
            <div className="w-36">
              <Input placeholder="3000" type="number" value={formData.consultation_fee_clinic} onChange={handleChange('consultation_fee_clinic')} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Session Duration (mins)</label>
        <select
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm outline-none focus:border-prism-rose appearance-none"
          value={formData.session_duration}
          onChange={(e) => setFormData(prev => ({ ...prev, session_duration: parseInt(e.target.value) }))}
        >
          {[15, 20, 30, 45, 60].map(m => (
            <option key={m} className="bg-prism-bg" value={m}>{m} Minutes</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="ghost" className="h-14 w-14 p-0 shrink-0 border-white/10 text-white" onClick={() => setStep('profile')}>
          <ChevronLeft size={18} />
        </Button>
        <Button variant="rose" className="h-14 w-full cursor-pointer" onClick={() => setStep('finish')}>
          Review &amp; Finalize <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderFinish = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 items-center text-center py-4">
      <div className="w-20 h-20 rounded-[24px] bg-prism-rose/10 border border-prism-rose/30 flex items-center justify-center text-prism-rose">
        <Upload size={36} />
      </div>
      <div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Launch</h3>
        <p className="text-white/40 text-sm max-w-sm">
          Your profile will be submitted for admin verification. You can log in anytime — your dashboard will activate once approved.
        </p>
      </div>

      <div className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
        <Row label="Name" value={formData.name || 'Not set'} />
        <Row label="PMDC" value={formData.pmdcNumber || 'Not set'} />
        <Row label="Specialty" value={(formData.specialty || 'General')} />
        <Row label="City" value={formData.city || 'Not set'} />
        <Row label="Video Fee" value={`Rs. ${formData.consultation_fee_video || 2000}`} />
      </div>

      <div className="flex gap-4 mt-4 w-full">
        <Button variant="ghost" className="h-16 w-16 p-0 shrink-0 border-white/10 text-white" onClick={() => setStep('practice')} disabled={loading}>
          <ChevronLeft size={18} />
        </Button>
        <Button
          variant="rose"
          className="w-full h-16 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          onClick={handleFinalSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting to Registry…' : 'Complete Global Launch'} <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const stepMap = { credentials: 0, profile: 1, practice: 2, finish: 3 };
  const steps = ['Init', 'Profile', 'Practice', 'Launch'];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Professional Registry</h2>
        <div className="flex items-center gap-2">
          <Badge variant="rose" className="px-3">Step {stepMap[step]+1}/4</Badge>
          <p className="text-white/40 font-medium text-sm">Configure your clinical presence.</p>
        </div>
        <div className="flex gap-2 mt-4 relative">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1 items-center relative">
               <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${i <= stepMap[step] ? 'bg-prism-rose shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-white/10'}`} />
               <span className={`text-[9px] font-black uppercase tracking-widest mt-1 transition-colors ${i <= stepMap[step] ? 'text-prism-rose' : 'text-white/20'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="p-8 md:p-10 border-white/5 bg-white/[0.03] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'credentials' && renderCredentials()}
          {step === 'profile' && renderProfile()}
          {step === 'practice' && renderPractice()}
          {step === 'finish' && renderFinish()}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs font-black uppercase tracking-widest text-white/30">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}