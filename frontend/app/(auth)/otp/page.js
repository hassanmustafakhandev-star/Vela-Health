'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowLeft, Clock } from 'lucide-react';

import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

export default function OTPPage() {
  const router = useRouter();
  const { verifyOTP, role } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  const handleVerification = async (otpCode) => {
    try {
      await verifyOTP(otpCode);
      const currentRole = useAuthStore.getState().role;
      toast.success('Protocol Verified');
      
      const target = currentRole === 'doctor' ? '/doctor/dashboard' : '/dashboard';
      router.push(target);
    } catch (error) {
      toast.error('Invalid OTP Code');
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit if full
    if (value !== '' && index === 5 && newCode.every((digit) => digit !== '')) {
       handleVerification(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-prism-surface/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-6 sm:p-12 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-prism-emerald/50 to-transparent opacity-50" />

      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors mb-10 group">
        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-white/30 transition-all">
          <ArrowLeft size={14} />
        </div>
        Back
      </button>

      <h2 className="text-3xl font-display font-bold text-white mb-2">Cryptographic Verification</h2>
      <p className="text-[15px] font-medium text-white/40 mb-10 leading-relaxed">
        Enter the 6-digit key dispatched to <span className="text-prism-emerald font-bold bg-prism-emerald/10 px-2 py-0.5 rounded ml-1">+92 *** ***345</span>
      </p>

      <div className="flex gap-2 sm:gap-3 mb-10 justify-between">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-14 sm:w-14 sm:h-20 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl sm:text-3xl font-mono font-bold text-white outline-none focus:border-prism-emerald focus:bg-white/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            autoFocus={idx === 0}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button 
          variant="emerald" 
          className="h-16 flex-1 text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
          onClick={() => handleVerification(code.join(''))}
        >
           Verify Protocol
        </Button>
      </div>

      <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm font-medium text-white/30">
        <Clock size={16} /> 
        {timeLeft > 0 ? (
          <span>Code expires in <span className="text-white font-mono">{timeLeft}s</span></span>
        ) : (
          <button className="text-prism-cyan hover:underline font-bold uppercase tracking-widest text-xs">Resend Signal</button>
        )}
      </div>
    </motion.div>
  );
}
