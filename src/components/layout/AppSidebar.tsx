import React, { useState } from 'react';
import { 
  CalendarRange, 
  UserCheck, 
  Utensils, 
  Network, 
  BedDouble, 
  Users, 
  Moon, 
  BarChart3, 
  Compass, 
  Database,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCheckIns: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenBookingEngine?: () => void;
  onOpenDbModal?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCheckIns,
  mobileOpen,
  onCloseMobile,
  onOpenBookingEngine,
  onOpenDbModal
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'tape-chart', label: 'Room Tape Chart', sub: 'Interactive Matrix', icon: CalendarRange },
    { id: 'front-desk', label: 'Front Desk & Folios', sub: 'Arrivals & Check-In', icon: UserCheck, badge: pendingCheckIns },
    { id: 'pos', label: 'POS & Services', sub: 'Dining & Outlets', icon: Utensils },
    { id: 'channel-manager', label: 'Channel Manager', sub: 'OTA 2-Way Sync', icon: Network, highlight: true },
    { id: 'housekeeping', label: 'Housekeeping', sub: 'Cleanliness & Tickets', icon: BedDouble },
    { id: 'crm', label: 'Guest CRM', sub: 'Profiles & KYC', icon: Users },
    { id: 'reports', label: 'Night Audit & Reports', sub: 'Day Close & GST', icon: Moon },
    { id: 'kpi', label: 'Executive Analytics', sub: 'RevPAR & Yields', icon: BarChart3 },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white border-r border-stone-200 transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Top Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between lg:hidden">
            <span className="font-serif text-sm font-bold text-stone-900">PMS Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Toggle Button */}
          <div className="hidden lg:flex items-center justify-end px-3 pt-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            {!collapsed && (
              <div className="px-3 pt-1 pb-2 text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                Operations
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full group text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all relative ${
                    isActive
                      ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/50 shadow-sm font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#B48C36] rounded-r-full" />
                  )}

                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isActive ? 'text-[#936F25]' : 'text-stone-400 group-hover:text-stone-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 font-sans truncate">{item.sub}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-stone-200 space-y-2">
          {/* SQLite Manager shortcut */}
          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              title={collapsed ? 'SQLite Database Manager' : undefined}
              className={`w-full py-2 px-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-serif font-bold flex items-center transition-colors ${
                collapsed ? 'justify-center' : 'gap-2'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {!collapsed && <span className="truncate">SQLite Database</span>}
            </button>
          )}

          {/* Launch Guest Engine button */}
          {onOpenBookingEngine && (
            <button
              onClick={onOpenBookingEngine}
              title={collapsed ? 'Guest Direct Engine' : undefined}
              className={`w-full py-2 px-2.5 rounded-xl bg-[#FAF6EC] hover:bg-[#F5EDD6] border border-[#B48C36]/30 text-[#936F25] text-xs font-serif font-bold flex items-center transition-colors ${
                collapsed ? 'justify-center' : 'gap-2'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              {!collapsed && <span className="truncate">Guest Booking Engine</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

