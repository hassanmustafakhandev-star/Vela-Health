'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Brain, Activity, Users, FileText } from 'lucide-react';

const navItems = [
  { name: 'Nexus', href: '/dashboard', icon: Home, theme: 'emerald' },
  { name: 'Records', href: '/records', icon: Activity, theme: 'emerald' },
  { name: 'AI Core', href: '/ai/symptoms', icon: Brain, theme: 'cyan', hero: true },
  { name: 'Family', href: '/family', icon: Users, theme: 'amber' },
  { name: 'Rx', href: '/prescriptions', icon: FileText, theme: 'cyan' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on auth, landing, or desktop
  if (!pathname || pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/otp') || pathname.startsWith('/setup')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 px-4 pb-6 pt-2">
      <div className="bg-prism-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex justify-between items-center px-4 h-[72px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          if (item.hero) {
            return (
              <Link key={item.name} href={item.href} className="relative -top-6 group">
                <div className="absolute inset-0 bg-prism-cyan blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="h-16 w-16 rounded-full bg-prism-cyan flex items-center justify-center text-white shadow-prism-cyan/50 shadow-lg border-2 border-prism-surface relative z-10"
                >
                  <Brain size={28} />
                </motion.div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest uppercase text-prism-cyan">SEHAT AI</span>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full gap-1 px-2 ${isActive ? `text-prism-${item.theme}` : 'text-white/30 hover:text-white/50 transition-colors'}`}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-widest uppercase">{item.name}</span>
              {isActive && <motion.div layoutId="nav-dot" className={`w-1 h-1 rounded-full bg-prism-${item.theme} mt-1`} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
