import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePmsStore } from '../store/usePmsStore';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  User, 
  KeyRound, 
  Compass,
  AlertCircle,
  Database
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = usePmsStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTarget = searchParams.get('redirect');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(email, password);
    if (res.success) {
      navigate(redirectTarget || res.redirectUrl);
    } else {
      setErrorMessage(res.message || 'Invalid credentials. Please use the Quick Demo login buttons.');
    }
  };

  const handleQuickDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');

    const res = login(demoEmail, demoPass);
    if (res.success) {
      navigate(redirectTarget || res.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1917] font-sans flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] border border-[#B48C36]/40 flex items-center justify-center shadow-sm">
            <span className="font-serif font-black text-xl text-[#B48C36]">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-widest uppercase text-stone-900">AURA</span>
              <span className="text-[10px] font-mono tracking-widest text-[#B48C36] bg-[#FAF6EC] border border-[#B48C36]/30 px-2 py-0.5 rounded-full uppercase font-bold">
                PMS & CHANNEL MANAGER
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-sans">Commercial Hospitality Suite & SQLite Engine</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-serif transition-colors shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-[#B48C36]" />
          <span className="hidden sm:inline">Guest Direct Booking Portal</span>
          <span className="sm:hidden">Booking Portal</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10 space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EC] border border-[#B48C36]/30 text-[#936F25] text-xs font-serif font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#B48C36]" />
              Hospitality Enterprise Gateway
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Hotel Staff & Partner Sign In
            </h1>
            <p className="text-xs text-stone-600 font-sans max-w-sm mx-auto">
              Authenticate to enter your PMS front desk, channel manager, and POS terminal.
            </p>
          </div>

          {/* Quick Demo Autofill Bar */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold text-center">
              ⚡ 1-Click Quick Demo Sign In
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* BookOne Suite Demo Account (User Specified Creds) */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('bookonedemo123@gmail.com', 'Pass@1234')}
                className="p-3 rounded-2xl bg-[#FAF6EC] border-2 border-[#B48C36] hover:bg-[#F5EDD6] flex items-center justify-between text-left transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#B48C36]/40 flex items-center justify-center text-[#B48C36] group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-stone-900">BookOne Suite & Towers</span>
                      <span className="text-[9px] font-mono bg-[#B48C36] text-white px-2 py-0.2 rounded-full font-bold">
                        HOTEL ADMIN (ACTIVE)
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#936F25] font-bold">
                      bookonedemo123@gmail.com • Pass@1234
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#B48C36] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Hotel Admin - Udaipur */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin@udaivilas.com', 'admin123')}
                className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36] flex items-center justify-between text-left transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4 text-[#B48C36]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-stone-900">AURA Heritage Palace (GM)</span>
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">/admin</span>
                    </div>
                    <p className="text-[11px] font-mono text-stone-500">admin@udaivilas.com • admin123</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#B48C36] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('superadmin@aurasaas.io', 'super123')}
                className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36] flex items-center justify-between text-left transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-stone-900">Super Admin (SaaS Owner)</span>
                      <span className="text-[9px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">/superadmin</span>
                    </div>
                    <p className="text-[11px] font-mono text-stone-500">superadmin@aurasaas.io • super123</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Guest / Public Customer */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('guest@luxurytraveler.com', 'guest123')}
                className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-[#B48C36] flex items-center justify-between text-left transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform">
                    <User className="w-4 h-4 text-[#B48C36]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-stone-900">Guest / Direct Traveler</span>
                      <span className="text-[9px] font-mono bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-bold">/book</span>
                    </div>
                    <p className="text-[11px] font-mono text-stone-500">guest@luxurytraveler.com • guest123</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-mono uppercase text-stone-400 tracking-wider font-bold absolute">
              or enter credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-stone-700">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="bookonedemo123@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#B48C36] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-stone-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#B48C36] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#B48C36] hover:bg-[#936F25] text-white font-serif font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate & Enter Portal</span>
            </button>
          </form>

          {/* SQLite Local Storage Notice */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500 font-mono flex items-center justify-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>SQLite Local Database Engine active on device (<code>data/hotel_pms.db</code>)</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-stone-400 font-mono pt-4 border-t border-stone-200">
        Commercial Hotel Property Management & Channel Distribution Platform • Native SQLite Local Storage
      </footer>
    </div>
  );
};
