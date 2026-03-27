'use client';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Avatar({ src, name, size = 'md', radius = 'xl', className }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const radii = {
    none: 'rounded-none',
    md: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return (
    <div className={twMerge(
      "relative overflow-hidden bg-white/5 border border-white/10 shrink-0",
      sizes[size],
      radii[radius],
      className
    )}>
      {src ? (
        <img src={src} alt={name || 'User'} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-xs">
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
}
