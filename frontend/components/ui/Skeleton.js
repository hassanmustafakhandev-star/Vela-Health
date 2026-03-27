'use client';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Skeleton({ className }) {
  return (
    <div className={twMerge(
      "animate-pulse bg-white/5 border border-white/10 rounded-xl",
      className
    )} />
  );
}
