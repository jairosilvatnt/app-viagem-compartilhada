import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { MapPin, Calendar, CheckCircle } from 'lucide-react'

export default function Bookings() {
  const { bookings, trips } = useAppStore()

  // In a real app, populate bookings with trip data in the backend or store
  // For now, assuming bookings have trip data populated in reducer or just joined here
  const myBookings = bookings
    .map((b) => {
      const trip = trips.find((t) => t.id === b.tripId)
      return { ...b, trip }
    })
    .filter((b) => b.trip) // Safety check

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Minhas Viagens</h1>

      {myBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-muted-foreground">Você ainda não tem reservas.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myBookings.map((booking: any) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/5 p-6 flex flex-col justify-center items-center w-full md:w-32 text-center border-b md:border-b-0 md:border-r">
                  <span className="text-2xl font-bold text-primary">
                    {format(new Date(booking.trip.departureTime), 'dd')}
                  </span>
                  <span className="text-sm font-medium uppercase text-muted-foreground">
                    {format(new Date(booking.trip.departureTime), 'MMM')}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {format(new Date(booking.trip.departureTime), 'HH:mm')}
                  </span>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                        {booking.trip.origin}{' '}
                        <MapPin className="w-4 h-4 text-muted-foreground" />{' '}
                        {booking.trip.destination}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Motorista: {booking.trip.driverName}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none">
                      Confirmado
                    </Badge>
                  </div>

                  <div className="flex gap-4 text-sm mt-4">
                    <div className="bg-secondary/10 px-3 py-1 rounded text-foreground font-medium">
                      {booking.seats} Assento(s)
                    </div>
                    {booking.hasPackage && (
                      <div className="bg-blue-50 px-3 py-1 rounded text-blue-700 font-medium">
                        Pacote Incluído
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 flex items-center justify-center border-t md:border-t-0 md:border-l bg-gray-50">
                  <Button variant="outline" className="w-full">
                    Detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
