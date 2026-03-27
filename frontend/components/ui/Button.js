'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const colorMap = {
  cyan: 'bg-prism-cyan text-white shadow-prism-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border-prism-cyan',
  fuchsia: 'bg-prism-fuchsia text-white shadow-prism-fuchsia/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] border-prism-fuchsia',
  emerald: 'bg-prism-emerald text-white shadow-prism-emerald/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] border-prism-emerald',
  rose: 'bg-prism-rose text-white shadow-prism-rose/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] border-prism-rose',
  amber: 'bg-prism-amber text-black shadow-prism-amber/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border-prism-amber',
  ghost: 'bg-white/5 text-white border-white/10 hover:bg-white/10 backdrop-blur-xl',
};

const Button = forwardRef(({ 
  children, 
  variant = 'cyan', 
  className = '', 
  onClick, 
  href,
  ...props 
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full transition-all duration-300 px-8 py-4 text-sm border";
  const colorClasses = colorMap[variant] || colorMap.cyan;
  const combinedClasses = `${baseClasses} ${colorClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a 
          ref={ref}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={combinedClasses}
          {...props}
        >
          {children}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
