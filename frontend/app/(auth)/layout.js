import { VelaLogoFull } from '@/components/brand/VelaLogo';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-prism-bg flex selection:bg-prism-cyan selection:text-white">
      {/* LEFT: Branding Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-white/10 bg-prism-surface/30">
        <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-prism-cyan/15 blur-[120px]" />
        
        <div className="relative z-10 flex items-center">
          <VelaLogoFull size={38} />
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-lg mb-20">
          <h1 className="text-5xl font-display font-medium leading-[1.1] text-white tracking-tight">
            The Neural Health <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-cyan to-white">Gateway.</span>
          </h1>
          <p className="text-lg text-white/50 font-medium leading-relaxed">
            Secure, unhackable biometric authentication. Your PMDC-certified medical data stays exclusively yours.
          </p>

          <div className="flex flex-col gap-6 mt-12 opacity-80">
            <div className="flex items-center gap-5 text-prism-cyan">
               <div className="w-12 h-12 rounded-xl bg-prism-cyan/10 border border-prism-cyan/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <ShieldCheck size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Military Grade Encryption</span>
            </div>
            <div className="flex items-center gap-5 text-prism-emerald">
               <div className="w-12 h-12 rounded-xl bg-prism-emerald/10 border border-prism-emerald/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Activity size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Live Telemetry Active</span>
            </div>
            <div className="flex items-center gap-5 text-prism-fuchsia">
               <div className="w-12 h-12 rounded-xl bg-prism-fuchsia/10 border border-prism-fuchsia/20 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                  <Cpu size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Neural Net Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Content Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-prism-fuchsia/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[540px] relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
