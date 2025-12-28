export interface User {
  id: string
  name: string
  email: string
  role: 'passenger' | 'admin'
  loyaltyPoints: number
  avatarUrl?: string
  tripsTaken: number
}

export interface Trip {
  id: string
  driverId: string
  driverName: string
  carModel: string
  carImage?: string
  origin: string
  destination: string
  departureTime: string // ISO string
  arrivalTime: string // ISO string
  totalSeats: number
  availableSeats: number
  basePrice: number
  currentPrice: number
  isPromo: boolean
  promoExpiresAt?: string
  allowPackages: boolean
  trunkCapacity: 'small' | 'medium' | 'large'
}

export interface Booking {
  id: string
  tripId: string
  userId: string
  seats: number
  totalPrice: number
  status: 'confirmed' | 'pending' | 'cancelled'
  hasPackage: boolean
  packageDetails?: {
    description: string
    weight: string
    dimensions: string
  }
  createdAt: string
  trip?: Trip // Populated for UI convenience
}

export interface DeliveryRequest {
  id: string
  tripId: string
  requesterId: string
  description: string
  status: 'pending' | 'accepted' | 'rejected'
}
