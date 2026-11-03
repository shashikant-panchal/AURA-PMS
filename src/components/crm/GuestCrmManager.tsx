import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { 
  Users, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar,
  FileCheck,
  Star,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { formatINR } from '../../utils/currency';

export const GuestCrmManager: React.FC = () => {
  const { reservations } = usePmsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  // Group unique guests from reservations
  const guestMap = new Map<string, {
    id: string;
    fullName: string;
    salutation: string;
    email: string;
    phone: string;
    country: string;
    idType: string;
    idNumber: string;
    vipStatus: boolean;
    specialRequests?: string;
    totalSpend: number;
    visitCount: number;
    lastStayDate: string;
    bookingCodes: string[];
  }>();

  reservations.forEach((r) => {
    const g = r.guest;
    if (!g || !g.fullName) return;

    const key = (g.email || g.phone || g.fullName).toLowerCase();
    const existing = guestMap.get(key);

    const rSpend = (r.folio || []).reduce((acc, f) => acc + f.totalWithTax, 0) || (r.roomRatePerNight * r.nights);

    if (existing) {
      existing.totalSpend += rSpend;
      existing.visitCount += 1;
      if (r.checkInDate > existing.lastStayDate) {
        existing.lastStayDate = r.checkInDate;
      }
      existing.bookingCodes.push(r.bookingCode);
    } else {
      guestMap.set(key, {
        id: g.id || `gst-${Date.now()}`,
        fullName: g.fullName,
        salutation: g.salutation || 'Mr.',
        email: g.email || 'guest@example.com',
        phone: g.phone || '+91 98000 00000',
        country: g.country || 'India',
        idType: g.idType || 'Aadhaar Card',
        idNumber: g.idNumber || '•••• •••• 1234',
        vipStatus: !!g.vipStatus,
        specialRequests: g.specialRequests || r.notes,
        totalSpend: rSpend,
        visitCount: 1,
        lastStayDate: r.checkInDate,
        bookingCodes: [r.bookingCode],
      });
    }
  });

  const guestList = Array.from(guestMap.values()).filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.fullName.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.idNumber.toLowerCase().includes(q)
    );
  });

  const activeGuest = selectedGuestId
    ? guestList.find((g) => g.id === selectedGuestId) || guestList[0]
    : guestList[0];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#FAFAF8]">
      {/* Left List of Guests */}
      <div className="w-full md:w-96 flex flex-col h-full border-r border-stone-200 bg-white">
        <div className="p-4 border-b border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B48C36]" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Guest CRM & Profiles</h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {guestList.length} Profiles
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, phone, Aadhaar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#B48C36]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {guestList.map((guest) => {
            const isSelected = activeGuest?.id === guest.id;

            return (
              <button
                key={guest.id}
                onClick={() => setSelectedGuestId(guest.id)}
                className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-[#FAF6EC] border-l-4 border-[#B48C36]' : 'hover:bg-stone-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-xs font-bold text-stone-900 truncate">
                      {guest.salutation} {guest.fullName}
                    </span>
                    {guest.vipStatus && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{guest.email}</p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">{guest.phone}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#936F25] block">
                    {formatINR(guest.totalSpend)}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {guest.visitCount} {guest.visitCount === 1 ? 'Stay' : 'Stays'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Guest Detail View */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
        {activeGuest ? (
          <>
            {/* Header Profile Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#B48C36]/20 border border-[#B48C36]/40 flex items-center justify-center font-serif text-xl font-bold text-[#936F25]">
                  {activeGuest.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-stone-900">
                      {activeGuest.salutation} {activeGuest.fullName}
                    </h2>
                    {activeGuest.vipStatus && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/40">
                        SOVEREIGN VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {activeGuest.country} • Last in-house stay on {activeGuest.lastStayDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right sm:border-r border-stone-200 sm:pr-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Lifetime Spend</span>
                  <span className="text-lg font-serif font-bold text-[#936F25]">
                    {formatINR(activeGuest.totalSpend)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Total Visits</span>
                  <span className="text-lg font-serif font-bold text-stone-900">
                    {activeGuest.visitCount}
                  </span>
                </div>
              </div>
            </div>

            {/* KYC & Verification Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Statutory KYC & Identification Documents
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                    Document Type
                  </span>
                  <p className="font-serif font-bold text-stone-900 text-xs">{activeGuest.idType}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                    Verified ID Number
                  </span>
                  <p className="font-mono font-bold text-stone-900 text-xs">{activeGuest.idNumber}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                    Phone & WhatsApp
                  </span>
                  <p className="font-mono text-xs font-bold text-stone-800">{activeGuest.phone}</p>
                </div>
              </div>

              {activeGuest.specialRequests && (
                <div className="p-3 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/30 text-xs text-[#936F25]">
                  <span className="font-bold font-serif block mb-0.5">Guest Preferences & Special Notes:</span>
                  <p className="font-sans text-[11px] text-stone-700">{activeGuest.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Stay History List */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-500" />
                Historical Reservations ({activeGuest.bookingCodes.length})
              </h3>

              <div className="space-y-2">
                {activeGuest.bookingCodes.map((code) => {
                  const res = reservations.find((r) => r.bookingCode === code);
                  if (!res) return null;

                  return (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{res.bookingCode}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-bold">
                            {res.source}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {res.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Room {res.roomId.replace('bse-', '')} • {res.checkInDate} to {res.checkOutDate} ({res.nights} nights)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-stone-900 block">
                          {formatINR(res.roomRatePerNight * res.nights)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {formatINR(res.roomRatePerNight)} / night
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
            Select a guest from the directory to review their CRM profile.
          </div>
        )}
      </div>
    </div>
  );
};

