'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import GlassCard from '@/components/ui/GlassCard';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const { role, loading, token } = useAuthStore();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-prism-rose/20 border-t-prism-rose rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return null;

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] selection:bg-prism-rose">
        <div className="absolute inset-0 mesh-bg opacity-10 pointer-events-none" />
        <GlassCard className="max-w-md p-10 text-center border-prism-rose/20 bg-prism-rose/[0.02] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-prism-rose to-transparent" />
          
          <div className="w-20 h-20 rounded-3xl bg-prism-rose/10 border border-prism-rose/20 flex items-center justify-center text-prism-rose mx-auto mb-8 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
             <ShieldAlert size={40} />
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-4 italic tracking-tight">Access Restricted</h2>
          <p className="text-white/40 font-medium leading-relaxed mb-10 text-sm">
            Your current identity node does not possess the required clearance for the Admin Nexus. This event has been logged in the security protocol.
          </p>

          <Button 
            variant="rose" 
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft size={18} /> Return to Safe Zone
          </Button>
        </GlassCard>
      </div>
    );
  }

  return children;
}
