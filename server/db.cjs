const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'hotel_pms.db');

function initDb() {
  const isNew = !fs.existsSync(DB_PATH);
  const db = new DatabaseSync(DB_PATH);

  // Enable WAL mode for performance
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  // Create tables schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      tagline TEXT,
      logo_url TEXT,
      currency TEXT DEFAULT 'INR',
      currency_symbol TEXT DEFAULT '₹',
      gstin TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      check_in_time TEXT DEFAULT '14:00',
      check_out_time TEXT DEFAULT '11:00',
      subscription_plan TEXT DEFAULT 'ENTERPRISE',
      status TEXT DEFAULT 'ACTIVE',
      monthly_billing_amount REAL DEFAULT 0,
      rating REAL DEFAULT 5.0,
      rooms_count INTEGER DEFAULT 20
    );

    CREATE TABLE IF NOT EXISTS room_categories (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      tier TEXT,
      description TEXT,
      base_price REAL NOT NULL,
      rack_rate REAL,
      min_rate REAL,
      max_rate REAL,
      max_adults INTEGER DEFAULT 2,
      max_children INTEGER DEFAULT 1,
      sq_ft INTEGER,
      bed_type TEXT,
      hero_image TEXT,
      amenities_json TEXT,
      total_rooms INTEGER DEFAULT 5
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      room_number TEXT NOT NULL,
      category_id TEXT NOT NULL,
      floor INTEGER NOT NULL,
      status TEXT DEFAULT 'Available',
      cleanliness TEXT DEFAULT 'Clean',
      current_reservation_id TEXT,
      maintenance_note TEXT
    );

    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      salutation TEXT DEFAULT 'Mr.',
      email TEXT,
      phone TEXT,
      country TEXT DEFAULT 'India',
      id_type TEXT DEFAULT 'Aadhaar Card',
      id_number TEXT,
      vip_status INTEGER DEFAULT 0,
      special_requests TEXT,
      dietary_preferences TEXT,
      total_spend REAL DEFAULT 0,
      visit_count INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      booking_code TEXT NOT NULL UNIQUE,
      room_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      guest_id TEXT,
      guest_json TEXT NOT NULL,
      check_in_date TEXT NOT NULL,
      check_out_date TEXT NOT NULL,
      nights INTEGER NOT NULL,
      adults INTEGER NOT NULL,
      children INTEGER NOT NULL,
      source TEXT NOT NULL,
      channel_ref TEXT,
      status TEXT NOT NULL DEFAULT 'Confirmed',
      room_rate REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      discount_code TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS folio_items (
      id TEXT PRIMARY KEY,
      reservation_id TEXT NOT NULL,
      date TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      gst_rate REAL NOT NULL,
      cgst REAL NOT NULL,
      sgst REAL NOT NULL,
      total_with_tax REAL NOT NULL,
      posted_by TEXT
    );

    CREATE TABLE IF NOT EXISTS folio_payments (
      id TEXT PRIMARY KEY,
      reservation_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      method TEXT NOT NULL,
      reference_number TEXT,
      amount REAL NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS pos_services (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      tax_rate REAL DEFAULT 0.05,
      image_url TEXT,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pos_orders (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      order_number TEXT NOT NULL,
      counter_name TEXT NOT NULL,
      room_id TEXT,
      reservation_id TEXT,
      guest_name TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax_amount REAL NOT NULL,
      total_amount REAL NOT NULL,
      payment_status TEXT NOT NULL,
      payment_method TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS channel_connections (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      status TEXT DEFAULT 'Connected',
      last_sync_time TEXT,
      pending_sync_count INTEGER DEFAULT 0,
      commission_rate REAL DEFAULT 15.0
    );

    CREATE TABLE IF NOT EXISTS sync_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL,
      channel TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      raw_payload TEXT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS night_audit_logs (
      id TEXT PRIMARY KEY,
      hotel_id TEXT NOT NULL,
      audit_date TEXT NOT NULL,
      run_by TEXT NOT NULL,
      occupied_rooms INTEGER,
      total_rooms INTEGER,
      occupancy_rate REAL,
      room_revenue REAL,
      pos_revenue REAL,
      total_revenue REAL,
      tax_collected REAL,
      created_at TEXT NOT NULL
    );
  `);

  return { db, dbPath: DB_PATH, isNew };
}

module.exports = { initDb, DB_PATH };

