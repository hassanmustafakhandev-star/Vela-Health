'use client';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Badge({ children, variant = 'cyan', className }) {
  const variants = {
    cyan: 'bg-prism-cyan/10 text-prism-cyan border-prism-cyan/20',
    rose: 'bg-prism-rose/10 text-prism-rose border-prism-rose/20',
    emerald: 'bg-prism-emerald/10 text-prism-emerald border-prism-emerald/20',
    fuchsia: 'bg-prism-fuchsia/10 text-prism-fuchsia border-prism-fuchsia/20',
    amber: 'bg-prism-amber/10 text-prism-amber border-prism-amber/20',
  };

  return (
    <span className={twMerge(
      "px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest",
      variants[variant] || variants.cyan,
      className
    )}>
      {children}
    </span>
  );
}
