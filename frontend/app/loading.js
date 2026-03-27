export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-24 h-24 rounded-full border border-prism-cyan/30 border-t-prism-cyan animate-spin" />
        {/* Inner Ring */}
        <div className="absolute w-16 h-16 rounded-full border border-prism-rose/30 border-b-prism-rose animate-[spin_2s_linear_reverse]" />
        {/* Core Glow */}
        <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
      </div>
      <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-white/50">Establishing Secure Uplink</p>
    </div>
  );
}
