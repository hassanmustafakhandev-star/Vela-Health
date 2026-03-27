'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Command, Search, Bell, Settings, LogOut } from 'lucide-react';
import { VelaLogoIcon, VelaLogoFull } from '@/components/brand/VelaLogo';

import useAuthStore from '@/store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Hide on auth, landing
  if (!pathname || pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/otp') || pathname.startsWith('/setup')) return null;

  return (
    <header className="md:hidden sticky top-0 w-full z-50 h-[72px] bg-prism-surface/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6">
      {/* Brand & Search */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center group">
          <VelaLogoIcon size={32} />
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-prism-rose"></span>
        </button>

        <Link href="/profile" className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
          <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=06B6D4&color=fff`} className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
}
