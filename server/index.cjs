const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { initDb, DB_PATH } = require('./db.cjs');
const { seedDatabase } = require('./seed.cjs');

const PORT = process.env.PORT || 5050;

// Initialize SQLite database
const { db } = initDb();
seedDatabase(db);
console.log(`[SQLite PMS] Database active at: ${DB_PATH}`);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  setCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // 1. Health & Database Status
    if (pathname === '/api/status' && req.method === 'GET') {
      const stats = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : { size: 0, mtime: new Date() };
      const tableCounts = {
        properties: db.prepare('SELECT COUNT(*) as c FROM properties').get().c,
        room_categories: db.prepare('SELECT COUNT(*) as c FROM room_categories').get().c,
        rooms: db.prepare('SELECT COUNT(*) as c FROM rooms').get().c,
        reservations: db.prepare('SELECT COUNT(*) as c FROM reservations').get().c,
        folio_items: db.prepare('SELECT COUNT(*) as c FROM folio_items').get().c,
        folio_payments: db.prepare('SELECT COUNT(*) as c FROM folio_payments').get().c,
        pos_services: db.prepare('SELECT COUNT(*) as c FROM pos_services').get().c,
        pos_orders: db.prepare('SELECT COUNT(*) as c FROM pos_orders').get().c,
        sync_logs: db.prepare('SELECT COUNT(*) as c FROM sync_logs').get().c,
      };

      return sendJson(res, 200, {
        status: 'online',
        engine: 'node:sqlite (Embedded SQLite 3)',
        dbPath: DB_PATH,
        sizeKb: Math.round(stats.size / 1024),
        lastModified: stats.mtime,
        tableCounts
      });
    }

    // 2. Full State Loader
    if (pathname === '/api/all' && req.method === 'GET') {
      const propertyId = url.searchParams.get('propertyId');

      const properties = db.prepare('SELECT * FROM properties').all();
      let categories, rooms, rawReservations, services, channels;

      if (propertyId && propertyId !== 'ALL') {
        categories = db.prepare('SELECT * FROM room_categories WHERE hotel_id = ?').all(propertyId);
        rooms = db.prepare('SELECT * FROM rooms WHERE hotel_id = ?').all(propertyId);
        rawReservations = db.prepare('SELECT * FROM reservations WHERE hotel_id = ? ORDER BY check_in_date DESC').all(propertyId);
        services = db.prepare('SELECT * FROM pos_services WHERE hotel_id = ?').all(propertyId);
        channels = db.prepare('SELECT * FROM channel_connections WHERE hotel_id = ?').all(propertyId);
      } else {
        categories = db.prepare('SELECT * FROM room_categories').all();
        rooms = db.prepare('SELECT * FROM rooms').all();
        rawReservations = db.prepare('SELECT * FROM reservations ORDER BY check_in_date DESC').all();
        services = db.prepare('SELECT * FROM pos_services').all();
        channels = db.prepare('SELECT * FROM channel_connections').all();
      }

      const folioItems = db.prepare('SELECT * FROM folio_items').all();
      const folioPayments = db.prepare('SELECT * FROM folio_payments').all();
      const posOrders = propertyId && propertyId !== 'ALL'
        ? db.prepare('SELECT * FROM pos_orders WHERE hotel_id = ? ORDER BY created_at DESC').all(propertyId)
        : db.prepare('SELECT * FROM pos_orders ORDER BY created_at DESC').all();
      const syncLogs = db.prepare('SELECT * FROM sync_logs ORDER BY timestamp DESC LIMIT 50').all();
      const auditLogs = propertyId && propertyId !== 'ALL'
        ? db.prepare('SELECT * FROM night_audit_logs WHERE hotel_id = ? ORDER BY created_at DESC').all(propertyId)
        : db.prepare('SELECT * FROM night_audit_logs ORDER BY created_at DESC').all();

      // Hydrate reservations with folio items & payments
      const reservations = rawReservations.map(r => {
        let guestObj = {};
        try { guestObj = JSON.parse(r.guest_json); } catch (e) { guestObj = { fullName: 'Guest' }; }

        return {
          id: r.id,
          hotelId: r.hotel_id,
          bookingCode: r.booking_code,
          roomId: r.room_id,
          categoryId: r.category_id,
          guest: guestObj,
          checkInDate: r.check_in_date,
          checkOutDate: r.check_out_date,
          nights: r.nights,
          adults: r.adults,
          children: r.children,
          source: r.source,
          channelReferenceId: r.channel_ref,
          status: r.status,
          roomRatePerNight: r.room_rate,
          discountAmount: r.discount_amount,
          discountCode: r.discount_code,
          notes: r.notes,
          createdAt: r.created_at,
          folio: folioItems.filter(f => f.reservation_id === r.id).map(f => ({
            id: f.id,
            date: f.date,
            department: f.department,
            description: f.description,
            amount: f.amount,
            gstRate: f.gst_rate,
            cgst: f.cgst,
            sgst: f.sgst,
            totalWithTax: f.total_with_tax,
            postedBy: f.posted_by
          })),
          payments: folioPayments.filter(p => p.reservation_id === r.id).map(p => ({
            id: p.id,
            timestamp: p.timestamp,
            method: p.method,
            referenceNumber: p.reference_number,
            amount: p.amount,
            notes: p.notes
          }))
        };
      });

      return sendJson(res, 200, {
        properties,
        categories: categories.map(c => ({
          ...c,
          amenities: c.amenities_json ? JSON.parse(c.amenities_json) : []
        })),
        rooms,
        reservations,
        services,
        posOrders: posOrders.map(o => ({
          ...o,
          items: o.items_json ? JSON.parse(o.items_json) : []
        })),
        channels,
        syncLogs,
        auditLogs
      });
    }

    // 3. Create Reservation
    if (pathname === '/api/reservations' && req.method === 'POST') {
      const data = await parseBody(req);
      const resId = data.id || `res-${Date.now()}`;
      const bookingCode = data.bookingCode || `BK1-${Math.floor(1000 + Math.random() * 9000)}`;

      db.prepare(`
        INSERT INTO reservations (
          id, hotel_id, booking_code, room_id, category_id, guest_id, guest_json,
          check_in_date, check_out_date, nights, adults, children, source, channel_ref,
          status, room_rate, discount_amount, discount_code, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        resId,
        data.hotelId || 'prop-bookone',
        bookingCode,
        data.roomId,
        data.categoryId,
        data.guest?.id || `gst-${Date.now()}`,
        JSON.stringify(data.guest || {}),
        data.checkInDate,
        data.checkOutDate,
        data.nights || 1,
        data.adults || 1,
        data.children || 0,
        data.source || 'Walk-In',
        data.channelReferenceId || null,
        data.status || 'Confirmed',
        data.roomRatePerNight || 2000,
        data.discountAmount || 0,
        data.discountCode || null,
        data.notes || null,
        new Date().toISOString()
      );

      // Room tariff folio item
      const gstRate = (data.roomRatePerNight >= 7500) ? 0.18 : 0.12;
      const cgst = (data.roomRatePerNight * gstRate) / 2;
      const sgst = (data.roomRatePerNight * gstRate) / 2;
      const total = data.roomRatePerNight + cgst + sgst;

      db.prepare(`
        INSERT INTO folio_items (
          id, reservation_id, date, department, description, amount, gst_rate, cgst, sgst, total_with_tax, posted_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `fol-${Date.now()}`,
        resId,
        data.checkInDate,
        'Room Tariff',
        'Room Tariff (Night 1)',
        data.roomRatePerNight,
        gstRate,
        cgst,
        sgst,
        total,
        `${data.source} Front Desk`
      );

      // Update room status
      db.prepare(`
        UPDATE rooms SET status = 'Reserved', current_reservation_id = ? WHERE id = ?
      `).run(resId, data.roomId);

      // Log sync
      db.prepare(`
        INSERT INTO sync_logs (
          id, timestamp, type, channel, action, details, raw_payload, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `log-${Date.now()}`,
        new Date().toLocaleTimeString(),
        data.source === 'Direct Web' || data.source === 'Walk-In' ? 'OUTBOUND' : 'INBOUND',
        data.source,
        'RESERVATION_RECORDED_SQLITE',
        `Reservation ${bookingCode} recorded to SQLite local database for ${data.guest?.fullName}.`,
        JSON.stringify({ bookingCode, room: data.roomId, guest: data.guest?.fullName }),
        'SUCCESS'
      );

      return sendJson(res, 201, { success: true, reservationId: resId, bookingCode });
    }

    // 4. Check-in Guest
    if (pathname.match(/^\/api\/reservations\/([^/]+)\/checkin$/) && req.method === 'PUT') {
      const match = pathname.match(/^\/api\/reservations\/([^/]+)\/checkin$/);
      const resId = match[1];
      const data = await parseBody(req);

      const resRow = db.prepare('SELECT room_id FROM reservations WHERE id = ?').get(resId);
      if (!resRow) return sendJson(res, 404, { error: 'Reservation not found' });

      db.prepare("UPDATE reservations SET status = 'Checked-In' WHERE id = ?").run(resId);
      db.prepare("UPDATE rooms SET status = 'Occupied', current_reservation_id = ? WHERE id = ?").run(resId, resRow.room_id);

      return sendJson(res, 200, { success: true, message: 'Guest checked in successfully' });
    }

    // 5. Check-out Guest
    if (pathname.match(/^\/api\/reservations\/([^/]+)\/checkout$/) && req.method === 'PUT') {
      const match = pathname.match(/^\/api\/reservations\/([^/]+)\/checkout$/);
      const resId = match[1];
      const data = await parseBody(req);

      const resRow = db.prepare('SELECT room_id FROM reservations WHERE id = ?').get(resId);
      if (!resRow) return sendJson(res, 404, { error: 'Reservation not found' });

      // Record settlement payment if amount > 0
      if (data.amountPaid && data.amountPaid > 0) {
        db.prepare(`
          INSERT INTO folio_payments (
            id, reservation_id, timestamp, method, reference_number, amount, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          `pay-${Date.now()}`,
          resId,
          new Date().toISOString(),
          data.paymentMethod || 'Cash',
          `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          data.amountPaid,
          data.notes || 'Checkout settlement'
        );
      }

      db.prepare("UPDATE reservations SET status = 'Checked-Out' WHERE id = ?").run(resId);
      db.prepare("UPDATE rooms SET status = 'Cleaning', cleanliness = 'Dirty', current_reservation_id = NULL WHERE id = ?").run(resRow.room_id);

      return sendJson(res, 200, { success: true, message: 'Guest checked out successfully' });
    }

    // 6. Post Folio Charge
    if (pathname.match(/^\/api\/reservations\/([^/]+)\/folio$/) && req.method === 'POST') {
      const match = pathname.match(/^\/api\/reservations\/([^/]+)\/folio$/);
      const resId = match[1];
      const data = await parseBody(req);

      const gstRate = data.gstRate !== undefined ? data.gstRate : 0.05;
      const cgst = (data.amount * gstRate) / 2;
      const sgst = (data.amount * gstRate) / 2;
      const total = data.amount + cgst + sgst;

      db.prepare(`
        INSERT INTO folio_items (
          id, reservation_id, date, department, description, amount, gst_rate, cgst, sgst, total_with_tax, posted_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `fol-${Date.now()}`,
        resId,
        new Date().toISOString().split('T')[0],
        data.department || 'Fine Dining',
        data.description,
        data.amount,
        gstRate,
        cgst,
        sgst,
        total,
        data.postedBy || 'Front Desk POS'
      );

      return sendJson(res, 201, { success: true, message: 'Charge posted to folio' });
    }

    // 7. Update Room Status & Cleanliness
    if (pathname.match(/^\/api\/rooms\/([^/]+)\/status$/) && req.method === 'PUT') {
      const match = pathname.match(/^\/api\/rooms\/([^/]+)\/status$/);
      const roomId = match[1];
      const data = await parseBody(req);

      if (data.status) {
        db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run(data.status, roomId);
      }
      if (data.cleanliness) {
        db.prepare('UPDATE rooms SET cleanliness = ? WHERE id = ?').run(data.cleanliness, roomId);
      }
      if (data.maintenanceNote !== undefined) {
        db.prepare('UPDATE rooms SET maintenance_note = ? WHERE id = ?').run(data.maintenanceNote, roomId);
      }

      return sendJson(res, 200, { success: true });
    }

    // 8. POS Order (F&B or Services)
    if (pathname === '/api/pos/orders' && req.method === 'POST') {
      const data = await parseBody(req);
      const orderId = `pos-${Date.now()}`;
      const orderNumber = `KOT-${Math.floor(1000 + Math.random() * 9000)}`;

      db.prepare(`
        INSERT INTO pos_orders (
          id, hotel_id, order_number, counter_name, room_id, reservation_id,
          guest_name, items_json, subtotal, tax_amount, total_amount, payment_status,
          payment_method, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderId,
        data.hotelId || 'prop-bookone',
        orderNumber,
        data.counterName || 'Main Restaurant',
        data.roomId || null,
        data.reservationId || null,
        data.guestName || 'Walk-In Guest',
        JSON.stringify(data.items || []),
        data.subtotal || 0,
        data.taxAmount || 0,
        data.totalAmount || 0,
        data.paymentStatus || 'PAID',
        data.paymentMethod || 'UPI',
        new Date().toISOString()
      );

      // If billed to room folio, also post item to folio_items
      if (data.paymentStatus === 'BILLED_TO_ROOM' && data.reservationId) {
        const gstRate = 0.05;
        const cgst = data.taxAmount / 2;
        const sgst = data.taxAmount / 2;

        db.prepare(`
          INSERT INTO folio_items (
            id, reservation_id, date, department, description, amount, gst_rate, cgst, sgst, total_with_tax, posted_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `fol-${Date.now()}`,
          data.reservationId,
          new Date().toISOString().split('T')[0],
          'Fine Dining',
          `POS Order #${orderNumber} (${data.counterName})`,
          data.subtotal,
          gstRate,
          cgst,
          sgst,
          data.totalAmount,
          'POS Terminal'
        );
      }

      return sendJson(res, 201, { success: true, orderId, orderNumber });
    }

    // 9. Night Audit End-of-Day Execution
    if (pathname === '/api/night-audit' && req.method === 'POST') {
      const data = await parseBody(req);
      const propertyId = data.hotelId || 'prop-bookone';
      const auditDate = data.auditDate || new Date().toISOString().split('T')[0];

      // Find all in-house checked-in guests and automatically post nightly tariff to their folios
      const inHouse = db.prepare(`
        SELECT r.id, r.room_id, r.room_rate, r.source, r.guest_json
        FROM reservations r
        WHERE r.hotel_id = ? AND r.status = 'Checked-In'
      `).all(propertyId);

      let roomRev = 0;
      let taxTotal = 0;

      for (const res of inHouse) {
        const gstRate = res.room_rate >= 7500 ? 0.18 : 0.12;
        const cgst = (res.room_rate * gstRate) / 2;
        const sgst = (res.room_rate * gstRate) / 2;
        const totalWithTax = res.room_rate + cgst + sgst;

        db.prepare(`
          INSERT INTO folio_items (
            id, reservation_id, date, department, description, amount, gst_rate, cgst, sgst, total_with_tax, posted_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `fol-nightaudit-${Date.now()}-${res.id}`,
          res.id,
          auditDate,
          'Room Tariff',
          `Nightly Tariff Post (${auditDate})`,
          res.room_rate,
          gstRate,
          cgst,
          sgst,
          totalWithTax,
          'Night Audit System'
        );

        roomRev += res.room_rate;
        taxTotal += (cgst + sgst);
      }

      const totalRooms = db.prepare('SELECT COUNT(*) as c FROM rooms WHERE hotel_id = ?').get(propertyId).c;
      const occupiedRooms = inHouse.length;
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

      // Log night audit
      const auditId = `audit-${Date.now()}`;
      db.prepare(`
        INSERT INTO night_audit_logs (
          id, hotel_id, audit_date, run_by, occupied_rooms, total_rooms,
          occupancy_rate, room_revenue, pos_revenue, total_revenue, tax_collected, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        auditId,
        propertyId,
        auditDate,
        data.runBy || 'System Auditor',
        occupiedRooms,
        totalRooms,
        occupancyRate,
        roomRev,
        0,
        roomRev,
        taxTotal,
        new Date().toISOString()
      );

      db.prepare(`
        INSERT INTO sync_logs (
          id, timestamp, type, channel, action, details, raw_payload, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `log-${Date.now()}`,
        new Date().toLocaleTimeString(),
        'SYSTEM',
        'CENTRAL_GATEWAY',
        'NIGHT_AUDIT_COMPLETED',
        `Night Audit completed for ${auditDate}. Posted room tariff to ${inHouse.length} in-house folios. Occupancy: ${occupancyRate.toFixed(1)}%.`,
        JSON.stringify({ auditDate, occupiedRooms, totalRooms, roomRev, taxTotal }),
        'SUCCESS'
      );

      return sendJson(res, 200, {
        success: true,
        auditId,
        postedRooms: inHouse.length,
        occupancyRate,
        roomRev,
        taxTotal
      });
    }

    // 10. Database Export / Download
    if (pathname === '/api/db/export' && req.method === 'GET') {
      if (!fs.existsSync(DB_PATH)) {
        return sendJson(res, 404, { error: 'Database file not found' });
      }

      res.setHeader('Content-Type', 'application/vnd.sqlite3');
      res.setHeader('Content-Disposition', 'attachment; filename="hotel_pms.db"');
      const fileStream = fs.createReadStream(DB_PATH);
      fileStream.pipe(res);
      return;
    }

    // 11. Database Re-Seed
    if ((pathname === '/api/db/reset' || pathname === '/api/reseed') && req.method === 'POST') {
      db.exec(`
        DELETE FROM folio_payments;
        DELETE FROM folio_items;
        DELETE FROM reservations;
        DELETE FROM rooms;
        DELETE FROM room_categories;
        DELETE FROM pos_orders;
        DELETE FROM pos_services;
        DELETE FROM channel_connections;
        DELETE FROM night_audit_logs;
        DELETE FROM sync_logs;
        DELETE FROM properties;
      `);
      seedDatabase(db);

      return sendJson(res, 200, { success: true, message: 'SQLite database re-seeded to pristine state.' });
    }

    // Route not found
    return sendJson(res, 404, { error: `Endpoint not found: ${req.method} ${pathname}` });
  } catch (err) {
    console.error('[SQLite API Error]:', err);
    return sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`[SQLite Local Server] Serving on http://localhost:${PORT}`);
});

