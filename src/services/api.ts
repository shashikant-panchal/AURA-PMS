import { DatabaseStatus } from '../types/hotel';

const BASE_URL = '/api';

export const pmsApi = {
  // 1. Database status
  async getStatus(): Promise<DatabaseStatus> {
    try {
      const res = await fetch(`${BASE_URL}/status`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Status check failed');
      return await res.json();
    } catch (e) {
      return {
        status: 'offline',
        engine: 'SQLite (Device Local Storage Fallback)',
        dbPath: 'data/hotel_pms.db (Offline Mirror Active)',
        sizeKb: 0,
      };
    }
  },

  // 2. Fetch full state from SQLite
  async getAll(propertyId: string = 'prop-bookone') {
    try {
      const res = await fetch(`${BASE_URL}/all?propertyId=${encodeURIComponent(propertyId)}`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 3. Create Reservation in SQLite
  async createReservation(payload: any) {
    try {
      const res = await fetch(`${BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      console.warn('SQLite API offline, using local store sync');
      return null;
    }
  },

  // 4. Check-in Guest in SQLite
  async checkIn(reservationId: string, notes?: string) {
    try {
      const res = await fetch(`${BASE_URL}/reservations/${encodeURIComponent(reservationId)}/checkin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 5. Check-out Guest in SQLite
  async checkOut(reservationId: string, paymentMethod: string, amountPaid: number, notes?: string) {
    try {
      const res = await fetch(`${BASE_URL}/reservations/${encodeURIComponent(reservationId)}/checkout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod, amountPaid, notes }),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 6. Post Folio Item to SQLite
  async postFolio(reservationId: string, item: any) {
    try {
      const res = await fetch(`${BASE_URL}/reservations/${encodeURIComponent(reservationId)}/folio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 7. Update Room Status in SQLite
  async updateRoomStatus(roomId: string, status?: string, cleanliness?: string, maintenanceNote?: string) {
    try {
      const res = await fetch(`${BASE_URL}/rooms/${encodeURIComponent(roomId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cleanliness, maintenanceNote }),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 8. Create POS Order in SQLite
  async createPosOrder(order: any) {
    try {
      const res = await fetch(`${BASE_URL}/pos/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 9. Execute Night Audit in SQLite
  async runNightAudit(payload: { hotelId: string; auditDate: string; runBy: string }) {
    try {
      const res = await fetch(`${BASE_URL}/night-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 10. Reset Database
  async resetDb() {
    try {
      const res = await fetch(`${BASE_URL}/db/reset`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 11. Download .db export URL
  getDbExportUrl(): string {
    return `${BASE_URL}/db/export`;
  },
};

