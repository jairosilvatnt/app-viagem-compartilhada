import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/useAppStore'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import TripDetails from '@/pages/TripDetails'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import Bookings from '@/pages/Bookings'
import Deliveries from '@/pages/Deliveries'
import Profile from '@/pages/Profile'

const App = () => (
  <AppProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
