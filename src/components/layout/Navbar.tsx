import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePmsStore } from '../../store/usePmsStore';
import {
  Building2,
  Clock,
  ChevronDown,
  RotateCcw,
  LogOut,
  Menu
} from 'lucide-react';
import { format } from 'date-fns';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const {
    properties,
    activePropertyId,
    setActiveProperty,
    resetToMockData,
    currentUser,
    logout
  } = usePmsStore();

  const [currentTime, setCurrentTime] = useState<string>('');
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
            <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-full">
                {/* Left: Hamburger + Clickable Brand/Property Switcher */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile Hamburger Button */}
                  <button
                    onClick={onToggleMobileMenu}
                    className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors lg:hidden shrink-0"
                    title="Toggle Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  {/* Combined Brand & Property Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPropMenu(!showPropMenu)}
                      className="flex items-center gap-2.5 p-1 -m-1 sm:p-1.5 sm:-m-1.5 rounded-2xl hover:bg-stone-100/80 transition-all text-left group"
                      title="Click to Switch Hotel Property"
                    >
                      <img
                        src={activeProperty.logoUrl || "https://bookonelocal.in/cdn/2026-04-07-121907443-logo2.jpg"}
                        alt={activeProperty.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-[#B48C36]/40 shadow-sm shrink-0"
                      />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                              <span className="font-serif text-sm sm:text-base font-bold tracking-wider text-stone-900 uppercase truncate max-w-[150px] sm:max-w-[220px] md:max-w-[280px]">
                                {activeProperty.name}
                              </span>
                                <span className="text-[9px] font-mono text-[#936F25] bg-[#FAF6EC] border border-[#B48C36]/30 px-1.5 py-0.2 rounded-full font-bold uppercase shrink-0">
                                  PMS
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform shrink-0" />
                              </div>
                              <p className="text-[10px] text-stone-500 font-sans truncate max-w-[180px] sm:max-w-[260px]">
                                {activeProperty.city}, {activeProperty.state}
                              </p>
                          </div>
                      </button>

                            {/* Property Selector Dropdown Menu */}
                            {showPropMenu && (
                              <div className="absolute left-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white border border-stone-200 shadow-2xl p-2 z-50 animate-in fade-in">
                                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-100 font-bold">
                                  Switch Active Property
                                </div>
                                <div className="max-h-80 overflow-y-auto space-y-1 mt-1">
                                  {properties.map((prop) => (
                                    <button
                                      key={prop.id}
                                      onClick={() => {
                                        setActiveProperty(prop.id);
                                        setShowPropMenu(false);
                                      }}
                                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${prop.id === activePropertyId
                                          ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/40 font-bold'
                                          : 'text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                      <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${prop.id === activePropertyId ? 'text-[#B48C36]' : 'text-stone-400'}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-stone-900 truncate">{prop.name}</p>
                                        <p className="text-[10px] text-stone-500 truncate">{prop.city}, {prop.state}</p>
                                        <span className="text-[9px] font-mono text-[#936F25]">GSTIN: {prop.gstin}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
              </div>
                        )}
                      </div>
                    </div>

                      {/* Center: Live Sync & Clock (Auto-hides on compact viewports to prevent any overlap) */}
                      <div className="hidden 2xl:flex items-center gap-3 bg-stone-50 border border-stone-200/90 rounded-full px-3.5 py-1 text-xs text-stone-700 shadow-sm shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="font-mono text-[11px] text-stone-600 font-bold">6 OTAs Synced</span>
                        </div>
                        <span className="text-stone-300">•</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-700">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{currentTime || '14:30:00'} IST</span>
                        </div>
                      </div>

                        {/* Right: Operator Profile + Sign Out + Reset */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {/* Operator Profile */}
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200/90 text-xs">
                            <div className="w-6 h-6 rounded-full bg-[#B48C36]/20 text-[#B48C36] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                              {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
                            </div>
                              <div className="text-left text-[11px] hidden md:block">
                                <p className="font-bold text-stone-900 leading-tight truncate max-w-[120px]">
                                  {currentUser?.name || 'General Manager'}
                                </p>
                                <p className="text-[9px] font-mono text-stone-500 leading-tight">
                                  {currentUser?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Hotel Manager'}
                                </p>
                              </div>
                            </div>

                              {/* Sign Out Button */}
                              <button
                                onClick={() => {
                                  logout();
                                  navigate('/login');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif font-bold transition-all shadow-sm shrink-0"
                                title="Sign Out"
                              >
                                <LogOut className="w-3.5 h-3.5 text-stone-500" />
                                <span className="hidden sm:inline">Sign Out</span>
                              </button>

                            {/* Reset Mock Data */}
                            <button
                              onClick={resetToMockData}
                              title="Reset System to Pristine State"
                              className="p-1.5 sm:p-2 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 transition-colors shadow-sm shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                    </div>
                  </header>
                  );
};
