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
  const dayPlus6 = format(addDays(new Date(), 6), 'yyyy-MM-dd');
  const dayPlus7 = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const dayPlus10 = format(addDays(new Date(), 10), 'yyyy-MM-dd');

  // 1. Properties
  const insertProp = db.prepare(`
    INSERT INTO properties (
      id, name, code, tagline, logo_url, currency, currency_symbol, gstin, address, city, state,
      contact_email, contact_phone, check_in_time, check_out_time, subscription_plan, status,
      monthly_billing_amount, rating, rooms_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Udaipur Palace (Primary Luxury Resort)
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

  // Ranthambore
  insertProp.run(
    'prop-ranthambore',
    'AURA Wilds Luxury Reserve',
    'AUR-RTH',
    'Private Tented Palaces on the Edge of the Bengal Tiger Realm',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=200&q=80',
    'INR',
    '₹',
    '08BBBBA1111B2Z6',
    'Kutalpura Jharina, Ranthambore Road',
    'Ranthambore',
    'Rajasthan',
    'wilds@aurahotels.luxury',
    '+91 (07462) 224 880',
    '13:00',
    '10:30',
    'PRO',
    'ACTIVE',
    32000,
    4.9,
    12
  );

  // Goa
  insertProp.run(
    'prop-goa',
    'AURA Ocean Pavilion & Spa',
    'AUR-GOA',
    'Cliffside Ultra-Luxury Villas Above the Arabian Sea',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80',
    'INR',
    '₹',
    '30CCCCA2222C3Z7',
    'Aguada Fort Road, Sinquerim, Candolim',
    'Goa',
    'Goa',
    'goa@aurahotels.luxury',
    '+91 (0832) 279 5000',
    '15:00',
    '12:00',
    'PRO',
    'ACTIVE',
    32000,
    4.95,
    15
  );

  // Delhi
  insertProp.run(
    'prop-delhi',
    'The Imperial Sovereign Residence',
    'IMP-DEL',
    'Art Deco Royal Grandeur in the Diplomatic Enclave',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    'INR',
    '₹',
    '07DDDDD3333D4Z8',
    'Janpath, Connaught Place',
    'New Delhi',
    'Delhi',
    'diplomatic@imperialsovereign.in',
    '+91 (011) 2334 1234',
    '14:00',
    '12:00',
    'TRIAL',
    'ACTIVE',
    0,
    4.85,
    24
  );

  // 2. Room Categories
  const insertCat = db.prepare(`
    INSERT INTO room_categories (
      id, hotel_id, name, code, tier, description, base_price, rack_rate, min_rate, max_rate,
      max_adults, max_children, sq_ft, bed_type, hero_image, amenities_json, total_rooms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const categories = [
    // Udaipur Categories
    {
      id: 'cat-garden',
      hotel_id: 'prop-udaipur',
      name: 'Standard Garden Villa',
      code: 'SGV',
      tier: 'Garden Sanctuary',
      description: 'Surrounded by bougainvillea courtyards, featuring private sun deck, marble en-suite and hand-carved jali screens.',
      base_price: 14500,
      rack_rate: 18000,
      min_rate: 12000,
      max_rate: 22000,
      max_adults: 2,
      max_children: 1,
      sq_ft: 680,
      bed_type: 'California King Bed with Egyptian Linens',
      hero_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Private Sun Terrace', 'Rain Shower & Soaking Tub', 'Pashmina Robes', 'Bose Sound System', 'Curated Organic Tea Bar'],
      total_rooms: 4
    },
    {
      id: 'cat-heritage',
      hotel_id: 'prop-udaipur',
      name: 'Royal Heritage Suite',
      code: 'RHS',
      tier: 'Palace Heritage',
      description: 'Authentic 19th-century royal architectural details, inlaid teakwood flooring, private alcove lounge and antique silver accents.',
      base_price: 28000,
      rack_rate: 34000,
      min_rate: 22000,
      max_rate: 40000,
      max_adults: 3,
      max_children: 2,
      sq_ft: 1150,
      bed_type: 'Four-Poster Canopied Teak King',
      hero_image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Butler Service 24/7', 'Handcrafted Deep Tub', 'Bang & Olufsen Acoustics', 'Dyson Supersonic Care', 'Private Library Alcove'],
      total_rooms: 4
    },
    {
      id: 'cat-lake',
      hotel_id: 'prop-udaipur',
      name: 'Lakeview Pavilion',
      code: 'LVP',
      tier: 'Waterfront Serenity',
      description: 'Uninterrupted panoramic perspectives across Lake Pichola and the distant Aravalli hills, floor-to-ceiling glass and private plunge pool.',
      base_price: 38500,
      rack_rate: 46000,
      min_rate: 30000,
      max_rate: 55000,
      max_adults: 2,
      max_children: 2,
      sq_ft: 1420,
      bed_type: 'Floating Custom Featherbed King',
      hero_image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Heated Infinity Plunge Pool', 'Lakefront Sun Deck', 'Evening Champagne Cart', 'Fine Art Collection', 'Aromatherapy Menu'],
      total_rooms: 4
    },
    {
      id: 'cat-pool-villa',
      hotel_id: 'prop-udaipur',
      name: 'Kohinoor Private Pool Villa',
      code: 'KPV',
      tier: 'Private Sanctuary',
      description: 'Secluded compound with temperature-controlled 12-meter lap pool, personal spa pavilion, dining gazebo and dedicated maître d\'.',
      base_price: 56000,
      rack_rate: 68000,
      min_rate: 45000,
      max_rate: 80000,
      max_adults: 4,
      max_children: 2,
      sq_ft: 2250,
      bed_type: 'Dual Master Suites (Grand King + Twin Queens)',
      hero_image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      amenities: ['12m Private Lap Pool', 'Dedicated Villa Host', 'In-Villa Dining Setup', 'Private Steam & Sauna Room', 'Helicopter Transfer Option'],
      total_rooms: 3
    },
    {
      id: 'cat-maharaja',
      hotel_id: 'prop-udaipur',
      name: 'Maharaja Presidential Sovereign Villa',
      code: 'MSV',
      tier: 'Imperial Sovereign',
      description: 'The pinnacle of Indian luxury. 3,800 square feet of private estate with antique royal thrones, private cinema, wine cellar, and Rolls-Royce chauffeur on standby.',
      base_price: 95000,
      rack_rate: 120000,
      min_rate: 80000,
      max_rate: 150000,
      max_adults: 6,
      max_children: 3,
      sq_ft: 3850,
      bed_type: 'Emperor Royal Beds with Cashmere Duvets',
      hero_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Rolls-Royce Ghost Chauffeur Included', 'Private Executive Chef', 'Security Detail Escort', 'Private Cigar Lounge & Cellar', 'Bullet-Proof Glass Veranda'],
      total_rooms: 2
    },

    // BookOne Suite Categories
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

  for (const cat of categories) {
    insertCat.run(
      cat.id, cat.hotel_id, cat.name, cat.code, cat.tier, cat.description,
      cat.base_price, cat.rack_rate, cat.min_rate, cat.max_rate,
      cat.max_adults, cat.max_children, cat.sq_ft, cat.bed_type, cat.hero_image,
      JSON.stringify(cat.amenities), cat.total_rooms
    );
  }

  // 3. Rooms
  const insertRoom = db.prepare(`
    INSERT INTO rooms (
      id, hotel_id, room_number, category_id, floor, status, cleanliness, current_reservation_id, maintenance_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const roomDefinitions = [
    // Udaipur Rooms (Floor 1: Garden Villas)
    { id: 'room-101', hotel_id: 'prop-udaipur', num: '101', cat: 'cat-garden', fl: 1, status: 'Occupied', cl: 'Clean', resId: 'res-001' },
    { id: 'room-102', hotel_id: 'prop-udaipur', num: '102', cat: 'cat-garden', fl: 1, status: 'Reserved', cl: 'Clean', resId: 'res-006' },
    { id: 'room-103', hotel_id: 'prop-udaipur', num: '103', cat: 'cat-garden', fl: 1, status: 'Available', cl: 'Inspected' },
    { id: 'room-104', hotel_id: 'prop-udaipur', num: '104', cat: 'cat-garden', fl: 1, status: 'Cleaning', cl: 'Dirty' },

    // Udaipur Rooms (Floor 2: Royal Heritage Suites)
    { id: 'room-201', hotel_id: 'prop-udaipur', num: '201', cat: 'cat-heritage', fl: 2, status: 'Occupied', cl: 'Clean', resId: 'res-002' },
    { id: 'room-202', hotel_id: 'prop-udaipur', num: '202', cat: 'cat-heritage', fl: 2, status: 'Available', cl: 'Clean' },
    { id: 'room-203', hotel_id: 'prop-udaipur', num: '203', cat: 'cat-heritage', fl: 2, status: 'Reserved', cl: 'Inspected', resId: 'res-007' },
    { id: 'room-204', hotel_id: 'prop-udaipur', num: '204', cat: 'cat-heritage', fl: 2, status: 'Maintenance', cl: 'Dirty', note: 'Antique brass chandelier restoration' },

    // Udaipur Rooms (Floor 3: Lakeview Pavilions)
    { id: 'room-301', hotel_id: 'prop-udaipur', num: '301', cat: 'cat-lake', fl: 3, status: 'Occupied', cl: 'Clean', resId: 'res-003' },
    { id: 'room-302', hotel_id: 'prop-udaipur', num: '302', cat: 'cat-lake', fl: 3, status: 'Occupied', cl: 'Clean', resId: 'res-008' },
    { id: 'room-303', hotel_id: 'prop-udaipur', num: '303', cat: 'cat-lake', fl: 3, status: 'Available', cl: 'Inspected' },
    { id: 'room-304', hotel_id: 'prop-udaipur', num: '304', cat: 'cat-lake', fl: 3, status: 'Reserved', cl: 'Clean', resId: 'res-009' },

    // Udaipur Rooms (Private Estate Wing: Kohinoor Pool Villas)
    { id: 'room-villa-1', hotel_id: 'prop-udaipur', num: 'Villa 1', cat: 'cat-pool-villa', fl: 1, status: 'Occupied', cl: 'Clean', resId: 'res-004' },
    { id: 'room-villa-2', hotel_id: 'prop-udaipur', num: 'Villa 2', cat: 'cat-pool-villa', fl: 1, status: 'Available', cl: 'Inspected' },
    { id: 'room-villa-3', hotel_id: 'prop-udaipur', num: 'Villa 3', cat: 'cat-pool-villa', fl: 1, status: 'Reserved', cl: 'Clean', resId: 'res-010' },

    // Udaipur Rooms (Floor 4: Maharaja Presidential Sovereign Estate)
    { id: 'room-sovereign-1', hotel_id: 'prop-udaipur', num: 'Sovereign I', cat: 'cat-maharaja', fl: 4, status: 'Occupied', cl: 'Clean', resId: 'res-005' },
    { id: 'room-sovereign-2', hotel_id: 'prop-udaipur', num: 'Sovereign II', cat: 'cat-maharaja', fl: 4, status: 'Available', cl: 'Inspected' },

    // BookOne Rooms (Floor 1: Standard Rooms 101 - 105)
    { id: 'bse-101', hotel_id: 'prop-bookone', num: 'B-101', cat: 'cat-bse-std', fl: 1, status: 'Occupied', cl: 'Clean', resId: 'res-bse-101' },
    { id: 'bse-102', hotel_id: 'prop-bookone', num: 'B-102', cat: 'cat-bse-std', fl: 1, status: 'Available', cl: 'Clean' },
    { id: 'bse-103', hotel_id: 'prop-bookone', num: 'B-103', cat: 'cat-bse-std', fl: 1, status: 'Reserved', cl: 'Clean', resId: 'res-bse-103' },
    { id: 'bse-104', hotel_id: 'prop-bookone', num: 'B-104', cat: 'cat-bse-std', fl: 1, status: 'Cleaning', cl: 'Dirty' },
    { id: 'bse-105', hotel_id: 'prop-bookone', num: 'B-105', cat: 'cat-bse-std', fl: 1, status: 'Available', cl: 'Clean' },

    // BookOne Rooms (Floor 2: Deluxe Rooms 201 - 205)
    { id: 'bse-201', hotel_id: 'prop-bookone', num: 'B-201', cat: 'cat-bse-dlx', fl: 2, status: 'Occupied', cl: 'Clean', resId: 'res-bse-201' },
    { id: 'bse-202', hotel_id: 'prop-bookone', num: 'B-202', cat: 'cat-bse-dlx', fl: 2, status: 'Available', cl: 'Clean' },
    { id: 'bse-203', hotel_id: 'prop-bookone', num: 'B-203', cat: 'cat-bse-dlx', fl: 2, status: 'Available', cl: 'Clean' },
    { id: 'bse-204', hotel_id: 'prop-bookone', num: 'B-204', cat: 'cat-bse-dlx', fl: 2, status: 'Reserved', cl: 'Clean', resId: 'res-bse-204' },
    { id: 'bse-205', hotel_id: 'prop-bookone', num: 'B-205', cat: 'cat-bse-dlx', fl: 2, status: 'Maintenance', cl: 'Dirty', note: 'AC filter overhaul' },

    // BookOne Rooms (Floor 3: Super Deluxe Rooms 301 - 305)
    { id: 'bse-301', hotel_id: 'prop-bookone', num: 'B-301', cat: 'cat-bse-super', fl: 3, status: 'Occupied', cl: 'Clean', resId: 'res-bse-301' },
    { id: 'bse-302', hotel_id: 'prop-bookone', num: 'B-302', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },
    { id: 'bse-303', hotel_id: 'prop-bookone', num: 'B-303', cat: 'cat-bse-super', fl: 3, status: 'Cleaning', cl: 'In Progress' },
    { id: 'bse-304', hotel_id: 'prop-bookone', num: 'B-304', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },
    { id: 'bse-305', hotel_id: 'prop-bookone', num: 'B-305', cat: 'cat-bse-super', fl: 3, status: 'Available', cl: 'Clean' },

    // BookOne Rooms (Floor 4: Executive Suites 401 - 405)
    { id: 'bse-401', hotel_id: 'prop-bookone', num: 'B-401', cat: 'cat-bse-suite', fl: 4, status: 'Occupied', cl: 'Clean', resId: 'res-bse-401' },
    { id: 'bse-402', hotel_id: 'prop-bookone', num: 'B-402', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' },
    { id: 'bse-403', hotel_id: 'prop-bookone', num: 'B-403', cat: 'cat-bse-suite', fl: 4, status: 'Reserved', cl: 'Clean', resId: 'res-bse-403' },
    { id: 'bse-404', hotel_id: 'prop-bookone', num: 'B-404', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' },
    { id: 'bse-405', hotel_id: 'prop-bookone', num: 'B-405', cat: 'cat-bse-suite', fl: 4, status: 'Available', cl: 'Clean' }
  ];

  for (const r of roomDefinitions) {
    insertRoom.run(
      r.id, r.hotel_id, r.num, r.cat, r.fl, r.status, r.cl, r.resId || null, r.note || null
    );
  }

  // 4. POS Services
  const insertService = db.prepare(`
    INSERT INTO pos_services (
      id, hotel_id, name, category, description, price, tax_rate, image_url, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const services = [
    { id: 'srv-1', hotel_id: 'prop-udaipur', name: 'Royal Mewar Thali Dinner', cat: 'Food', desc: 'Authentic 14-dish sovereign Rajasthani royal culinary experience', price: 1800, tax: 0.05, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
    { id: 'srv-2', hotel_id: 'prop-udaipur', name: 'Abhyanga Herbal Ayurvedic Ritual (90m)', cat: 'Activity', desc: 'Rejuvenating full-body warm herbal oil treatment', price: 4500, tax: 0.18, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200' },
    { id: 'srv-3', hotel_id: 'prop-udaipur', name: 'Private Sunset Solar Lake Cruise', cat: 'Activity', desc: 'Private solar-powered boat cruise on Lake Pichola with champagne', price: 12000, tax: 0.18, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200' },
    { id: 'srv-4', hotel_id: 'prop-udaipur', name: 'BMW 7 Series Chauffeur Airport Transfer', cat: 'Transport', desc: 'Luxury chauffeured transfer to/from Maharana Pratap Airport', price: 3500, tax: 0.18, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200' },
    { id: 'srv-5', hotel_id: 'prop-udaipur', name: 'Express Silk & Cashmere Dry Cleaning', cat: 'Activity', desc: 'Gentle organic solvent wash and steam press', price: 850, tax: 0.18, img: 'https://images.unsplash.com/photo-1545173168-9f1907e80789?w=200' },
    { id: 'srv-6', hotel_id: 'prop-udaipur', name: 'Gourmet Buffet Breakfast Spread', cat: 'Food', desc: 'Continental, American and regional Indian breakfast with fresh juices', price: 450, tax: 0.05, img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200' },
    { id: 'srv-7', hotel_id: 'prop-udaipur', name: 'Executive 4-Course Lunch', cat: 'Food', desc: 'Chef-curated corporate lunch with soup, salad, main and dessert', price: 950, tax: 0.05, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
    { id: 'srv-8', hotel_id: 'prop-udaipur', name: 'Afternoon High Tea & Patisserie', cat: 'Beverages', desc: 'Artisanal scones, finger sandwiches, macarons and Darjeeling tea', price: 650, tax: 0.05, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200' },
    { id: 'srv-9', hotel_id: 'prop-udaipur', name: 'French Press Coffee & Organic Teas', cat: 'Beverages', desc: 'Single-origin Coorg roast and loose leaf organic herbal infusions', price: 220, tax: 0.05, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200' },
    { id: 'srv-10', hotel_id: 'prop-udaipur', name: 'Extra Rollaway Orthopaedic Bed', cat: 'Extra Bed', desc: 'Full-size orthopaedic rollaway bed with linen set', price: 1500, tax: 0.12, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200' },
    // BookOne Services
    { id: 'srv-bse-1', hotel_id: 'prop-bookone', name: 'Buffet Breakfast', cat: 'Food', desc: 'Hearty morning spread with South & North Indian continental delights', price: 200, tax: 0.05, img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200' },
    { id: 'srv-bse-2', hotel_id: 'prop-bookone', name: 'Executive Lunch', cat: 'Food', desc: 'Curated 4-course gourmet business lunch', price: 450, tax: 0.05, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
    { id: 'srv-bse-3', hotel_id: 'prop-bookone', name: 'Fine Dining Dinner', cat: 'Food', desc: 'Chef specialty tandoori and regional specialties', price: 650, tax: 0.05, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200' },
    { id: 'srv-bse-4', hotel_id: 'prop-bookone', name: 'Tea & Artisan Coffee', cat: 'Beverages', desc: 'Fresh roasted coffee and organic Darjeeling/Assam teas', price: 120, tax: 0.05, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200' },
    { id: 'srv-bse-5', hotel_id: 'prop-bookone', name: 'Premium Laundry Service', cat: 'Activity', desc: 'Same-day steam press, wash and gentle fold', price: 500, tax: 0.05, img: 'https://images.unsplash.com/photo-1545173168-9f1907e80789?w=200' },
    { id: 'srv-bse-6', hotel_id: 'prop-bookone', name: 'Airport Pickup / Drop', cat: 'Transport', desc: 'Bhubaneswar BBI Airport dedicated chauffeur sedan', price: 500, tax: 0.05, img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200' }
  ];

  for (const s of services) {
    insertService.run(s.id, s.hotel_id, s.name, s.cat, s.desc, s.price, s.tax, s.img, 1);
  }

  // 5. Channel Connections
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
    insertChannel.run(c.id, 'prop-udaipur', c.name, c.slug, c.status, c.sync, c.pend, c.comm);
  }

  // 6. Reservations
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
    // res-001 (Vikramaditya Singhania)
    {
      id: 'res-001',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2601',
      roomId: 'room-101',
      catId: 'cat-garden',
      guest: {
        id: 'g-001',
        fullName: 'Vikramaditya Singhania',
        salutation: 'Mr.',
        email: 'vikram.singhania@apexholding.in',
        phone: '+91 98200 45192',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 9104',
        idDocumentPreview: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80',
        vipStatus: true,
        specialRequests: 'Allergic to shellfish. Extra feather pillows required.',
        dietaryPreferences: 'Vegetarian, Organic Jain option for dinner'
      },
      checkIn: yesterday,
      checkOut: dayPlus2,
      nights: 3,
      adults: 2,
      children: 0,
      source: 'MakeMyTrip',
      rate: 14500,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Room Charge (Standard Garden Villa)', dept: 'Room Tariff', amount: 14500, tax: 0.18 },
        { desc: 'Royal Mewar Thali Dinner for 2 at Darbar Hall', dept: 'Fine Dining', amount: 4500, tax: 0.18 },
        { desc: 'Abhyanga Herbal Rejuvenation Ritual (90 Mins)', dept: 'Ayurvedic Spa', amount: 6000, tax: 0.18 }
      ],
      payments: [
        { method: 'Credit Card', amount: 15000, ref: 'HDFC_TXN_882910', notes: 'Pre-authorization deposit at check-in' }
      ]
    },

    // res-002 (Lady Eleanor Cavendish)
    {
      id: 'res-002',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2602',
      roomId: 'room-201',
      catId: 'cat-heritage',
      guest: {
        id: 'g-002',
        fullName: 'Lady Eleanor Cavendish',
        salutation: 'Lady',
        email: 'eleanor.cavendish@mayfaircapital.co.uk',
        phone: '+44 7700 900341',
        country: 'United Kingdom',
        idType: 'Passport',
        idNumber: 'GBR-P5581903',
        idDocumentPreview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        vipStatus: true,
        specialRequests: 'Warm almond milk every evening at 21:30. Lake view table for breakfast.'
      },
      checkIn: yesterday,
      checkOut: dayPlus3,
      nights: 4,
      adults: 2,
      children: 0,
      source: 'Booking.com',
      rate: 28000,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Room Charge (Royal Heritage Suite)', dept: 'Room Tariff', amount: 25200, tax: 0.18 },
        { desc: 'Luxury Airport Transfer (BMW 7 Series) + City Tour', dept: 'Chauffeur / Transfer', amount: 7500, tax: 0.18 }
      ],
      payments: []
    },

    // res-003 (Aarav & Ananya Mehta)
    {
      id: 'res-003',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2603',
      roomId: 'room-301',
      catId: 'cat-lake',
      guest: {
        id: 'g-003',
        fullName: 'Aarav & Ananya Mehta',
        salutation: 'Mr.',
        email: 'aarav.mehta@zenithventures.com',
        phone: '+91 99870 12345',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 4421',
        idDocumentPreview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        vipStatus: false,
        specialRequests: 'Celebrating 5th Wedding Anniversary. Complimentary cake requested.'
      },
      checkIn: today,
      checkOut: dayPlus4,
      nights: 4,
      adults: 2,
      children: 0,
      source: 'Direct Web',
      rate: 38500,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Room Charge (Lakeview Pavilion)', dept: 'Room Tariff', amount: 33500, tax: 0.18 },
        { desc: 'Private Sunset Solar Boat Cruise on Lake Pichola with Champagne', dept: 'Bespoke Experience', amount: 12000, tax: 0.18 }
      ],
      payments: [
        { method: 'UPI', amount: 53690, ref: 'UPI/2611029481/HDFC', notes: 'Pre-settlement for first 2 nights + cruise' }
      ]
    },

    // res-004 (Dr. Siddharth & Rhea Kapoor)
    {
      id: 'res-004',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2604',
      roomId: 'room-villa-1',
      catId: 'cat-pool-villa',
      guest: {
        id: 'g-004',
        fullName: 'Dr. Siddharth & Rhea Kapoor',
        salutation: 'Dr.',
        email: 'siddharth.kapoor@apollohearts.org',
        phone: '+91 98110 99882',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 7719',
        vipStatus: true,
        specialRequests: 'Temperature of the private lap pool set to 29°C precisely.'
      },
      checkIn: yesterday,
      checkOut: dayPlus5,
      nights: 6,
      adults: 2,
      children: 2,
      source: 'Luxury Escapes',
      rate: 56000,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Room Charge (Kohinoor Pool Villa)', dept: 'Room Tariff', amount: 56000, tax: 0.18 },
        { desc: 'Private Courtyard Barbecue curated by Chef Rajesh', dept: 'Fine Dining', amount: 14000, tax: 0.18 }
      ],
      payments: []
    },

    // res-005 (Sheikh Hamdan Al-Maktoum)
    {
      id: 'res-005',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2605',
      roomId: 'room-sovereign-1',
      catId: 'cat-maharaja',
      guest: {
        id: 'g-005',
        fullName: 'Sheikh Hamdan Al-Maktoum',
        salutation: 'Lord',
        email: 'h.office@dubaiholdings.ae',
        phone: '+971 50 123 4567',
        country: 'United Arab Emirates',
        idType: 'Passport',
        idNumber: 'ARE-D882091',
        vipStatus: true,
        specialRequests: 'Full security protocols. Rolls-Royce Ghost reserved for entire duration.'
      },
      checkIn: yesterday,
      checkOut: dayPlus6,
      nights: 7,
      adults: 4,
      children: 0,
      source: 'Direct Web',
      rate: 95000,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Imperial Sovereign Suite Tariff', dept: 'Room Tariff', amount: 95000, tax: 0.18 },
        { desc: 'Private Royal Falconry & Palace Heritage Banquet', dept: 'Bespoke Experience', amount: 35000, tax: 0.18 }
      ],
      payments: [
        { method: 'Bank Transfer', amount: 250000, ref: 'SWIFT-EMIR-20261101', notes: 'Advance wire transfer' }
      ]
    },

    // res-006 (Rohan & Maya Deshmukh)
    {
      id: 'res-006',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2606',
      roomId: 'room-102',
      catId: 'cat-garden',
      guest: {
        id: 'g-006',
        fullName: 'Rohan & Maya Deshmukh',
        salutation: 'Mr.',
        email: 'rohan.deshmukh@tata.com',
        phone: '+91 98450 67891',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 5512',
        vipStatus: false
      },
      checkIn: today,
      checkOut: dayPlus2,
      nights: 2,
      adults: 2,
      children: 1,
      source: 'Goibibo',
      rate: 14500,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // res-007 (Marcus & Chloe Vance)
    {
      id: 'res-007',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2607',
      roomId: 'room-203',
      catId: 'cat-heritage',
      guest: {
        id: 'g-007',
        fullName: 'Marcus & Chloe Vance',
        salutation: 'Mr.',
        email: 'marcus.vance@vanceholdings.com.au',
        phone: '+61 412 889 001',
        country: 'Australia',
        idType: 'Passport',
        idNumber: 'AUS-N771029',
        vipStatus: true
      },
      checkIn: today,
      checkOut: dayPlus3,
      nights: 3,
      adults: 2,
      children: 0,
      source: 'Booking.com',
      rate: 28000,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // res-008 (Priya & Devansh Oberoi)
    {
      id: 'res-008',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2608',
      roomId: 'room-302',
      catId: 'cat-lake',
      guest: {
        id: 'g-008',
        fullName: 'Priya & Devansh Oberoi',
        salutation: 'Mrs.',
        email: 'priya.oberoi@delhicapitals.in',
        phone: '+91 97112 34567',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 9901',
        vipStatus: true
      },
      checkIn: yesterday,
      checkOut: tomorrow,
      nights: 2,
      adults: 2,
      children: 0,
      source: 'Walk-In',
      rate: 38500,
      status: 'Checked-In',
      folio: [
        { desc: 'Night 1 Room Charge (Lakeview Pavilion)', dept: 'Room Tariff', amount: 38500, tax: 0.18 },
        { desc: 'Express Silk & Cashmere Dry Cleaning (4 garments)', dept: 'Laundry', amount: 1800, tax: 0.18 }
      ],
      payments: []
    },

    // res-009 (Kavita Krishnamurthy)
    {
      id: 'res-009',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2609',
      roomId: 'room-304',
      catId: 'cat-lake',
      guest: {
        id: 'g-009',
        fullName: 'Kavita Krishnamurthy',
        salutation: 'Ms.',
        email: 'kavita.k@bengalurutech.io',
        phone: '+91 94480 88712',
        country: 'India',
        idType: 'Driving License',
        idNumber: 'KA-01-2022-009812',
        vipStatus: false
      },
      checkIn: tomorrow,
      checkOut: dayPlus4,
      nights: 3,
      adults: 2,
      children: 1,
      source: 'MakeMyTrip',
      rate: 38500,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // res-010 (Jean-Luc & Sophie Moreau)
    {
      id: 'res-010',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2610',
      roomId: 'room-villa-3',
      catId: 'cat-pool-villa',
      guest: {
        id: 'g-010',
        fullName: 'Jean-Luc & Sophie Moreau',
        salutation: 'Mr.',
        email: 'sophie.moreau@lvmh.fr',
        phone: '+33 6 12 34 56 78',
        country: 'France',
        idType: 'Passport',
        idNumber: 'FRA-992104B',
        vipStatus: true
      },
      checkIn: dayPlus2,
      checkOut: dayPlus7,
      nights: 5,
      adults: 2,
      children: 0,
      source: 'Direct Web',
      rate: 56000,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // res-011 (Arjun Singhal)
    {
      id: 'res-011',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2611',
      roomId: 'room-103',
      catId: 'cat-garden',
      guest: {
        id: 'g-011',
        fullName: 'Arjun Singhal',
        salutation: 'Mr.',
        email: 'arjun@singhalindustries.com',
        phone: '+91 99201 11223',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 1122',
        vipStatus: false
      },
      checkIn: dayPlus3,
      checkOut: dayPlus6,
      nights: 3,
      adults: 2,
      children: 0,
      source: 'Agoda',
      rate: 14500,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // res-012 (Gautam Adani Jr.)
    {
      id: 'res-012',
      hotel_id: 'prop-udaipur',
      code: 'AURA-2612',
      roomId: 'room-202',
      catId: 'cat-heritage',
      guest: {
        id: 'g-012',
        fullName: 'Gautam Adani Jr.',
        salutation: 'Mr.',
        email: 'gautam.office@adaniports.com',
        phone: '+91 98980 44556',
        country: 'India',
        idType: 'Passport',
        idNumber: 'IND-Z887291',
        vipStatus: true
      },
      checkIn: dayPlus4,
      checkOut: dayPlus10,
      nights: 6,
      adults: 2,
      children: 0,
      source: 'Direct Web',
      rate: 28000,
      status: 'Confirmed',
      folio: [],
      payments: []
    },

    // BookOne Suite Bookings
    {
      id: 'res-bse-101',
      hotel_id: 'prop-bookone',
      code: 'BK1-4821',
      roomId: 'bse-101',
      catId: 'cat-bse-std',
      guest: {
        id: 'gst-1',
        fullName: 'Rajesh & Meera Sharma',
        salutation: 'Mr.',
        email: 'rajesh.sharma@tcs.com',
        phone: '+91 98301 22890',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 9921',
        vipStatus: true
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
      hotel_id: 'prop-bookone',
      code: 'BK1-7294',
      roomId: 'bse-201',
      catId: 'cat-bse-dlx',
      guest: {
        id: 'gst-2',
        fullName: 'Dr. Siddharth Sen',
        salutation: 'Dr.',
        email: 'siddharth.sen@aiims.edu',
        phone: '+91 94370 11982',
        country: 'India',
        idType: 'Passport',
        idNumber: 'IND-P881920',
        vipStatus: true
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
      hotel_id: 'prop-bookone',
      code: 'BK1-9102',
      roomId: 'bse-301',
      catId: 'cat-bse-super',
      guest: {
        id: 'gst-3',
        fullName: 'Pooja Agarwal & Family',
        salutation: 'Ms.',
        email: 'pooja.agarwal@deloitte.com',
        phone: '+91 98112 33456',
        country: 'India',
        idType: 'Aadhaar Card',
        idNumber: '•••• •••• 4401',
        vipStatus: false
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
        { desc: 'Dinner In-Room Dining', dept: 'Fine Dining', amount: 1300, tax: 0.05 }
      ],
      payments: [
        { method: 'Credit Card', amount: 7500, ref: 'CC-AUTH-882194', notes: 'MasterCard Pre-auth Settlement' }
      ]
    },
    {
      id: 'res-bse-401',
      hotel_id: 'prop-bookone',
      code: 'BK1-3319',
      roomId: 'bse-401',
      catId: 'cat-bse-suite',
      guest: {
        id: 'gst-4',
        fullName: 'Vikram & Radhika Oberoi',
        salutation: 'Mr.',
        email: 'v.oberoi@oberoi-holdings.in',
        phone: '+91 98200 77123',
        country: 'India',
        idType: 'Passport',
        idNumber: 'IND-P339912',
        vipStatus: true
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
      payments: []
    }
  ];

  for (const b of initialBookings) {
    insertRes.run(
      b.id,
      b.hotel_id,
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
      b.source + '-REF-' + Math.floor(1000 + Math.random() * 9000),
      b.status,
      b.rate,
      0,
      null,
      'VIP guest request logged',
      new Date().toISOString()
    );

    let fIdx = 1;
    for (const f of b.folio) {
      const halfTax = (f.amount * f.tax) / 2;
      const total = f.amount + (f.amount * f.tax);
      insertFolio.run(
        `fol-${b.id}-${fIdx++}`,
        b.id,
        yesterday,
        f.dept,
        f.desc,
        f.amount,
        f.tax,
        halfTax,
        halfTax,
        total,
        'System Seed'
      );
    }

    let pIdx = 1;
    for (const p of b.payments) {
      insertPayment.run(
        `pay-${b.id}-${pIdx++}`,
        b.id,
        `${yesterday} 12:00`,
        p.method,
        p.ref,
        p.amount,
        p.notes
      );
    }
  }

  // 7. Initial Sync Logs
  const insertSyncLog = db.prepare(`
    INSERT INTO sync_logs (
      id, timestamp, type, channel, action, details, raw_payload, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSyncLog.run(
    'log-001',
    new Date().toISOString(),
    'INBOUND',
    'MakeMyTrip',
    'OTA_RESERVATION_PUSH',
    'Synchronized booking payload for Standard Garden Villa (Guest: Vikramaditya Singhania)',
    '{"ota":"MakeMyTrip","channelRef":"MMT-IND-8829104","roomType":"SGV","rate":14500,"currency":"INR"}',
    'SUCCESS'
  );

  insertSyncLog.run(
    'log-002',
    new Date().toISOString(),
    'OUTBOUND',
    'CENTRAL_GATEWAY',
    'BROADCAST_INVENTORY_DELTA',
    'Broadcasted inventory delta to MakeMyTrip, Booking.com, Goibibo, Agoda',
    '{"event":"INVENTORY_SYNC","hotelId":"prop-udaipur","delta":[{"catId":"cat-garden","avail":1}]}',
    'SUCCESS'
  );
}

module.exports = { seedDatabase };
