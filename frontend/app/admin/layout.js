'use client';
import { motion } from 'framer-motion';
import { Shield, Users, Bell, LogOut, LayoutDashboard, Search, Calendar, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VelaLogoIcon } from '@/components/brand/VelaLogo';
import AdminAuthGuard from '@/components/admin/layout/AdminAuthGuard';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <AdminAuthGuard>
    <div className="h-screen bg-[#050505] flex overflow-hidden selection:bg-prism-rose selection:text-white">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-black border-r border-white/5 flex flex-col relative z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <VelaLogoIcon size={32} />
           <div>
             <h1 className="text-sm font-black text-white tracking-widest uppercase">Admin Nexus</h1>
             <p className="text-[10px] text-prism-rose font-bold uppercase tracking-tighter">System Overseer</p>
           </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 pt-8">
          <AdminNavLink href="/admin/dashboard" icon={LayoutDashboard} label="Fleet Overview" active={pathname === '/admin/dashboard'} />
          <AdminNavLink href="/admin/doctors" icon={Users} label="Provider Queue" active={pathname.startsWith('/admin/doctors')} />
          <AdminNavLink href="/admin/users" icon={UserCheck} label="Patient Registry" active={pathname.startsWith('/admin/users')} />
          <AdminNavLink href="/admin/security" icon={Shield} label="Security Logs" active={pathname.startsWith('/admin/security')} />
        </nav>

        <div className="p-4 border-t border-white/5">
           <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-prism-rose/10 group transition-all">
             <LogOut size={18} className="text-white/20 group-hover:text-prism-rose" />
             <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">Terminate Sync</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between bg-black/50 backdrop-blur-xl">
           <div className="flex items-center gap-4 flex-1 max-w-xl">
              <Search size={18} className="text-white/20" />
              <input type="text" placeholder="Scan system for entities..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/10" />
           </div>
           <div className="flex items-center gap-6">
              <button className="relative text-white/40 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-prism-rose" />
              </button>
              <div className="w-10 h-10 rounded-full bg-prism-rose/20 border border-prism-rose/30 flex items-center justify-center">
                 <Shield size={20} className="text-prism-rose" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
    </AdminAuthGuard>
  );
}

function AdminNavLink({ href, icon: Icon, label, active }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-prism-rose/10 border-l-2 border-prism-rose text-white' : 'text-white/30 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}>
      <Icon size={18} />
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="admin-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-prism-rose shadow-[0_0_10px_#f43f5e]" />}
    </Link>
  );
}
