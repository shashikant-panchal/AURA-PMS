import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { formatINR } from '../../utils/currency';
import { OtaLogo } from '../common/OtaLogo';
import { 
  Network, 
  Zap, 
  RefreshCw, 
  Radio, 
  Terminal, 
  Sliders, 
  Copy, 
  Check, 
  ArrowDownLeft, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const ChannelSimulationCenter: React.FC = () => {
  const { 
    channels, 
    categories, 
    syncLogs, 
    stopSells, 
    channelStopSells, 
    toggleStopSell, 
    simulateOtaInbound, 
    simulateDirectBooking, 
    triggerRateParitySync 
  } = usePmsStore();

  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INBOUND' | 'OUTBOUND' | 'SYSTEM'>('ALL');

  const filteredLogs = syncLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.type === logFilter;
  });

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8]">
      {/* Top Banner & Simulation Control Center */}
      <div className="p-6 border-b border-stone-200 bg-white shadow-soft-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <Network className="w-6 h-6 text-[#B48C36]" />
                OTA Channel Manager & Bi-Directional Simulation Gateway
              </h2>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                GATEWAY 100% ONLINE
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Live bidirectional testbench for OTAs: simulate inbound booking webhooks from MakeMyTrip & Goibibo, audit rate parity, and broadcast outbound inventory deduction deltas.
            </p>
          </div>

          {/* Master Simulation Actions (Prompt requirements) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => simulateOtaInbound('MakeMyTrip')}
              className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-800 font-serif font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-red-600" />
              <span>Simulate MMT Inbound Booking</span>
            </button>

            <button
              onClick={() => simulateOtaInbound('Goibibo')}
              className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-900 font-serif font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-orange-600" />
              <span>Simulate Goibibo Booking</span>
            </button>

            <button
              onClick={triggerRateParitySync}
              className="px-4 py-2 rounded-xl bg-[#FAF6EC] border border-[#B48C36] hover:bg-[#F7F0DF] text-[#936F25] font-serif font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B48C36]" />
              <span>Trigger Inventory Sync to All OTAs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split View */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-12 gap-6">
        {/* Left Column: Connected OTAs Matrix & Stop-Sell Manager */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Channel Connection Health Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#936F25] font-bold flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" />
                Connection Health & Official Brand Endpoints
              </span>
              <span className="text-[10px] font-mono text-stone-500 font-semibold">5 Active Channels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-soft-luxury hover:border-[#B48C36]/50 transition-all space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <OtaLogo channel={ch.name} size="md" />
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ch.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 font-sans truncate">{ch.activeRatePlan}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] font-mono text-stone-500">
                    <span>Last Sync: {ch.lastSyncTime}</span>
                    <span className="font-semibold text-stone-700">Commission: {ch.commissionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Parity & Stop-Sell Controls Matrix */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-soft-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#936F25]">
                <Sliders className="w-4 h-4" />
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  Rate Parity & Stop-Sell Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-500 font-semibold">
                BAR (Best Available Rate) Enforced
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Toggle Stop-Sell to instantly close inventory across all global channels or selectively restrict channels during peak high-demand windows.
            </p>

            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-200 bg-[#FAF6EC] text-[10px] text-stone-700 uppercase font-bold">
                    <th className="py-2.5 px-3">Room Category</th>
                    <th className="py-2.5 px-3 text-right">BAR Rate (₹)</th>
                    <th className="py-2.5 px-3 text-center">Global Stop-Sell</th>
                    <th className="py-2.5 px-3 text-center">MMT</th>
                    <th className="py-2.5 px-3 text-center">Booking.com</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => {
                    const isGlobalStop = stopSells[cat.id] || false;
                    const isMmtStop = channelStopSells[`makemytrip_${cat.id}`] || false;
                    const isBdcStop = channelStopSells[`booking-com_${cat.id}`] || false;

                    return (
                      <tr key={cat.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-sans">
                          <span className="font-bold text-stone-900 block">{cat.name}</span>
                          <span className="text-[10px] text-stone-500 font-mono">{cat.tier}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-stone-900">
                          {formatINR(cat.basePrice)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleStopSell(cat.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] border font-bold transition-all ${
                              isGlobalStop
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            {isGlobalStop ? 'CLOSED (STOP)' : 'OPEN'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleStopSell(cat.id, 'makemytrip')}
                            className={`px-2 py-0.5 rounded-full text-[10px] border transition-all ${
                              isMmtStop
                                ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {isMmtStop ? 'STOPPED' : 'ACTIVE'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleStopSell(cat.id, 'booking-com')}
                            className={`px-2 py-0.5 rounded-full text-[10px] border transition-all ${
                              isBdcStop
                                ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {isBdcStop ? 'STOPPED' : 'ACTIVE'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Sync Log Terminal (Real REST / XML Payloads) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full min-h-[500px]">
          <div className="p-4 rounded-t-2xl bg-stone-900 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold">
                Live OTA Webhook & Sync Terminal
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {(['ALL', 'INBOUND', 'OUTBOUND'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLogFilter(type)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    logFilter === type
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-stone-950 text-stone-200 rounded-b-2xl p-4 overflow-y-auto space-y-3 font-mono text-xs shadow-soft-luxury-lg">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {log.type === 'INBOUND' ? (
                      <span className="flex items-center gap-1 text-[10px] text-blue-300 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-500/30">
                        <ArrowDownLeft className="w-3 h-3" />
                        INBOUND
                      </span>
                    ) : log.type === 'OUTBOUND' ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        <ArrowUpRight className="w-3 h-3" />
                        OUTBOUND
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                        SYSTEM
                      </span>
                    )}

                    <span className="font-bold text-white text-xs">{log.channel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400">{log.timestamp}</span>
                    <button
                      onClick={() => handleCopySnippet(log.id, log.rawPayloadSnippet)}
                      title="Copy payload snippet"
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      {copiedLogId === log.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-stone-300 font-sans text-xs leading-relaxed">{log.details}</p>

                {/* Raw Payload Block */}
                <div className="p-2.5 rounded-lg bg-black text-[11px] text-emerald-400 break-all font-mono leading-relaxed select-all border border-stone-800">
                  {log.rawPayloadSnippet}
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-stone-500 font-sans">
                No logs recorded for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
