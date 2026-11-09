import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  variant = 'light',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Pasher Shop Logo Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0`}
        aria-label="Pasher Shop Logo"
      >
        <svg
          viewBox="0 0 1254 1254"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location Pin colored in brand blue #0B4A8A or white on dark */}
          <path
            fill={isDark ? '#FFFFFF' : '#0B4A8A'}
            fillRule="evenodd"
            d="M624 122C420 122 254 288 254 490C254 600 300 680 360 755L606 1054Q624 1070 642 1054L888 755C948 680 994 600 994 490C994 288 828 122 624 122Z M624 186A308 308 0 1 0 624 802A308 308 0 1 0 624 186Z"
          />

          {/* Inside Store Awning, Legs & Arrow Pointer in brand orange #FF7900 */}
          <g fill="#FF7900">
            {/* Awning */}
            <path d="M476 280L558 280L514 436C500 475 465 492 438 491C400 490 373 462 373 433C373 420 378 412 384 405Z" />
            <path d="M577 280L674 280L709 425C716 465 675 497 624 497C573 497 535 465 539 425Z" />
            <path d="M692 280L773 280L866 408C874 420 876 428 876 435C874 465 845 491 810 491C775 491 745 468 735 436Z" />

            {/* Store pillars */}
            <path d="M418 508L470 508L470 718C450 706 430 692 418 678Z" />
            <path d="M783 508L833 508L833 678C820 692 802 706 783 718Z" />

            {/* Click Cursor Arrow */}
            <polygon points="529,511 709,573 664,604 757,697 718,738 624,644 585,699" />
          </g>
        </svg>
      </div>

      {/* Brand Text Lockup */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight ${textSizes[size]} leading-none`}>
          <span className={isDark ? 'text-white' : 'text-[#0B4A8A]'}>Pasher </span>
          <span className="text-[#FF7900]">Shop</span>
        </div>
        {showTagline && (
          <span className={`text-[11px] font-medium tracking-normal mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
            আপনার পাশের দোকান, এখন অনলাইনে।
          </span>
        )}
      </div>
    </div>
  );
};
