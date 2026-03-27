'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VelaLogoIcon } from '@/components/brand/VelaLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-prism-bg flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-prism-fuchsia/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-prism-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="text-center relative z-10 max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
            <VelaLogoIcon size={40} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-[120px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/40 text-lg font-medium mb-10 leading-relaxed"
        >
          This node doesn't exist in the Vela nexus. The pathway you requested is offline or has been relocated.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-prism-cyan text-white font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all">
            <ArrowLeft size={18} /> Return to Nexus
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
