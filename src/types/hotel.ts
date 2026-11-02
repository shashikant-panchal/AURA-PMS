export type UserRole = 'SUPER_ADMIN' | 'HOTEL_ADMIN' | 'GUEST';

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

export type BookingSource = 'MakeMyTrip' | 'Booking.com' | 'Goibibo' | 'Agoda' | 'Direct Web' | 'Walk-In' | 'Luxury Escapes';

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
  extraBedCharge: number;
  maxAdults: number;
  maxChildren: number;
  sqFt: number;
  view: string;
  bedType: string;
  heroImage: string;
  gallery: string[];
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
  idType: 'Aadhaar Card' | 'Passport' | 'Driving License';
  idNumber: string;
  idDocumentPreview?: string;
  vipStatus: boolean;
  specialRequests?: string;
  dietaryPreferences?: string;
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
  name: BookingSource;
  slug: string;
  status: 'Connected' | 'Syncing' | 'Error' | 'Paused';
  lastSyncTime: string;
  pendingSyncCount: number;
  activeRatePlan: string;
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
