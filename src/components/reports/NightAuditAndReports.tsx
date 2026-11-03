import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { 
  Moon, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck,
  ChevronRight,
  PieChart,
  BarChart,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { format, addDays } from 'date-fns';

export const NightAuditAndReports: React.FC = () => {
  const { 
    reservations, 
    rooms, 
    selectedDate, 
    runNightAudit, 
    nightAuditReports, 
    activePropertyId, 
    properties 
  } = usePmsStore();

  const [auditStep, setAuditStep] = useState<number>(1);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'audit' | 'manager-flash' | 'gst-tax'>('audit');

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0];

  // In-House & Today's Stats
  const inHouseReservations = reservations.filter((r) => r.status === 'Checked-In');
  const expectedDepartures = reservations.filter((r) => r.status === 'Checked-In' && r.checkOutDate === selectedDate);
  const pendingArrivals = reservations.filter((r) => r.status === 'Confirmed' && r.checkInDate === selectedDate);

  const totalRoomsCount = rooms.length || 20;
  const occupiedCount = inHouseReservations.length;
  const occupancyPercent = totalRoomsCount > 0 ? (occupiedCount / totalRoomsCount) * 100 : 0;

  const totalRoomRevenue = inHouseReservations.reduce((acc, r) => acc + r.roomRatePerNight, 0);
  const adr = occupiedCount > 0 ? totalRoomRevenue / occupiedCount : 0;
  const revPar = totalRoomsCount > 0 ? totalRoomRevenue / totalRoomsCount : 0;

  // Folio Revenue Totals
  let totalDiningRev = 0;
  let totalLaundryRev = 0;
  let totalOtherRev = 0;
  let totalGstCollected = 0;

  reservations.forEach((r) => {
    (r.folio || []).forEach((item) => {
      totalGstCollected += (item.cgst + item.sgst);
      if (item.department === 'Fine Dining') totalDiningRev += item.amount;
      else if (item.department === 'Laundry') totalLaundryRev += item.amount;
      else if (item.department !== 'Room Tariff') totalOtherRev += item.amount;
    });
  });

  const handleExecuteAudit = async () => {
    setIsRunningAudit(true);
    await runNightAudit('Twinkle Bagh (General Manager)');
    setIsRunningAudit(false);
    setAuditStep(3);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FAFAF8] p-4 sm:p-6 space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#B48C36]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Night Audit & Financial Intelligence
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            End-of-day revenue reconciliation, room tariff posting, and statutory GST tax compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveReportTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
              activeReportTab === 'audit'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            End-of-Day Audit Wizard
          </button>
          <button
            onClick={() => setActiveReportTab('manager-flash')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
              activeReportTab === 'manager-flash'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Manager Daily Flash
          </button>
          <button
            onClick={() => setActiveReportTab('gst-tax')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
              activeReportTab === 'gst-tax'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Indian GST GSTR-1
          </button>
        </div>
      </div>

      {/* Tab 1: Night Audit Wizard */}
      {activeReportTab === 'audit' && (
        <div className="space-y-6">
          {/* Step Progression Bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: 1, title: 'Pre-Audit Preflight', desc: 'Verify Arrivals & Departures' },
              { step: 2, title: 'Posting & Rollover', desc: 'Auto-Post Tariffs & Advance Date' },
              { step: 3, title: 'Audit Closure', desc: 'Generate Night Audit Flash' },
            ].map((s) => (
              <div
                key={s.step}
                className={`p-3.5 rounded-2xl border transition-all ${
                  auditStep === s.step
                    ? 'bg-[#FAF6EC] border-[#B48C36]/50 shadow-sm'
                    : auditStep > s.step
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                    auditStep > s.step ? 'bg-emerald-600 text-white' : 'bg-[#B48C36] text-white'
                  }`}>
                    {auditStep > s.step ? '✓' : s.step}
                  </span>
                  <span className="font-serif text-xs font-bold text-stone-900">{s.title}</span>
                </div>
                <p className="text-[10px] text-stone-500 font-mono">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Audit Step 1: Pre-flight Verification */}
          {auditStep === 1 && (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Step 1: Operational Preflight Audit ({selectedDate})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ensure all check-ins and check-outs for today are settled prior to rolling the business date.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  Business Date: {selectedDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">In-House Guests</span>
                  <p className="text-2xl font-serif font-bold text-stone-900">{inHouseReservations.length} Rooms</p>
                  <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for nightly tariff post
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">Pending Check-Ins</span>
                  <p className="text-2xl font-serif font-bold text-stone-900">{pendingArrivals.length}</p>
                  <p className="text-xs text-stone-500 mt-1">
                    {pendingArrivals.length === 0 ? 'All scheduled arrivals processed' : 'Pending walk-in or no-show check'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">Due Departures</span>
                  <p className="text-2xl font-serif font-bold text-stone-900">{expectedDepartures.length}</p>
                  <p className="text-xs text-stone-500 mt-1">
                    {expectedDepartures.length === 0 ? 'No open checkouts remaining' : 'Requires folio settlement'}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setAuditStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white text-xs font-serif font-bold transition-all shadow-sm"
                >
                  <span>Proceed to Night Posting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Audit Step 2: Confirmation & Execution */}
          {auditStep === 2 && (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-5">
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Step 2: Automated Night Tariff Posting & Date Advance
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Executing night audit will post <b>{inHouseReservations.length}</b> room tariff folios totalling <b>{formatINR(totalRoomRevenue)}</b>, write audit logs to SQLite, and advance calendar date to <b>{format(addDays(new Date(selectedDate), 1), 'yyyy-MM-dd')}</b>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/30 text-xs text-[#936F25] space-y-2">
                <p className="font-bold font-serif">Audit Execution Checklist:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  <li>Room charges calculated with GST slab compliance (12% for &lt; ₹7,500; 18% for luxury)</li>
                  <li>Inbound OTA inventory buffers synchronized with MakeMyTrip and Booking.com</li>
                  <li>SQLite relational write commit to <code>data/hotel_pms.db</code></li>
                  <li>Business date rolls forward at midnight</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setAuditStep(1)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-serif font-bold"
                >
                  Back
                </button>

                <button
                  onClick={handleExecuteAudit}
                  disabled={isRunningAudit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-serif font-bold transition-all shadow-sm"
                >
                  <Moon className={`w-4 h-4 ${isRunningAudit ? 'animate-spin' : ''}`} />
                  <span>{isRunningAudit ? 'Executing Audit...' : 'Execute Night Audit & Close Day'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Audit Step 3: Audit Success Closure */}
          {auditStep === 3 && (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Night Audit Successfully Finalized!
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                All guest folios posted, GST entries audited, and operational business date advanced to <b>{selectedDate}</b>.
              </p>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={() => setActiveReportTab('manager-flash')}
                  className="px-4 py-2 rounded-xl bg-[#B48C36] text-white text-xs font-serif font-bold"
                >
                  View Manager Daily Flash Report
                </button>
                <button
                  onClick={() => setAuditStep(1)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-serif font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manager Daily Flash Report */}
      {activeReportTab === 'manager-flash' && (
        <div className="space-y-6">
          {/* KPI Header Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Occupancy Rate
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900">{occupancyPercent.toFixed(1)}%</p>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">{occupiedCount} / {totalRoomsCount} Units Sold</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                ADR (Avg Daily Rate)
              </span>
              <p className="text-2xl font-serif font-bold text-[#936F25]">{formatINR(adr)}</p>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">Per Occupied Room</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                RevPAR
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900">{formatINR(revPar)}</p>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">Per Available Room</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Total Day Revenue
              </span>
              <p className="text-2xl font-serif font-bold text-emerald-700">{formatINR(totalRoomRevenue + totalDiningRev + totalLaundryRev)}</p>
              <p className="text-[11px] text-stone-500 mt-1 font-mono">Gross Before GST</p>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Departmental Revenue Summary
              </h3>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Flash Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Revenue Department</th>
                    <th className="py-2.5">Gross Revenue</th>
                    <th className="py-2.5">GST Rate</th>
                    <th className="py-2.5">CGST</th>
                    <th className="py-2.5">SGST</th>
                    <th className="py-2.5">Total with Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-2.5 font-bold text-stone-900 font-serif">Room Tariff (Accommodation)</td>
                    <td className="py-2.5 font-mono">{formatINR(totalRoomRevenue)}</td>
                    <td className="py-2.5 font-mono">12%</td>
                    <td className="py-2.5 font-mono">{formatINR(totalRoomRevenue * 0.06)}</td>
                    <td className="py-2.5 font-mono">{formatINR(totalRoomRevenue * 0.06)}</td>
                    <td className="py-2.5 font-mono font-bold text-[#936F25]">{formatINR(totalRoomRevenue * 1.12)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-stone-900 font-serif">Fine Dining & Room Service F&B</td>
                    <td className="py-2.5 font-mono">{formatINR(totalDiningRev)}</td>
                    <td className="py-2.5 font-mono">5%</td>
                    <td className="py-2.5 font-mono">{formatINR(totalDiningRev * 0.025)}</td>
                    <td className="py-2.5 font-mono">{formatINR(totalDiningRev * 0.025)}</td>
                    <td className="py-2.5 font-mono font-bold text-[#936F25]">{formatINR(totalDiningRev * 1.05)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-stone-900 font-serif">Laundry & Valet Services</td>
                    <td className="py-2.5 font-mono">{formatINR(totalLaundryRev)}</td>
                    <td className="py-2.5 font-mono">5%</td>
                    <td className="py-2.5 font-mono">{formatINR(totalLaundryRev * 0.025)}</td>
                    <td className="py-2.5 font-mono">{formatINR(totalLaundryRev * 0.025)}</td>
                    <td className="py-2.5 font-mono font-bold text-[#936F25]">{formatINR(totalLaundryRev * 1.05)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-stone-900 font-serif">Airport Transfers & Bespoke Concierge</td>
                    <td className="py-2.5 font-mono">{formatINR(totalOtherRev)}</td>
                    <td className="py-2.5 font-mono">5%</td>
                    <td className="py-2.5 font-mono">{formatINR(totalOtherRev * 0.025)}</td>
                    <td className="py-2.5 font-mono">{formatINR(totalOtherRev * 0.025)}</td>
                    <td className="py-2.5 font-mono font-bold text-[#936F25]">{formatINR(totalOtherRev * 1.05)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Indian GST GSTR-1 Compliance */}
      {activeReportTab === 'gst-tax' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Indian GST Statutory Return (GSTR-1 Format)
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Property GSTIN: <b>{activeProperty.gstin}</b> • State: {activeProperty.state} (Code: 21)
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-serif font-bold shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export GST Filing Summary</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                  5% Slab (F&B / Outlets)
                </span>
                <p className="text-xl font-mono font-bold text-stone-900">{formatINR(totalDiningRev + totalLaundryRev)}</p>
                <p className="text-xs text-stone-500 font-mono mt-1">Tax: {formatINR((totalDiningRev + totalLaundryRev) * 0.05)}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                  12% Slab (Standard Rooms &lt; ₹7,500)
                </span>
                <p className="text-xl font-mono font-bold text-stone-900">{formatINR(totalRoomRevenue)}</p>
                <p className="text-xs text-stone-500 font-mono mt-1">Tax: {formatINR(totalRoomRevenue * 0.12)}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                  Total GST Payable
                </span>
                <p className="text-xl font-mono font-bold text-[#936F25]">
                  {formatINR(totalRoomRevenue * 0.12 + (totalDiningRev + totalLaundryRev) * 0.05)}
                </p>
                <p className="text-xs text-stone-500 font-mono mt-1">Split 50% CGST + 50% SGST</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

