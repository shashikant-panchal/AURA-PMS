import React, { useState, useEffect } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  Clock, 
  RefreshCw, 
  Sparkles, 
  Globe, 
  Zap, 
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  onOpenBookingEngine: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBookingEngine, activeView, setActiveView }) => {
  const { 
    properties, 
    activePropertyId, 
    setActiveProperty, 
    selectedDate, 
    setSelectedDate,
    simulateOtaInbound,
    simulateDirectBooking,
    triggerRateParitySync,
    resetToMockData,
    channels 
  } = usePmsStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showPropMenu, setShowPropMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(format(now, 'HH:mm:ss'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-obsidian/95 backdrop-blur-md px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Property Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold/30 via-gold/10 to-transparent border border-gold/40 flex items-center justify-center shadow-gold-glow">
              <span className="font-serif font-black text-gold text-lg tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-widest text-slate-100 uppercase">AURA</span>
                <span className="text-[10px] tracking-widest font-mono text-gold bg-gold/10 border border-gold/20 px-1.5 py-0.5 rounded uppercase">PMS & OTA</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight">Sovereign Hospitality Intelligence</p>
            </div>
          </div>

          {/* Property Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowPropMenu(!showPropMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-gold/40 text-left transition-all group"
            >
              <Building2 className="w-4 h-4 text-gold/70 group-hover:text-gold transition-colors" />
              <div>
                <p className="text-xs font-serif font-semibold text-slate-200 line-clamp-1">{activeProperty.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{activeProperty.location || `${activeProperty.city}, ${activeProperty.state}`}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold ml-1 transition-colors" />
            </button>

            {showPropMenu && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-surface-elevated border border-surface-border backdrop-blur-2xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-surface-border">
                  Select Luxury Portfolio Property
                </div>
                {properties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => {
                      setActiveProperty(prop.id);
                      setShowPropMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                      prop.id === activePropertyId
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 mt-0.5 ${prop.id === activePropertyId ? 'text-gold' : 'text-slate-500'}`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-100">{prop.name}</p>
                      <p className="text-[10px] text-slate-400">{prop.location || `${prop.city}, ${prop.state}`}</p>
                      <span className="text-[9px] font-mono text-gold/80">GSTIN: {prop.gstin}</span>
                    </div>
                    {prop.id === activePropertyId && <CheckCircle2 className="w-4 h-4 text-gold" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Calendar Anchor & Clock */}
        <div className="hidden lg:flex items-center gap-3 bg-surface-card/80 border border-surface-border rounded-xl px-3.5 py-1.5">
          <div className="flex items-center gap-2 pr-3 border-r border-surface-border">
            <CalendarIcon className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-mono text-slate-300">{format(new Date(selectedDate), 'dd MMMM yyyy')}</span>
          </div>

          <div className="flex items-center gap-2 pr-3 border-r border-surface-border">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-emerald-400">{currentTime || '21:14:00'} IST</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-400">4 OTAs Connected</span>
          </div>
        </div>

        {/* Right: Quick Simulations & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Simulation Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-gold/30 text-gold-light hover:bg-gold/10 hover:border-gold transition-all text-xs font-medium shadow-sm"
              title="Channel Manager Simulation Triggers"
            >
              <Zap className="w-3.5 h-3.5 text-gold" />
              <span>Simulate OTA</span>
              <ChevronDown className="w-3 h-3 text-gold/70" />
            </button>

            {showSimMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-elevated border border-surface-border backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gold border-b border-surface-border mb-1">
                  ⚡ Channel Simulation Gateway
                </div>
                
                <button
                  onClick={() => {
                    simulateOtaInbound('MakeMyTrip');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Simulate Inbound MakeMyTrip
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-gold">+Res</span>
                </button>

                <button
                  onClick={() => {
                    simulateOtaInbound('Booking.com');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Simulate Inbound Booking.com
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-gold">+Res</span>
                </button>

                <button
                  onClick={() => {
                    simulateDirectBooking();
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Simulate Direct Web Booking
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-gold">0% Comm</span>
                </button>

                <div className="my-1 border-t border-surface-border"></div>

                <button
                  onClick={() => {
                    triggerRateParitySync();
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-gold-light hover:bg-gold/15 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gold" />
                  <span>Broadcast Rate Parity Audit</span>
                </button>
              </div>
            )}
          </div>

          {/* Guest Booking Engine Preview Button */}
          <button
            onClick={onOpenBookingEngine}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold/90 via-gold to-gold-light text-obsidian font-serif font-bold text-xs tracking-wide shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-obsidian" />
            <span className="hidden sm:inline">Guest Booking Portal</span>
            <span className="sm:hidden">Book</span>
            <ExternalLink className="w-3 h-3 text-obsidian/70" />
          </button>

          {/* Reset Mock Data Button */}
          <button
            onClick={resetToMockData}
            title="Reset Mock Data to Pristine Luxury State"
            className="p-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

