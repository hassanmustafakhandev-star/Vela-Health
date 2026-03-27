'use client';
import { usePathname } from 'next/navigation';
import { VelaLogoIcon } from '@/components/brand/VelaLogo';
import { Bell, Search, User } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/doctor/doctorAuthStore';

export default function DoctorNavbar() {
  const pathname = usePathname();
  const { doctorProfile } = useDoctorAuthStore();

  return (
    <nav className="h-20 flex items-center justify-between px-6 bg-prism-surface/50 backdrop-blur-2xl border-b border-white/5 z-30 sticky top-0 md:hidden">
      <div className="flex items-center gap-3">
        <VelaLogoIcon size={32} />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
          <Bell size={20} />
        </button>
        <button className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
          <img src={doctorProfile?.photo_url || "https://i.pravatar.cc/100?img=33"} alt="dr" className="w-full h-full object-cover" />
        </button>
      </div>
    </nav>
  );
}