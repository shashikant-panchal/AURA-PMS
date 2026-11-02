import React from 'react';

export type OtaPartner = 'MakeMyTrip' | 'MAKEMYTRIP' | 'Goibibo' | 'GOIBIBO' | 'Booking.com' | 'BOOKING_COM' | 'Agoda' | 'AGODA' | 'Expedia' | 'EXPEDIA' | 'Airbnb' | 'AIRBNB' | 'Direct Web' | 'DIRECT_WEB' | 'Walk-In' | 'WALK_IN' | 'Luxury Escapes';

interface OtaLogoProps {
  channel: OtaPartner | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const OtaLogo: React.FC<OtaLogoProps> = ({
  channel,
  size = 'sm',
  showText = true,
  className = '',
}) => {
  const norm = channel.toUpperCase().replace(/\s+/g, '_').replace('.', '_');

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

  // 2. Goibibo (Orange #F26722 and Blue #1C8FE3)
  if (norm.includes('GOIBIBO') || norm === 'GOI') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-[#F26722]/30 text-[#1C1917] font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 28 28" className="h-3.5 w-auto" aria-label="Goibibo">
          <circle cx="9" cy="14" r="7" fill="#F26722" />
          <circle cx="19" cy="14" r="7" fill="#1C8FE3" fillOpacity="0.9" />
          <path d="M9 11l3 3-3 3M19 11l-3 3 3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {showText && (
          <span className="tracking-tight text-[11px] leading-none">
            <span className="text-[#F26722] font-black">go</span>
            <span className="text-[#1C8FE3] font-bold">ibibo</span>
          </span>
        )}
      </div>
    );
  }

  // 3. Booking.com (Deep Navy Blue #003580)
  if (norm.includes('BOOKING') || norm === 'BDC') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#003580] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-auto fill-current" aria-label="Booking.com">
          <path d="M5 4h6.5c3 0 5.5 1.5 5.5 4 0 1.5-.8 2.8-2.2 3.4 1.8.6 2.7 2 2.7 3.8 0 2.8-2.4 4.8-5.8 4.8H5V4zm3.2 6h3c1.3 0 2.3-.6 2.3-1.8 0-1.1-.9-1.7-2.3-1.7H8.2V10zm0 7.5h3.3c1.5 0 2.6-.7 2.6-2.1 0-1.3-1.1-2.1-2.6-2.1H8.2v4.2z" fill="#FFFFFF" />
          <circle cx="20" cy="17.5" r="1.8" fill="#00BAFC" />
        </svg>
        {showText && <span className="tracking-tight font-extrabold text-[11px] leading-none">Booking.com</span>}
      </div>
    );
  }

  // 4. Agoda (Five Multicolored Dots)
  if (norm.includes('AGODA') || norm === 'AGD') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <div className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA2330]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
        </div>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none text-stone-900">agoda</span>}
      </div>
    );
  }

  // 5. Expedia (Navy #000055 with Yellow Airplane)
  if (norm.includes('EXPEDIA')) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#000055] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-auto" fill="#FFCC00">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none">Expedia</span>}
      </div>
    );
  }

  // 6. Airbnb (Coral #FF5A5F)
  if (norm.includes('AIRBNB')) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FF5A5F] text-white font-sans font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-auto fill-current">
          <path d="M12 2C8 2 5 6 5 10c0 4 3 8 7 12 4-4 7-8 7-12 0-4-3-8-7-8zm0 15c-2 0-3-1.5-3-3.5s1-3.5 3-3.5 3 1.5 3 3.5-1 3.5-3 3.5z" />
        </svg>
        {showText && <span className="tracking-tight font-bold text-[11px] leading-none">airbnb</span>}
      </div>
    );
  }

  // 7. Direct Web (Polished Warm Gold & Charcoal)
  if (norm.includes('DIRECT') || norm === 'DIRECT_WEB') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FAF6EC] border border-[#B48C36]/40 text-[#936F25] font-serif font-bold shadow-sm ${heightClass} ${className}`}>
        <svg viewBox="0 0 24 24" className="h-3 w-auto fill-[#B48C36]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        {showText && <span className="tracking-wider uppercase text-[10px] font-mono font-bold">DIRECT WEB</span>}
      </div>
    );
  }

  // Default: Front Desk Walk-In
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[10px] font-semibold ${heightClass} ${className}`}>
      <span>WALK-IN</span>
    </div>
  );
};

