import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePmsStore } from '../store/usePmsStore';
import { RoomCategory } from '../types/hotel';
import { formatINR } from '../utils/currency';
import { calculateReservationTotals } from '../utils/taxEngine';
import { OtaLogo } from '../components/common/OtaLogo';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Coffee, 
  Flower2, 
  Compass, 
  Star, 
  Award, 
  Lock, 
  CheckCircle2, 
  X,
  CreditCard,
  Building2,
  ChevronDown,
  Info
} from 'lucide-react';
import { format, addDays } from 'date-fns';

export const GuestPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    categories, 
    rooms, 
    properties, 
    activePropertyId, 
    bookFromGuestPortal, 
    promoCodes 
  } = usePmsStore();

  const property = properties.find((p) => p.id === activePropertyId) || properties[0];

  // Booking search bar state
  const [checkInDate, setCheckInDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [nights, setNights] = useState<number>(3);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Selected suite for reservation modal
  const [selectedSuite, setSelectedSuite] = useState<RoomCategory | null>(null);

  // Guest checkout drawer state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+91 ');
  const [promoCodeInput, setPromoCodeInput] = useState('AURAWELCOME');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('AURAWELCOME');
  const [specialRequests, setSpecialRequests] = useState('High floor courtyard view. Late night airport transfer.');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'PAY_AT_HOTEL'>('UPI');

  // Booking confirmed receipt state
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const checkOutDate = format(addDays(new Date(checkInDate), nights), 'yyyy-MM-dd');

  // Calculate pricing for currently active suite modal
  let discountAmount = 0;
  if (selectedSuite && appliedPromo) {
    if (appliedPromo.toUpperCase() === 'AURAWELCOME') {
      discountAmount = Math.round((selectedSuite.basePrice * nights * 10) / 100);
    } else {
      const found = promoCodes.find((p) => p.code.toUpperCase() === appliedPromo.toUpperCase());
      if (found) {
        discountAmount = found.discountType === 'PERCENTAGE'
          ? Math.round((selectedSuite.basePrice * nights * found.value) / 100)
          : found.value;
      }
    }
  }

  const totals = selectedSuite
    ? calculateReservationTotals(selectedSuite.basePrice, nights, discountAmount)
    : null;

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'AURAWELCOME' || promoCodes.some((p) => p.code.toUpperCase() === code)) {
      setAppliedPromo(code);
    } else {
      alert('Invalid promotional privilege code. Try AURAWELCOME or ROYAL15');
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuite) return;
    if (!guestName.trim()) {
      alert('Please enter your full legal name');
      return;
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#B48C36', '#C5A059', '#1C1917', '#10B981'],
    });

    const bookingCode = bookFromGuestPortal({
      categoryId: selectedSuite.id,
      guestName,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@luxuryguest.com`,
      guestPhone: guestPhone || '+91 98200 12345',
      checkInDate,
      checkOutDate,
      nights,
      adults,
      children,
      promoCode: appliedPromo || undefined,
      specialRequests,
      paymentMethod,
    });

    setConfirmedBookingId(bookingCode);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1917] font-sans antialiased selection:bg-[#B48C36]/20 selection:text-[#B48C36]">
      {/* 1. Ultra-Luxury Light Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 shadow-soft-luxury">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src={property.logoUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80"}
              alt={property.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#B48C36]/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-widest uppercase text-stone-900">{property.name}</span>
                <span className="text-[10px] font-mono tracking-widest text-[#B48C36] bg-[#FAF6EC] border border-[#B48C36]/30 px-2 py-0.5 rounded-full uppercase font-bold">
                  {property.code || 'RESERVE'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-sans tracking-tight">{property.tagline}</p>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-serif tracking-wider uppercase text-stone-700">
            <a href="#suites" className="hover:text-[#B48C36] transition-colors">The Suites</a>
            <a href="#experiences" className="hover:text-[#B48C36] transition-colors">Royal Experiences</a>
            <a href="#wellness" className="hover:text-[#B48C36] transition-colors">Ayurvedic Spa</a>
            <a href="#dining" className="hover:text-[#B48C36] transition-colors">Fine Dining</a>
          </div>

          {/* Action CTA & Elegant Staff Login (Prompt requirement 1 & 4.C) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-[#B48C36] text-stone-700 hover:text-stone-900 text-xs font-serif font-bold transition-all shadow-sm"
              title="Staff & Hotel Manager Secure Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-[#B48C36]" />
              <span>Staff & Partner Sign In</span>
            </button>

            <a
              href="#suites"
              className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow transition-all"
            >
              Reserve Sanctuary
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: Cinematic Light Luxury */}
      <section className="relative h-[85vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop Image with Warm Light Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=2000&q=85"
            alt="AURA Grand Palace Lake Pichola"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/50 to-[#1C1917]/30"></div>
          <div className="absolute inset-0 bg-[#FAF6EC]/30 backdrop-blur-[1px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#B48C36]/30 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#B48C36]" />
            <span className="text-xs font-serif tracking-widest uppercase text-stone-800 font-semibold">
              The Sovereign Indian Hospitality Benchmark
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1]">
            An Imperial Sovereign Retreat Over Lake Pichola
          </h1>

          <p className="text-sm sm:text-base text-stone-700 max-w-2xl mx-auto font-sans leading-relaxed">
            Where 19th-century royal Mewari architecture meets contemporary Aman-grade precision. Secluded suites, private heated plunge pools, and uninterrupted perspectives across the Aravalli horizon.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-stone-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B48C36]" />
              Lake Pichola, Udaipur, Rajasthan
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Direct Best Rate Guarantee
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#B48C36] fill-[#B48C36]" />
              5.0 Luxury Reserve Rating
            </span>
          </div>
        </div>
      </section>

      {/* 3. Prominent Sticky Booking Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft-luxury-lg p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {/* Check-In */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
              Check-In Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B48C36]" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent font-mono text-xs text-stone-900 font-bold outline-none w-full"
              />
            </div>
          </div>

          {/* Nights */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
              Duration of Stay
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-transparent font-mono text-xs text-stone-900 font-bold outline-none w-14"
              />
              <span className="text-xs font-mono text-stone-600">Nights</span>
            </div>
          </div>

          {/* Check-Out */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
              Check-Out Date
            </label>
            <p className="font-mono text-xs text-stone-900 font-bold pt-0.5">
              {checkOutDate}
            </p>
          </div>

          {/* Guests */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
              Guests
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B48C36]" />
              <select
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                className="bg-transparent font-mono text-xs text-stone-900 font-bold outline-none w-full"
              >
                <option value="1">1 Sovereign Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4 Adults</option>
              </select>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#suites"
            className="w-full h-full py-3.5 px-4 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs text-center shadow-gold-glow flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Suites</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 4. Interactive Room & Suite Showcase */}
      <section id="suites" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#B48C36]">Private Residential Sanctuary</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Handcrafted Mewari Palatial Suites
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every suite is an individual architectural masterpiece featuring hand-carved jali marble screens, private terraces, deep copper soaking tubs, and 24/7 dedicated butler service.
          </p>
        </div>

        {/* Room Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const availInCat = rooms.filter((r) => r.categoryId === cat.id && r.status === 'Available').length;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-soft-luxury hover:shadow-soft-luxury-lg hover:border-[#B48C36]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Gallery */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={cat.heroImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#936F25] font-mono text-[10px] font-bold px-3 py-1 rounded-full border border-[#B48C36]/30 shadow-sm uppercase">
                    {cat.tier}
                  </span>

                  <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-md">
                    {cat.sqFt} SQ FT • {cat.view}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-[#B48C36] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>

                    <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {cat.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-stone-100 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-stone-500">Starting From</p>
                      <p className="font-serif font-bold text-2xl text-stone-900">
                        {formatINR(cat.basePrice)}
                        <span className="text-xs font-mono font-normal text-stone-500"> / night</span>
                      </p>
                      <p className="text-[10px] font-mono text-emerald-600 font-medium">
                        ✓ {availInCat} Suites Available Now
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedSuite(cat)}
                      className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow flex items-center gap-1.5 transition-all"
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
      </section>

      {/* 5. Bespoke Royal Experiences Showcase */}
      <section id="experiences" className="bg-[#FAF6EC]/60 border-y border-stone-200/80 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#B48C36]">Curated Itineraries</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Sovereign Mewari Experiences
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every moment at AURA is tailored to royal sensibilities. Available to add directly to your guest folio upon arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft-luxury space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/30 flex items-center justify-center text-[#B48C36]">
                <Coffee className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900">Darbar Hall Fine Dining</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authentic Mewar royal thali banquet prepared by hereditary palace master chefs, accompanied by live santoor recital.
              </p>
              <p className="text-xs font-mono font-bold text-[#936F25]">₹4,500 + 18% GST / Guest</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft-luxury space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/30 flex items-center justify-center text-[#B48C36]">
                <Flower2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900">Abhyanga Ayurvedic Sanctuary</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Traditional 90-minute warm herbal oil rejuvenation administered by master Vaidyas under arched marble pavilions.
              </p>
              <p className="text-xs font-mono font-bold text-[#936F25]">₹6,000 + 18% GST / Session</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft-luxury space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/30 flex items-center justify-center text-[#B48C36]">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900">Lake Pichola Sunset Solar Cruise</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Silent bespoke solar yacht navigation to Jag Mandir with chilled Krug Clos d'Ambonnay and artisanal Mewari hors d'oeuvres.
              </p>
              <p className="text-xs font-mono font-bold text-[#936F25]">₹12,000 + 18% GST / Couple</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer & Direct Booking Guarantee */}
      <footer className="bg-white border-t border-stone-200 py-16 px-6 text-stone-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-widest uppercase text-stone-900">AURA</span>
              <span className="text-[10px] font-mono text-[#B48C36] bg-[#FAF6EC] px-1.5 py-0.5 rounded border border-[#B48C36]/30">
                UDAIPUR
              </span>
            </div>
            <p className="text-stone-500 leading-relaxed">
              {property.address}
            </p>
            <p className="font-mono text-stone-600">
              GSTIN: <span className="font-bold text-stone-800">{property.gstin}</span>
            </p>
          </div>

          <div>
            <p className="font-serif font-bold text-stone-900 uppercase tracking-wider mb-3">Reservations Concierge</p>
            <p className="font-mono text-stone-600">{property.contactPhone}</p>
            <p className="text-stone-500 mt-1">{property.contactEmail}</p>
            <p className="text-[11px] text-stone-500 mt-2">Check-in: 14:00 • Check-out: 11:00 IST</p>
          </div>

          <div>
            <p className="font-serif font-bold text-stone-900 uppercase tracking-wider mb-3">Direct Web Privilege</p>
            <ul className="space-y-1.5 text-stone-600">
              <li>✓ Guaranteed Best Room Tariff</li>
              <li>✓ Complimentary Palace Breakfast</li>
              <li>✓ Flexible Cancellation up to 48h</li>
              <li>✓ Instant Sync with Hotel Front-Desk</li>
            </ul>
          </div>

          <div>
            <p className="font-serif font-bold text-stone-900 uppercase tracking-wider mb-3">Hotel Staff & Admin Access</p>
            <p className="text-stone-500 leading-relaxed mb-3">
              Authorized general managers, front-desk concierges, and property owners can access the operations PMS:
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-serif font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-[#B48C36]" />
              <span>Staff & Partner Sign In</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-4">
          <p>© 2026 AURA Hotels & Luxury Reserves India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>MakeMyTrip Connected</span>
            <span>•</span>
            <span>Booking.com Connected</span>
            <span>•</span>
            <span>Goibibo Connected</span>
          </div>
        </div>
      </footer>

      {/* 7. Instant Reservation Drawer Modal */}
      {selectedSuite && totals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF6EC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#B48C36]/40 flex items-center justify-center text-[#B48C36]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Reserve {selectedSuite.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-mono">
                    {selectedSuite.tier} • {nights} Nights ({checkInDate} to {checkOutDate})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSuite(null)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmReservation} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Guest Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold">
                  Primary Guest Details
                </h4>

                <div>
                  <label className="text-xs text-stone-600 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Gayatri Singh"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="guest@royalfamily.in"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 block mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-600 block mb-1">Bespoke Concierge Requests</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>

              {/* Indian GST Breakdown Ledger */}
              <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#936F25] uppercase tracking-wider">
                    Tariff & Indian GST Ledger
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {selectedSuite.basePrice >= 7500 ? '18% GST (Rate ≥ ₹7,500)' : '12% GST'}
                  </span>
                </div>

                {/* Promo Code applicator */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter AURAWELCOME or ROYAL15"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 uppercase font-mono focus:border-[#B48C36] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-1.5 rounded-xl bg-white border border-[#B48C36] text-[#936F25] font-serif font-bold text-xs hover:bg-[#FAF6EC]"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-[#B48C36]/20">
                  <div className="flex justify-between text-stone-600">
                    <span>Base Tariff ({formatINR(selectedSuite.basePrice)} × {nights} nights):</span>
                    <span>{formatINR(totals.rawRoomSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Privilege Code ({appliedPromo}):</span>
                      <span>- {formatINR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600 border-t border-stone-200/60 pt-1">
                    <span>Central GST (CGST {totals.roomGstRate * 50}%):</span>
                    <span>{formatINR(totals.roomCgst)}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>State GST (SGST {totals.roomGstRate * 50}%):</span>
                    <span>{formatINR(totals.roomSgst)}</span>
                  </div>

                  <div className="flex justify-between text-stone-900 font-bold text-base border-t border-[#B48C36]/30 pt-2">
                    <span className="font-serif">Total Payable:</span>
                    <span className="text-[#936F25]">{formatINR(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block">
                  Select Settlement Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'Instant UPI (GPay / PhonePe)' },
                    { id: 'CREDIT_CARD', label: 'Credit / Debit Card' },
                    { id: 'PAY_AT_HOTEL', label: 'Settle at Arrival' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-serif transition-all text-center ${
                        paymentMethod === m.id
                          ? 'border-[#B48C36] bg-[#FAF6EC] text-[#936F25] font-bold shadow-sm'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Booking Submission CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-black text-sm tracking-wide shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4 text-stone-900" />
                  <span>Confirm & Complete Reservation ({formatINR(totals.grandTotal)})</span>
                </button>
                <p className="text-[10px] font-mono text-center text-stone-500 mt-2">
                  🔒 Encrypted Direct Connection • Zero OTA Commission • Instant PMS Allocation
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Booking Confirmation Receipt Modal with 1-Click Link to Admin Portal */}
      {confirmedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-[#B48C36]/40 rounded-3xl shadow-2xl p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B48C36]">
                Reservation Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Imperial Sanctuary Acknowledged
              </h3>
              <p className="text-xs text-stone-600 mt-2">
                Your direct booking has been generated and pushed immediately into the hotel's central PMS database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#B48C36]/30 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Booking Reference:</span>
                <span className="font-bold text-stone-900 text-sm">{confirmedBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Primary Guest:</span>
                <span className="font-bold text-stone-900">{guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Dates:</span>
                <span>{checkInDate} – {checkOutDate} ({nights} nts)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Category:</span>
                <span>{selectedSuite?.name}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-[#B48C36]/20 pt-1.5">
                <span>PMS Status:</span>
                <span>CONFIRMED • INVENTORY DEDUCTED</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setSelectedSuite(null);
                  setConfirmedBookingId(null);
                }}
                className="w-full py-3 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow transition-all"
              >
                Done & Return to Resort Home
              </button>

              <button
                onClick={() => {
                  setSelectedSuite(null);
                  setConfirmedBookingId(null);
                  navigate('/login?redirect=/admin');
                }}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-serif font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#B48C36]" />
                <span>Staff Concierge: Sign In to View on Tape Chart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

