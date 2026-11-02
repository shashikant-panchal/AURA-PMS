import React, { useRef } from 'react';
import { Reservation, HotelProperty } from '../../types/hotel';
import { formatINR } from '../../utils/currency';
import { formatDateEditorial } from '../../utils/dateUtils';
import { Printer, X, Download, ShieldCheck, Sparkles } from 'lucide-react';

interface PrintableInvoiceProps {
  reservation: Reservation;
  property: HotelProperty;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  reservation,
  property,
  onClose,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

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
  const balanceRemaining = Math.max(0, totalGross - totalPayments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 print:m-0 print:p-0 print:shadow-none print:max-w-none">
        {/* Action Header (Hidden during print) */}
        <div className="p-4 bg-surface-card text-white border-b border-surface-border flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="font-serif font-bold text-sm">Official GST Tax Invoice Preview</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-obsidian font-serif font-bold text-xs shadow-gold-glow hover:bg-gold-light transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet (Strict Aman / Bulgari Haute-Luxury Styling) */}
        <div ref={invoiceRef} className="p-8 sm:p-12 font-sans bg-white text-slate-900 print:p-6">
          {/* Top Header: Brand & GSTIN */}
          <div className="border-b-2 border-slate-900 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-500 flex items-center justify-center font-serif font-black text-xl">
                  A
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-black tracking-widest uppercase text-slate-900">
                    AURA HOTELS & RESORTS
                  </h1>
                  <p className="font-serif text-xs tracking-wider text-slate-600">
                    {property.name}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 max-w-md mt-2">
                {property.address}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-mono">
                <span>Tel: {property.contactPhone}</span>
                <span>Email: {property.contactEmail}</span>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="inline-block bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1 uppercase tracking-widest mb-2">
                ORIGINAL TAX INVOICE
              </span>
              <p className="text-xs font-bold text-slate-900">
                GSTIN: <span className="font-bold text-amber-700">{property.gstin}</span>
              </p>
              <p className="text-xs text-slate-600">
                Invoice No: <span className="font-bold text-slate-900">INV-{reservation.bookingCode}</span>
              </p>
              <p className="text-xs text-slate-600">
                Date: {formatDateEditorial(new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Guest & Reservation Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Guest Information</p>
              <p className="font-bold text-slate-900 font-serif text-sm mt-1">
                {reservation.guest.salutation} {reservation.guest.fullName}
              </p>
              <p className="text-slate-600 mt-0.5">{reservation.guest.country}</p>
              <p className="font-mono text-slate-500 mt-0.5">
                {reservation.guest.idType}: {reservation.guest.idNumber}
              </p>
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Reservation Code</p>
              <p className="font-mono font-bold text-slate-900 text-sm mt-1">
                {reservation.bookingCode}
              </p>
              <p className="text-slate-600 mt-0.5">Source: {reservation.source}</p>
              {reservation.channelReferenceId && (
                <p className="font-mono text-slate-500 text-[10px]">OTA Ref: {reservation.channelReferenceId}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Stay Duration</p>
              <p className="font-bold text-slate-900 mt-1">
                {formatDateEditorial(reservation.checkInDate)} – {formatDateEditorial(reservation.checkOutDate)}
              </p>
              <p className="font-mono text-slate-600 mt-0.5">
                {reservation.nights} Night{reservation.nights > 1 ? 's' : ''} • {reservation.adults} Adults
              </p>
            </div>

            <div>
              <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Allocated Residence</p>
              <p className="font-bold text-slate-900 font-serif mt-1">
                Room {reservation.roomId.replace('room-', '')}
              </p>
              <p className="text-slate-600 mt-0.5">Check-in: 14:00 • Check-out: 11:00</p>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 font-mono uppercase tracking-wider text-[10px] text-slate-600">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">SAC Code</th>
                  <th className="py-2.5">Description & Department</th>
                  <th className="py-2.5 text-right">Taxable Val (₹)</th>
                  <th className="py-2.5 text-right">CGST (₹)</th>
                  <th className="py-2.5 text-right">SGST (₹)</th>
                  <th className="py-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reservation.folio.map((item, idx) => {
                  const sacCode = item.department === 'Room Tariff' ? '996311' : item.department === 'Fine Dining' ? '996331' : '999721';
                  return (
                    <tr key={idx} className="hover:bg-slate-50 font-mono">
                      <td className="py-3 text-slate-500">{item.date}</td>
                      <td className="py-3 text-slate-500">{sacCode}</td>
                      <td className="py-3 font-sans">
                        <span className="font-semibold text-slate-900">{item.description}</span>
                        <span className="block text-[10px] text-slate-500 font-mono uppercase">{item.department}</span>
                      </td>
                      <td className="py-3 text-right">{item.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right">{item.cgst.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right">{item.sgst.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {item.totalWithTax.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tax Summary & Financial Breakdown */}
          <div className="border-t-2 border-slate-900 pt-6 flex flex-col sm:flex-row justify-between gap-8 font-mono">
            <div className="flex-1 space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                  GST Summary & Settlement Terms
                </p>
                <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
                  All room rates are subject to Indian Goods & Services Tax (GST) Act, 2017. Services rendered under SAC 9963. Payments accepted via UPI, RuPay, Visa, MasterCard, and Wire Transfer.
                </p>
              </div>

              {/* Payments Ledger */}
              {reservation.payments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Payments Recorded</p>
                  {reservation.payments.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-200">
                      <span className="text-slate-600">
                        {p.timestamp} • {p.method} ({p.referenceNumber})
                      </span>
                      <span className="font-bold text-emerald-700">
                        - {formatINR(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Balance Card */}
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Taxable Amount:</span>
                <span className="font-bold text-slate-900">{formatINR(totalPreTax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST 9%):</span>
                <span>{formatINR(totalCgst)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST 9%):</span>
                <span>{formatINR(totalSgst)}</span>
              </div>
              <div className="flex justify-between text-slate-900 border-t border-slate-300 pt-2 font-bold text-sm">
                <span>Grand Total (Inc. Taxes):</span>
                <span>{formatINR(totalGross)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Amount Settled:</span>
                <span className="font-bold">- {formatINR(totalPayments)}</span>
              </div>
              <div className="flex justify-between text-slate-900 border-t-2 border-slate-900 pt-2 font-bold text-base bg-amber-50 p-2 rounded">
                <span>Balance Payable:</span>
                <span className={balanceRemaining > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {formatINR(balanceRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
            <div>
              <p className="font-serif font-bold text-slate-900">Guest Signature</p>
              <div className="w-48 border-b border-slate-400 mt-10"></div>
              <p className="text-[10px] text-slate-500 mt-1">{reservation.guest.fullName}</p>
            </div>

            <div className="text-right">
              <div className="inline-block p-3 border border-amber-600/30 rounded-full text-center mb-2">
                <span className="text-[9px] font-mono text-amber-800 uppercase block tracking-widest font-bold">
                  AURA AUDIT VERIFIED
                </span>
              </div>
              <p className="font-serif font-bold text-slate-900">Authorized Signatory</p>
              <div className="w-48 border-b border-slate-400 mt-2 ml-auto"></div>
              <p className="text-[10px] text-slate-500 mt-1">General Manager • AURA Hotels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

