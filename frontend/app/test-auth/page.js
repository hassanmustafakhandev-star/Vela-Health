'use client';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import GlassCard from '@/components/ui/GlassCard';

export default function TestAuthPage() {
  const auth = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-prism-bg p-10 flex flex-col items-center justify-center font-mono">
      <h1 className="text-3xl font-bold text-prism-cyan mb-8 uppercase tracking-widest">Auth Diagnostic Node</h1>
      
      <GlassCard className="w-full max-w-2xl p-8 border-prism-cyan/30">
        <div className="space-y-6">
          <section>
            <h2 className="text-prism-fuchsia text-sm font-black mb-2">[USER OBJECT]</h2>
            <pre className="bg-black/40 p-4 rounded-xl text-xs overflow-auto max-h-40">
              {JSON.stringify(auth.user, (key, value) => (key === 'auth' || key === 'stsTokenManager') ? '[Internal]' : value, 2)}
            </pre>
          </section>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-black">Role</p>
                <p className="text-xl text-prism-emerald font-bold">{auth.role || 'NONE'}</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-black">Loading State</p>
                <p className="text-xl text-prism-amber font-bold">{auth.loading ? 'TRUE' : 'FALSE'}</p>
             </div>
          </div>

          <section>
            <h2 className="text-prism-rose text-sm font-black mb-2">[SERVICE STATUS]</h2>
            <div className="flex gap-4">
               <div className={`px-4 py-2 rounded-full border ${auth.token ? 'bg-prism-emerald/10 border-prism-emerald/30 text-prism-emerald' : 'bg-prism-rose/10 border-prism-rose/30 text-prism-rose'} text-xs font-black`}>
                 TOKEN: {auth.token ? 'ACQUIRED' : 'MISSING'}
               </div>
               <div className={`px-4 py-2 rounded-full border ${auth.user ? 'bg-prism-emerald/10 border-prism-emerald/30 text-prism-emerald' : 'bg-prism-rose/10 border-prism-rose/30 text-prism-rose'} text-xs font-black`}>
                 FIREBASE: {auth.user ? 'CONNECTED' : 'DISCONNECTED'}
               </div>
            </div>
          </section>

          <section className="pt-6 border-t border-white/10">
            <button 
              onClick={() => auth.initAuth()}
              className="w-full h-12 rounded-xl bg-prism-cyan text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
            >
              Manual Force Init Auth
            </button>
          </section>
        </div>
      </GlassCard>

      <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
        Vela Node Diagnostic — Security Level 4
      </p>
    </div>
  );
}
