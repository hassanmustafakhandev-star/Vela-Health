'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ChevronRight, Smartphone, Globe, Mail, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { GoogleLogo } from '@/components/brand/SocialLogos';

import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendOTP, token, role } = useAuthStore();
  const [method, setMethod] = useState('phone'); // phone or social
  const [view, setView] = useState('login'); // login or signup
  const [phone, setPhone] = useState('');
  
  // Signup State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      const currentRole = useAuthStore.getState().role;
      let target = '/dashboard';
      if (currentRole === 'doctor') target = '/doctor/dashboard';
      if (currentRole === 'admin') target = '/admin/dashboard';
      window.location.href = target;
      toast.success('Secure Identity Synchronized');
    } catch (error) {
      toast.error('Authentication Failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(method === 'phone' && phone.length > 5) {
      try {
        await sendOTP(phone, 'recaptcha-container');
        toast.success('OTP Signal Dispatched');
        router.push('/otp');
      } catch (error) {
        toast.error('Failed to send OTP. Check number format.');
      }
    } else {
      try {
        if (view === 'login') {
          await signInWithEmail(formData.email, formData.password);
          toast.success('Access Granted');
        } else {
          await signUpWithEmail(formData.email, formData.password, formData.name);
          toast.success('Identity Created');
        }
        
        const currentRole = useAuthStore.getState().role;
        let target = '/dashboard';
        if (currentRole === 'doctor') target = '/doctor/dashboard';
        if (currentRole === 'admin') target = '/admin/dashboard';
        window.location.href = target;
      } catch (error) {
        toast.error(error.message || 'Authentication error');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-prism-surface/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden"
    >
      <div id="recaptcha-container"></div>
      {/* Form Glint */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-prism-cyan/50 to-transparent opacity-50" />

      <h2 className="text-3xl font-display font-bold text-white mb-2">
        {view === 'login' ? 'Initialize Session' : 'Create Identity'}
      </h2>
      <p className="text-[15px] font-medium text-white/40 mb-10">
        {view === 'login' ? 'Select your preferred authentication layer.' : 'Register your medical soul on the Vela network.'}
      </p>

      {/* Toggle */}
      <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10 mb-10 relative">
        <button 
          onClick={() => { setMethod('phone'); setView('login'); }}
          className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${method === 'phone' ? 'text-black' : 'text-white/50 hover:text-white'}`}
        >
          <Smartphone size={16} /> Standard
        </button>
        <button 
          onClick={() => setMethod('social')}
          className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${method === 'social' ? 'text-black' : 'text-white/50 hover:text-white'}`}
        >
          <Globe size={16} /> Global
        </button>
        {/* Active Indicator */}
        <motion.div 
          className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-prism-cyan rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          initial={false}
          animate={{ x: method === 'phone' ? '4px' : 'calc(100% + 8px)' }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {method === 'phone' ? (
          <motion.form 
            key="phone"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-prism-cyan ml-2">Secure Link</label>
               <Input 
                 type="tel" 
                 placeholder="+92 300 1234567" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 autoFocus
                 className="text-lg tracking-widest h-16"
               />
            </div>
            
            <Button type="submit" variant="cyan" className="w-full h-16 mt-4">
              Send OTP Code <ChevronRight size={18} className="ml-2" />
            </Button>
          </motion.form>
        ) : (
          <motion.div 
            key="social"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6 py-2"
          >
            {view === 'login' ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleGoogleSignIn}
                    className="h-20 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <GoogleLogo size={28} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/60">Continue with Google</span>
                    </div>
                  </button>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-white/20">or manually access</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                   <Input 
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    autoComplete="username"
                  />
                  <Input 
                    icon={Lock}
                    type="password"
                    placeholder="Identity Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    autoComplete="current-password"
                  />
                  <Button type="submit" variant="cyan" className="w-full h-16 mt-2">
                    Enter Protocol <ChevronRight size={18} className="ml-2" />
                  </Button>


                </form>

                <div className="flex flex-col gap-4 mt-2">
                  <button onClick={() => setView('signup')} className="w-full text-[10px] font-black uppercase tracking-widest text-prism-cyan hover:opacity-80 transition-all">
                    No account? Create Identity
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-4">
                  <Input 
                    icon={User}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    autoComplete="name"
                  />
                  <Input 
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    autoComplete="email"
                  />
                  <Input 
                    icon={Lock}
                    type="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" variant="cyan" className="w-full h-16 mt-2">
                  Complete Registration <ChevronRight size={18} className="ml-2" />
                </Button>
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  Already have an account? Log In
                </button>
              </form>
            )}

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest mb-4">Are you a healthcare provider?</p>
              <Link href="/doctor/register" className="inline-flex items-center gap-2 text-[12px] font-black text-prism-rose hover:opacity-80 transition-all">
                Access Provider Nexus <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
