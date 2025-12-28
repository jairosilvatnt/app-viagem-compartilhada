import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle,
  Package,
  Users,
  Car,
} from 'lucide-react'
import { format } from 'date-fns'

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, bookTrip, currentUser } = useAppStore()
  const trip = trips.find((t) => t.id === id)

  const [seats, setSeats] = useState(1)
  const [hasPackage, setHasPackage] = useState(false)
  const [packageDesc, setPackageDesc] = useState('')
  const [useLoyalty, setUseLoyalty] = useState(false)

  if (!trip) return <div className="p-8">Viagem não encontrada.</div>

  const baseTotal = trip.currentPrice * seats
  const discount = useLoyalty
    ? Math.min(currentUser?.loyaltyPoints || 0 / 100, baseTotal * 0.2)
    : 0 // Simple logic
  const total = baseTotal - discount

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para reservar.')
      navigate('/login')
      return
    }

    bookTrip({
      tripId: trip.id,
      userId: currentUser.id,
      seats,
      totalPrice: total,
      hasPackage,
      packageDetails: hasPackage
        ? { description: packageDesc, weight: 'TBD', dimensions: 'TBD' }
        : undefined,
    })

    toast.success('Reserva confirmada com sucesso!', {
      description: 'Verifique os detalhes em "Minhas Viagens".',
      icon: <CheckCircle className="text-green-500" />,
    })

    navigate('/bookings')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-elevation">
            <div className="h-64 bg-gray-200 relative">
              <img
                src={
                  trip.carImage || 'https://img.usecurling.com/p/800/400?q=car'
                }
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <Car className="w-4 h-4" /> {trip.carModel}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {trip.origin}{' '}
                    <span className="text-muted-foreground">para</span>{' '}
                    {trip.destination}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Saída:{' '}
                      {format(new Date(trip.departureTime), 'HH:mm')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Chegada:{' '}
                      {format(new Date(trip.arrivalTime), 'HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    R$ {trip.currentPrice.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">por pessoa</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {trip.driverName[0]}
                </div>
                <div>
                  <p className="font-medium">{trip.driverName}</p>
                  <p className="text-xs text-muted-foreground">
                    Motorista Verificado • 4.9 ★
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detalhes da Reserva</h3>

                <div className="space-y-2">
                  <Label>Número de Passageiros</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={seats === num ? 'default' : 'outline'}
                        onClick={() => setSeats(num)}
                        disabled={num > trip.availableSeats}
                        className="flex-1"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {trip.availableSeats} vagas restantes
                  </p>
                </div>

                {trip.allowPackages && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <Label htmlFor="package-mode" className="font-medium">
                          Enviar Encomenda?
                        </Label>
                      </div>
                      <Switch
                        id="package-mode"
                        checked={hasPackage}
                        onCheckedChange={setHasPackage}
                      />
                    </div>

                    {hasPackage && (
                      <div className="animate-accordion-down overflow-hidden">
                        <Label className="mb-2 block">
                          O que você vai enviar?
                        </Label>
                        <Textarea
                          placeholder="Descreva o pacote (tamanho, conteúdo)..."
                          value={packageDesc}
                          onChange={(e) => setPackageDesc(e.target.value)}
                        />
                        <p className="text-xs text-yellow-600 mt-2">
                          Sujeito a aprovação pelo motorista na hora do
                          embarque.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{seats}x Passageiro(s)</span>
                <span>R$ {baseTotal.toFixed(2)}</span>
              </div>
              {hasPackage && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxa de Encomenda</span>
                  <span>A combinar</span>
                </div>
              )}

              <div className="flex items-center space-x-2 py-4 border-t border-b">
                <Switch
                  id="loyalty"
                  checked={useLoyalty}
                  onCheckedChange={setUseLoyalty}
                />
                <Label htmlFor="loyalty" className="flex-1 cursor-pointer">
                  Usar Bônus Fidelidade
                  <span className="block text-xs text-muted-foreground">
                    Saldo: {currentUser?.loyaltyPoints} pts
                  </span>
                </Label>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                onClick={handleBooking}
              >
                Confirmar Reserva
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Cancelamento Grátis
              </p>
              <p className="text-xs text-green-700">Até 24h antes da viagem.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
