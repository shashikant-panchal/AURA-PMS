import React, { useState } from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { PosService, PosOrderItem, PaymentMethod } from '../../types/hotel';
import { 
  Utensils, 
  Coffee, 
  Car, 
  Shirt, 
  Bed, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Search,
  Printer,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { formatINR } from '../../utils/currency';

export const PosManager: React.FC = () => {
  const { posServices, rooms, reservations, createPosOrder, posOrders } = usePmsStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [billingMode, setBillingMode] = useState<'BILLED_TO_ROOM' | 'DIRECT_PAY'>('BILLED_TO_ROOM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [activeCounter, setActiveCounter] = useState('BookOne Main Restaurant');
  const [walkInGuestName, setWalkInGuestName] = useState('');
  const [showKOTPreview, setShowKOTPreview] = useState(false);
  const [lastOrderKOT, setLastOrderKOT] = useState<any>(null);

  // In-house checked-in reservations
  const inHouseReservations = reservations.filter((r) => r.status === 'Checked-In');

  // Filtered services
  const filteredServices = posServices.filter((s) => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    return true;
  });

  const addToCart = (serviceId: string) => {
    setCart((prev) => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1,
    }));
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => {
      const current = prev[serviceId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: current - 1 };
    });
  };

  const clearItemFromCart = (serviceId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  // Cart Calculations
  const cartItems: PosOrderItem[] = Object.entries(cart).map(([srvId, qty]) => {
    const srv = posServices.find((s) => s.id === srvId)!;
    const amount = srv.price * qty;
    const taxAmount = Math.round(amount * srv.taxRate);
    return {
      serviceId: srv.id,
      name: srv.name,
      quantity: qty,
      unitPrice: srv.price,
      amount,
      taxAmount,
      totalAmount: amount + taxAmount,
    };
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.amount, 0);
  const taxTotal = cartItems.reduce((acc, item) => acc + item.taxAmount, 0);
  const grandTotal = subtotal + taxTotal;

  // Selected reservation
  const selectedRes = inHouseReservations.find((r) => r.roomId === selectedRoomId);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (billingMode === 'BILLED_TO_ROOM') {
      if (!selectedRoomId) {
        alert('Please select an in-house guest room to post charges.');
        return;
      }
    }

    const guestName = billingMode === 'BILLED_TO_ROOM' 
      ? (selectedRes?.guest?.fullName || `Room ${selectedRoomId.replace('bse-', '')}`)
      : (walkInGuestName || 'Walk-In Customer');

    const newOrder = createPosOrder({
      counterName: activeCounter,
      roomId: billingMode === 'BILLED_TO_ROOM' ? selectedRoomId : undefined,
      reservationId: billingMode === 'BILLED_TO_ROOM' ? selectedRes?.id : undefined,
      guestName,
      items: cartItems,
      subtotal,
      taxAmount: taxTotal,
      totalAmount: grandTotal,
      paymentStatus: billingMode === 'BILLED_TO_ROOM' ? 'BILLED_TO_ROOM' : 'PAID',
      paymentMethod: billingMode === 'DIRECT_PAY' ? paymentMethod : undefined,
    });

    setLastOrderKOT(newOrder);
    setShowKOTPreview(true);
    setCart({});
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#FAFAF8]">
      {/* Left / Center Catalog Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 border-r border-stone-200">
        {/* Header & Counter Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#B48C36]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Point of Sale & Services Hub
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Direct F&B and amenity charges, room service billing, and digital KOT dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-stone-500">Counter:</span>
            <select
              value={activeCounter}
              onChange={(e) => setActiveCounter(e.target.value)}
              className="text-xs font-serif font-bold bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-stone-800 shadow-sm focus:outline-none focus:border-[#B48C36]"
            >
              <option value="BookOne Main Restaurant">Main Restaurant (Ground Floor)</option>
              <option value="In-Room Dining KOT">In-Room Dining / Room Service</option>
              <option value="Executive Lounge & Bar">Lounge & Coffee Bar</option>
              <option value="Banquet & Events Outlet">Banquet & Catering Service</option>
            </select>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'Food', label: 'Dining & Meals' },
              { id: 'Beverages', label: 'Tea & Coffee' },
              { id: 'Activity', label: 'Laundry & House' },
              { id: 'Transport', label: 'Transfers' },
              { id: 'Extra Bed', label: 'Extra Bedding' },
              { id: 'Express Checkout', label: 'Late Checkout' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/50 shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search services, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#B48C36]"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1 overflow-y-auto">
          {filteredServices.map((srv) => {
            const countInCart = cart[srv.id] || 0;

            return (
              <div
                key={srv.id}
                className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36]/50 shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
                      {srv.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-900">
                      {formatINR(srv.price)}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#936F25] transition-colors line-clamp-1">
                    {srv.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    GST: {srv.taxRate * 100}%
                  </span>

                  {countInCart > 0 ? (
                    <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#B48C36]/40 rounded-xl px-2 py-1">
                      <button
                        onClick={() => removeFromCart(srv.id)}
                        className="p-1 rounded-lg hover:bg-[#B48C36]/20 text-[#936F25]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-[#936F25] px-1">
                        {countInCart}
                      </span>
                      <button
                        onClick={() => addToCart(srv.id)}
                        className="p-1 rounded-lg hover:bg-[#B48C36]/20 text-[#936F25]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(srv.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#FAF6EC] text-stone-700 hover:text-[#936F25] border border-stone-200 hover:border-[#B48C36]/40 text-xs font-serif font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Billing & Cart Drawer */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-stone-200 flex flex-col justify-between h-auto md:h-full p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col overflow-y-auto">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B48C36]" />
              <h3 className="font-serif text-sm font-bold text-stone-900">Current Order Cart</h3>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>

          {/* Billing Destination Selector */}
          <div className="mb-4">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1.5">
              Billing Destination
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBillingMode('BILLED_TO_ROOM')}
                className={`py-2 px-2.5 rounded-xl text-xs font-serif font-bold text-center transition-all ${
                  billingMode === 'BILLED_TO_ROOM'
                    ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/60 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                Post to Room Folio
              </button>
              <button
                onClick={() => setBillingMode('DIRECT_PAY')}
                className={`py-2 px-2.5 rounded-xl text-xs font-serif font-bold text-center transition-all ${
                  billingMode === 'DIRECT_PAY'
                    ? 'bg-[#FAF6EC] text-[#936F25] border border-[#B48C36]/60 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                Direct Settlement
              </button>
            </div>
          </div>

          {/* Room Selector or Walk-in Name */}
          {billingMode === 'BILLED_TO_ROOM' ? (
            <div className="mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block mb-1">
                Select In-House Room
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full text-xs font-serif font-bold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#B48C36]"
              >
                <option value="">-- Choose In-House Room --</option>
                {inHouseReservations.map((res) => (
                  <option key={res.id} value={res.roomId}>
                    Room {res.roomId.replace('bse-', '')} - {res.guest?.fullName} ({res.bookingCode})
                  </option>
                ))}
              </select>
              {selectedRes && (
                <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between">
                  <span>Guest: <b>{selectedRes.guest?.fullName}</b></span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Checked-In
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Guest Name / Table #
              </label>
              <input
                type="text"
                placeholder="Walk-In Guest / Table 4"
                value={walkInGuestName}
                onChange={(e) => setWalkInGuestName(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-stone-800 focus:outline-none focus:border-[#B48C36]"
              />

              <div className="pt-2">
                <span className="text-[10px] font-mono text-stone-500 block mb-1">Payment Method:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['UPI', 'Cash', 'Credit Card'] as PaymentMethod[]).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold border ${
                        paymentMethod === pm
                          ? 'bg-[#B48C36] text-white border-[#B48C36]'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                Your cart is empty. Select items from the catalog.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.serviceId}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-serif font-bold text-stone-900 leading-tight">{item.name}</p>
                    <p className="text-[10px] font-mono text-stone-500">
                      {formatINR(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">
                      {formatINR(item.amount)}
                    </span>
                    <button
                      onClick={() => clearItemFromCart(item.serviceId)}
                      className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Totals & Checkout Button */}
        <div className="pt-3 border-t border-stone-200 space-y-2">
          <div className="flex justify-between text-xs text-stone-600">
            <span>Item Subtotal:</span>
            <span className="font-mono font-bold">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-600">
            <span>GST Tax (CGST + SGST):</span>
            <span className="font-mono">{formatINR(taxTotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
            <span>Total Payable:</span>
            <span className="font-mono text-[#936F25] text-base">{formatINR(grandTotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className={`w-full py-3 rounded-xl font-serif text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              cartItems.length > 0
                ? 'bg-[#B48C36] hover:bg-[#936F25] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {billingMode === 'BILLED_TO_ROOM' ? 'Post Charges to Room Folio' : 'Process Payment & Generate KOT'}
            </span>
          </button>
        </div>
      </div>

      {/* KOT / Receipt Confirmation Dialog */}
      {showKOTPreview && lastOrderKOT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="text-center">
              <span className="inline-block p-2.5 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <Receipt className="w-6 h-6" />
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Order Generated: {lastOrderKOT.orderNumber}
              </h3>
              <p className="text-xs text-stone-500">
                {lastOrderKOT.counterName} • {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-bold text-stone-800">
                  {lastOrderKOT.paymentStatus === 'BILLED_TO_ROOM' ? `Room ${lastOrderKOT.roomId?.replace('bse-', '')}` : 'Direct Settled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guest:</span>
                <span className="font-bold text-stone-800">{lastOrderKOT.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Billed:</span>
                <span className="font-mono font-bold text-[#936F25]">{formatINR(lastOrderKOT.totalAmount)}</span>
              </div>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto border-t border-stone-200 pt-2 text-xs">
              {lastOrderKOT.items.map((i: any, idx: number) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span>{i.name} × {i.quantity}</span>
                  <span className="font-mono font-bold">{formatINR(i.amount)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-serif font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print KOT Ticket</span>
              </button>
              <button
                onClick={() => setShowKOTPreview(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white text-xs font-serif font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

