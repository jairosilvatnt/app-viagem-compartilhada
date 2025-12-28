import { Trip } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Package, ArrowRight, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface TripCardProps {
  trip: Trip
  compact?: boolean
}

export const TripCard = ({ trip, compact = false }: TripCardProps) => {
  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 card-hover group h-full flex flex-col',
        {
          'border-secondary/50 shadow-[0_0_15px_rgba(255,59,48,0.15)] animate-pulse-glow':
            trip.isPromo,
        },
      )}
    >
      <CardHeader className="p-0 relative h-40 overflow-hidden bg-muted">
        {trip.carImage ? (
          <img
            src={trip.carImage}
            alt={trip.carModel}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}

        {trip.isPromo && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="destructive"
              className="animate-pulse shadow-md font-bold px-3 py-1"
            >
              <Zap className="w-3 h-3 mr-1 fill-white" />
              PROMOÇÃO RELÂMPAGO
            </Badge>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-semibold text-lg drop-shadow-md">
            {trip.origin} <ArrowRight className="inline w-4 h-4 mx-1" />{' '}
            {trip.destination}
          </p>
          <p className="text-white/90 text-sm">
            {format(new Date(trip.departureTime), "dd 'de' MMM, HH:mm")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Motorista
            </p>
            <p className="font-semibold text-foreground">{trip.driverName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">
              Preço por assento
            </p>
            <div className="flex items-center justify-end gap-2">
              {trip.isPromo && (
                <span className="text-sm line-through text-muted-foreground">
                  R$ {trip.basePrice}
                </span>
              )}
              <span
                className={cn(
                  'text-xl font-bold',
                  trip.isPromo ? 'text-secondary' : 'text-primary',
                )}
              >
                R$ {trip.currentPrice.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/10 p-2 rounded-md">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium">
              {trip.availableSeats} vagas
            </span>
          </div>
          {trip.allowPackages && (
            <div className="flex items-center gap-2 text-muted-foreground bg-green-50 p-2 rounded-md">
              <Package className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">
                Aceita encomendas
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {!compact && (
        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            className={cn(
              'w-full shadow-lg',
              trip.isPromo ? 'bg-secondary hover:bg-secondary/90' : '',
            )}
          >
            <Link to={`/trip/${trip.id}`}>
              {trip.availableSeats === 0 ? 'Esgotado' : 'Reservar Agora'}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
