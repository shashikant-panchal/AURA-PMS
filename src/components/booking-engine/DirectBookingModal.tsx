import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { RoomCategory } from '../../types/hotel';
import { formatINR } from '../../utils/currency';
import { calculateReservationTotals } from '../../utils/taxEngine';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Compass, 
  Star, 
  Tag, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface DirectBookingModalProps {
  onClose: () => void;
  onBookingSuccess: (reservationId: string) => void;
}

export const DirectBookingModal: React.FC<DirectBookingModalProps> = ({
  onClose,
  onBookingSuccess,
}) => {
  const { 
    categories, 
    rooms, 
    createReservation, 
    properties, 
    activePropertyId, 
    promoCodes 
  } = usePmsStore();

  const property = properties.find((p) => p.id === activePropertyId) || properties[0];

  const [checkInDate, setCheckInDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [nights, setNights] = useState(3);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Selected Category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[1]?.id || categories[0]?.id);
  
  // Checkout form step
  const [currentStep, setCurrentStep] = useState<'rooms' | 'guest-details'>('rooms');

  // Guest details state
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [country, setCountry] = useState('India');
  const [promoCodeInput, setPromoCodeInput] = useState('ROYAL15');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('ROYAL15');
  const [specialRequests, setSpecialRequests] = useState('Sunset lake view table for arrival dinner.');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const checkOutDate = format(addDays(new Date(checkInDate), nights), 'yyyy-MM-dd');

  // Find an available room in this category
  const availableRoomsInCategory = rooms.filter(
    (r) => r.categoryId === selectedCategory.id && r.status === 'Available'
  );
  // If no "Available" room, fallback to any room in this category
  const targetRoom = availableRoomsInCategory[0] || rooms.find((r) => r.categoryId === selectedCategory.id) || rooms[0];

  // Calculate pricing
  let discountAmount = 0;
  if (appliedPromo) {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === appliedPromo.toUpperCase());
    if (promo) {
      if (promo.discountType === 'PERCENTAGE') {
        discountAmount = Math.round((selectedCategory.basePrice * nights * promo.value) / 100);
      } else {
        discountAmount = promo.value;
      }
    }
  }

  const totals = calculateReservationTotals(selectedCategory.basePrice, nights, discountAmount);

  const handleApplyPromo = () => {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (promo) {
      setAppliedPromo(promo.code);
    } else {
      alert('Invalid promotional code');
    }
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert('Please enter your legal name');
      return;
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E5C378', '#FFFFFF', '#10B981'],
    });

    const newRes = createReservation({
      roomId: targetRoom.id,
      categoryId: selectedCategory.id,
      guest: {
        id: `g-${Date.now()}`,
        fullName: guestName,
        salutation: 'Mr.',
        email: email || `${guestName.toLowerCase().replace(/\s+/g, '.')}@directluxury.com`,
        phone: phone || '+91 98000 00000',
        country,
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
        vipStatus: true,
        specialRequests,
      },
      checkInDate,
      checkOutDate,
      nights,
      adults,
      children,
      source: 'Direct Web',
      roomRatePerNight: selectedCategory.basePrice,
      discountAmount,
      discountCode: appliedPromo || undefined,
      notes: specialRequests,
    });

    onBookingSuccess(newRes.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-6xl bg-obsidian border border-gold/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Luxury Top Navigation */}
        <div className="px-6 py-4 border-b border-surface-border bg-surface-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold/30 via-gold/10 to-transparent border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
              <Compass className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-slate-100 tracking-wider">
                  {property.name.toUpperCase()}
                </h3>
                <span className="text-[10px] font-mono text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-full">
                  OFFICIAL DIRECT SOVEREIGN ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Best Rate Guarantee • 0% Middleman Commission • Complimentary Breakfast Included
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date & Occupancy Selector Header */}
        <div className="p-4 bg-surface-muted/90 border-b border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Check-In</label>
            <div className="flex items-center gap-2 bg-obsidian border border-surface-border rounded-xl px-3 py-2 text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent font-mono outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nights Duration</label>
            <div className="flex items-center gap-2 bg-obsidian border border-surface-border rounded-xl px-3 py-2 text-slate-200">
              <input
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-transparent font-mono outline-none w-full"
              />
              <span className="text-slate-400 font-mono text-xs">Nights</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Guests</label>
            <div className="flex items-center gap-2 bg-obsidian border border-surface-border rounded-xl px-3 py-2 text-slate-200">
              <Users className="w-3.5 h-3.5 text-gold" />
              <select
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                className="bg-transparent font-mono outline-none w-full text-slate-200"
              >
                <option value="1" className="bg-obsidian">1 Adult</option>
                <option value="2" className="bg-obsidian">2 Adults</option>
                <option value="3" className="bg-obsidian">3 Adults</option>
                <option value="4" className="bg-obsidian">4 Adults</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Check-Out</label>
            <div className="flex items-center gap-2 bg-black/40 border border-surface-border rounded-xl px-3 py-2 text-slate-400 font-mono">
              <span>{checkOutDate}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'rooms' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                const roomAvail = rooms.filter((r) => r.categoryId === cat.id && r.status === 'Available').length;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-surface-card border-gold shadow-gold-glow'
                        : 'bg-surface-card/60 border-surface-border hover:border-gold/40'
                    }`}
                  >
                    {/* Hero Image */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={cat.heroImage}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-black/30 to-transparent"></div>
                      <span className="absolute top-3 left-3 bg-obsidian/80 backdrop-blur-md text-gold font-mono text-[10px] px-2.5 py-1 rounded-full border border-gold/30">
                        {cat.tier}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/80 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded">
                        {cat.sqFt} SQ FT
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-slate-100 group-hover:text-gold transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cat.amenities.slice(0, 3).map((am, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted text-slate-300 border border-surface-border"
                            >
                              ✓ {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-surface-border/60 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase">Direct Sovereign Rate</p>
                          <p className="font-serif font-bold text-lg text-gold">
                            {formatINR(cat.basePrice)}
                            <span className="text-xs font-mono text-slate-400 font-normal"> / night</span>
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategoryId(cat.id);
                            setCurrentStep('guest-details');
                          }}
                          className="px-4 py-2 rounded-xl bg-gold text-obsidian font-serif font-bold text-xs shadow-gold-glow hover:bg-gold-light transition-all flex items-center gap-1.5"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Guest Checkout Step */
            <div className="grid grid-cols-12 gap-8">
              {/* Form details */}
              <div className="col-span-12 lg:col-span-7 space-y-5">
                <button
                  onClick={() => setCurrentStep('rooms')}
                  className="text-xs text-slate-400 hover:text-gold flex items-center gap-1 font-mono transition-colors"
                >
                  ← Back to Room Selection
                </button>

                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Sovereign Guest Credentials
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instant guaranteed reservation. No pre-payment required; settle upon departure.
                  </p>
                </div>

                <form onSubmit={handleCompleteBooking} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Princess Gayatri Devi"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-gold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="guest@royalfamily.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-gold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Bespoke Concierge Requests</label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-surface-card border border-surface-border rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-gold outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
                    <p className="text-[11px] text-slate-300">
                      Your reservation connects directly with {property.name}'s Front-Desk PMS. Room assignment is instantly confirmed.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-serif font-black text-sm tracking-wide shadow-gold-glow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-obsidian" />
                    <span>Complete Instant Reservation ({formatINR(totals.grandTotal)})</span>
                  </button>
                </form>
              </div>

              {/* Order Summary & GST Ledger */}
              <div className="col-span-12 lg:col-span-5 p-6 rounded-2xl bg-surface-card border border-gold/30 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                  <img
                    src={selectedCategory.heroImage}
                    alt={selectedCategory.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gold/30"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-100">{selectedCategory.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedCategory.tier} • {selectedCategory.sqFt} sq ft</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Stay Span:</span>
                    <span>{format(new Date(checkInDate), 'dd MMM')} – {format(new Date(checkOutDate), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Nights / Occupants:</span>
                    <span>{nights} Nights • {adults} Adults</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Nightly Rate:</span>
                    <span>{formatINR(selectedCategory.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tariff Subtotal:</span>
                    <span>{formatINR(totals.rawRoomSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Privilege Discount ({appliedPromo}):</span>
                      <span>- {formatINR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400 border-t border-surface-border pt-2">
                    <span>CGST ({totals.roomGstRate * 50}%):</span>
                    <span>{formatINR(totals.roomCgst)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST ({totals.roomGstRate * 50}%):</span>
                    <span>{formatINR(totals.roomSgst)}</span>
                  </div>

                  <div className="flex justify-between text-gold font-bold text-base border-t-2 border-surface-border pt-2">
                    <span className="font-serif">Total Payable:</span>
                    <span>{formatINR(totals.grandTotal)}</span>
                  </div>
                </div>

                {/* Promo Code input */}
                <div className="pt-2 border-t border-surface-border">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Promotional Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ROYAL15"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-obsidian border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 uppercase font-mono focus:border-gold outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-1.5 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/25"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

