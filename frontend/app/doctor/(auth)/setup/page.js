'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Clock, Briefcase, GraduationCap, MapPin, Upload, DollarSign } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DoctorSetupInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();

  const prefillName = searchParams.get('name') || '';
  const prefillPmdc = searchParams.get('pmdc') || '';
  const prefillSpecialty = searchParams.get('specialty') || '';

  const [step, setStep] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: prefillName,
    qualification: '',
    experience_years: '',
    city: '',
    bio: '',
    pmdc_number: prefillPmdc,
    specialties: prefillSpecialty ? [prefillSpecialty] : [],
    consultation_fee_video: '',
    consultation_fee_clinic: '',
    session_duration: 30,
  });

  const handleChange = (field) => (e) =>
    setProfile(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: profile.name,
        pmdc_number: String(profile.pmdc_number),
        specialties: profile.specialties.length ? profile.specialties : ['General Physician'],
        qualification: profile.qualification || 'MBBS',
        experience_years: parseInt(profile.experience_years) || 0,
        city: profile.city || 'Karachi',
        consultation_fee_video: parseInt(profile.consultation_fee_video) || 2000,
        consultation_fee_clinic: parseInt(profile.consultation_fee_clinic) || null,
        bio: profile.bio || '',
        session_duration: profile.session_duration,
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

      toast.success('Profile submitted — pending admin verification ✓');
      
      // Force token refresh so the frontend receives the new `vela_role: doctor` custom claim
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }
      
      // Hard navigate so DoctorAuthGuard re-evaluates with fresh Firestore state
      window.location.href = '/doctor/dashboard';
    } catch (err) {
      toast.error(err.message || 'Setup failed');
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Qualification</label>
          <Input placeholder="MBBS, FCPS, MD…" icon={GraduationCap} value={profile.qualification} onChange={handleChange('qualification')} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Experience (Years)</label>
          <Input type="number" placeholder="10" icon={Briefcase} value={profile.experience_years} onChange={handleChange('experience_years')} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">City</label>
        <Input placeholder="Karachi, Lahore…" icon={MapPin} value={profile.city} onChange={handleChange('city')} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Bio / Professional Summary</label>
        <textarea
          placeholder="e.g. Senior Consultant with 15+ years in…"
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-prism-rose transition-all resize-none placeholder:text-white/20"
        />
      </div>
      <Button variant="rose" className="h-14 mt-2" onClick={() => setStep('practice')}>
        Practice Settings <ArrowRight size={18} className="ml-2" />
      </Button>
    </div>
  );

  const renderPractice = () => (
    <div className="flex flex-col gap-6">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <h4 className="text-sm font-bold text-white mb-6">Consultation Fees (Rs.)</h4>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-prism-cyan/10 text-prism-cyan flex items-center justify-center"><Clock size={20} /></div>
              <span className="text-sm font-bold text-white">Video Consultation</span>
            </div>
            <div className="w-36">
              <Input placeholder="2000" type="number" value={profile.consultation_fee_video} onChange={handleChange('consultation_fee_video')} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-prism-rose/10 text-prism-rose flex items-center justify-center"><Briefcase size={20} /></div>
              <span className="text-sm font-bold text-white">Clinic Visit</span>
            </div>
            <div className="w-36">
              <Input placeholder="3000" type="number" value={profile.consultation_fee_clinic} onChange={handleChange('consultation_fee_clinic')} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-rose ml-2">Session Duration (mins)</label>
        <select
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm outline-none focus:border-prism-rose appearance-none"
          value={profile.session_duration}
          onChange={(e) => setProfile(prev => ({ ...prev, session_duration: parseInt(e.target.value) }))}
        >
          {[15, 20, 30, 45, 60].map(m => (
            <option key={m} className="bg-prism-bg" value={m}>{m} Minutes</option>
          ))}
        </select>
      </div>
      <Button variant="rose" className="h-14 mt-2" onClick={() => setStep('finish')}>
        Review &amp; Submit <ArrowRight size={18} className="ml-2" />
      </Button>
    </div>
  );

  const renderFinish = () => (
    <div className="flex flex-col gap-6 items-center text-center py-4">
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
        <Row label="Name" value={profile.name || prefillName} />
        <Row label="PMDC" value={profile.pmdc_number || prefillPmdc} />
        <Row label="Specialty" value={(profile.specialties[0] || prefillSpecialty)} />
        <Row label="City" value={profile.city || 'Not set'} />
        <Row label="Video Fee" value={`Rs. ${profile.consultation_fee_video || 2000}`} />
      </div>

      <Button
        variant="rose"
        className="w-full h-16 mt-2 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting Profile…' : 'Complete Global Launch'} <ArrowRight size={18} className="ml-2" />
      </Button>
    </div>
  );

  const stepMap = { profile: 0, practice: 1, finish: 2 };
  const steps = ['Profile', 'Practice', 'Submit'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex flex-col gap-2 mb-10">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Practice Alignment</h2>
        <div className="flex items-center gap-2">
          <Badge variant="rose" className="px-3">Step 2/2</Badge>
          <p className="text-white/40 font-medium text-sm">Configure your clinical presence.</p>
        </div>
        <div className="flex gap-2 mt-4">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all ${i <= stepMap[step] ? 'bg-prism-rose' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <GlassCard className="p-8 md:p-10 border-white/5 bg-white/[0.03]">
        {step === 'profile' && renderProfile()}
        {step === 'practice' && renderPractice()}
        {step === 'finish' && renderFinish()}
      </GlassCard>
    </motion.div>
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

export default function DoctorSetup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-prism-bg">
        <div className="w-12 h-12 border-4 border-prism-rose/20 border-t-prism-rose rounded-full animate-spin" />
      </div>
    }>
      <DoctorSetupInner />
    </Suspense>
  );
}