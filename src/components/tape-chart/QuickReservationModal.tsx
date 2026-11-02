import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { Room, RoomCategory, BookingSource } from '../../types/hotel';
import { X, Calendar, User, Phone, Mail, Sparkles, Tag } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { formatINR } from '../../utils/currency';
import { calculateReservationTotals } from '../../utils/taxEngine';

interface QuickReservationModalProps {
  room: Room;
  category: RoomCategory;
  initialCheckInDate: string;
  onClose: () => void;
  onSuccess: (resId: string) => void;
}

export const QuickReservationModal: React.FC<QuickReservationModalProps> = ({
  room,
  category,
  initialCheckInDate,
  onClose,
  onSuccess,
}) => {
  const { createReservation, promoCodes } = usePmsStore();

  const [guestName, setGuestName] = useState('');
  const [salutation, setSalutation] = useState<'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Lord'>('Mr.');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [country] = useState('India');
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [nights, setNights] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [source, setSource] = useState<BookingSource>('Walk-In');
  const [vipStatus, setVipStatus] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');

  const checkOutDate = format(addDays(new Date(checkInDate), nights), 'yyyy-MM-dd');

  let discountAmount = 0;
  if (appliedPromo) {
    const found = promoCodes.find((p) => p.code.toUpperCase() === appliedPromo.toUpperCase());
    if (found) {
      if (found.discountType === 'PERCENTAGE') {
        discountAmount = Math.round((category.basePrice * nights * found.value) / 100);
      } else {
        discountAmount = found.value;
      }
    }
  }

  const totals = calculateReservationTotals(category.basePrice, nights, discountAmount);

  const handleApplyPromo = () => {
    const found = promoCodes.find((p) => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (found) {
      setAppliedPromo(found.code);
    } else {
      alert('Invalid Promo Code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    const newRes = createReservation({
      roomId: room.id,
      categoryId: category.id,
      guest: {
        id: `g-${Date.now()}`,
        fullName: guestName,
        salutation,
        email: email || `${guestName.toLowerCase().replace(/\s+/g, '.')}@luxuryguest.com`,
        phone: phone || '+91 98000 00000',
        country,
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
        vipStatus,
        specialRequests,
      },
      checkInDate,
      checkOutDate,
      nights,
      adults,
      children,
      source,
      roomRatePerNight: category.basePrice,
      discountAmount,
      discountCode: appliedPromo || undefined,
      notes: specialRequests,
    });

    onSuccess(newRes.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF6EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#B48C36]/40 flex items-center justify-center text-[#B48C36]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">Walk-In & Front-Desk Booking</h3>
              <p className="text-xs text-stone-600 font-mono">
                Suite {room.roomNumber} • {category.name} ({category.tier})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Guest Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Primary Guest Profile
            </h4>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <label className="text-[11px] text-stone-600 block mb-1">Salutation</label>
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Lord">Lord</option>
                </select>
              </div>

              <div className="col-span-9">
                <label className="text-[11px] text-stone-600 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharaja Yuvraj Singh"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#B48C36] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Mobile / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="vipCheck"
                checked={vipStatus}
                onChange={(e) => setVipStatus(e.target.checked)}
                className="rounded accent-[#B48C36]"
              />
              <label htmlFor="vipCheck" className="text-xs text-stone-700 flex items-center gap-1.5 cursor-pointer font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#B48C36]" />
                Flag as VIP Sovereign Dignitary
              </label>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Stay Dates & Booking Source
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Check-In Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Nights Duration</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Check-Out Date</label>
                <input
                  type="text"
                  disabled
                  value={checkOutDate}
                  className="w-full bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-600 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">Booking Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-medium"
                >
                  <option value="Walk-In">Front-Desk Walk-In</option>
                  <option value="Direct Web">Direct Web</option>
                  <option value="MakeMyTrip">MakeMyTrip</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Goibibo">Goibibo</option>
                  <option value="Agoda">Agoda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & GST Engine */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                Indian GST & Financial Calculation
              </span>
              <span className="text-[10px] text-stone-500 font-sans">
                {category.basePrice >= 7500 ? '18% GST (Rate ≥ ₹7,500)' : '12% GST'}
              </span>
            </h4>

            {/* Price breakdown ledger */}
            <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Room Tariff ({formatINR(category.basePrice)} × {nights} nights):</span>
                <span>{formatINR(totals.rawRoomSubtotal)}</span>
              </div>

              <div className="flex justify-between text-stone-600 border-t border-[#B48C36]/20 pt-1">
                <span>CGST ({totals.roomGstRate * 50}%):</span>
                <span>{formatINR(totals.roomCgst)}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>SGST ({totals.roomGstRate * 50}%):</span>
                <span>{formatINR(totals.roomSgst)}</span>
              </div>

              <div className="flex justify-between text-stone-900 font-bold text-sm border-t border-[#B48C36]/30 pt-1.5">
                <span className="font-serif">Total Payable:</span>
                <span className="text-[#936F25]">{formatINR(totals.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-stone-600 block mb-1">Special Preferences / Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Early check-in, feather-free pillows..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow transition-all"
            >
              Confirm Reservation & Post Folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
