'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, FileText,
  ClipboardList, Banknote, Star, Clock,
  ChevronLeft, ChevronRight, LogOut, RefreshCcw,
} from 'lucide-react';
import { VelaLogoIcon, VelaLogoFull } from '@/components/brand/VelaLogo';
import { useState } from 'react';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';
import { useDoctorAuthContext } from '@/context/DoctorAuthContext';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import Toggle from '@/components/ui/Toggle';

// ─── Navigation structure ────────────────────────────────────────────────────
const practiceItems = [
  { label: 'Dashboard',     href: '/doctor/dashboard',     icon: LayoutDashboard, theme: 'emerald' },
  { label: 'Appointments',  href: '/doctor/appointments',  icon: Calendar,        theme: 'rose'    },
  { label: 'Patients',      href: '/doctor/patients',      icon: Users,           theme: 'cyan'    },
];
const clinicalItems = [
  { label: 'Prescriptions', href: '/doctor/prescriptions', icon: FileText,        theme: 'fuchsia' },
  { label: 'Templates',     href: '/doctor/templates',     icon: ClipboardList,   theme: 'amber'   },
];
const businessItems = [
  { label: 'Earnings',      href: '/doctor/earnings',      icon: Banknote,        theme: 'emerald' },
  { label: 'Reviews',       href: '/doctor/reviews',       icon: Star,            theme: 'rose'    },
  { label: 'Availability',  href: '/doctor/availability',  icon: Clock,           theme: 'cyan'    },
];

const colorMap = {
  cyan:    'text-prism-cyan    bg-prism-cyan/10    group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
  fuchsia: 'text-prism-fuchsia bg-prism-fuchsia/10 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]',
  rose:    'text-prism-rose    bg-prism-rose/10    group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  emerald: 'text-prism-emerald bg-prism-emerald/10 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  amber:   'text-prism-amber   bg-prism-amber/10   group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
};
const activeBorderMap = {
  cyan: 'border-l-prism-cyan', fuchsia: 'border-l-prism-fuchsia',
  rose: 'border-l-prism-rose', emerald: 'border-l-prism-emerald',
  amber: 'border-l-prism-amber',
};

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const collapsed = !sidebarOpen;

  // Read profile from store — DoctorAuthProvider in layout owns the listener
  const { doctorProfile, logout: logoutStore } = useDoctorAuthStore();

  // toggleAvailability comes from context (not from a hook that spins up a new listener)
  const { toggleAvailability } = useDoctorAuthContext();

  const { logout: logoutGlobal } = useAuthStore();

  const handleLogout = async () => {
    logoutStore();
    await logoutGlobal();
    router.push('/login');
  };

  // Fix Bug #3: specialties is an array — show first element
  const specialtyLabel =
    doctorProfile?.specialties?.[0] ||
    doctorProfile?.specialty ||   // backward compat fallback
    'Medical Specialist';

  const renderNavGroup = (items, label) => (
    <div className="flex flex-col gap-1 mb-4">
      {!collapsed && (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-4 mb-2">
          {label}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const themeClasses = colorMap[item.theme] || colorMap.cyan;
        const activeBorder = activeBorderMap[item.theme] || activeBorderMap.cyan;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-4 px-3 py-2.5 rounded-2xl transition-all duration-200 border-l-2 ${
              isActive
                ? `bg-white/[0.07] ${activeBorder}`
                : 'border-l-transparent hover:bg-white/[0.04] hover:border-l-white/20'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                isActive ? themeClasses : 'text-white/30 bg-white/5 group-hover:text-white'
              }`}
            >
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {!collapsed && (
              <span
                className={`text-sm font-bold whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-white/40 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`hidden md:flex flex-col relative h-screen bg-prism-surface/80 backdrop-blur-3xl border-r border-white/5 shadow-[4px_0_30px_rgba(0,0,0,0.4)] transition-all duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 h-20 border-b border-white/5">
        <Link href="/doctor/dashboard" className="flex items-center gap-3 overflow-hidden">
          {collapsed ? <VelaLogoIcon size={32} /> : <VelaLogoFull />}
        </Link>
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {/* Doctor identity card */}
        {!collapsed && doctorProfile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-[24px] bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={doctorProfile.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorProfile.name || 'Dr')}&background=0d1117&color=fff&size=80`}
                alt="Dr"
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">
                  Dr. {doctorProfile.name}
                </p>
                <p className="text-[10px] font-black uppercase text-prism-cyan truncate">
                  {specialtyLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                Availability
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-black uppercase ${
                    doctorProfile.available_now ? 'text-prism-emerald' : 'text-white/30'
                  }`}
                >
                  {doctorProfile.available_now ? '● Live' : '○ Offline'}
                </span>
                <Toggle
                  checked={!!doctorProfile.available_now}
                  onChange={(e) => toggleAvailability(e.target.checked)}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {renderNavGroup(practiceItems, 'Practice')}
        {renderNavGroup(clinicalItems, 'Clinical')}
        {renderNavGroup(businessItems, 'Business')}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-white/5 flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/[0.04] transition-all group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/30 group-hover:text-prism-cyan group-hover:border-prism-cyan/30 transition-all">
            <RefreshCcw size={18} />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-white/40 group-hover:text-prism-cyan transition-colors">
              Switch to Patient
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-prism-rose/10 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/30 group-hover:text-prism-rose group-hover:border-prism-rose/30 transition-all">
            <LogOut size={18} />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-white/40 group-hover:text-prism-rose transition-colors">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}