export const VelaLogoFull = ({ size = 32, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <VelaLogoIcon size={size} />
    <span className="font-display font-bold tracking-tighter text-white" style={{ fontSize: size * 0.75 }}>
      VELA<span className="text-prism-cyan">.</span>
    </span>
  </div>
);

export const VelaLogoIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} filter drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]`}
  >
    {/* Background Glow */}
    <circle cx="20" cy="20" r="15" fill="url(#logo_glow)" opacity="0.15" />
    
    {/* Main "V" Strokes */}
    <path 
      d="M10 12 L20 30 L30 12" 
      stroke="url(#logo_grad_main)" 
      strokeWidth="4.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Inner Precision Taper */}
    <path 
      d="M14 14 L20 25 L26 14" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      opacity="0.6"
    />

    {/* Central Data Point */}
    <circle cx="20" cy="12" r="2.5" fill="url(#logo_grad_point)" />

    <defs>
      <linearGradient id="logo_grad_main" x1="10" y1="12" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06B6D4" />
        <stop offset="1" stopColor="#D946EF" />
      </linearGradient>
      
      <linearGradient id="logo_grad_point" x1="17.5" y1="9.5" x2="22.5" y2="14.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D946EF" />
        <stop offset="1" stopColor="#F43F5E" />
      </linearGradient>

      <radialGradient id="logo_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 20) rotate(90) scale(15)">
        <stop stopColor="#06B6D4" />
        <stop offset="1" stopColor="transparent" />
      </radialGradient>
    </defs>
  </svg>
);
