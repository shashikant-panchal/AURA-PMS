import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePmsStore } from '../store/usePmsStore';
import { TapeChart } from '../components/tape-chart/TapeChart';
import { FrontDeskManager } from '../components/check-in/FrontDeskManager';
import { ChannelSimulationCenter } from '../components/channel-manager/ChannelSimulationCenter';
import { ExecutiveAnalytics } from '../components/analytics/ExecutiveAnalytics';
import { HousekeepingManager } from '../components/housekeeping/HousekeepingManager';
import { GuestFolioModal } from '../components/folio/GuestFolioModal';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  RotateCcw,
  ChevronDown,
  Compass,
  CalendarRange,
  UserCheck,
  Network,
  BarChart3,
  BedDouble,
  ArrowRight,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';

export const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    properties, 
    activePropertyId, 
    setActiveProperty, 
    selectedDate, 
    resetToMockData,
    reservations,
    rooms,
    currentUser,
    logout
  } = usePmsStore();

  const [activeTab, setActiveTab] = useState<'kpi' | 'tape-chart' | 'front-desk' | 'channel-manager' | 'housekeeping'>('tape-chart');
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
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
  const pendingCheckIns = reservations.filter((r) => r.status === 'Confirmed').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAFAF8] text-[#1C1917] font-sans select-none">
      {/* 1. Persistent Top Navigation Header (Light Luxury) */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md px-6 py-3 shadow-soft-luxury">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Dynamic Brand Set by Super Admin */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={activeProperty.logoUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80"}
                alt={activeProperty.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#B48C36]/40 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-widest text-stone-900 uppercase">
                    {activeProperty.name}
                  </span>
                  <span className="text-[10px] tracking-widest font-mono text-[#936F25] bg-[#FAF6EC] border border-[#B48C36]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    HOTEL PMS
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">{activeProperty.tagline}</p>
              </div>
            </div>

            {/* Property Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowPropMenu(!showPropMenu)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#B48C36] text-left transition-all group shadow-sm"
              >
                <Building2 className="w-4 h-4 text-[#B48C36]" />
                <div>
                  <p className="text-xs font-serif font-bold text-stone-900 line-clamp-1">{activeProperty.name}</p>
                  <p className="text-[10px] text-stone-500 font-mono">{activeProperty.location || `${activeProperty.city}, ${activeProperty.state}`}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 ml-1 transition-colors" />
              </button>

              {showPropMenu && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-stone-400 border-b border-stone-100 font-bold">
                    Select Luxury Portfolio Property
                  </div>
                  {properties.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => {
                        setActiveProperty(prop.id);
                        setShowPropMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                        prop.id === activePropertyId
                          ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/40 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 mt-0.5 ${prop.id === activePropertyId ? 'text-[#B48C36]' : 'text-stone-400'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-900">{prop.name}</p>
                        <p className="text-[10px] text-stone-500">{prop.location || `${prop.city}, ${prop.state}`}</p>
                        <span className="text-[9px] font-mono text-[#936F25]">GSTIN: {prop.gstin}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Live Calendar Anchor & Clock */}
          <div className="hidden lg:flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2 pr-3 border-r border-stone-200">
              <CalendarIcon className="w-3.5 h-3.5 text-[#B48C36]" />
              <span className="text-xs font-mono font-bold text-stone-800">{format(new Date(selectedDate), 'dd MMMM yyyy')}</span>
            </div>

            <div className="flex items-center gap-2 pr-3 border-r border-stone-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-mono font-bold text-emerald-700">{currentTime || '21:45:00'} IST</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-stone-600 font-bold">4 OTAs Synced</span>
            </div>
          </div>

          {/* Right: Operator Profile & Sign Out Button (Prompt requirement 4.B) */}
          <div className="flex items-center gap-3">
            {/* Operator Profile */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-[#B48C36]/20 text-[#B48C36] flex items-center justify-center font-serif text-xs font-bold">
                {currentUser?.name ? currentUser.name.charAt(0) : 'V'}
              </div>
              <div className="text-left text-[11px]">
                <p className="font-bold text-stone-900 leading-tight">
                  {currentUser?.name || 'Vikramaditya Singh'}
                </p>
                <p className="text-[9px] font-mono text-stone-500">
                  {currentUser?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Hotel Manager'}
                </p>
              </div>
            </div>

            {/* If Super Admin is viewing Hotel PMS, offer 1-click return to Super Admin */}
            {currentUser?.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => navigate('/superadmin')}
                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-mono font-bold transition-colors"
              >
                /superadmin
              </button>
            )}

            {/* Sign Out Button (Prompt requirement 4.B) */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif font-bold transition-all shadow-sm"
              title="End session and return to Login"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Sign Out</span>
            </button>

            {/* Reset Seed Data */}
            <button
              onClick={resetToMockData}
              title="Reset Mock Data to Pristine Luxury State"
              className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-stone-800 transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs inside /admin */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100 overflow-x-auto">
          {[
            { id: 'tape-chart', label: 'Room Tape Chart', icon: CalendarRange },
            { id: 'front-desk', label: 'Front Desk & Express Check-In', icon: UserCheck, badge: pendingCheckIns },
            { id: 'kpi', label: 'Executive KPI Dashboard', icon: BarChart3 },
            { id: 'channel-manager', label: 'Channel Manager Gateway', icon: Network, highlight: true },
            { id: 'housekeeping', label: 'Housekeeping & Cleanliness', icon: BedDouble },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B48C36]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeTab === 'tape-chart' && (
          <TapeChart onSelectReservation={(resId) => setSelectedReservationId(resId)} />
        )}

        {activeTab === 'front-desk' && (
          <FrontDeskManager onOpenFolio={(resId) => setSelectedReservationId(resId)} />
        )}

        {activeTab === 'kpi' && (
          <ExecutiveAnalytics />
        )}

        {activeTab === 'channel-manager' && (
          <ChannelSimulationCenter />
        )}

        {activeTab === 'housekeeping' && (
          <HousekeepingManager />
        )}
      </main>

      {/* Global Interactive Guest Folio & Settlement Modal */}
      {selectedReservationId && (
        <GuestFolioModal
          reservationId={selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
        />
      )}
    </div>
  );
};

