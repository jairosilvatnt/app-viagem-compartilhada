import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { TripCard } from '@/components/TripCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Search, MapPin, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { trips } = useAppStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')

  // Derived state for Dashboard
  const availableCars = trips.length
  const totalSeats = trips.reduce((acc, trip) => acc + trip.availableSeats, 0)

  const filteredTrips = trips.filter((trip) => {
    if (origin && !trip.origin.toLowerCase().includes(origin.toLowerCase()))
      return false
    if (
      destination &&
      !trip.destination.toLowerCase().includes(destination.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-6 md:p-10 text-white shadow-elevation relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Sua próxima viagem começa aqui
          </h1>
          <p className="text-blue-100 text-lg md:text-xl">
            Conforto, segurança e economia para você e suas encomendas.
          </p>

          <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 mt-8">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
              <MapPin className="text-muted-foreground w-5 h-5 mr-2" />
              <Input
                placeholder="De onde?"
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-400"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="w-[1px] bg-gray-200 hidden md:block"></div>
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
              <MapPin className="text-muted-foreground w-5 h-5 mr-2" />
              <Input
                placeholder="Para onde?"
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-400"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="w-[1px] bg-gray-200 hidden md:block"></div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'flex-1 justify-start text-left font-normal bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-900',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? (
                    format(date, 'PPP', { locale: ptBR })
                  ) : (
                    <span>Quando?</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              size="lg"
              className="rounded-xl px-8 bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg"
            >
              <Search className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Buscar</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Availability Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-primary animate-odometer">
            {availableCars}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Carros Hoje
          </span>
        </div>
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-green-600 animate-odometer">
            {totalSeats}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Vagas Restantes
          </span>
        </div>
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center col-span-2 md:col-span-2 bg-gradient-to-br from-secondary/10 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-secondary" />
            <span className="font-bold text-secondary">Entregas Rápidas</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Aproveite porta-malas vazios para enviar encomendas.
          </p>
        </div>
      </section>

      {/* Trip Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Viagens Disponíveis
          </h2>
          <Button variant="outline" size="sm">
            Filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma viagem encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente mudar a data ou o destino.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
