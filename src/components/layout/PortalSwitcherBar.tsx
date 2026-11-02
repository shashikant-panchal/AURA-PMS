import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, BedDouble, LayoutDashboard, Compass } from 'lucide-react';
import { usePmsStore } from '../../store/usePmsStore';

export const PortalSwitcherBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations, rooms } = usePmsStore();

  const isAdmin = location.pathname.startsWith('/admin');
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const totalCount = rooms.length;

  return (
    <div className="bg-[#1C1917] text-white border-b border-stone-800 px-4 py-2 flex items-center justify-between text-xs z-50 sticky top-0 shadow-md">
      {/* Left: Active Portal Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#B48C36] animate-pulse"></span>
          <span className="text-stone-400 uppercase tracking-wider">Active Portal:</span>
          <span className="font-bold text-[#E5C378]">
            {isAdmin ? 'Hotel Owner & Front-Desk PMS (/admin)' : 'Guest Direct Booking Website (/)'}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-stone-800 text-stone-400 text-[11px] font-mono">
          <span>{totalCount} Total Suites</span>
          <span>•</span>
          <span className="text-emerald-400">{totalCount - occupiedCount} Available</span>
          <span>•</span>
          <span>{reservations.length} Active Reservations</span>
        </div>
      </div>

      {/* Right: Instant Route Switcher Button */}
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF6EC] hover:bg-white text-[#936F25] font-serif font-bold text-xs border border-[#B48C36]/40 transition-all shadow-sm group"
          >
            <Compass className="w-3.5 h-3.5 text-[#B48C36]" />
            <span>Switch to Guest Direct Booking Site (/)</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs transition-all shadow-gold-glow group"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-stone-900" />
            <span>Switch to Hotel Admin PMS (/admin)</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

