import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { FolioItem, PaymentMethod } from '../../types/hotel';
import { formatINR } from '../../utils/currency';
import { formatDateEditorial } from '../../utils/dateUtils';
import { PrintableInvoice } from './PrintableInvoice';
import { OtaLogo } from '../common/OtaLogo';
import { 
  X, 
  Receipt, 
  PlusCircle, 
  CreditCard, 
  Sparkles, 
  Printer, 
  Coffee, 
  Flower2, 
  Shirt, 
  Car, 
  CheckCircle2, 
  LogOut,
  Tag
} from 'lucide-react';

interface GuestFolioModalProps {
  reservationId: string;
  onClose: () => void;
}

export const GuestFolioModal: React.FC<GuestFolioModalProps> = ({ reservationId, onClose }) => {
  const { 
    reservations, 
    properties, 
    activePropertyId, 
    addFolioItem, 
    addPayment, 
    checkInGuest, 
    checkOutGuest,
    applyPromoCodeToReservation,
    categories 
  } = usePmsStore();

  const reservation = reservations.find((r) => r.id === reservationId);
  const property = properties.find((p) => p.id === activePropertyId) || properties[0];
  const category = categories.find((c) => c.id === reservation?.categoryId);

  // Folio post form state
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [department, setDepartment] = useState<FolioItem['department']>('Fine Dining');
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');

  // Payment settle state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentAmount, setPaymentAmount] = useState('');

  // Promo code state
  const [promoInput, setPromoInput] = useState('');

  // Printable invoice modal state
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);

  if (!reservation) return null;

  // Calculate totals
  let totalPreTax = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalGross = 0;

  reservation.folio.forEach((item) => {
    totalPreTax += item.amount;
    totalCgst += item.cgst;
    totalSgst += item.sgst;
    totalGross += item.totalWithTax;
  });

  const totalPayments = reservation.payments.reduce((acc, p) => acc + p.amount, 0);
  const balanceDue = Math.max(0, totalGross - totalPayments);

  const postPresetCharge = (dept: FolioItem['department'], desc: string, amt: number) => {
    addFolioItem(reservation.id, {
      department: dept,
      description: desc,
      amount: amt,
      gstRate: 0.18,
      postedBy: 'Front Desk Quick Action',
    });
  };

  const handlePostChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amountInput);
    if (isNaN(num) || num <= 0) return;

    addFolioItem(reservation.id, {
      department,
      description: description.trim() || `${department} Service Charge`,
      amount: num,
      gstRate: 0.18,
      postedBy: 'Front Desk Manager',
    });

    setDescription('');
    setAmountInput('');
    setShowAddCharge(false);
  };

  const handleSettlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(paymentAmount);
    if (isNaN(num) || num <= 0) return;

    addPayment(reservation.id, {
      method: paymentMethod,
      amount: num,
      notes: `Settlement via ${paymentMethod}`,
    });

    setPaymentAmount('');
    setShowPaymentModal(false);
  };

  const handleFinalizeCheckout = () => {
    if (balanceDue > 0) {
      checkOutGuest(reservation.id, 'UPI', balanceDue, 'Full settlement at final checkout');
    } else {
      checkOutGuest(reservation.id, 'UPI', 0, 'Folio settled in full');
    }
    setShowInvoicePrint(true);
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    applyPromoCodeToReservation(reservation.id, promoInput);
    setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF6EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#B48C36]/40 flex items-center justify-center text-[#B48C36]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Guest Folio #{reservation.bookingCode}
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    reservation.status === 'Checked-In'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : reservation.status === 'Checked-Out'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {reservation.status}
                </span>
                <OtaLogo channel={reservation.source} size="xs" />
              </div>
              <p className="text-xs text-stone-600 font-mono">
                Suite {reservation.roomId.replace('room-', '')} • {category?.name} ({category?.tier})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoicePrint(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#B48C36] text-[#936F25] hover:bg-[#FAF6EC] text-xs font-serif font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-12 gap-6 bg-[#FAFAF8]">
          {/* Left Column: Guest info & Folio Ledger */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Guest Summary Card */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-stone-500 font-mono text-[10px] uppercase font-bold">Primary Guest</p>
                <p className="font-serif font-bold text-stone-900 text-sm mt-0.5">
                  {reservation.guest.salutation} {reservation.guest.fullName}
                </p>
                <p className="text-stone-600 font-mono text-[11px]">{reservation.guest.phone}</p>
                <p className="text-stone-500 text-[11px] truncate">{reservation.guest.email}</p>
              </div>

              <div>
                <p className="text-stone-500 font-mono text-[10px] uppercase font-bold">Identity Document</p>
                <p className="font-mono text-stone-800 mt-0.5 font-semibold">
                  {reservation.guest.idType}: {reservation.guest.idNumber}
                </p>
                <p className="text-stone-500 text-[10px]">Nationality: {reservation.guest.country}</p>
              </div>

              <div>
                <p className="text-stone-500 font-mono text-[10px] uppercase font-bold">Stay Schedule</p>
                <p className="font-mono text-stone-800 mt-0.5 font-semibold">
                  {formatDateEditorial(reservation.checkInDate)} – {formatDateEditorial(reservation.checkOutDate)}
                </p>
                <p className="text-stone-500 font-mono text-[11px]">
                  {reservation.nights} Nights • {reservation.adults} Adults
                </p>
              </div>
            </div>

            {/* Quick Post Preset Charges Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold">
                  ⚡ Post Room Charges & Incidental Bills
                </span>
                <button
                  onClick={() => setShowAddCharge(!showAddCharge)}
                  className="text-xs text-[#936F25] font-bold hover:underline flex items-center gap-1 font-mono"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Custom Charge
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => postPresetCharge('Fine Dining', 'Mewar Royal Thali Dinner', 4500)}
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#B48C36] text-left transition-all shadow-sm group"
                >
                  <Coffee className="w-4 h-4 text-amber-600 mb-1" />
                  <p className="text-xs font-bold text-stone-900 group-hover:text-[#B48C36]">In-Room Dining</p>
                  <p className="text-[10px] font-mono text-stone-500">₹4,500 + 18% GST</p>
                </button>

                <button
                  onClick={() => postPresetCharge('Ayurvedic Spa', '90-Min Abhyanga Spa Ritual', 6000)}
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#B48C36] text-left transition-all shadow-sm group"
                >
                  <Flower2 className="w-4 h-4 text-emerald-600 mb-1" />
                  <p className="text-xs font-bold text-stone-900 group-hover:text-[#B48C36]">Ayurvedic Spa</p>
                  <p className="text-[10px] font-mono text-stone-500">₹6,000 + 18% GST</p>
                </button>

                <button
                  onClick={() => postPresetCharge('Laundry', 'Express Silk Laundry & Pressing', 800)}
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#B48C36] text-left transition-all shadow-sm group"
                >
                  <Shirt className="w-4 h-4 text-blue-600 mb-1" />
                  <p className="text-xs font-bold text-stone-900 group-hover:text-[#B48C36]">Laundry</p>
                  <p className="text-[10px] font-mono text-stone-500">₹800 + 18% GST</p>
                </button>

                <button
                  onClick={() => postPresetCharge('Chauffeur / Transfer', 'BMW 7 Airport Chauffeur', 7500)}
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#B48C36] text-left transition-all shadow-sm group"
                >
                  <Car className="w-4 h-4 text-purple-600 mb-1" />
                  <p className="text-xs font-bold text-stone-900 group-hover:text-[#B48C36]">Airport Chauffeur</p>
                  <p className="text-[10px] font-mono text-stone-500">₹7,500 + 18% GST</p>
                </button>
              </div>

              {/* Collapsible Custom Charge Form */}
              {showAddCharge && (
                <form
                  onSubmit={handlePostChargeSubmit}
                  className="mt-3 p-4 rounded-2xl bg-white border border-[#B48C36]/40 space-y-3 shadow-sm animate-in fade-in"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-stone-600 block mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                      >
                        <option value="Fine Dining">In-Room Dining</option>
                        <option value="Ayurvedic Spa">Ayurvedic Spa</option>
                        <option value="Laundry">Laundry</option>
                        <option value="Minibar">Minibar</option>
                        <option value="Chauffeur / Transfer">Chauffeur / Transfer</option>
                        <option value="Bespoke Experience">Bespoke Experience</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-stone-600 block mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Vintage Dom Pérignon 2013"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-stone-600 block mb-1">Pre-Tax Amount (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="4500"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCharge(false)}
                      className="px-3 py-1 rounded-lg text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 text-xs font-serif font-bold shadow-sm"
                    >
                      Post Charge to Folio
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Folio Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-bold">
                  Itemized Ledger & Indian GST Breakdown (9% CGST + 9% SGST)
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {reservation.folio.length} Posted Items
                </span>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-stone-200 bg-[#FAF6EC] text-[10px] text-stone-700 uppercase font-bold">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                      <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">Gross (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reservation.folio.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 text-stone-500 text-[11px]">{item.date}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-stone-900 font-sans font-semibold block">{item.description}</span>
                          <span className="text-[10px] text-stone-500">{item.department} • Posted by {item.postedBy}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-stone-700">{item.amount.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right text-stone-500">{item.cgst.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right text-stone-500">{item.sgst.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right text-stone-900 font-bold">{item.totalWithTax.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    {reservation.folio.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400 font-sans text-xs">
                          No incidental charges posted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Billing Summary & Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            {/* Folio Settlement Box */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#B48C36]" />
                Folio Settlement Ledger
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-600">
                  <span>Taxable Subtotal:</span>
                  <span>{formatINR(totalPreTax)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Central GST (CGST 9%):</span>
                  <span>{formatINR(totalCgst)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>State GST (SGST 9%):</span>
                  <span>{formatINR(totalSgst)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-2 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#936F25]">{formatINR(totalGross)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Payments Settled:</span>
                  <span>- {formatINR(totalPayments)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-stone-200 pt-2 text-base font-bold bg-[#FAF6EC] p-2 rounded-xl">
                  <span className="text-stone-800">Balance Due:</span>
                  <span className={balanceDue > 0 ? 'text-rose-600 font-mono' : 'text-emerald-700 font-mono'}>
                    {formatINR(balanceDue)}
                  </span>
                </div>
              </div>

              {/* Promo code applicator */}
              <div className="pt-2 border-t border-stone-200">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                  Promotional Privilege Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ROYAL15"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 uppercase font-mono focus:border-[#B48C36] outline-none"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF6EC] border border-[#B48C36] text-[#936F25] text-xs font-serif font-bold hover:bg-[#F7F0DF]"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Settle Balance Button */}
              {balanceDue > 0 && (
                <button
                  onClick={() => {
                    setPaymentAmount(balanceDue.toString());
                    setShowPaymentModal(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Settle Balance ({formatINR(balanceDue)})</span>
                </button>
              )}

              {/* Payments History List */}
              {reservation.payments.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">Recorded Receipts</p>
                  {reservation.payments.map((p) => (
                    <div key={p.id} className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-stone-900">{p.method}</span>
                        <p className="text-[10px] font-mono text-stone-500">{p.referenceNumber} • {p.timestamp}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatINR(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Front Desk Operational Actions */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold">
                Front-Desk Operational Controls
              </p>

              {reservation.status === 'Confirmed' && (
                <button
                  onClick={() => checkInGuest(reservation.id)}
                  className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-serif font-bold text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Complete Express Check-In</span>
                </button>
              )}

              {reservation.status === 'Checked-In' && (
                <button
                  onClick={handleFinalizeCheckout}
                  className="w-full py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-serif font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Finalize Check-Out & Generate Tax Invoice</span>
                </button>
              )}

              {reservation.status === 'Checked-Out' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-mono font-semibold">
                  ✓ Guest checked out. Suite dispatched to Housekeeping.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settlement Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-serif font-bold text-stone-900 text-sm">
                Settle Folio Balance
              </h4>
              <button onClick={() => setShowPaymentModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSettlePayment} className="space-y-4">
              <div>
                <label className="text-xs text-stone-600 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Credit Card', 'Cash', 'OTA Virtual Card'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 rounded-lg border text-xs font-mono transition-all text-center ${
                        paymentMethod === m
                          ? 'border-[#B48C36] bg-[#FAF6EC] text-[#936F25] font-bold shadow-sm'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-600 block mb-1">Amount to Settle (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoicePrint && (
        <PrintableInvoice
          reservation={reservation}
          property={property}
          onClose={() => setShowInvoicePrint(false)}
        />
      )}
    </div>
  );
};
