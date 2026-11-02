import React from 'react';
import { 
  CalendarRange, 
  UserCheck, 
  Network, 
  BarChart3, 
  Sparkles, 
  Layers, 
  BedDouble, 
  ReceiptText,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenBookingEngine: () => void;
  pendingCheckInsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenBookingEngine,
  pendingCheckInsCount,
}) => {
  const navItems = [
    {
      id: 'tape-chart',
      label: 'Room Tape Chart',
      sublabel: 'Interactive Calendar',
      icon: CalendarRange,
    },
    {
      id: 'front-desk',
      label: 'Front Desk & Folios',
      sublabel: 'Check-In, Ledger, Billing',
      icon: UserCheck,
      badge: pendingCheckInsCount > 0 ? `${pendingCheckInsCount}` : undefined,
    },
    {
      id: 'channel-manager',
      label: 'Channel Manager',
      sublabel: 'OTA Gateway & Simulator',
      icon: Network,
      highlight: true,
    },
    {
      id: 'analytics',
      label: 'Executive Analytics',
      sublabel: 'RevPAR, ADR, Yields',
      icon: BarChart3,
    },
    {
      id: 'housekeeping',
      label: 'Housekeeping',
      sublabel: 'Sanitation & Status',
      icon: BedDouble,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-surface-border bg-surface-card flex flex-col justify-between hidden md:flex">
      <div className="p-3 space-y-1">
        <div className="px-3 pt-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
          PMS Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full group text-left px-3.5 py-3 rounded-xl flex items-center gap-3.5 transition-all relative ${
                isActive
                  ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-slate-100'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-gold-glow"></div>
              )}
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold/20 text-gold'
                    : 'bg-white/[0.03] text-slate-400 group-hover:text-slate-200 group-hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-semibold tracking-wide truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate">{item.sublabel}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Guest Experience Banner */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-surface-border">
        <div className="flex items-center gap-2 mb-2 text-gold">
          <Sparkles className="w-4 h-4" />
          <span className="font-serif text-xs font-semibold tracking-wider">Direct Experience</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Preview the high-touch direct reservation experience as a sovereign guest.
        </p>
        <button
          onClick={onOpenBookingEngine}
          className="w-full py-2 px-3 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Launch Booking Portal</span>
        </button>
      </div>
    </aside>
  );
};

