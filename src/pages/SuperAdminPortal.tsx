import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePmsStore } from '../store/usePmsStore';
import { HotelTenant, SubscriptionPlan, TenantStatus } from '../types/hotel';
import { formatINR } from '../utils/currency';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Edit3, 
  DollarSign, 
  Bed, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  TrendingUp, 
  Save, 
  X, 
  UserPlus, 
  ExternalLink,
  Sliders,
  Globe
} from 'lucide-react';

export const SuperAdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    hotels, 
    currentUser, 
    logout, 
    updateHotelBranding, 
    createHotelTenant, 
    provisionAdminUser, 
    toggleHotelStatus,
    reservations,
    rooms,
    setActiveProperty
  } = usePmsStore();

  // Branding editor drawer state
  const [editingHotel, setEditingHotel] = useState<HotelTenant | null>(null);
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editGstin, setEditGstin] = useState('');
  const [editPlan, setEditPlan] = useState<SubscriptionPlan>('ENTERPRISE');

  // New hotel onboarding modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Rajasthan');
  const [newAddress, setNewAddress] = useState('');
  const [newGstin, setNewGstin] = useState('');
  const [newPlan, setNewPlan] = useState<SubscriptionPlan>('PRO');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newLogoUrl, setNewLogoUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80');

  // Account provisioning modal state
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provHotelId, setProvHotelId] = useState(hotels[0]?.id || '');

  // Calculate platform-wide aggregates
  const totalHotelsCount = hotels.length;
  const activeHotelsCount = hotels.filter((h) => h.status === 'ACTIVE').length;
  const totalRoomsManaged = hotels.reduce((acc, h) => acc + (h.roomsCount || 15), 0);
  
  // Aggregate Gross Booking Value (GBV across all reservations)
  const totalPlatformGbv = reservations.reduce((acc, res) => {
    return acc + res.folio.reduce((fsum, f) => fsum + f.totalWithTax, 0);
  }, 0);

  // Platform SaaS MRR (Sum of monthly billing across active tenants)
  const platformMrr = hotels
    .filter((h) => h.status === 'ACTIVE')
    .reduce((acc, h) => acc + (h.monthlyBillingAmount || 35000), 0);

  const openBrandingEditor = (hotel: HotelTenant) => {
    setEditingHotel(hotel);
    setEditName(hotel.name);
    setEditTagline(hotel.tagline || '');
    setEditLogoUrl(hotel.logoUrl || '');
    setEditAddress(hotel.address || '');
    setEditGstin(hotel.gstin || '');
    setEditPlan(hotel.subscriptionPlan);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;

    updateHotelBranding(editingHotel.id, {
      name: editName,
      tagline: editTagline,
      logoUrl: editLogoUrl,
      address: editAddress,
      gstin: editGstin,
      subscriptionPlan: editPlan,
    });

    setEditingHotel(null);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHotelTenant({
      name: newName,
      code: newCode.toUpperCase(),
      tagline: 'Imperial Luxury Residence & Sanctuary',
      logoUrl: newLogoUrl,
      currency: 'INR',
      currencySymbol: '₹',
      gstin: newGstin || '08EEEEE5555E5Z9',
      address: newAddress,
      city: newCity,
      state: newState,
      subscriptionPlan: newPlan,
      status: 'ACTIVE',
      monthlyBillingAmount: newPlan === 'ENTERPRISE' ? 45000 : newPlan === 'PRO' ? 32000 : 0,
      contactEmail: newEmail,
      contactPhone: newPhone,
      checkInTime: '14:00',
      checkOutTime: '11:00',
    });

    setShowOnboardingModal(false);
    setNewName('');
    setNewCode('');
    setNewCity('');
    setNewAddress('');
  };

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    provisionAdminUser(provName, provEmail, provHotelId);
    setShowProvisionModal(false);
    setProvName('');
    setProvEmail('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1917] font-sans flex flex-col">
      {/* 1. Super Admin Luxury Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 px-6 py-4 shadow-soft-luxury">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-900 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-purple-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold tracking-widest uppercase text-stone-900">
                  AURA SAAS MASTER CONTROL
                </h1>
                <span className="text-[10px] font-mono tracking-widest text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  SUPER ADMIN PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-sans">Multi-Tenant Management & Dynamic White-Label Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-700 font-bold">{currentUser?.name || 'Alexander Sterling'}</span>
              <span className="text-stone-400">•</span>
              <span className="text-purple-700 font-bold">SUPER_ADMIN</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Global Platform KPIs (Prompt requirement A) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tenants */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft-luxury space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                Onboarded Hotel Tenants
              </span>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif font-bold text-3xl text-stone-900 tracking-tight">
              {totalHotelsCount} Properties
            </p>
            <p className="text-[11px] font-mono text-emerald-700 font-semibold">
              ✓ {activeHotelsCount} Active Subscriptions
            </p>
          </div>

          {/* Platform MRR */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft-luxury space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                Platform SaaS MRR
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif font-bold text-3xl text-emerald-800 tracking-tight">
              {formatINR(platformMrr)}
            </p>
            <p className="text-[11px] font-mono text-stone-500">
              Recurring Enterprise Billing
            </p>
          </div>

          {/* Total Managed Rooms */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft-luxury space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                Managed Room Units
              </span>
              <div className="p-2.5 rounded-2xl bg-[#FAF6EC] text-[#936F25]">
                <Bed className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif font-bold text-3xl text-stone-900 tracking-tight">
              {totalRoomsManaged} Suites
            </p>
            <p className="text-[11px] font-mono text-stone-500">
              Synchronized with OTA Gateways
            </p>
          </div>

          {/* Platform Gross Booking Value */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-soft-luxury space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                Aggregate Gross Booking Value
              </span>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif font-bold text-3xl text-[#936F25] tracking-tight">
              {formatINR(totalPlatformGbv)}
            </p>
            <p className="text-[11px] font-mono text-emerald-700 font-semibold">
              Platform-wide Folio Volume
            </p>
          </div>
        </div>

        {/* 3. Tenant Management & Live White-Label Editor Section */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-soft-luxury p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Hotel Tenant Roster & Dynamic Branding Engine
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Customize property logos, names, and subscription plans in real time. Modifications immediately cascade to public booking engines and admin PMS.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProvisionModal(true)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-serif font-bold flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-stone-600" />
                <span>Provision Admin User</span>
              </button>

              <button
                onClick={() => setShowOnboardingModal(true)}
                className="px-4 py-2 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 text-xs font-serif font-bold flex items-center gap-1.5 shadow-gold-glow transition-all"
              >
                <Plus className="w-4 h-4 text-stone-900" />
                <span>Onboard New Hotel</span>
              </button>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF6EC] text-[10px] text-stone-700 uppercase font-bold">
                  <th className="py-3 px-4">Hotel Property & Branding</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4 text-right">Monthly Billing</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Property Logo and Name */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <img
                          src={h.logoUrl}
                          alt={h.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shadow-sm flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-sm leading-tight">{h.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono mt-0.5">{h.contactEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-stone-700">
                      {h.code}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 font-sans">
                      {h.city}, {h.state}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        h.subscriptionPlan === 'ENTERPRISE'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : h.subscriptionPlan === 'PRO'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {h.subscriptionPlan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 font-mono">
                      {h.monthlyBillingAmount ? formatINR(h.monthlyBillingAmount) : 'Trial (₹0)'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleHotelStatus(h.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all ${
                          h.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {h.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveProperty(h.id);
                            navigate('/');
                          }}
                          title="Preview Guest Booking Site for this Hotel"
                          className="p-1.5 rounded-lg border border-stone-200 hover:border-[#B48C36] text-stone-600 hover:text-[#936F25] transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openBrandingEditor(h)}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF6EC] border border-[#B48C36] text-[#936F25] text-xs font-serif font-bold hover:bg-[#F7F0DF] transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Branding</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Live Branding & White-Label Drawer Modal (Prompt requirement A) */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF6EC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#B48C36]/40 flex items-center justify-center text-[#B48C36]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Live White-Label Branding Editor
                  </h3>
                  <p className="text-xs text-stone-600 font-mono">
                    Tenant Property: {editingHotel.name} ({editingHotel.code})
                  </p>
                </div>
              </div>

              <button onClick={() => setEditingHotel(null)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranding} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Hotel Display Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-serif font-bold"
                />
                <p className="text-[10px] text-stone-500 mt-1 font-sans">
                  Instantly updates hero banner, metadata, and guest confirmation receipts.
                </p>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Property Logo Image URL *</label>
                <div className="flex gap-3 items-center">
                  <img
                    src={editLogoUrl}
                    alt="Logo Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm flex-shrink-0"
                  />
                  <input
                    type="url"
                    required
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Brand Tagline / Statement</label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">Official Property GSTIN</label>
                  <input
                    type="text"
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:border-[#B48C36] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">SaaS Subscription Tier</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  >
                    <option value="TRIAL">Trial Tier (0₹/mo)</option>
                    <option value="PRO">Professional Tier (₹32,000/mo)</option>
                    <option value="ENTERPRISE">Luxury Enterprise (₹45,000/mo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Physical Property Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHotel(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Push Brand Updates Live</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Hotel Onboarding Modal (Prompt requirement A) */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#B48C36]" />
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Onboard New Hotel Property Tenant
                </h3>
              </div>
              <button onClick={() => setShowOnboardingModal(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">Property Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amanbagh Luxury Fort & Sanctuary"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">Property Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMAN-ALW"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono uppercase focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">City & Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Alwar, Rajasthan"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">SaaS Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  >
                    <option value="PRO">Professional Tier (₹32,000/mo)</option>
                    <option value="ENTERPRISE">Luxury Enterprise (₹45,000/mo)</option>
                    <option value="TRIAL">Trial Tier (₹0)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Property Address</label>
                <input
                  type="text"
                  placeholder="Palace Road, Near Fort..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">Contact Email</label>
                  <input
                    type="email"
                    placeholder="gm@hotel.luxury"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-700 block mb-1 font-bold">GSTIN</label>
                  <input
                    type="text"
                    placeholder="08AAAAA0000A1Z5"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono uppercase focus:border-[#B48C36] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B48C36] hover:bg-[#C5A059] text-stone-900 font-serif font-bold text-xs shadow-gold-glow"
                >
                  Onboard & Provision Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Admin Account Provisioning Modal (Prompt requirement A) */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Provision Hotel Admin Credentials
              </h3>
              <button onClick={() => setShowProvisionModal(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Target Property Tenant</label>
                <select
                  value={provHotelId}
                  onChange={(e) => setProvHotelId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">General Manager / Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharaja Raghavendra"
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1 font-bold">Login Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@hotel.com"
                  value={provEmail}
                  onChange={(e) => setProvEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#B48C36] outline-none font-mono"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-serif font-bold text-xs shadow-sm"
                >
                  Create & Grant Hotel Admin Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

