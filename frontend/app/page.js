'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, Brain, Stethoscope, Activity, ShieldCheck, Play,
  Star, ArrowRight, Check, Users, HeartPulse, ScanLine, Menu, X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { VelaLogoFull, VelaLogoIcon } from '@/components/brand/VelaLogo';

/* ──────────── DATA ──────────── */
const navLinks = ['Features', 'Doctors', 'Pricing', 'About'];

const features = [
  { title: 'Sehat AI Core', desc: 'Hyper-intelligent triage that understands English, Urdu & Roman. 24/7 instant symptom analysis.', icon: Brain, theme: 'fuchsia' },
  { title: 'Elite Tele-Care', desc: 'PMDC-verified specialists via UHD video. Book in seconds. Consult from anywhere.', icon: Stethoscope, theme: 'rose' },
  { title: 'Telemetry Vault', desc: 'Complete medical history, lab results, and biometric feeds in one encrypted location.', icon: Activity, theme: 'emerald' },
  { title: 'Sovereign Data', desc: 'Bank-grade biometric encryption. Your records are exclusively yours — unhackable.', icon: ShieldCheck, theme: 'cyan' },
  { title: 'Family Network', desc: 'Manage health for your spouse, children, and elderly parents — all in one command center.', icon: Users, theme: 'amber' },
  { title: 'Neural Scan', desc: 'Verify medications, analyze ingredients, and set precision reminders with computer vision.', icon: ScanLine, theme: 'fuchsia' },
];

const doctors = [
  { name: 'Dr. Sarah Chen', spec: 'Cardiologist', exp: '14 yrs', rating: '4.9', img: 'https://i.pravatar.cc/300?img=44', tag: 'Top Rated' },
  { name: 'Dr. Ahmed Raza', spec: 'Neurologist', exp: '18 yrs', rating: '5.0', img: 'https://i.pravatar.cc/300?img=11', tag: 'Most Booked' },
  { name: 'Dr. Emily Watson', spec: 'Pediatrician', exp: '9 yrs', rating: '4.8', img: 'https://i.pravatar.cc/300?img=9', tag: 'Highly Rated' },
];

const stats = [
  { value: '500+', label: 'PMDC Verified Doctors', color: 'rose' },
  { value: '98.4%', label: 'Diagnostic Accuracy', color: 'emerald' },
  { value: '50K+', label: 'Active Patients', color: 'cyan' },
  { value: '24/7', label: 'AI Support', color: 'fuchsia' },
];

const plans = [
  {
    name: 'Basic', price: 'Free', desc: 'For individuals getting started.', color: 'cyan',
    features: ['AI Symptom Checker (5/mo)', '1 Family Member', 'Medical Records Vault', 'Email Support'],
  },
  {
    name: 'Pro', price: 'Rs 999', period: '/mo', desc: 'For families & power users.', color: 'fuchsia', popular: true,
    features: ['Unlimited AI Diagnoses', '5 Family Members', 'Priority Specialist Access', 'Prescription Management', '24/7 Phone Support'],
  },
  {
    name: 'Enterprise', price: 'Custom', desc: 'For clinics & hospitals.', color: 'emerald',
    features: ['Everything in Pro', 'Unlimited Members', 'Dedicated Account Manager', 'API Access', 'Custom Integrations'],
  },
];

/* ──────────── PAGE ──────────── */
export default function LandingPage() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 600], [0, 120]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.onChange(v => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);

  return (
    <div className="relative min-h-screen bg-prism-bg overflow-x-hidden selection:bg-prism-cyan selection:text-white">
      {/* Fixed Ambient Glows */}
      <div className="fixed inset-0 mesh-bg opacity-40 mix-blend-screen pointer-events-none z-0" />
      <div className="fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-prism-fuchsia/15 blur-[120px] animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-prism-cyan/15 blur-[120px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '2s' }} />

      {/* ── HEADER ── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-prism-bg/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
              <VelaLogoFull size={36} />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[13px] font-black text-white/50 uppercase tracking-widest hover:text-white transition-all">
                {link}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/doctor/register" className="text-[12px] font-black text-prism-rose uppercase tracking-[0.2em] hover:opacity-80 transition-all border-b border-prism-rose/30">
              Join as Doctor
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <Link href="/login" className="text-[13px] font-black text-white/50 uppercase tracking-widest hover:text-white transition-all">
              Log In
            </Link>
            <Link href="/login" className="h-[44px] px-6 rounded-full bg-prism-cyan text-prism-bg font-black text-[12px] uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-2">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/60 hover:text-white transition-colors">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-prism-bg/95 backdrop-blur-2xl border-b border-white/10 px-6 pb-6 flex flex-col gap-4"
          >
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-[13px] font-black text-white/60 uppercase tracking-widest hover:text-white py-2 transition-all">
                {link}
              </a>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)} className="h-[48px] rounded-full bg-prism-cyan text-prism-bg font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 mt-2">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/doctor/register" onClick={() => setMenuOpen(false)} className="h-[48px] rounded-full border border-prism-rose/30 text-prism-rose font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2">
              Join as Doctor <Stethoscope size={14} />
            </Link>
          </motion.div>
        )}
      </header>

      <main className="relative z-10">

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[76px] relative">
          <motion.div style={{ y: yHero }} className="max-w-6xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-prism-cyan/30 bg-prism-cyan/10 backdrop-blur-xl text-xs font-black text-prism-cyan uppercase tracking-[0.3em] mb-10"
            >
              <Sparkles size={14} className="animate-pulse" />
              Pakistan's #1 AI Healthcare Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 1 }}
              className="text-6xl sm:text-8xl xl:text-[9rem] font-display font-medium text-white tracking-tighter leading-[0.9] mb-8"
            >
              Healthcare at<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan via-prism-fuchsia to-prism-rose">the Speed of AI.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="max-w-2xl text-lg sm:text-xl text-white/50 leading-relaxed mb-12 font-medium"
            >
              Connect with PMDC-certified specialists, get instant AI diagnoses, and keep your entire family's health in one sovereign, encrypted vault.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/login" className="h-14 px-10 rounded-full bg-prism-cyan text-prism-bg font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 transition-all flex items-center gap-3">
                  Start Free — No Card Needed <ArrowRight size={16} />
                </Link>
                <button className="h-14 px-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-prism-fuchsia/20 flex items-center justify-center text-prism-fuchsia">
                    <Play size={14} className="fill-current ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>
              
              <Link href="/doctor/register" className="group flex items-center gap-2 text-[11px] font-black text-prism-rose/60 uppercase tracking-[0.3em] hover:text-prism-rose transition-colors">
                 <span>Are you a medical professional?</span>
                 <span className="flex items-center gap-1 text-prism-rose">Join the Nexus <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating HUD Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 1 }}
            className="absolute left-[4%] top-[30%] hidden xl:block"
          >
            <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 animate-float-slow">
              <div className="w-12 h-12 rounded-xl bg-prism-rose/20 border border-prism-rose/30 flex items-center justify-center text-prism-rose">
                <HeartPulse size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-prism-rose mb-1">Heart Rate</p>
                <p className="text-2xl font-mono font-bold text-white">72 <span className="text-sm text-white/40">BPM</span></p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 1 }}
            className="absolute right-[4%] top-[35%] hidden xl:block"
          >
            <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 animate-float-slow" style={{ animationDelay: '1.5s' }}>
              <div className="w-12 h-12 rounded-xl bg-prism-fuchsia/20 border border-prism-fuchsia/30 flex items-center justify-center text-prism-fuchsia">
                <Brain size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-prism-fuchsia mb-1">Sehat AI</p>
                <p className="text-base font-display font-bold text-white italic">Analyzing...</p>
                <div className="flex gap-1 mt-1">
                  {[0,1,2,3].map(i => (
                    <motion.div key={i} animate={{ scaleY: [1, 2, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} className="w-0.5 h-3 bg-prism-fuchsia rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-prism-bg to-transparent pointer-events-none" />
        </section>

        {/* ── STATS STRIP ── */}
        <section className="py-16 px-6 border-y border-white/5 bg-white/[0.02] relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className={`text-4xl sm:text-5xl font-mono font-bold text-prism-${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-prism-fuchsia mb-4">Everything You Need</h2>
              <h3 className="text-5xl sm:text-7xl font-display font-medium text-white tracking-tighter leading-tight">
                Six Modules.<br />Total Health Control.
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => (
                <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <GlassCard glowColor={feat.theme} className="p-8 h-full flex flex-col gap-6 group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-prism-${feat.theme} bg-prism-${feat.theme}/10 border border-prism-${feat.theme}/20 shadow-[0_0_20px_currentColor] group-hover:scale-110 transition-transform`}>
                      <feat.icon size={26} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-prism-cyan transition-colors">{feat.title}</h4>
                      <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">{feat.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOCTORS ── */}
        <section id="doctors" className="py-32 px-6 relative z-10 bg-white/[0.015] border-y border-white/5">
          <div className="absolute inset-0 bg-prism-rose/5 blur-[200px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-prism-rose mb-4">Elite Medical Network</h2>
              <h3 className="text-5xl sm:text-7xl font-display font-medium text-white tracking-tighter">
                Human Empathy.<br />Digital Precision.
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {doctors.map((doc, i) => (
                <motion.div key={doc.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <GlassCard glowColor="rose" className="p-6 flex flex-col items-center text-center group">
                    <div className="relative mb-5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-prism-rose/20 group-hover:border-prism-rose/60 transition-all shadow-[0_0_20px_rgba(244,63,94,0.1)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                        <img src={doc.img} alt={doc.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-prism-rose text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                        {doc.tag}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-prism-rose transition-colors">{doc.name}</h4>
                    <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">{doc.spec}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full mb-6">
                      <span className="flex items-center gap-1"><Star size={11} className="text-prism-amber fill-prism-amber" /> {doc.rating}</span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{doc.exp} exp.</span>
                    </div>
                    <Link href="/login" className="w-full h-10 rounded-full bg-prism-rose/10 border border-prism-rose/30 text-prism-rose text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-prism-rose hover:text-white transition-all">
                      Book Session <ArrowRight size={13} />
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-3 text-sm font-black text-prism-rose hover:text-white uppercase tracking-widest transition-colors">
                View All 500+ Doctors <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOR DOCTORS: PROVIDER NEXUS ── */}
        <section className="py-24 px-6 relative z-10 overflow-hidden">
           <div className="max-w-7xl mx-auto">
              <GlassCard glowColor="rose" className="p-12 md:p-20 border-prism-rose/20 bg-prism-rose/[0.02] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-prism-rose/5 blur-[100px] pointer-events-none" />
                 <div className="max-w-xl relative z-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-prism-rose mb-6">Partner with Vela</h2>
                    <h3 className="text-4xl sm:text-6xl font-display font-medium text-white tracking-tighter mb-8 italic">
                       Expand your Practice <br />
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-rose to-white">Across Pakistan.</span>
                    </h3>
                    <p className="text-lg text-white/40 leading-relaxed font-medium mb-10">
                       Harness the power of Neural Triage, Spatial EMR, and UHD Tele-consultation. Join an elite community of PMDC-certified specialists providing high-fidelity care.
                    </p>
                    <div className="flex flex-wrap gap-6">
                       <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                          <Check size={16} className="text-prism-rose" />
                          <span className="text-xs font-bold text-white/60">Automated Billing</span>
                       </div>
                       <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                          <Check size={16} className="text-prism-rose" />
                          <span className="text-xs font-bold text-white/60">Secure Telemetry</span>
                       </div>
                       <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                          <Check size={16} className="text-prism-rose" />
                          <span className="text-xs font-bold text-white/60">Global Reach</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-[32px] bg-prism-rose/10 text-prism-rose flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
                       <Stethoscope size={48} />
                    </div>
                    <Link href="/doctor/register" className="h-16 px-12 rounded-2xl bg-prism-rose text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-105 transition-all flex items-center gap-3 outline-none">
                       Apply to Nexus <ArrowRight size={18} />
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Verified PMDC Required</p>
                 </div>
              </GlassCard>
           </div>
        </section>

        {/* ── ABOUT VELA ── */}
        <section id="about" className="py-32 px-6 relative z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-prism-cyan/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-prism-cyan mb-6">Our Mission</h2>
                <h3 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tighter mb-8 italic">Pioneering Sovereign <br />Health Intelligence.</h3>
                <p className="text-white/50 font-medium leading-relaxed mb-8">
                  At Vela, we believe that healthcare is a fundamental right, and privacy is a fundamental necessity. We are building the world's first decentralized medical nexus that puts power back into the hands of the patient.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-2xl font-mono font-bold text-white mb-1">2024</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Protocol Launch</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-2xl font-mono font-bold text-white mb-1">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">User Sovereignty</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-prism-cyan/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-prism-fuchsia/20 blur-3xl rounded-full" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              <div>
                <h4 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">The HMK Vision</h4>
                <p className="text-white/40 leading-relaxed font-medium">
                  Vela is not just an app; it's a paradigm shift. We merge cutting-edge neural diagnostics with the trust of PMDC-certified medicine to create a healthcare experience that is faster, safer, and entirely centered around you.
                </p>
              </div>
              
              <ul className="flex flex-col gap-6">
                {[
                  { title: 'Global Accessibility', desc: 'Consult with the top 1% from any corner of the globe.' },
                  { title: 'Privacy by Design', desc: 'Your medical identity is encrypted at the chip level.' },
                  { title: 'AI-First Triage', desc: 'Instant, accurate symptom mapping in native languages.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-prism-cyan group-hover:bg-prism-cyan group-hover:text-black transition-all">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1 group-hover:text-prism-cyan transition-colors">{item.title}</p>
                      <p className="text-sm text-white/30 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-32 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-prism-emerald mb-4">Simple Pricing</h2>
              <h3 className="text-5xl sm:text-7xl font-display font-medium text-white tracking-tighter">Transparent. Fair.<br />No Hidden Fees.</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard glowColor={plan.color} className={`p-8 h-full flex flex-col gap-6 relative ${plan.popular ? 'border-prism-fuchsia/30' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-prism-fuchsia text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-black uppercase tracking-[0.3em] text-prism-${plan.color} mb-3`}>{plan.name}</p>
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-4xl font-mono font-bold text-white">{plan.price}</span>
                        {plan.period && <span className="text-white/40 font-medium mb-1">{plan.period}</span>}
                      </div>
                      <p className="text-sm text-white/40">{plan.desc}</p>
                    </div>

                    <ul className="flex flex-col gap-3 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm font-medium text-white/70">
                          <Check size={14} className={`text-prism-${plan.color} flex-shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/login" className={`h-12 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all ${plan.popular ? `bg-prism-${plan.color} text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105` : `border border-prism-${plan.color}/30 text-prism-${plan.color} hover:bg-prism-${plan.color}/10`}`}>
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-32 px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white/[0.03] border border-white/10 rounded-[60px] p-16 md:p-24 text-center backdrop-blur-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-prism-fuchsia/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-5xl sm:text-7xl font-display font-medium text-white tracking-tighter mb-8 leading-tight">Heal at the Speed<br />of Thought.</h2>
              <p className="text-lg text-white/40 font-medium mb-12 max-w-xl mx-auto">Join 50,000+ Pakistanis who trust Vela as their primary healthcare companion.</p>
              <Link href="/login" className="inline-flex items-center gap-3 h-14 px-12 rounded-full bg-gradient-to-r from-prism-cyan via-prism-fuchsia to-prism-rose text-white font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(217,70,239,0.5)] hover:scale-105 transition-all">
                Begin your Vela Session <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="pt-16 pb-10 px-6 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <VelaLogoIcon size={30} />
                  <span className="font-display font-bold text-lg text-white">Vela Health</span>
                </div>
                <p className="text-sm text-white/40 font-medium leading-relaxed max-w-[220px]">Pakistan's leading AI-powered healthcare intelligence platform.</p>
              </div>
              {/* Links */}
              {[
                { heading: 'Platform', links: ['Features', 'Doctors', 'AI Diagnostic', 'Prescriptions'] },
                { heading: 'For Providers', links: [{ label: 'Register as Doctor', href: '/doctor/register' }, { label: 'Provider Login', href: '/login' }, 'Medical Protocol', 'Liability Shield'] },
                { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Data Security', 'PMDC Compliance'] },
              ].map(col => (
                <div key={col.heading}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-5">{col.heading}</p>
                  <ul className="flex flex-col gap-3">
                    {col.links.map((link, idx) => {
                       const label = typeof link === 'string' ? link : link.label;
                       const href = typeof link === 'string' ? "#" : link.href;
                       return (
                        <li key={idx}>
                          <Link href={href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{label}</Link>
                        </li>
                       );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
              <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">© 2026 HMK Ventures. All rights reserved.</p>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-prism-cyan">Engineered in Pakistan 🇵🇰</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
