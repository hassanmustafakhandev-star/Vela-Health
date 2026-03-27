'use client';

export default function Toggle({ checked, onChange, size = 'md' }) {
  const sizes = {
    sm: { w: 'w-8', h: 'h-4.5', s: 'w-3.5 h-3.5', t: 'translate-x-[16px]' },
    md: { w: 'w-10', h: 'h-6', s: 'w-4.5 h-4.5', t: 'translate-x-[18px]' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <label className={`relative inline-flex items-center cursor-pointer`}>
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked} 
        onChange={onChange}
      />
      <div className={`${s.w} ${s.h} bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:${s.t} peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:${s.s} after:transition-all peer-checked:bg-prism-cyan/40 peer-checked:after:bg-prism-cyan peer-checked:after:opacity-100`}></div>
    </label>
  );
}
