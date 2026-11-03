# AURA-PMS — Commercial Hotel Management System & Channel Manager

> **Enterprise-Ready, High-Performance Hospitality Suite with On-Device SQLite Local Storage, Real-Time Channel Manager Sync, Point of Sale (POS), Guest CRM, Express Check-In/Out, and Indian GST Tax Compliance.**

Inspired by enterprise cloud PMS architectures like **BookOne PMS**, AURA-PMS is engineered for hotels, resorts, and boutique luxury properties requiring **zero cloud dependence, absolute data privacy, instantaneous local-device persistence via SQLite**, and a responsive user experience across desktops, tablets, and smartphones.

---

## 🚀 Key Highlights & Commercial Capabilities

### 1. 💾 Zero-Cloud On-Device SQLite Database
- **Local Persistence**: Full relational database stored locally on the host device at `data/hotel_pms.db`.
- **Zero-Dependency Native Driver**: Built with Node.js v24 native `node:sqlite` (`DatabaseSync`), requiring no external binary build tools (`node-gyp`) or C++ compilers.
- **High Concurrency WAL Mode**: Write-Ahead Logging (`PRAGMA journal_mode = WAL`) guarantees high throughput and crash resistance.
- **Live Database Manager**: Inspect database file size, WAL journal state, table row counts, live SQLite ping latency, export `.sql` dump, and download raw `.db` file in 1-click.

### 2. 📱 Fully Responsive Cross-Platform UI
- **Adaptive Layout**: Collapsible sidebar navigation (expanded with sub-labels or streamlined icon-only mode) plus a mobile slide-over drawer with backdrop blur.
- **Mobile First Front Desk & POS**: Touch-friendly POS quick-cart builder, responsive KPI cards, and scrollable horizontal tape chart with sticky room headers.
- **Aesthetic**: Warm Alabaster luxury design system with crisp hairline borders, high-contrast typography, and live IST system clocks.

### 3. 🗓️ Interactive Room Tape Chart & Room Management
- **Multi-Day Zoom**: Dynamic view spans (7 Days, 14 Days, 21 Days, 30 Days) with instant zoom toggles.
- **Floor & Type Filters**: Filter by floor (Ground, 1st, 2nd, 3rd Floor) and room type (Standard, Deluxe, Super Deluxe, Executive Suite).
- **Direct Cell Booking**: Click any empty date cell to launch a pre-populated Walk-In / Quick Reservation modal.
- **Live Status Badges**: Real OTA badges (MakeMyTrip, Goibibo, Booking.com, Agoda, Expedia, Airbnb, Direct).

### 4. 🛎️ Front Desk & Express Check-In / Check-Out
- **Express Operations**: 1-click status transitions (`Reserved` ➔ `Checked-In` ➔ `Checked-Out`).
- **KYC & Document Verification**: Integrated ID verification modal supporting **Aadhaar Card, Passport, Driving License, and Voter ID**, complete with ID number validation and verification timestamps.
- **Room Folio Billing**: Real-time room folio tracking room charges, dining orders, laundry, and extra beds with instant settlement.

### 5. 🍽️ Point of Sale (POS) & Restaurant Billing
- **Authentic Service Catalog**: Pre-loaded catalog matching BookOne Suite (Buffet Breakfast, Multi-Cuisine Lunch & Dinner, Laundry, Airport Transfer, Extra Bed, Hi-Tea, Mineral Water).
- **Flexible Settlement**:
  - **Post to Room Folio**: Charge directly to active checked-in guest room folio with instant room lookup.
  - **Direct Settlement**: Instant settlement via Cash, UPI / QR, Credit Card, or Debit Card with invoice generation.
- **Kitchen Order Ticket (KOT)**: Print or view formatted KOT tickets with order numbers, server notes, table numbers, and itemized timestamps.

### 6. 🌐 2-Way Channel Manager Gateway
- **Multi-OTA Support**: Integrated gateways for **MakeMyTrip, Booking.com, Agoda, Goibibo, Expedia, and Airbnb**.
- **Live Webhook Simulator**: Trigger mock OTA bookings to test 2-way rate and inventory availability syncing.
- **Bi-Directional Sync Logs**: Audit trail tracking timestamped push/pull events, room inventory updates, and OTA reservation payloads.

### 7. 👥 Guest CRM & Loyalty Profiles
- **Guest Profiles**: Centralized directory tracking total stays, lifetime spend, VIP tags, Aadhaar/Passport numbers, and contact details.
- **Instant Search**: Search guests by name, phone number, email, or government ID.

### 8. 🌙 Automated Night Audit & Indian GST Reports
- **3-Step Audit Wizard**:
  1. Room charge posting and occupancy reconciliation.
  2. Front Desk pending check-in/out verification.
  3. Day close, revenue snapshot, and rollover to next business date.
- **Manager Daily Flash Report**: Daily summary of Gross Room Revenue, F&B/POS Revenue, ADR, RevPAR, and Total Occupancy %.
- **GSTR-1 Tax Compliance**: Breakdown of 12% GST (Rooms < ₹7,500), 18% GST (Rooms ≥ ₹7,500), and 5% GST (Dining & F&B) with CGST / SGST split.

---

## 🔑 Demo Credentials

| Role | Email / Username | Password | Default Property |
| :--- | :--- | :--- | :--- |
| **Hotel Admin (BookOne GM)** | `bookonedemo123@gmail.com` | `Pass@1234` | **BookOne Suite & Towers** |
| **Hotel Admin (Udaivilas GM)** | `admin@udaivilas.com` | `admin123` | The Oberoi Udaivilas |
| **Super Admin (Platform Owner)** | `superadmin@aurasaas.io` | `super123` | Platform Overview |
| **Verified Guest** | `guest@luxurytraveler.com` | `guest123` | Direct Booking Engine |

> 💡 **Quick Login**: Use the 1-click demo buttons on the `/login` page to sign in instantly without typing.

---

## 🛠️ Tech Stack

- **Backend & Database**: Node.js v24 native `node:sqlite` (`DatabaseSync`), Express REST API (`server/index.cjs`), SQLite WAL storage (`data/hotel_pms.db`).
- **Frontend Framework**: React 18, Vite 5, TypeScript (Strict Mode).
- **State Management**: Zustand with seamless SQLite local-server sync and client-side fallback.
- **Styling & Icons**: Tailwind CSS, PostCSS, Lucide React, Framer Motion.
- **Charts & Visuals**: Recharts (Revenue & Occupancy trends), Canvas-Confetti (Booking confirmations).
- **Tax Module**: Indian GST calculation engine with CGST (6%/9%/2.5%) and SGST (6%/9%/2.5%) reporting.

---

## 🚦 Quick Start Guide

### Prerequisites
- **Node.js**: v20+ (Node.js v24 recommended for native `node:sqlite`).
- **npm** or **pnpm**.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Local SQLite Database Server
```bash
npm run server
```
*The local database server will initialize `data/hotel_pms.db` with WAL mode and serve the REST API on `http://localhost:5050`.*

### 3. Start the Vite Frontend Application
In a second terminal:
```bash
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your web browser.*

### 4. Build for Production
```bash
npm run build
```
*Compiles strict TypeScript and outputs production-minified assets to `dist/`.*

---

## 📂 Project Structure

```
AURA-PMS/
├── data/
│   └── hotel_pms.db          # On-device SQLite database (auto-created)
├── server/
│   ├── db.cjs                # Native node:sqlite engine & table schema
│   ├── seed.cjs              # Database seeder with BookOne properties & catalog
│   └── index.cjs             # REST API endpoints (Rooms, Res, POS, Audit, Sync)
├── src/
│   ├── components/
│   │   ├── check-in/         # Front Desk, Express Check-In, KYC Verification Modal
│   │   ├── crm/              # Guest CRM & Loyalty Profiles
│   │   ├── database/         # SQLite Manager Modal with live stats & backup
│   │   ├── layout/           # Responsive Navbar & Collapsible Sidebar Drawer
│   │   ├── pos/              # Point of Sale & F&B billing with KOT printing
│   │   ├── reports/          # 3-Step Night Audit & GSTR-1 Tax Filing
│   │   └── tape-chart/       # Interactive Room Tape Chart with multi-day zoom
│   ├── mock/
│   │   └── hotelData.ts      # Property definitions & default tenant data
│   ├── services/
│   │   └── api.ts            # Client API service connecting to SQLite backend
│   ├── store/
│   │   └── usePmsStore.ts    # Central Zustand state with SQLite sync
│   └── types/
│       └── hotel.ts          # Comprehensive TypeScript interface definitions
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📄 License
MIT License. Engineered for commercial hospitality environments.
