import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glowColor = 'cyan' }) {
  const glowMap = {
    cyan: 'hover:border-prism-cyan/50 hover:shadow-[0_10px_40px_rgba(6,182,212,0.15)]',
    fuchsia: 'hover:border-prism-fuchsia/50 hover:shadow-[0_10px_40px_rgba(217,70,239,0.15)]',
    emerald: 'hover:border-prism-emerald/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]',
    rose: 'hover:border-prism-rose/50 hover:shadow-[0_10px_40px_rgba(244,63,94,0.15)]',
    amber: 'hover:border-prism-amber/50 hover:shadow-[0_10px_40px_rgba(245,158,11,0.15)]',
  };

  const activeGlow = hover ? (glowMap[glowColor] || glowMap.cyan) : '';

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.01 } : {}}
      className={`bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-3xl transition-all duration-500 overflow-hidden ${activeGlow} ${className}`}
    >
      {children}
    </motion.div>
  );
}
