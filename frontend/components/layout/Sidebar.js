'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, Activity, Users, Stethoscope, FileText, Settings, ChevronLeft, ChevronRight, LogOut, Search, Command, Store, Microscope, ShieldAlert } from 'lucide-react';
import { VelaLogoIcon, VelaLogoFull } from '@/components/brand/VelaLogo';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, theme: 'emerald' },
  { label: 'Sehat AI', href: '/ai/symptoms', icon: Brain, theme: 'fuchsia' },
  { label: 'Pharmacy', href: '/pharmacy', icon: Store, theme: 'cyan' },
  { label: 'Lab Tests', href: '/labs', icon: Microscope, theme: 'emerald' },
  { label: 'Emergency SOS', href: '/emergency', icon: ShieldAlert, theme: 'rose' },
  { label: 'Find Doctors', href: '/doctors', icon: Stethoscope, theme: 'rose' },
  { label: 'Medical Records', href: '/records', icon: Activity, theme: 'emerald' },
  { label: 'Prescriptions', href: '/prescriptions', icon: FileText, theme: 'cyan' },
  { label: 'Family', href: '/family', icon: Users, theme: 'amber' },
  { label: 'Profile', href: '/profile', icon: Settings, theme: 'cyan' },
];

const colorMap = {
  cyan: 'text-prism-cyan bg-prism-cyan/10 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
  fuchsia: 'text-prism-fuchsia bg-prism-fuchsia/10 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]',
  rose: 'text-prism-rose bg-prism-rose/10 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  emerald: 'text-prism-emerald bg-prism-emerald/10 group-hover:shadow-[0_0_15_rgba(16,185,129,0.3)]',
  amber: 'text-prism-amber bg-prism-amber/10 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
};

const activeBorderMap = {
  cyan: 'border-l-prism-cyan',
  fuchsia: 'border-l-prism-fuchsia',
  rose: 'border-l-prism-rose',
  emerald: 'border-l-prism-emerald',
  amber: 'border-l-prism-amber',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const collapsed = !sidebarOpen;

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Patient Mode';
  const userPhoto = user?.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=06B6D4&color=fff`;

  if (!pathname || pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/otp') || pathname.startsWith('/setup')) return null;

  return (
    <aside className={`hidden md:flex flex-col relative h-screen z-40 bg-prism-surface/80 backdrop-blur-3xl border-r border-white/5 shadow-[4px_0_30px_rgba(0,0,0,0.4)] transition-all duration-300 ${collapsed ? 'w-[80px]' : 'w-[280px]'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 h-20 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
          {collapsed ? (
            <VelaLogoIcon size={32} />
          ) : (
            <VelaLogoFull />
          )}
        </Link>
        <button onClick={toggleSidebar} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Global Search Node */}
      <div className="px-5 py-4">
        {collapsed ? (
          <button onClick={toggleSidebar} className="mx-auto w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-prism-cyan transition-all">
            <Search size={18} />
          </button>
        ) : (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-prism-cyan transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Nexus..." 
              className="w-full h-10 bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/20 outline-none focus:border-white/10 focus:bg-white/[0.07] transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-white/20">
              <Command size={8} /> K
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto no-scrollbar pt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const themeClasses = colorMap[item.theme] || colorMap.cyan;
          const activeBorder = activeBorderMap[item.theme] || activeBorderMap.cyan;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-200 border-l-2 ${
                isActive
                  ? `bg-white/[0.07] ${activeBorder}`
                  : 'border-l-transparent hover:bg-white/[0.04] hover:border-l-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isActive ? themeClasses : 'text-white/30 bg-white/5 group-hover:text-white'}`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm font-bold whitespace-nowrap ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-prism-cyan shadow-[0_0_10px_#06B6D4]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Profile & Logout */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-3">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/[0.04] transition-all group">
          <div className="relative flex-shrink-0">
            <img src={userPhoto} alt="user" className="w-10 h-10 rounded-xl object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-prism-emerald border-2 border-prism-surface shadow-lg" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white whitespace-nowrap leading-none mb-1">{userName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-prism-cyan flex items-center gap-1.5">
                <Activity size={10} className="text-prism-emerald animate-pulse" /> Node Active
              </p>
            </div>
          )}
        </Link>
        <button 
          onClick={async () => {
            await logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-prism-rose/10 group transition-all"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/30 group-hover:text-prism-rose group-hover:border-prism-rose/30 transition-all">
            <LogOut size={18} />
          </div>
          {!collapsed && <span className="text-sm font-bold text-white/40 group-hover:text-prism-rose transition-colors">Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
}
