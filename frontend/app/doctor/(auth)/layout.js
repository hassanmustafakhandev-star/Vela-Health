import { VelaLogoFull } from '@/components/brand/VelaLogo';
import { Stethoscope, Award, ShieldAlert } from 'lucide-react';

export default function DoctorAuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-prism-bg flex selection:bg-prism-cyan selection:text-white">
      {/* LEFT: Branding Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-white/10 bg-prism-surface/30">
        <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-prism-rose/15 blur-[120px]" />
        
        <div className="relative z-10 flex items-center">
          <VelaLogoFull size={38} />
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-lg mb-20">
          <h1 className="text-5xl font-display font-medium leading-[1.1] text-white tracking-tight">
            The Medical <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-prism-rose to-white">Nexus Center.</span>
          </h1>
          <p className="text-lg text-white/50 font-medium leading-relaxed">
            A high-fidelity workspace for certified medical professionals. Seamlessly manage prescriptions, consultations, and patient telemetry.
          </p>

          <div className="flex flex-col gap-6 mt-12 opacity-80">
            <div className="flex items-center gap-5 text-prism-rose">
               <div className="w-12 h-12 rounded-xl bg-prism-rose/10 border border-prism-rose/20 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <Stethoscope size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Clinical Command Center</span>
            </div>
            <div className="flex items-center gap-5 text-prism-amber">
               <div className="w-12 h-12 rounded-xl bg-prism-amber/10 border border-prism-amber/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Award size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Verified PMDC Credentials</span>
            </div>
            <div className="flex items-center gap-5 text-prism-fuchsia">
               <div className="w-12 h-12 rounded-xl bg-prism-fuchsia/10 border border-prism-fuchsia/20 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                  <ShieldAlert size={22} />
               </div>
               <span className="text-sm font-black tracking-widest uppercase">Secure Liability Shield</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Content Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-prism-rose/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[540px] relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}