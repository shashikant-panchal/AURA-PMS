const { format, addDays, subDays } = require('date-fns');

function seedDatabase(db) {
  const rowCount = db.prepare('SELECT COUNT(*) as c FROM properties').get();
  if (rowCount.c > 0) {
    return; // Already seeded
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const dayPlus2 = format(addDays(new Date(), 2), 'yyyy-MM-dd');
  const dayPlus3 = format(addDays(new Date(), 3), 'yyyy-MM-dd');
  const dayPlus4 = format(addDays(new Date(), 4), 'yyyy-MM-dd');
  const dayPlus5 = format(addDays(new Date(), 5), 'yyyy-MM-dd');

  // 1. Properties
  const insertProp = db.prepare(`
    INSERT INTO properties (
      id, name, code, tagline, logo_url, currency, currency_symbol, gstin, address, city, state,
      contact_email, contact_phone, check_in_time, check_out_time, subscription_plan, status,
      monthly_billing_amount, rating, rooms_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // BookOne Suite (Reference Property from User Request)
  insertProp.run(
    'prop-bookone',
    'BookOne Suite & Towers',
    'BSE-PATIA',
    'Commercial Grade Smart Hospitality & Channel Management Suites',
    'https://bookonelocal.in/cdn/2026-04-07-121907443-logo2.jpg',
    'INR',
    '₹',
    '21AAACB1234D1Z5',
    'DLF Cyber City, Patia',
    'Bhubaneswar',
    'Odisha',
    'bookonedemo123@gmail.com',
    '+91 79785 78046',
    '14:00',
    '11:00',
    'ENTERPRISE',
    'ACTIVE',
    25000,
    4.9,
    20
  );

  // Udaipur Palace
  insertProp.run(
    'prop-udaipur',
    'AURA Heritage Palace & Reserve',
    'AUR-UDZ',
    'An Imperial Sovereign Retreat Overlooking Lake Pichola',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80',
    'INR',
    '₹',
    '08AAAAA0000A1Z5',
    'Palace Road, Near Lake Pichola Promenade',
    'Udaipur',
    'Rajasthan',
    'concierge.udaipur@aurahotels.luxury',
    '+91 (0294) 243 9000',
    '14:00',
    '11:00',
    'ENTERPRISE',
    'ACTIVE',
    45000,
    5.0,
    17
  );

  // 2. Room Categories for BookOne Suite
  const insertCat = db.prepare(`
    INSERT INTO room_categories (
      id, hotel_id, name, code, tier, description, base_price, rack_rate, min_rate, max_rate,
      max_adults, max_children, sq_ft, bed_type, hero_image, amenities_json, total_rooms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const bookoneCategories = [
    {
      id: 'cat-bse-std',
      hotel_id: 'prop-bookone',
      name: 'Standard Room',
      code: 'STD',
      tier: 'Standard',
      description: 'Well-appointed comfortable business rooms with high-speed Wi-Fi, ergonomic work desk and city view.',
      base_price: 2000,
      rack_rate: 2500,
      min_rate: 1500,
      max_rate: 4000,
      max_adults: 2,
      max_children: 1,
      sq_ft: 280,
      bed_type: 'Queen Comfort Bed',
      hero_image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      amenities: ['High Speed Wi-Fi', 'Work Desk', 'Smart TV', 'Tea/Coffee Maker', 'Air Conditioning'],
      total_rooms: 5
    },
    {
      id: 'cat-bse-dlx',
      hotel_id: 'prop-bookone',
      name: 'Deluxe Room',
      code: 'DLX',
      tier: 'Deluxe',
      description: 'Spacious modern deluxe rooms featuring plush king bedding, panoramic glass windows, and luxury rain shower.',
      base_price: 2500,
      rack_rate: 3200,
      min_rate: 1800,
      max_rate: 4500,
      max_adults: 2,
      max_children: 1,
      sq_ft: 350,
      bed_type: 'King Bed',
      hero_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['King Bed', 'City Skyline View', 'Rain Shower', 'Espresso Machine', 'Mini Bar', '24/7 Room Service'],
      total_rooms: 5
    },
    {
      id: 'cat-bse-super',
      hotel_id: 'prop-bookone',
      name: 'Super Deluxe Room',
      code: 'SDLX',
      tier: 'Premium',
      description: 'Executive super deluxe room with generous seating lounge, deep soaking tub, and luxury bath amenities.',
      base_price: 3000,
      rack_rate: 3800,
      min_rate: 2200,
      max_rate: 5500,
      max_adults: 3,
      max_children: 1,
      sq_ft: 420,
      bed_type: 'Emperor Bed',
      hero_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      amenities: ['Lounge Area', 'Soaking Tub', 'Complimentary Breakfast', 'Butler Service', 'High Speed Fibre'],
      total_rooms: 5
    },
    {
      id: 'cat-bse-suite',
      hotel_id: 'prop-bookone',
      name: 'Executive Suite Room',
      code: 'STE',
      tier: 'Suite',
      description: 'Grand master suite with private meeting salon, kitchenette, walk-in dressing wardrobe, and VIP concierge privileges.',
      base_price: 3500,
      rack_rate: 5000,
      min_rate: 2800,
      max_rate: 7500,
      max_adults: 3,
      max_children: 2,
      sq_ft: 580,
      bed_type: 'Royal Master Bed',
      hero_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      amenities: ['Separate Living Room', 'Executive Lounge Access', 'Airport Chauffeur', 'Complimentary Minibar', 'Jacuzzi'],
      total_rooms: 5
    }
  ];

  for (const cat of bookoneCategories) {
    insertCat.run(
      cat.id, cat.hotel_id, cat.name, cat.code, cat.tier, cat.description,
      cat.base_price, cat.rack_rate, cat.min_rate, cat.max_rate,
      cat.max_adults, cat.max_children, cat.sq_ft, cat.bed_type, cat.hero_image,
      JSON.stringify(cat.amenities), cat.total_rooms
    );
  }

  // 3. Rooms (20 Rooms across 4 floors for BookOne Suite)
  const insertRoom = db.prepare(`
    INSERT INTO rooms (
      id, hotel_id, room_number, category_id, floor, status, cleanliness, current_reservation_id, maintenance_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const roomDefinitions = [
    // Floor 1: Standard Rooms 101 - 105
    { id: 'bse-101', num: '101', cat: 'cat-bse-std', fl: 1, status: 'Occupied', cl: 'Clean', resId: 'res-bse-101' },
    { id: 'bse-102', num: '102', cat: 'cat-bse-std', fl: 1, status: 'Available', cl: 'Clean' },
    { id: 'bse-103', num: '103', cat: 'cat-bse-std', fl: 1, status: 'Reserved', cl: 'Clean', resId: 'res-bse-103' },
    { id: 'bse-104', num: '104', cat: 'cat-bse-std', fl: 1, status: 'Cleaning', cl: 'Dirty' },
    { id: 'bse-105', num: '105', cat: 'cat-bse-std', fl: 1, status: 'Available', cl: 'Clean' },

    // Floor 2: Deluxe Rooms 201 - 205
    { id: 'bse-201', num: '201', cat: 'cat-bse-dlx', fl: 2, status: 'Occupied', cl: 'Clean', resId: 'res-bse-201' },
    { id: 'bse-202', num: '202', cat: 'cat-bse-dlx', fl: 2, status: 'Available', cl: 'Clean' },
    { id: 'bse-203', num: '203', cat: 'cat-bse-dlx', fl: 2, status: 'Available', cl: 'Clean' },
    { id: 'bse-204', num: '204', cat: 'cat-bse-dlx', fl: 2, status: 'Reserved', cl: 'Clean', resId: 'res-bse-204' },
    { id: 'bse-205', num: '205', cat: 'cat-bse-dlx', fl: 2, status: 'Maintenance', cl: 'Dirty', note: 'AC filter overhaul' },

    // Floor 3: Super Deluxe Rooms 301 - 305
    { id: 'bse-301', num: '301', cat: 'cat-bse-super', fl: 3, status: 'Occupied', cl: 'Clean', resId: 'res-bse-301' },
    { id: 'bse-302', num: '302', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },
    { id: 'bse-303', num: '303', cat: 'cat-bse-super', fl: 3, status: 'Cleaning', cl: 'In Progress' },
    { id: 'bse-304', num: '304', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },
    { id: 'bse-305', num: '305', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },

    // Floor 4: Executive Suites 401 - 405
    { id: 'bse-401', num: '401', cat: 'cat-bse-suite', fl: 4, status: 'Occupied', cl: 'Clean', resId: 'res-bse-401' },
    { id: 'bse-402', num: '402', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' },
    { id: 'bse-403', num: '403', cat: 'cat-bse-suite', fl: 4, status: 'Reserved', cl: 'Clean', resId: 'res-bse-403' },
    { id: 'bse-404', num: '404', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' },
    { id: 'bse-405', num: '405', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' }
  ];

  for (const r of roomDefinitions) {
    insertRoom.run(
      r.id, 'prop-bookone', r.num, r.cat, r.fl, r.status, r.cl, r.resId || null, r.note || null
    );
  }

  // 4. POS Services (Actual services list extracted from BookOne)
  const insertService = db.prepare(`
    INSERT INTO pos_services (
      id, hotel_id, name, category, description, price, tax_rate, image_url, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const services = [
    { id: 'srv-1', name: 'Buffet Breakfast', cat: 'Food', desc: 'Hearty morning spread with South & North Indian continental delights', price: 200, tax: 0.05, img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200' },
    { id: 'srv-2', name: 'Executive Lunch', cat: 'Food', desc: 'Curated 4-course gourmet business lunch', price: 450, tax: 0.05, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
    { id: 'srv-3', name: 'Fine Dining Dinner', cat: 'Food', desc: 'Chef specialty tandoori and regional specialties', price: 650, tax: 0.05, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200' },
    { id: 'srv-4', name: 'Tea & Artisan Coffee', cat: 'Beverages', desc: 'Fresh roasted coffee and organic Darjeeling/Assam teas', price: 120, tax: 0.05, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200' },
    { id: 'srv-5', name: 'Premium Laundry Service', cat: 'Activity', desc: 'Same-day steam press, wash and gentle fold', price: 500, tax: 0.05, img: 'https://images.unsplash.com/photo-1545173168-9f1907e80789?w=200' },
    { id: 'srv-6', name: 'Airport Pickup / Drop', cat: 'Transport', desc: 'Bhubaneswar BBI Airport dedicated chauffeur sedan', price: 500, tax: 0.05, img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200' },
    { id: 'srv-7', name: 'Extra Rollaway Bed', cat: 'Extra Bed', desc: 'Full-size orthopaedic rollaway bed with linen set', price: 800, tax: 0.12, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200' },
    { id: 'srv-8', name: 'Royal Hi-Tea Set', cat: 'Beverages', desc: 'Afternoon savoury pastries, sandwiches and scones', price: 350, tax: 0.05, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200' },
    { id: 'srv-9', name: 'Late Check-Out (up to 4 PM)', cat: 'Express Checkout', desc: 'Extended stay flexibility subject to availability', price: 1000, tax: 0.18, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200' },
    { id: 'srv-10', name: 'Mineral Artesian Water (Pack of 4)', cat: 'Beverages', desc: 'Himalayan natural spring bottled water', price: 150, tax: 0.05, img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200' }
  ];

  for (const s of services) {
    insertService.run(s.id, 'prop-bookone', s.name, s.cat, s.desc, s.price, s.tax, s.img, 1);
  }

  // 5. Channel Connections (OTA Integrations)
  const insertChannel = db.prepare(`
    INSERT INTO channel_connections (
      id, hotel_id, name, slug, status, last_sync_time, pending_sync_count, commission_rate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const channels = [
    { id: 'ch-1', name: 'MakeMyTrip', slug: 'makemytrip', status: 'Connected', sync: 'Just now', pend: 0, comm: 18.0 },
    { id: 'ch-2', name: 'Booking.com', slug: 'bookingcom', status: 'Connected', sync: 'Just now', pend: 0, comm: 15.0 },
    { id: 'ch-3', name: 'Goibibo', slug: 'goibibo', status: 'Connected', sync: '2 mins ago', pend: 0, comm: 18.0 },
    { id: 'ch-4', name: 'Agoda', slug: 'agoda', status: 'Connected', sync: '5 mins ago', pend: 0, comm: 14.0 },
    { id: 'ch-5', name: 'Expedia', slug: 'expedia', status: 'Connected', sync: '12 mins ago', pend: 0, comm: 16.0 },
    { id: 'ch-6', name: 'Airbnb', slug: 'airbnb', status: 'Connected', sync: '18 mins ago', pend: 0, comm: 12.0 }
  ];

  for (const c of channels) {
    insertChannel.run(c.id, 'prop-bookone', c.name, c.slug, c.status, c.sync, c.pend, c.comm);
  }

  // 6. Initial In-House and Upcoming Reservations
  const insertRes = db.prepare(`
    INSERT INTO reservations (
      id, hotel_id, booking_code, room_id, category_id, guest_id, guest_json,
      check_in_date, check_out_date, nights, adults, children, source, channel_ref,
      status, room_rate, discount_amount, discount_code, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFolio = db.prepare(`
    INSERT INTO folio_items (
      id, reservation_id, date, department, description, amount, gst_rate, cgst, sgst, total_with_tax, posted_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPayment = db.prepare(`
    INSERT INTO folio_payments (
      id, reservation_id, timestamp, method, reference_number, amount, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialBookings = [
    {
      id: 'res-bse-101',
      code: 'BK1-4821',
      roomId: 'bse-101',
      catId: 'cat-bse-std',
      guest: {
        id: 'gst-1',
        name: 'Rajesh & Meera Sharma',
        sal: 'Mr.',
        email: 'rajesh.sharma@tcs.com',
        phone: '+91 98301 22890',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 9921',
        vip: true,
        requests: 'High floor, quiet corner room'
      },
      checkIn: yesterday,
      checkOut: dayPlus2,
      nights: 3,
      adults: 2,
      children: 0,
      source: 'MakeMyTrip',
      rate: 2000,
      status: 'Checked-In',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 2000, tax: 0.12 },
        { desc: 'Buffet Breakfast (2 Pax)', dept: 'Fine Dining', amount: 400, tax: 0.05 },
        { desc: 'Airport Pickup Chauffeur', dept: 'Chauffeur / Transfer', amount: 500, tax: 0.05 }
      ],
      payments: [
        { method: 'UPI', amount: 2240, ref: 'UPI-9823481230', notes: 'Advance night 1 payment' }
      ]
    },
    {
      id: 'res-bse-201',
      code: 'BK1-7294',
      roomId: 'bse-201',
      catId: 'cat-bse-dlx',
      guest: {
        id: 'gst-2',
        name: 'Dr. Siddharth Sen',
        sal: 'Dr.',
        email: 'siddharth.sen@aiims.edu',
        phone: '+91 94370 11982',
        country: 'India',
        idType: 'Passport',
        idNumber: 'IND-P881920',
        vip: true,
        requests: 'Early breakfast tray at 7:00 AM'
      },
      checkIn: today,
      checkOut: dayPlus3,
      nights: 3,
      adults: 1,
      children: 0,
      source: 'Booking.com',
      rate: 2500,
      status: 'Checked-In',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 2500, tax: 0.12 },
        { desc: 'Laundry Express Service', dept: 'Laundry', amount: 500, tax: 0.05 }
      ],
      payments: []
    },
    {
      id: 'res-bse-301',
      code: 'BK1-9102',
      roomId: 'bse-301',
      catId: 'cat-bse-super',
      guest: {
        id: 'gst-3',
        name: 'Pooja Agarwal & Family',
        sal: 'Ms.',
        email: 'pooja.agarwal@deloitte.com',
        phone: '+91 98112 33456',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 4401',
        vip: false,
        requests: 'Extra towels and herbal toiletries'
      },
      checkIn: yesterday,
      checkOut: tomorrow,
      nights: 2,
      adults: 2,
      children: 1,
      source: 'Direct Web',
      rate: 3000,
      status: 'Checked-In',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 3000, tax: 0.12 },
        { desc: 'Room Tariff (Night 2)', dept: 'Room Tariff', amount: 3000, tax: 0.12 },
        { desc: 'Dinner In-Room Dining', dept: 'Fine Dining', amount: 1300, tax: 0.05 }
      ],
      payments: [
        { method: 'Credit Card', amount: 7500, ref: 'CC-AUTH-882194', notes: 'MasterCard Pre-auth Settlement' }
      ]
    },
    {
      id: 'res-bse-401',
      code: 'BK1-3319',
      roomId: 'bse-401',
      catId: 'cat-bse-suite',
      guest: {
        id: 'gst-4',
        name: 'Vikram & Radhika Oberoi',
        sal: 'Mr.',
        email: 'v.oberoi@oberoi-holdings.in',
        phone: '+91 98200 77123',
        country: 'India',
        idType: 'Passport',
        idNumber: 'IND-P339912',
        vip: true,
        requests: 'Complimentary fruit basket, non-smoking floor'
      },
      checkIn: today,
      checkOut: dayPlus4,
      nights: 4,
      adults: 2,
      children: 0,
      source: 'Direct Web',
      rate: 3500,
      status: 'Checked-In',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 3500, tax: 0.12 }
      ],
      payments: [
        { method: 'Bank Transfer', amount: 3920, ref: 'NEFT-AXIS-9921', notes: 'Advance reservation deposit' }
      ]
    },
    {
      id: 'res-bse-103',
      code: 'BK1-6102',
      roomId: 'bse-103',
      catId: 'cat-bse-std',
      guest: {
        id: 'gst-5',
        name: 'Amitabh Mukherjee',
        sal: 'Mr.',
        email: 'amukherjee@wipro.com',
        phone: '+91 99030 44512',
        country: 'India',
        idType: 'Driving License',
        idNumber: 'OD-02-2018-8821',
        vip: false,
        requests: 'Late check-in at 8:00 PM'
      },
      checkIn: today,
      checkOut: dayPlus2,
      nights: 2,
      adults: 1,
      children: 0,
      source: 'Goibibo',
      rate: 2000,
      status: 'Confirmed',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 2000, tax: 0.12 }
      ],
      payments: []
    },
    {
      id: 'res-bse-204',
      code: 'BK1-8841',
      roomId: 'bse-204',
      catId: 'cat-bse-dlx',
      guest: {
        id: 'gst-6',
        name: 'Sunita & Deepak Chopra',
        sal: 'Mrs.',
        email: 'sunita.chopra@gmail.com',
        phone: '+91 97170 88291',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 3319',
        vip: false,
        requests: 'Feather pillows, wake-up call at 6:30 AM'
      },
      checkIn: tomorrow,
      checkOut: dayPlus4,
      nights: 3,
      adults: 2,
      children: 0,
      source: 'Agoda',
      rate: 2500,
      status: 'Confirmed',
      folio: [
        { desc: 'Room Tariff (Night 1)', dept: 'Room Tariff', amount: 2500, tax: 0.12 }
      ],
      payments: []
    }
  ];

  for (const b of initialBookings) {
    insertRes.run(
      b.id,
      'prop-bookone',
      b.code,
      b.roomId,
      b.catId,
      b.guest.id,
      JSON.stringify(b.guest),
      b.checkIn,
      b.checkOut,
      b.nights,
      b.adults,
      b.children,
      b.source,
      null,
      b.status,
      b.rate,
      0,
      null,
      b.guest.requests,
      new Date().toISOString()
    );

    for (let i = 0; i < b.folio.length; i++) {
      const f = b.folio[i];
      const cgst = (f.amount * f.tax) / 2;
      const sgst = (f.amount * f.tax) / 2;
      const total = f.amount + cgst + sgst;
      insertFolio.run(
        `fol-${b.id}-${i}`,
        b.id,
        b.checkIn,
        f.dept,
        f.desc,
        f.amount,
        f.tax,
        cgst,
        sgst,
        total,
        `${b.source} Front Desk`
      );
    }

    for (let p = 0; p < b.payments.length; p++) {
      const pm = b.payments[p];
      insertPayment.run(
        `pay-${b.id}-${p}`,
        b.id,
        `${b.checkIn} 14:15`,
        pm.method,
        pm.ref,
        pm.amount,
        pm.notes
      );
    }
  }

  // 7. Initial Sync Logs
  const insertLog = db.prepare(`
    INSERT INTO sync_logs (
      id, timestamp, type, channel, action, details, raw_payload, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLog.run(
    'log-init-1',
    format(new Date(), 'HH:mm:ss'),
    'SYSTEM',
    'CENTRAL_GATEWAY',
    'SQLITE_LOCAL_DB_INITIALIZED',
    'SQLite Local Database engine initialized at data/hotel_pms.db with 20 rooms, 4 categories, 10 POS services.',
    '[DB READY] Full relational schema created with foreign keys and WAL journal mode.',
    'SUCCESS'
  );

  insertLog.run(
    'log-init-2',
    format(new Date(), 'HH:mm:ss'),
    'INBOUND',
    'MakeMyTrip',
    'OTA_CHANNEL_SYNC',
    'Two-way rates and inventory sync established with MakeMyTrip Channel Manager API.',
    '{"status":"CONNECTED","inventoryUnits":20,"rateParity":true}',
    'SUCCESS'
  );
}

module.exports = { seedDatabase };

