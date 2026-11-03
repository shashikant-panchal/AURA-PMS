import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { Room, RoomCategory, BookingSource } from '../../types/hotel';
import { X, Calendar, User, Phone, Mail, Sparkles, Tag } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { formatINR } from '../../utils/currency';
import { calculateReservationTotals } from '../../utils/taxEngine';

export interface QuickReservationModalProps {
  room: Room;
  category: RoomCategory;
  initialCheckInDate?: string;
  initialDate?: string;
  onClose: () => void;
  onSuccess?: (resId: string) => void;
}

export const QuickReservationModal: React.FC<QuickReservationModalProps> = ({
  room,
  category,
  initialCheckInDate,
  initialDate,
  onClose,
  onSuccess,
}) => {
  const { createReservation, promoCodes } = usePmsStore();

  const effectiveStartDate = initialDate || initialCheckInDate || format(new Date(), 'yyyy-MM-dd');
  const [guestName, setGuestName] = useState('');
  const [salutation, setSalutation] = useState<'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Lord'>('Mr.');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [country] = useState('India');
  const [checkInDate, setCheckInDate] = useState(effectiveStartDate);
  const [nights, setNights] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [source, setSource] = useState<BookingSource>('Walk-In');
  const [vipStatus, setVipStatus] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');

  // Auto-compute checkOut
  const checkOutDate = format(addDays(new Date(checkInDate), nights), 'yyyy-MM-dd');

  // Handle promo code
  let discountAmount = 0;
  if (appliedPromo) {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === appliedPromo.toUpperCase());
    if (promo) {
      if (promo.discountType === 'PERCENTAGE') {
        discountAmount = Math.round((category.basePrice * nights * promo.value) / 100);
      } else {
        discountAmount = promo.value;
      }
    }
  }

  const totals = calculateReservationTotals(
    category.basePrice,
    nights,
    discountAmount
  );

  const handleApplyPromo = () => {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (promo) {
      setAppliedPromo(promo.code);
    } else {
      alert('Invalid Promo Code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newRes = createReservation({
      roomId: room.id,
      categoryId: category.id,
      guest: {
        id: `g-${Date.now()}`,
        fullName: guestName.trim(),
        salutation,
        email: email.trim() || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.in`,
        phone: phone.trim(),
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

    if (onSuccess) {
      onSuccess(newRes.id);
    }
    onClose();
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
                Room {room.roomNumber} • {category.name} ({category.tier})
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
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="col-span-6">
                <label className="text-[11px] text-stone-600 block mb-1">Mobile / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="col-span-6">
                <label className="text-[11px] text-stone-600 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stay Configuration */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Stay Dates & Occupancy
            </h4>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <label className="text-[11px] text-stone-600 block mb-1">Check-In Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] text-stone-600 block mb-1">Duration (Nights)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono text-center focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="col-span-4">
                <label className="text-[11px] text-stone-600 block mb-1">Check-Out Date</label>
                <input
                  type="text"
                  readOnly
                  value={checkOutDate}
                  className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-600 font-mono"
                />
              </div>

              <div className="col-span-4">
                <label className="text-[11px] text-stone-600 block mb-1">Adults (Max {category.maxAdults})</label>
                <input
                  type="number"
                  min={1}
                  max={category.maxAdults}
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 text-center font-mono focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="col-span-4">
                <label className="text-[11px] text-stone-600 block mb-1">Children (Max {category.maxChildren})</label>
                <input
                  type="number"
                  min={0}
                  max={category.maxChildren}
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 text-center font-mono focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="col-span-4">
                <label className="text-[11px] text-stone-600 block mb-1">Booking Origin Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-medium"
                >
                  <option value="Walk-In">Walk-In (Front Desk)</option>
                  <option value="Direct Web">Direct Web Booking</option>
                  <option value="MakeMyTrip">MakeMyTrip</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Goibibo">Goibibo</option>
                  <option value="Agoda">Agoda</option>
                  <option value="Corporate">Corporate Account</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Ledger & Indian GST Summary */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B48C36]" />
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
              placeholder="e.g. Early check-in, quiet corner room..."
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
              className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white font-serif font-bold text-xs transition-all shadow-sm"
            >
              Confirm Reservation & Post Folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
