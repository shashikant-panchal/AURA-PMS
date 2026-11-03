import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { Reservation, Room, RoomCategory } from '../../types/hotel';
import { formatINR } from '../../utils/currency';
import { formatDateEditorial, getTodayStr } from '../../utils/dateUtils';
import { OtaLogo } from '../common/OtaLogo';
import { 
  Search, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  CreditCard,
  Plus,
  BedDouble,
  Clock,
  Phone
} from 'lucide-react';
import { QuickReservationModal } from '../tape-chart/QuickReservationModal';

interface FrontDeskManagerProps {
  onOpenFolio: (reservationId: string) => void;
}

export const FrontDeskManager: React.FC<FrontDeskManagerProps> = ({ onOpenFolio }) => {
  const { reservations, checkInGuest, rooms, categories, selectedDate } = usePmsStore();

  const [activeTab, setActiveTab] = useState<'arrivals' | 'inhouse' | 'departures' | 'all'>('arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerificationRes, setSelectedVerificationRes] = useState<Reservation | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  const todayStr = selectedDate || getTodayStr();

  // Filters
  const arrivals = reservations.filter(
    (r) => r.status === 'Confirmed' && r.checkInDate <= todayStr
  );
  const inHouse = reservations.filter((r) => r.status === 'Checked-In');
  const departures = reservations.filter(
    (r) => r.status === 'Checked-In' && r.checkOutDate <= todayStr
  );

  const currentList = () => {
    let list: Reservation[] = [];
    if (activeTab === 'arrivals') list = arrivals;
    else if (activeTab === 'inhouse') list = inHouse;
    else if (activeTab === 'departures') list = departures;
    else list = reservations;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (r) =>
        r.guest.fullName.toLowerCase().includes(q) ||
        r.bookingCode.toLowerCase().includes(q) ||
        r.guest.phone.includes(q) ||
        r.roomId.toLowerCase().includes(q)
    );
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Standard';
  };

  const availableRoomForWalkIn = rooms.find((r) => r.status === 'Available') || rooms[0];
  const availableCatForWalkIn = categories.find((c) => c.id === availableRoomForWalkIn?.categoryId) || categories[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8] p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* KPI Operations Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
            Expected Arrivals
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{arrivals.length}</span>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              Pending Check-In
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
            In-House In Residence
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-700">{inHouse.length}</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              Active Folios
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
            Due Departures
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{departures.length}</span>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
              Due Today
            </span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
            Total Inventory Units
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#936F25]">{rooms.length}</span>
            <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-bold">
              4 Floors
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'arrivals', label: 'Expected Arrivals', count: arrivals.length },
            { id: 'inhouse', label: 'In-House Guests', count: inHouse.length },
            { id: 'departures', label: 'Expected Departures', count: departures.length },
            { id: 'all', label: 'All Reservations', count: reservations.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/50 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] ${
                activeTab === tab.id ? 'bg-[#B48C36]/20 text-[#936F25]' : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Search & Walk-In Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Guest, code, phone, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#B48C36]"
            />
          </div>

          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white text-xs font-serif font-bold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Walk-In</span>
            <span className="sm:hidden">Walk-In</span>
          </button>
        </div>
      </div>

      {/* Reservation Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {currentList().map((res) => {
          const roomUnit = rooms.find((r) => r.id === res.roomId);
          const categoryName = getCategoryName(res.categoryId);

          return (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36]/40 shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
            >
              {/* Left Guest Info */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                  <OtaLogo source={res.source} size="md" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#936F25] transition-colors truncate">
                      {res.guest.salutation} {res.guest.fullName}
                    </span>
                    {res.guest.vipStatus && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                        VIP
                      </span>
                    )}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      res.status === 'Checked-In'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : res.status === 'Confirmed'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {res.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-serif mt-0.5">
                    Room {roomUnit?.roomNumber || res.roomId.replace('bse-', '')} • {categoryName}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-stone-500 mt-1 flex-wrap">
                    <span>Code: <strong className="text-stone-800">{res.bookingCode}</strong></span>
                    <span>•</span>
                    <span>{formatDateEditorial(res.checkInDate)} – {formatDateEditorial(res.checkOutDate)} ({res.nights} nts)</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-stone-400" />
                      {res.guest.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions & Folio Details */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                <div className="text-left lg:text-right font-mono">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Rate / Night</p>
                  <p className="text-xs font-bold text-stone-900">{formatINR(res.roomRatePerNight)}</p>
                  <p className="text-[10px] text-[#936F25] font-semibold">{res.folio.length} Posted Items</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Verify ID Button */}
                  <button
                    onClick={() => setSelectedVerificationRes(res)}
                    className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#B48C36] text-xs text-stone-700 hover:text-[#936F25] flex items-center gap-1.5 transition-colors font-medium shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verify ID</span>
                  </button>

                  {/* View Folio */}
                  <button
                    onClick={() => onOpenFolio(res.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/50 text-[#936F25] hover:bg-[#F5EDD6] text-xs font-serif font-bold transition-colors shadow-sm"
                  >
                    Folio
                  </button>

                  {/* Check-In / Check-Out Actions */}
                  {res.status === 'Confirmed' && (
                    <button
                      onClick={() => checkInGuest(res.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif font-bold hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Check-In</span>
                    </button>
                  )}

                  {res.status === 'Checked-In' && (
                    <button
                      onClick={() => onOpenFolio(res.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif font-bold hover:bg-rose-100 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Check-Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {currentList().length === 0 && (
          <div className="p-12 text-center border border-dashed border-stone-300 rounded-2xl bg-white shadow-sm">
            <UserCheck className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-serif text-stone-700">No reservations found matching this view.</p>
            <p className="text-xs text-stone-500 mt-1">Try switching tabs or clearing your search filter.</p>
          </div>
        )}
      </div>

      {/* Guest Identification Card Modal (Aadhaar / Passport Luxury Mock) */}
      {selectedVerificationRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 text-[#936F25]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Government Identity Verification
                </h4>
              </div>
              <button
                onClick={() => setSelectedVerificationRes(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Preview Card */}
            <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#B48C36]/20 border border-[#B48C36]/40 flex items-center justify-center text-[10px] font-bold text-[#936F25]">
                    GOI
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-800 font-bold">
                      {selectedVerificationRes.guest.idType}
                    </p>
                    <p className="text-[9px] text-stone-500 font-mono">Government of {selectedVerificationRes.guest.country}</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED AUTH
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl bg-stone-200 border border-stone-300 overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={
                      selectedVerificationRes.guest.idDocumentPreview ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    }
                    alt="Guest Photo"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-serif font-bold text-stone-900 text-sm">
                    {selectedVerificationRes.guest.fullName}
                  </p>
                  <p className="font-mono text-[#936F25] font-bold text-xs">
                    {selectedVerificationRes.guest.idNumber}
                  </p>
                  <p className="text-[11px] text-stone-600 font-mono">
                    DOB: 14 Aug 1988 • Nationality: {selectedVerificationRes.guest.country}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Phone: {selectedVerificationRes.guest.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2 border-t border-stone-200">
              {selectedVerificationRes.status === 'Confirmed' && (
                <button
                  onClick={() => {
                    checkInGuest(selectedVerificationRes.id);
                    setSelectedVerificationRes(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white font-serif font-bold text-xs shadow-sm"
                >
                  Approve ID & Check-In Guest Immediately
                </button>
              )}
              {selectedVerificationRes.status === 'Checked-In' && (
                <button
                  onClick={() => setSelectedVerificationRes(null)}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif"
                >
                  Close Verification
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Reservation Modal */}
      {showWalkInModal && availableRoomForWalkIn && availableCatForWalkIn && (
        <QuickReservationModal
          room={availableRoomForWalkIn}
          category={availableCatForWalkIn}
          initialDate={todayStr}
          onClose={() => setShowWalkInModal(false)}
        />
      )}
    </div>
  );
};
