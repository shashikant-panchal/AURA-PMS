import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { Reservation } from '../../types/hotel';
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
  CreditCard
} from 'lucide-react';

interface FrontDeskManagerProps {
  onOpenFolio: (reservationId: string) => void;
}

export const FrontDeskManager: React.FC<FrontDeskManagerProps> = ({ onOpenFolio }) => {
  const { reservations, checkInGuest, rooms, categories } = usePmsStore();

  const [activeTab, setActiveTab] = useState<'arrivals' | 'inhouse' | 'departures' | 'all'>('arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerificationRes, setSelectedVerificationRes] = useState<Reservation | null>(null);

  const todayStr = getTodayStr();

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
    return categories.find((c) => c.id === catId)?.name || 'Palatial Suite';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8]">
      {/* Top Banner & Quick KPI Strip */}
      <div className="p-6 border-b border-stone-200 bg-white shadow-soft-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#B48C36]" />
              Front-Desk Operations & Guest Concierge
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Verify guest Aadhaar/Passport identification, allocate physical suite keycards, manage active folios, and process checkout settlement.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3 shadow-sm">
              <LogIn className="w-4 h-4 text-purple-700" />
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 font-bold">Expected Arrivals</p>
                <p className="font-mono font-bold text-sm text-purple-900">{arrivals.length} Guests</p>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 shadow-sm">
              <UserCheck className="w-4 h-4 text-rose-700" />
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 font-bold">In-House Active</p>
                <p className="font-mono font-bold text-sm text-rose-900">{inHouse.length} Suites</p>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 shadow-sm">
              <LogOut className="w-4 h-4 text-amber-700" />
              <div>
                <p className="text-[10px] font-mono uppercase text-stone-500 font-bold">Pending Departures</p>
                <p className="font-mono font-bold text-sm text-amber-900">{departures.length} Guests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === 'arrivals'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Arrivals ({arrivals.length})
            </button>

            <button
              onClick={() => setActiveTab('inhouse')}
              className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === 'inhouse'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              In-House ({inHouse.length})
            </button>

            <button
              onClick={() => setActiveTab('departures')}
              className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === 'departures'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Departures ({departures.length})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Records ({reservations.length})
            </button>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, booking code, suite, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#B48C36] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Reservation Cards List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {currentList().map((res) => {
          const roomUnit = rooms.find((r) => r.id === res.roomId);
          const categoryName = getCategoryName(res.categoryId);

          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36]/50 transition-all shadow-soft-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              {/* Left: Guest & Room Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 flex items-center justify-center font-serif text-lg font-bold text-[#B48C36] flex-shrink-0 shadow-sm">
                  {res.guest.fullName.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#B48C36] transition-colors">
                      {res.guest.salutation} {res.guest.fullName}
                    </h3>
                    {res.guest.vipStatus && (
                      <span className="flex items-center gap-1 text-[9px] font-mono text-[#936F25] bg-[#FAF6EC] border border-[#B48C36]/30 px-2 py-0.5 rounded-full font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-[#B48C36]" />
                        VIP
                      </span>
                    )}
                    <OtaLogo channel={res.source} size="xs" />
                  </div>

                  <p className="text-xs text-stone-600 mt-0.5">
                    Suite {roomUnit?.roomNumber || res.roomId.replace('room-', '')} • {categoryName}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 mt-1">
                    <span>Code: <strong className="text-stone-800">{res.bookingCode}</strong></span>
                    <span>•</span>
                    <span>
                      {formatDateEditorial(res.checkInDate)} – {formatDateEditorial(res.checkOutDate)} ({res.nights} nts)
                    </span>
                    <span>•</span>
                    <span>{res.guest.phone}</span>
                  </div>
                </div>
              </div>

              {/* Center: ID Verification & Folio Summary */}
              <div className="flex items-center gap-6">
                <div className="text-right font-mono">
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Tariff / Night</p>
                  <p className="text-xs font-bold text-stone-900">{formatINR(res.roomRatePerNight)}</p>
                  <p className="text-[10px] text-[#936F25] font-semibold">{res.folio.length} Posted Folio Items</p>
                </div>

                {/* ID Preview Trigger */}
                <button
                  onClick={() => setSelectedVerificationRes(res)}
                  className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#B48C36] text-xs text-stone-700 hover:text-[#936F25] flex items-center gap-1.5 transition-colors font-medium shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify ID</span>
                </button>

                {/* Operational Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenFolio(res.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF6EC] border border-[#B48C36] text-[#936F25] hover:bg-[#F7F0DF] text-xs font-serif font-bold transition-colors shadow-sm"
                  >
                    View Folio
                  </button>

                  {res.status === 'Confirmed' && (
                    <button
                      onClick={() => checkInGuest(res.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif font-bold hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Check-In</span>
                    </button>
                  )}

                  {res.status === 'Checked-In' && (
                    <button
                      onClick={() => onOpenFolio(res.id)}
                      className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5 shadow-sm"
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
                  Government Identity Document Verification
                </h4>
              </div>
              <button
                onClick={() => setSelectedVerificationRes(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-res Sovereign Mock ID Card (Light Luxury Edition) */}
            <div className="p-5 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 shadow-sm relative overflow-hidden">
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
                    DOB: 14 Aug 1988 • Gender: Verified
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Address: {selectedVerificationRes.guest.country} Residence Protocol
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#B48C36]/20 flex justify-between items-center text-[10px] font-mono text-stone-500">
                <span>Guest UID: {selectedVerificationRes.guest.id}</span>
                <span className="text-[#936F25] font-bold">Biometric Pass Verified</span>
              </div>
            </div>

            {/* Verification details */}
            <div className="text-xs space-y-1 text-stone-600 font-mono">
              <p>Special Requests: {selectedVerificationRes.guest.specialRequests || 'None recorded'}</p>
              <p>Dietary Preference: {selectedVerificationRes.guest.dietaryPreferences || 'Standard Royal Luxury Menu'}</p>
            </div>

            {/* Action button */}
            <div className="pt-2 border-t border-stone-200">
              {selectedVerificationRes.status === 'Confirmed' && (
                <button
                  onClick={() => {
                    checkInGuest(selectedVerificationRes.id);
                    setSelectedVerificationRes(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow"
                >
                  Approve ID & Check-In Guest Immediately
                </button>
              )}
              {selectedVerificationRes.status === 'Checked-In' && (
                <button
                  onClick={() => setSelectedVerificationRes(null)}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif"
                >
                  Close Verification Window
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
