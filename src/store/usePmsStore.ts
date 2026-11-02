import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  HotelProperty, 
  RoomCategory, 
  Room, 
  Reservation, 
  ChannelConnection, 
  PromoCode, 
  SyncLog,
  RoomStatus,
  CleanlinessStatus,
  PaymentMethod,
  FolioItem,
  FolioPayment,
  BookingSource,
  AuthUser,
  HotelTenant,
  UserRole
} from '../types/hotel';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_CATEGORIES, 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_CHANNELS, 
  INITIAL_PROMO_CODES, 
  INITIAL_SYNC_LOGS,
  MOCK_ACCOUNTS,
  MockAccount
} from '../mock/hotelData';
import { calculateItemGst, getRoomGstRate } from '../utils/taxEngine';
import { format, addDays } from 'date-fns';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface AuraPmsState {
  // Auth & RBAC State
  currentUser: AuthUser | null;
  accounts: MockAccount[];
  login: (email: string, pass: string) => { success: boolean; redirectUrl: string; message?: string };
  logout: () => void;

  // Multi-Tenant SaaS State
  hotels: HotelTenant[];
  properties: HotelTenant[];
  activePropertyId: string;
  updateHotelBranding: (hotelId: string, updates: Partial<HotelTenant>) => void;
  createHotelTenant: (newHotel: Omit<HotelTenant, 'id' | 'rating' | 'roomsCount'>) => HotelTenant;
  provisionAdminUser: (name: string, email: string, hotelId: string) => void;
  toggleHotelStatus: (hotelId: string) => void;

  categories: RoomCategory[];
  rooms: Room[];
  reservations: Reservation[];
  channels: ChannelConnection[];
  promoCodes: PromoCode[];
  syncLogs: SyncLog[];
  selectedDate: string; // Current calendar anchor date
  stopSells: Record<string, boolean>; // categoryId -> boolean
  channelStopSells: Record<string, boolean>; // `${channelSlug}_${categoryId}` -> boolean
  toasts: ToastMessage[];

  // Actions
  setActiveProperty: (id: string) => void;
  setSelectedDate: (date: string) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  updateCleanliness: (roomId: string, cleanliness: CleanlinessStatus) => void;
  createReservation: (data: {
    roomId: string;
    categoryId: string;
    guest: Reservation['guest'];
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
    source: BookingSource;
    roomRatePerNight: number;
    discountAmount?: number;
    discountCode?: string;
    notes?: string;
  }) => Reservation;
  checkInGuest: (reservationId: string, notes?: string) => void;
  checkOutGuest: (reservationId: string, paymentMethod: PaymentMethod, amountPaid: number, notes?: string) => void;
  addFolioItem: (
    reservationId: string, 
    item: { 
      department: FolioItem['department']; 
      description: string; 
      amount: number; 
      gstRate?: number;
      postedBy?: string;
    }
  ) => void;
  addPayment: (
    reservationId: string, 
    payment: {
      method: PaymentMethod;
      amount: number;
      referenceNumber?: string;
      notes?: string;
    }
  ) => void;
  applyPromoCodeToReservation: (
    reservationId: string, 
    codeStr: string
  ) => { success: boolean; message: string; discountAmount: number };
  toggleStopSell: (categoryId: string, channelSlug?: string) => void;
  simulateOtaInbound: (channel: 'MakeMyTrip' | 'Booking.com' | 'Goibibo' | 'Agoda') => Reservation | null;
  simulateOtaBooking: (source: 'MAKEMYTRIP' | 'GOIBIBO' | 'BOOKING_COM') => void;
  simulateDirectBooking: () => Reservation | null;
  bookFromGuestPortal: (bookingData: {
    categoryId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
    promoCode?: string;
    specialRequests?: string;
    paymentMethod?: string;
  }) => string;
  addFolioCharge: (reservationId: string, charge: { description: string; amount: number; department?: FolioItem['department'] }) => void;
  setRoomStatus: (roomId: string, status: RoomStatus) => void;
  triggerRateParitySync: () => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  resetToMockData: () => void;
}

export const usePmsStore = create<AuraPmsState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      accounts: MOCK_ACCOUNTS,
      hotels: INITIAL_PROPERTIES,
      properties: INITIAL_PROPERTIES,
      activePropertyId: 'prop-udaipur',
      categories: INITIAL_CATEGORIES,
      rooms: INITIAL_ROOMS,
      reservations: INITIAL_RESERVATIONS,
      channels: INITIAL_CHANNELS,
      promoCodes: INITIAL_PROMO_CODES,
      syncLogs: INITIAL_SYNC_LOGS,
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      stopSells: {},
      channelStopSells: {},
      toasts: [],

      login: (email, pass) => {
        const acc = get().accounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === pass
        );

        if (!acc) {
          return { success: false, redirectUrl: '/login', message: 'Invalid credentials. Please use the Quick Demo login buttons.' };
        }

        const user: AuthUser = {
          id: acc.id,
          name: acc.name,
          email: acc.email,
          role: acc.role,
          hotelId: acc.hotelId,
        };

        let targetUrl = '/';
        if (acc.role === 'SUPER_ADMIN') {
          targetUrl = '/superadmin';
        } else if (acc.role === 'HOTEL_ADMIN') {
          targetUrl = '/admin';
          if (acc.hotelId) {
            set({ activePropertyId: acc.hotelId });
          }
        } else {
          targetUrl = '/';
        }

        set({ currentUser: user });
        get().addToast('Authentication Verified', `Welcome back, ${user.name}. Granted ${user.role} scope.`, 'success');

        return { success: true, redirectUrl: targetUrl };
      },

      logout: () => {
        set({ currentUser: null });
        get().addToast('Session Ended', 'You have been securely signed out of the platform.', 'info');
      },

      updateHotelBranding: (hotelId, updates) => {
        set((state) => {
          const updatedHotels = state.hotels.map((h) =>
            h.id === hotelId ? { ...h, ...updates } : h
          );
          return {
            hotels: updatedHotels,
            properties: updatedHotels,
          };
        });
        get().addToast(
          'Brand Identity Synchronized',
          'Updated hotel branding. Changes are immediately live across the Guest Booking Engine and PMS.',
          'success'
        );
      },

      createHotelTenant: (newHotelData) => {
        const id = `prop-${Date.now().toString(36)}`;
        const newHotel: HotelTenant = {
          ...newHotelData,
          id,
          rating: 5.0,
          roomsCount: 12,
        };

        set((state) => ({
          hotels: [newHotel, ...state.hotels],
          properties: [newHotel, ...state.properties],
        }));

        get().addToast(
          'Tenant Provisioned',
          `Successfully onboarded ${newHotel.name} (${newHotel.code}) onto AURA SaaS.`,
          'success'
        );

        return newHotel;
      },

      provisionAdminUser: (name, email, hotelId) => {
        const newAccount: MockAccount = {
          id: `usr-${Date.now()}`,
          name,
          email,
          password: 'pass' + Math.floor(100 + Math.random() * 900),
          role: 'HOTEL_ADMIN',
          hotelId,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));

        get().addToast(
          'Account Provisioned',
          `Hotel Admin access created for ${email}. Ready for instant sign-in.`,
          'success'
        );
      },

      toggleHotelStatus: (hotelId) => {
        set((state) => {
          const updated = state.hotels.map((h) =>
            h.id === hotelId
              ? { ...h, status: (h.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE') as any }
              : h
          );
          return { hotels: updated, properties: updated };
        });
      },

      setActiveProperty: (id) => set({ activePropertyId: id }),
      
      setSelectedDate: (date) => set({ selectedDate: date }),

      addToast: (title, message, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const now = format(new Date(), 'HH:mm:ss');
        set((state) => ({
          toasts: [{ id, title, message, type, timestamp: now }, ...state.toasts.slice(0, 4)],
        }));
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      updateRoomStatus: (roomId, status) => {
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, status } : r)),
        }));
        get().addToast('Room Status Updated', `Room status changed to ${status}`, 'info');
      },

      updateCleanliness: (roomId, cleanliness) => {
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, cleanliness } : r)),
        }));
        get().addToast('Housekeeping Updated', `Room cleanliness set to ${cleanliness}`, 'info');
      },

      createReservation: (data) => {
        const id = `res-${Date.now()}`;
        const bookingCode = `AURA-${Math.floor(1000 + Math.random() * 9000)}`;
        const gstRate = getRoomGstRate(data.roomRatePerNight);
        
        // Initial room tariff folio item for Night 1
        const initialTaxCalc = calculateItemGst(data.roomRatePerNight, gstRate);
        const initialFolioItem: FolioItem = {
          id: `fol-${Date.now()}`,
          date: data.checkInDate,
          department: 'Room Tariff',
          description: `Room Tariff (Night 1)`,
          amount: data.roomRatePerNight,
          gstRate,
          cgst: initialTaxCalc.cgstAmount,
          sgst: initialTaxCalc.sgstAmount,
          totalWithTax: initialTaxCalc.grandTotal,
          postedBy: `${data.source} Booking Engine`,
        };

        const newRes: Reservation = {
          id,
          bookingCode,
          roomId: data.roomId,
          categoryId: data.categoryId,
          guest: data.guest,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          nights: data.nights,
          adults: data.adults,
          children: data.children,
          source: data.source,
          status: 'Confirmed',
          roomRatePerNight: data.roomRatePerNight,
          discountAmount: data.discountAmount || 0,
          discountCode: data.discountCode,
          folio: [initialFolioItem],
          payments: [],
          createdAt: new Date().toISOString(),
          notes: data.notes,
        };

        const nowTime = format(new Date(), 'HH:mm:ss');
        const syncLog: SyncLog = {
          id: `log-${Date.now()}`,
          timestamp: nowTime,
          type: data.source === 'Direct Web' ? 'OUTBOUND' : 'INBOUND',
          channel: data.source,
          action: 'RESERVATION_CREATED',
          details: `New booking ${bookingCode} created for ${data.guest.fullName} (${data.nights} nights).`,
          rawPayloadSnippet: JSON.stringify({
            bookingCode,
            guest: data.guest.fullName,
            room: data.roomId,
            nights: data.nights,
            rate: data.roomRatePerNight,
            source: data.source,
          }),
          status: 'SUCCESS',
        };

        set((state) => ({
          reservations: [newRes, ...state.reservations],
          rooms: state.rooms.map((r) =>
            r.id === data.roomId ? { ...r, status: 'Reserved', currentReservationId: id } : r
          ),
          syncLogs: [syncLog, ...state.syncLogs],
        }));

        get().addToast(
          'Reservation Confirmed',
          `${bookingCode} created for ${data.guest.fullName} via ${data.source}`,
          'success'
        );

        return newRes;
      },

      checkInGuest: (reservationId, notes) => {
        const state = get();
        const res = state.reservations.find((r) => r.id === reservationId);
        if (!res) return;

        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === reservationId
              ? {
                  ...r,
                  status: 'Checked-In',
                  notes: notes ? `${r.notes ? r.notes + ' | ' : ''}${notes}` : r.notes,
                }
              : r
          ),
          rooms: s.rooms.map((room) =>
            room.id === res.roomId ? { ...room, status: 'Occupied', currentReservationId: res.id } : room
          ),
        }));

        get().addToast(
          'Guest Checked In',
          `${res.guest.salutation} ${res.guest.fullName} has checked into Room ${res.roomId.replace('room-', '')}`,
          'success'
        );
      },

      checkOutGuest: (reservationId, paymentMethod, amountPaid, notes) => {
        const state = get();
        const res = state.reservations.find((r) => r.id === reservationId);
        if (!res) return;

        const newPayment: FolioPayment = {
          id: `pay-${Date.now()}`,
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
          method: paymentMethod,
          referenceNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: amountPaid,
          notes: notes || 'Settlement at checkout',
        };

        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === reservationId
              ? {
                  ...r,
                  status: 'Checked-Out',
                  payments: [...r.payments, newPayment],
                }
              : r
          ),
          rooms: s.rooms.map((room) =>
            room.id === res.roomId
              ? { ...room, status: 'Cleaning', cleanliness: 'Dirty', currentReservationId: undefined }
              : room
          ),
        }));

        get().addToast(
          'Checkout Complete',
          `${res.guest.fullName} checked out. Room ${res.roomId.replace('room-', '')} marked for Cleaning.`,
          'info'
        );
      },

      addFolioItem: (reservationId, item) => {
        const state = get();
        const res = state.reservations.find((r) => r.id === reservationId);
        if (!res) return;

        const gstRate = item.gstRate !== undefined ? item.gstRate : 0.18;
        const taxCalc = calculateItemGst(item.amount, gstRate);

        const newFolioItem: FolioItem = {
          id: `fol-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: format(new Date(), 'yyyy-MM-dd'),
          department: item.department,
          description: item.description,
          amount: item.amount,
          gstRate,
          cgst: taxCalc.cgstAmount,
          sgst: taxCalc.sgstAmount,
          totalWithTax: taxCalc.grandTotal,
          postedBy: item.postedBy || 'Front Desk Operations',
        };

        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === reservationId ? { ...r, folio: [...r.folio, newFolioItem] } : r
          ),
        }));

        get().addToast(
          'Charge Posted',
          `Posted ₹${item.amount.toLocaleString('en-IN')} (${item.department}) to Folio #${res.bookingCode}`,
          'success'
        );
      },

      addPayment: (reservationId, payment) => {
        const state = get();
        const res = state.reservations.find((r) => r.id === reservationId);
        if (!res) return;

        const newPayment: FolioPayment = {
          id: `pay-${Date.now()}`,
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
          method: payment.method,
          referenceNumber: payment.referenceNumber || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: payment.amount,
          notes: payment.notes,
        };

        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === reservationId ? { ...r, payments: [...r.payments, newPayment] } : r
          ),
        }));

        get().addToast(
          'Payment Recorded',
          `Received ₹${payment.amount.toLocaleString('en-IN')} via ${payment.method}`,
          'success'
        );
      },

      applyPromoCodeToReservation: (reservationId, codeStr) => {
        const state = get();
        const res = state.reservations.find((r) => r.id === reservationId);
        if (!res) return { success: false, message: 'Reservation not found', discountAmount: 0 };

        const promo = state.promoCodes.find((p) => p.code.toUpperCase() === codeStr.trim().toUpperCase());
        if (!promo) {
          return { success: false, message: 'Invalid or expired promotional code', discountAmount: 0 };
        }

        if (promo.minimumNights && res.nights < promo.minimumNights) {
          return {
            success: false,
            message: `Promo code ${promo.code} requires a minimum stay of ${promo.minimumNights} nights.`,
            discountAmount: 0,
          };
        }

        let discount = 0;
        const totalRoomTariff = res.roomRatePerNight * res.nights;
        if (promo.discountType === 'PERCENTAGE') {
          discount = Math.round((totalRoomTariff * promo.value) / 100);
        } else {
          discount = promo.value;
        }

        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.id === reservationId
              ? {
                  ...r,
                  discountAmount: discount,
                  discountCode: promo.code,
                }
              : r
          ),
        }));

        get().addToast(
          'Promotion Applied',
          `Applied code ${promo.code}: Saved ₹${discount.toLocaleString('en-IN')}`,
          'success'
        );

        return { success: true, message: `Applied ${promo.code} (-₹${discount.toLocaleString('en-IN')})`, discountAmount: discount };
      },

      toggleStopSell: (categoryId, channelSlug) => {
        if (channelSlug) {
          const key = `${channelSlug}_${categoryId}`;
          set((s) => ({
            channelStopSells: {
              ...s.channelStopSells,
              [key]: !s.channelStopSells[key],
            },
          }));
          const isStop = !get().channelStopSells[key];
          get().addToast(
            'Channel Stop-Sell Toggled',
            `${channelSlug.toUpperCase()} Stop-Sell: ${isStop ? 'ACTIVE' : 'RELEASED'}`,
            isStop ? 'warning' : 'info'
          );
        } else {
          set((s) => ({
            stopSells: {
              ...s.stopSells,
              [categoryId]: !s.stopSells[categoryId],
            },
          }));
          const isStop = !get().stopSells[categoryId];
          get().addToast(
            'Master Stop-Sell Toggled',
            `Category Stop-Sell: ${isStop ? 'CLOSED (STOP SELL)' : 'OPEN FOR SALE'}`,
            isStop ? 'warning' : 'info'
          );
        }
      },

      simulateOtaInbound: (channel) => {
        const state = get();
        // Pick an available room
        const availableRoom = state.rooms.find((r) => r.status === 'Available');
        if (!availableRoom) {
          get().addToast('OTA Sync Alert', `No rooms currently available to accept ${channel} booking!`, 'warning');
          return null;
        }

        const category = state.categories.find((c) => c.id === availableRoom.categoryId) || state.categories[0];
        const guests = [
          { name: 'Kabir & Tara Singhania', email: 'kabir.s@singhania.co', phone: '+91 98201 99281' },
          { name: 'Devendra Rathore', email: 'rathore.d@heritage.in', phone: '+91 94140 88219' },
          { name: 'Sir James Sterling', email: 'james.sterling@oxfordalumni.org', phone: '+44 7911 123456' },
          { name: 'Nisha & Sameer Khurana', email: 'nisha@khuranagroup.com', phone: '+91 98100 44321' },
        ];
        const randomGuest = guests[Math.floor(Math.random() * guests.length)];
        const checkIn = format(new Date(), 'yyyy-MM-dd');
        const checkOut = format(addDays(new Date(), 3), 'yyyy-MM-dd');

        const newRes = get().createReservation({
          roomId: availableRoom.id,
          categoryId: category.id,
          guest: {
            id: `g-${Date.now()}`,
            fullName: randomGuest.name,
            salutation: 'Mr.',
            email: randomGuest.email,
            phone: randomGuest.phone,
            country: 'India',
            idType: 'Aadhaar Card',
            idNumber: '•••• •••• 8844',
            vipStatus: true,
          },
          checkInDate: checkIn,
          checkOutDate: checkOut,
          nights: 3,
          adults: 2,
          children: 0,
          source: channel,
          roomRatePerNight: category.basePrice,
          notes: `Simulated inbound live push via ${channel} Channel Gateway API v3.2`,
        });

        // Add a detailed sync log
        const syncLog: SyncLog = {
          id: `log-${Date.now()}`,
          timestamp: format(new Date(), 'HH:mm:ss'),
          type: 'INBOUND',
          channel,
          action: 'OTA_WEBHOOK_PUSH',
          details: `Channel Manager received instant XML/JSON booking push from ${channel} for ${category.name} (${availableRoom.roomNumber}).`,
          rawPayloadSnippet: `[SYNC SUCCESS] Payload acknowledged. Inventory deducted on MMT, Booking.com, Goibibo, Agoda (Rate: ₹${category.basePrice.toLocaleString('en-IN')}, StopSell: false)`,
          status: 'SUCCESS',
        };

        set((s) => ({
          syncLogs: [syncLog, ...s.syncLogs],
        }));

        return newRes;
      },

      simulateOtaBooking: (source) => {
        const channelMap: Record<string, 'MakeMyTrip' | 'Booking.com' | 'Goibibo'> = {
          MAKEMYTRIP: 'MakeMyTrip',
          GOIBIBO: 'Goibibo',
          BOOKING_COM: 'Booking.com',
        };
        const ch = channelMap[source] || 'MakeMyTrip';
        get().simulateOtaInbound(ch);
      },

      setRoomStatus: (roomId, status) => {
        get().updateRoomStatus(roomId, status);
      },

      addFolioCharge: (reservationId, charge) => {
        get().addFolioItem(reservationId, {
          department: charge.department || 'Fine Dining',
          description: charge.description,
          amount: charge.amount,
        });
      },

      bookFromGuestPortal: (data) => {
        const state = get();
        const category = state.categories.find((c) => c.id === data.categoryId) || state.categories[0];
        
        // Find first available room in category or any available
        const availRoom = 
          state.rooms.find((r) => r.categoryId === category.id && r.status === 'Available') ||
          state.rooms.find((r) => r.status === 'Available') ||
          state.rooms.find((r) => r.categoryId === category.id) ||
          state.rooms[0];

        let discount = 0;
        if (data.promoCode) {
          const promo = state.promoCodes.find((p) => p.code.toUpperCase() === data.promoCode?.trim().toUpperCase());
          if (promo) {
            discount = promo.discountType === 'PERCENTAGE' 
              ? Math.round((category.basePrice * data.nights * promo.value) / 100)
              : promo.value;
          }
        }

        const newRes = get().createReservation({
          roomId: availRoom.id,
          categoryId: category.id,
          guest: {
            id: `g-${Date.now()}`,
            fullName: data.guestName,
            salutation: 'Mr.',
            email: data.guestEmail,
            phone: data.guestPhone,
            country: 'India',
            idType: 'Aadhaar Card',
            idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
            vipStatus: true,
            specialRequests: data.specialRequests,
          },
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
          nights: data.nights,
          adults: data.adults,
          children: data.children,
          source: 'Direct Web',
          roomRatePerNight: category.basePrice,
          discountAmount: discount,
          discountCode: data.promoCode,
          notes: data.specialRequests,
        });

        // Record upfront payment if chosen
        if (data.paymentMethod && data.paymentMethod !== 'PAY_AT_HOTEL') {
          const totalAfterDiscount = Math.max(0, category.basePrice * data.nights - discount);
          const tax = Math.round(totalAfterDiscount * 0.18);
          get().addPayment(newRes.id, {
            method: data.paymentMethod === 'UPI' ? 'UPI' : 'Credit Card',
            amount: totalAfterDiscount + tax,
            notes: `Direct guest advance settlement (${data.paymentMethod})`,
          });
        }

        return newRes.bookingCode;
      },

      simulateDirectBooking: () => {
        const state = get();
        const availableRoom = state.rooms.find((r) => r.status === 'Available');
        if (!availableRoom) {
          get().addToast('Direct Engine Alert', 'No rooms available for direct guest booking!', 'warning');
          return null;
        }

        const category = state.categories.find((c) => c.id === availableRoom.categoryId) || state.categories[0];
        const checkIn = format(new Date(), 'yyyy-MM-dd');
        const checkOut = format(addDays(new Date(), 4), 'yyyy-MM-dd');

        const newRes = get().createReservation({
          roomId: availableRoom.id,
          categoryId: category.id,
          guest: {
            id: `g-${Date.now()}`,
            fullName: 'Countess Beatrix Von Habsburg',
            salutation: 'Lady',
            email: 'beatrix@habsburg-estate.at',
            phone: '+43 1 512 8844',
            country: 'Austria',
            idType: 'Passport',
            idNumber: 'AUT-P998124',
            vipStatus: true,
            specialRequests: 'Chilled Krug Clos d\'Ambonnay upon arrival.',
          },
          checkInDate: checkIn,
          checkOutDate: checkOut,
          nights: 4,
          adults: 2,
          children: 0,
          source: 'Direct Web',
          roomRatePerNight: category.basePrice,
          discountAmount: Math.round(category.basePrice * 0.1),
          discountCode: 'ROYAL10',
          notes: 'Booked directly via AURA Sovereign Guest Engine (0% commission).',
        });

        const syncLog: SyncLog = {
          id: `log-${Date.now()}`,
          timestamp: format(new Date(), 'HH:mm:ss'),
          type: 'OUTBOUND',
          channel: 'Direct Web',
          action: 'BROADCAST_INVENTORY_DEDUCTION',
          details: `Direct booking ${newRes.bookingCode} completed. Dispatched inventory -1 delta to all connected OTA channels.`,
          rawPayloadSnippet: `[BROADCAST SUCCESS] Dispatched OTA Inventory Delta: Category ${category.code} inventory updated on MMT, BDC, GOI, AGD.`,
          status: 'SUCCESS',
        };

        set((s) => ({
          syncLogs: [syncLog, ...s.syncLogs],
        }));

        return newRes;
      },

      triggerRateParitySync: () => {
        const nowTime = format(new Date(), 'HH:mm:ss');
        const syncLog: SyncLog = {
          id: `log-${Date.now()}`,
          timestamp: nowTime,
          type: 'SYSTEM',
          channel: 'CENTRAL_GATEWAY',
          action: 'FORCE_FULL_INVENTORY_RATE_SYNC',
          details: 'Full bi-directional audit completed across MakeMyTrip, Booking.com, Goibibo, and Agoda. All rates in 100% parity.',
          rawPayloadSnippet: `[RATE PARITY OK] 5 Categories Synced | 17 Units Distributed | Rates Validated: SGV ₹14,500, RHS ₹28,000, LVP ₹38,500, KPV ₹56,000, MSV ₹95,000.`,
          status: 'SUCCESS',
        };

        set((s) => ({
          syncLogs: [syncLog, ...s.syncLogs],
          channels: s.channels.map((c) => ({
            ...c,
            lastSyncTime: 'Just now',
            pendingSyncCount: 0,
          })),
        }));

        get().addToast('OTA Parity Sync', 'Bi-directional rate & inventory synchronization broadcasted to all channels.', 'success');
      },

      resetToMockData: () => {
        set({
          properties: INITIAL_PROPERTIES,
          activePropertyId: 'prop-udaipur',
          categories: INITIAL_CATEGORIES,
          rooms: INITIAL_ROOMS,
          reservations: INITIAL_RESERVATIONS,
          channels: INITIAL_CHANNELS,
          promoCodes: INITIAL_PROMO_CODES,
          syncLogs: INITIAL_SYNC_LOGS,
          selectedDate: format(new Date(), 'yyyy-MM-dd'),
          stopSells: {},
          channelStopSells: {},
          toasts: [],
        });
        get().addToast('System Reset', 'All PMS data restored to pristine luxury seed state.', 'info');
      },
    }),
    {
      name: 'aura-luxury-pms-store',
    }
  )
);

