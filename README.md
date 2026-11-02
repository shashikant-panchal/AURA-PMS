# AURA-PMS — Multi-Tenant Luxury Hospitality SaaS & Direct Booking Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://shashikant-panchal.github.io/AURA-PMS/)

> **Permanent 24/7 Production URL:** **[https://shashikant-panchal.github.io/AURA-PMS/](https://shashikant-panchal.github.io/AURA-PMS/)**
> 
> **Pristine Luxury Aesthetic | 3 Role-Protected Routed Portals | Dynamic Multi-Tenant White-Labeling | Indian GST Engine | Real OTA Brand Integrations**

A commercial-grade, multi-tenant Property Management System (PMS), Channel Manager Gateway, and Luxury Direct Guest Booking Engine built with React 18, TypeScript, Tailwind CSS, Lucide Icons, and Zustand with local storage persistence.

---

## 🌟 Architecture & The Three Routed Portals

AURA provides three distinct, bookmarkable portals governed by authentication and deep route protection:

1. **Guest Direct Booking Engine (`/` or `/book`)**
   - **Public Access**: Bespoke luxury resort showcase tailored dynamically to the active tenant hotel.
   - Sticky real-time room selector with check-in/out calendar and guest counters.
   - Live availability lookup with Indian GST rate tiering (12% for rooms < ₹7,500; 18% for luxury rooms ≥ ₹7,500).
   - Promo code discounts (e.g., `AURAWELCOME`), special guest requests, instant booking confirmation, and celebration confetti.
   - Persistent "Staff & Partner Sign In" button for hotel operations.

2. **Hotel Admin / Front-Desk PMS (`/admin`)**
   - **Protected Route**: Requires `HOTEL_ADMIN` or `FRONT_DESK` role.
   - Operations KPI header: Occupancy %, ADR (Average Daily Rate), RevPAR, Pending Check-Ins/Outs.
   - Interactive 14-day horizontal Tape Chart displaying live reservations with authentic OTA brand badges (MakeMyTrip, Goibibo, Booking.com, Agoda, Expedia, Airbnb).
   - 1-click Express Check-In & Check-Out status transitions.
   - Comprehensive Room Folio Billing: Post dining, spa, and airport transfer charges, generate printable GST tax invoices.
   - Bi-directional Channel Manager Sync simulation.

3. **Super Admin Platform (`/superadmin`)**
   - **Strictly Protected**: Requires `SUPER_ADMIN` role.
   - SaaS Owner multi-tenant overview: Platform-wide Gross Booking Value (GBV), MRR, Active Properties, and Live System Health.
   - **Live White-Label Engine**: Edit any hotel's property name, logo, and brand accent color in real-time — immediately cascading to both the Admin PMS and public Guest Booking Engine.
   - Multi-property onboarding modal and Hotel Admin account provisioning.

4. **Staff & Partner Login Gateway (`/login`)**
   - Luxury, minimalist authentication portal with **1-Click Quick Demo Autofill** buttons.

---

## 🔑 Quick Demo Credentials

| Role | Email | Password | Target Redirection |
| :--- | :--- | :--- | :--- |
| **Super Admin (SaaS Owner)** | `superadmin@aurasaas.io` | `super123` | Directs to `/superadmin` |
| **Hotel Admin (Udaivilas GM)** | `admin@udaivilas.com` | `admin123` | Directs to `/admin` |
| **Verified Guest** | `guest@luxurytraveler.com` | `guest123` | Directs to `/` |

---

## 🎨 Design System: "Warm Alabaster & Bespoke Luxury"

- **Palette**: Warm alabaster base (`#FAFAF8` / `#FFFFFF`), crisp hairline dividers (`#E5E0D8`), deep charcoal obsidian text (`#1C1917`), and brushed champagne gold accents (`#B48C36`).
- **Typography**: Editorial Luxury Serif (`Playfair Display`, `Cinzel`), clean UI sans (`Plus Jakarta Sans`, `Inter`), and high-clarity tabular figures (`JetBrains Mono`).
- **Authentic OTA Logos**: Custom vector SVG logos for MakeMyTrip (MMT Red/White), Goibibo (Orange/Blue), Booking.com (Deep Blue), Agoda, Expedia, and Airbnb.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone https://github.com/shashikant-panchal/AURA-PMS.git
cd AURA-PMS
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 18, Vite 6, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **State Management**: Zustand with `localStorage` hydration
- **Routing**: React Router DOM v6 with custom `ProtectedRoute` RBAC
- **Visuals & Charts**: Recharts, Canvas-Confetti, Framer Motion
- **Tax Compliance**: Indian GST Module (CGST + SGST slabs)

---

## 📄 License
MIT License. Created for high-end luxury hospitality SaaS.

