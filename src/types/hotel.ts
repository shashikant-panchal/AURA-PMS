export type UserRole = 'SUPER_ADMIN' | 'HOTEL_ADMIN' | 'FRONT_DESK' | 'HOUSEKEEPING' | 'GUEST';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string; // Links hotel admins to their specific property
}

export type SubscriptionPlan = 'TRIAL' | 'PRO' | 'ENTERPRISE';
export type TenantStatus = 'ACTIVE' | 'SUSPENDED';

export interface HotelTenant {
  id: string;
  name: string;
  code: string;
  tagline: string;
  logoUrl: string;
  currency: string;
  currencySymbol: string;
  gstin: string;
  address: string;
  location?: string;
  city: string;
  state: string;
  subscriptionPlan: SubscriptionPlan;
  status: TenantStatus;
  monthlyBillingAmount: number;
  contactEmail: string;
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
  rating: number;
  roomsCount: number;
}

// Backward compatibility alias
export type HotelProperty = HotelTenant;

export type RoomStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance';

export type CleanlinessStatus = 'Clean' | 'Dirty' | 'Inspected' | 'In Progress';

export type BookingSource = 'MakeMyTrip' | 'Booking.com' | 'Goibibo' | 'Agoda' | 'Expedia' | 'Airbnb' | 'Direct Web' | 'Walk-In' | 'Corporate' | 'Luxury Escapes';

export type ReservationStatus = 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'OTA Virtual Card' | 'Bank Transfer';

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
}

export interface RoomCategory {
  id: string;
  hotelId?: string;
  name: string;
  code: string;
  tier: string;
  description: string;
  basePrice: number;
  rackRate?: number;
  minRate?: number;
  maxRate?: number;
  extraBedCharge?: number;
  maxAdults: number;
  maxChildren: number;
  sqFt: number;
  view?: string;
  bedType: string;
  heroImage: string;
  gallery?: string[];
  amenities: string[];
  totalRooms: number;
}

export interface Room {
  id: string;
  hotelId?: string;
  roomNumber: string;
  categoryId: string;
  floor: number;
  status: RoomStatus;
  cleanliness: CleanlinessStatus;
  currentReservationId?: string;
  maintenanceNote?: string;
}

export interface GuestProfile {
  id: string;
  fullName: string;
  salutation: 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Lord' | 'Lady';
  email: string;
  phone: string;
  country: string;
  idType: 'Aadhaar Card' | 'Passport' | 'Driving License' | 'Voter ID';
  idNumber: string;
  idDocumentPreview?: string;
  vipStatus: boolean;
  specialRequests?: string;
  dietaryPreferences?: string;
  totalSpend?: number;
  visitCount?: number;
}

export interface FolioItem {
  id: string;
  date: string;
  department: 'Room Tariff' | 'Fine Dining' | 'Ayurvedic Spa' | 'Laundry' | 'Minibar' | 'Chauffeur / Transfer' | 'Bespoke Experience' | 'Miscellaneous';
  description: string;
  amount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  totalWithTax: number;
  postedBy: string;
}

export interface FolioPayment {
  id: string;
  timestamp: string;
  method: PaymentMethod;
  referenceNumber: string;
  amount: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  hotelId?: string;
  bookingCode: string;
  roomId: string;
  categoryId: string;
  guest: GuestProfile;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  source: BookingSource;
  channelReferenceId?: string;
  status: ReservationStatus;
  roomRatePerNight: number;
  discountAmount: number;
  discountCode?: string;
  folio: FolioItem[];
  payments: FolioPayment[];
  createdAt: string;
  notes?: string;
  isComplimentaryUpgrade?: boolean;
}

export interface ChannelConnection {
  id: string;
  hotelId?: string;
  name: BookingSource;
  slug: string;
  status: 'Connected' | 'Syncing' | 'Error' | 'Paused';
  lastSyncTime: string;
  pendingSyncCount: number;
  activeRatePlan?: string;
  commissionRate: number;
  logoUrl?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'INBOUND' | 'OUTBOUND' | 'SYSTEM' | 'ERROR';
  channel: BookingSource | 'CENTRAL_GATEWAY';
  action: string;
  details: string;
  rawPayloadSnippet: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface PromoCode {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  value: number;
  minimumNights?: number;
  validUntil: string;
}

// Point of Sale (POS) & Property Services
export interface PosService {
  id: string;
  hotelId?: string;
  name: string;
  category: 'Food' | 'Beverages' | 'Activity' | 'Transport' | 'Extra Bed' | 'Express Checkout' | 'Spa' | 'Miscellaneous';
  description: string;
  price: number;
  taxRate: number; // e.g. 0.05 for F&B, 0.18 for luxury services
  imageUrl?: string;
  active: boolean;
}

export interface PosOrderItem {
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface PosOrder {
  id: string;
  hotelId: string;
  orderNumber: string;
  counterName: string;
  roomId?: string;
  reservationId?: string;
  guestName: string;
  items: PosOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'BILLED_TO_ROOM';
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

// Night Audit & Financial Operations
export interface NightAuditReport {
  id: string;
  hotelId: string;
  auditDate: string;
  runBy: string;
  occupiedRooms: number;
  totalRooms: number;
  occupancyRate: number;
  roomRevenue: number;
  posRevenue: number;
  totalRevenue: number;
  taxCollected: number;
  createdAt: string;
}

// Local SQLite Database State
export interface DatabaseStatus {
  status: 'online' | 'offline' | 'connecting';
  engine: string;
  dbPath: string;
  sizeKb: number;
  lastModified?: string;
  tableCounts?: {
    properties: number;
    room_categories: number;
    rooms: number;
    reservations: number;
    folio_items: number;
    folio_payments: number;
    pos_services: number;
    pos_orders: number;
    sync_logs: number;
  };
}
