import React from 'react';

export type OtaPartner = 'MakeMyTrip' | 'MAKEMYTRIP' | 'Goibibo' | 'GOIBIBO' | 'Booking.com' | 'BOOKING_COM' | 'Agoda' | 'AGODA' | 'Expedia' | 'EXPEDIA' | 'Airbnb' | 'AIRBNB' | 'Direct Web' | 'DIRECT_WEB' | 'Walk-In' | 'WALK_IN' | 'Luxury Escapes';

interface OtaLogoProps {
  channel?: OtaPartner | string;
  source?: OtaPartner | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const OtaLogo: React.FC<OtaLogoProps> = ({
  channel,
  source,
  size = 'sm',
  showText = true,
  className = '',
}) => {
  const channelName = channel || source || 'Direct Web';
  const norm = channelName.toUpperCase().replace(/\s+/g, '_').replace('.', '_');

  // Size mapping
  const heightClass = {
    xs: 'h-4 text-[10px]',
    sm: 'h-5 text-xs',
    md: 'h-7 text-xs',
    lg: 'h-9 text-sm',
  }[size];

  // 1. MakeMyTrip (Red #EA2330 with White / Yellow emblem)
  if (norm.includes('MAKEMYTRIP') || norm === 'MMT') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EA2330] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 40 24" className="h-3.5 w-auto fill-current" aria-label="MakeMyTrip">
          <circle cx="12" cy="12" r="9" fill="#FFFFFF" fillOpacity="0.2" />
          <path d="M7 16V8l5 5 5-5v8h-2.5v-4.5L12 14l-2.5-2.5V16H7z" fill="#FFFFFF" />
          <path d="M22 16V8l5 5 5-5v8h-2.5v-4.5L27 14l-2.5-2.5V16H22z" fill="#FFFFFF" />
        </svg>
        {showText && <span className="tracking-tight font-extrabold text-[11px] leading-none">MMT</span>}
      </div>
    );
  }

  // 2. Goibibo (Orange #EC5B24 & Blue badge)
  if (norm.includes('GOIBIBO') || norm === 'GOI') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EC5B24] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 32 24" className="h-3.5 w-auto fill-current" aria-label="Goibibo">
          <circle cx="8" cy="12" r="6" fill="#FFFFFF" />
          <path d="M16 6h10v4H16zM16 14h10v4H16z" fill="#FFFFFF" />
        </svg>
        {showText && <span className="tracking-tight font-extrabold text-[11px] leading-none">goibibo</span>}
      </div>
    );
  }

  // 3. Booking.com (Dark Blue #003580)
  if (norm.includes('BOOKING') || norm === 'BDC') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#003580] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <span className="font-extrabold tracking-tighter text-xs leading-none">B.</span>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none">Booking.com</span>}
      </div>
    );
  }

  // 4. Agoda (Teal #0B7285 with red/yellow dots)
  if (norm.includes('AGODA')) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-900 font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <div className="flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        </div>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none text-stone-800">agoda</span>}
      </div>
    );
  }

  // 5. Expedia (Yellow #FEE100 and Navy #002244)
  if (norm.includes('EXPEDIA')) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#002244] text-[#FEE100] font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3 w-auto fill-current">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none">Expedia</span>}
      </div>
    );
  }

  // 6. Airbnb (Rausch Pink #FF5A5F)
  if (norm.includes('AIRBNB')) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FF5A5F] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3 w-auto fill-current">
          <path d="M12 2C8.5 2 6 5 6 8.5c0 4 6 11.5 6 11.5s6-7.5 6-11.5C18 5 15.5 2 12 2zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none">airbnb</span>}
      </div>
    );
  }

  // 7. Direct Web Engine
  if (norm.includes('DIRECT') || norm.includes('WEB')) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF6EC] border border-[#B48C36]/50 text-[#936F25] font-serif font-bold ${heightClass} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#B48C36]"></span>
        {showText && <span className="text-[11px] leading-none">Direct Web</span>}
      </div>
    );
  }

  // Default Walk-In / Hotel Front Desk
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 font-sans font-bold ${heightClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
      {showText && <span className="text-[11px] leading-none">{channelName}</span>}
    </div>
  );
};
