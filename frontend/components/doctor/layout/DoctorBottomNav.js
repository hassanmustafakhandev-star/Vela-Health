'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Banknote, User } from 'lucide-react';

const items = [
  { label: 'Home', href: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Schedule', href: '/doctor/appointments', icon: Calendar },
  { label: 'Patients', href: '/doctor/patients', icon: Users },
  { label: 'Earnings', href: '/doctor/earnings', icon: Banknote },
  { label: 'Profile', href: '/doctor/profile', icon: User },
];

export default function DoctorBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-prism-surface/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 z-40">
      {items.map((item, idx) => {
        const isActive = pathname === item.href;
        
        if (idx === 1) { // Center Schedule Item (Special Style)
          return (
            <Link key={item.href} href={item.href} className="relative -top-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isActive ? 'bg-prism-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-prism-surface border border-white/10 text-white/40'}`}>
                <item.icon size={24} />
              </div>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
            <div className={`transition-colors ${isActive ? 'text-prism-cyan' : 'text-white/30 group-hover:text-white'}`}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-white/40'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}