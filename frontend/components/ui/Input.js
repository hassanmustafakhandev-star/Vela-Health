import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ className = '', variant = 'cyan', error, icon: Icon, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const borderColors = {
    cyan: 'focus-within:border-prism-cyan focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    fuchsia: 'focus-within:border-prism-fuchsia focus-within:shadow-[0_0_15px_rgba(217,70,239,0.3)]',
    emerald: 'focus-within:border-prism-emerald focus-within:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    rose: 'focus-within:border-prism-rose focus-within:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    amber: 'focus-within:border-prism-amber focus-within:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  };

  const currentTheme = borderColors[variant] || borderColors.cyan;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className={`relative flex items-center w-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl transition-all duration-300 ${currentTheme} ${error ? 'border-prism-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''}`}>
        {Icon && (
          <div className="absolute left-5 text-white/30">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-transparent border-none py-4 text-white placeholder:text-white/30 outline-none font-medium ${Icon ? 'pl-14' : 'pl-6'} ${isPassword ? 'pr-12' : 'pr-6'} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-white/30 hover:text-white transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs font-bold text-prism-rose uppercase tracking-widest pl-2">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
