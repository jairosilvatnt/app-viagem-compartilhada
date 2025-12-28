import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Trip, User, Booking, DeliveryRequest } from '@/types'
import { addHours, subDays } from 'date-fns'

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Silva',
  email: 'alex@example.com',
  role: 'passenger', // changed dynamically in auth
  loyaltyPoints: 1250,
  tripsTaken: 14,
  avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
}

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    driverId: 'd1',
    driverName: 'Carlos Oliveira',
    carModel: 'Toyota Corolla 2023',
    carImage: 'https://img.usecurling.com/p/400/300?q=white%20sedan%20car',
    origin: 'São Paulo',
    destination: 'Campinas',
    departureTime: new Date(new Date().setHours(14, 0)).toISOString(),
    arrivalTime: new Date(new Date().setHours(15, 30)).toISOString(),
    totalSeats: 4,
    availableSeats: 3,
    basePrice: 45,
    currentPrice: 45,
    isPromo: false,
    allowPackages: true,
    trunkCapacity: 'medium',
  },
  {
    id: 't2',
    driverId: 'd2',
    driverName: 'Fernanda Santos',
    carModel: 'Honda HR-V',
    carImage: 'https://img.usecurling.com/p/400/300?q=suv%20car',
    origin: 'São Paulo',
    destination: 'Santos',
    departureTime: new Date(new Date().setHours(18, 0)).toISOString(),
    arrivalTime: new Date(new Date().setHours(19, 15)).toISOString(),
    totalSeats: 4,
    availableSeats: 2,
    basePrice: 60,
    currentPrice: 60,
    isPromo: true,
    promoExpiresAt: addHours(new Date(), 2).toISOString(),
    allowPackages: true,
    trunkCapacity: 'large',
  },
  {
    id: 't3',
    driverId: 'd1',
    driverName: 'Carlos Oliveira',
    carModel: 'Toyota Corolla 2023',
    carImage: 'https://img.usecurling.com/p/400/300?q=white%20sedan%20car',
    origin: 'Campinas',
    destination: 'São Paulo',
    departureTime: new Date(new Date().setHours(8, 0)).toISOString(), // Tomorrow logic handled in component usually, but keeping simple
    arrivalTime: new Date(new Date().setHours(9, 30)).toISOString(),
    totalSeats: 4,
    availableSeats: 0,
    basePrice: 45,
    currentPrice: 45,
    isPromo: false,
    allowPackages: false,
    trunkCapacity: 'medium',
  },
]

interface AppState {
  currentUser: User | null
  trips: Trip[]
  bookings: Booking[]
  deliveries: DeliveryRequest[]
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: Trip } // Used for promos
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const initialState: AppState = {
  currentUser: MOCK_USER,
  trips: MOCK_TRIPS,
  bookings: [
    {
      id: 'b1',
      tripId: 't3',
      userId: 'u1',
      seats: 1,
      totalPrice: 45,
      status: 'confirmed',
      hasPackage: false,
      createdAt: subDays(new Date(), 1).toISOString(),
      trip: MOCK_TRIPS[2],
    },
  ],
  deliveries: [],
}

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload }
    case 'LOGOUT':
      return { ...state, currentUser: null }
    case 'ADD_BOOKING':
      // Update available seats on the trip
      const updatedTripsBooking = state.trips.map((t) => {
        if (t.id === action.payload.tripId) {
          return {
            ...t,
            availableSeats: t.availableSeats - action.payload.seats,
          }
        }
        return t
      })
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        trips: updatedTripsBooking,
      }
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] }
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      }
    case 'UPDATE_USER':
      if (!state.currentUser) return state
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      }
    default:
      return state
  }
}

interface AppContextType extends AppState {
  dispatch: React.Dispatch<Action>
  login: (email: string, role: User['role']) => void
  logout: () => void
  bookTrip: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void
  createTrip: (
    trip: Omit<Trip, 'id' | 'currentPrice' | 'availableSeats'>,
  ) => void
  togglePromo: (tripId: string, isActive: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const login = (email: string, role: User['role']) => {
    // Mock login
    const user: User = {
      ...MOCK_USER,
      email,
      role,
      name: email.split('@')[0],
    }
    dispatch({ type: 'LOGIN', payload: user })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const bookTrip = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>,
  ) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      trip: state.trips.find((t) => t.id === bookingData.tripId),
    }
    dispatch({ type: 'ADD_BOOKING', payload: newBooking })
  }

  const createTrip = (
    tripData: Omit<Trip, 'id' | 'currentPrice' | 'availableSeats'>,
  ) => {
    const newTrip: Trip = {
      ...tripData,
      id: Math.random().toString(36).substr(2, 9),
      currentPrice: tripData.basePrice,
      availableSeats: tripData.totalSeats,
    }
    dispatch({ type: 'ADD_TRIP', payload: newTrip })
  }

  const togglePromo = (tripId: string, isActive: boolean) => {
    const trip = state.trips.find((t) => t.id === tripId)
    if (trip) {
      const updatedTrip = {
        ...trip,
        isPromo: isActive,
        currentPrice: isActive ? trip.basePrice * 0.7 : trip.basePrice,
        promoExpiresAt: isActive
          ? addHours(new Date(), 2).toISOString()
          : undefined,
      }
      dispatch({ type: 'UPDATE_TRIP', payload: updatedTrip })
    }
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        ...state,
        dispatch,
        login,
        logout,
        bookTrip,
        createTrip,
        togglePromo,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
