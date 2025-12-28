import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Zap, Users, Car, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { trips, togglePromo, currentUser } = useAppStore()

  // Filter trips for this admin (mock logic, usually by driverId)
  const myTrips = trips

  const handleTogglePromo = (tripId: string, currentState: boolean) => {
    togglePromo(tripId, !currentState)
    if (!currentState) {
      toast.success('Promoção Relâmpago Ativada!', {
        description: 'O preço foi reduzido em 30% por 2 horas.',
        icon: <Zap className="text-yellow-500" />,
      })
    }
  }

  if (currentUser?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Acesso Restrito</div>
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Painel do Motorista</h1>
          <p className="text-muted-foreground">
            Gerencie suas viagens e promoções
          </p>
        </div>
        <Button className="bg-primary text-white gap-2 shadow-lg">
          <Plus className="w-4 h-4" /> Nova Viagem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Viagens Ativas
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTrips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Assentos Ocupados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +12% desde o último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Estimada
            </CardTitle>
            <span className="text-green-600 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.250</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trips" className="w-full">
        <TabsList>
          <TabsTrigger value="trips">Minhas Viagens</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="car">Veículo</TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="mt-6">
          <div className="grid gap-6">
            {myTrips.map((trip) => (
              <Card
                key={trip.id}
                className="flex flex-col md:flex-row overflow-hidden"
              >
                <div className="w-full md:w-48 bg-muted h-32 md:h-auto relative">
                  {trip.carImage && (
                    <img
                      src={trip.carImage}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">
                        {trip.origin} → {trip.destination}
                      </h3>
                      {trip.isPromo && (
                        <Badge variant="destructive">Promoção Ativa</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {format(
                        new Date(trip.departureTime),
                        "dd/MM/yyyy 'às' HH:mm",
                      )}
                    </p>
                    <p className="text-sm font-medium">
                      {trip.availableSeats} de {trip.totalSeats} vagas
                      disponíveis
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 w-full md:w-auto">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Promoção Relâmpago
                      </span>
                      <Switch
                        checked={trip.isPromo}
                        onCheckedChange={() =>
                          handleTogglePromo(trip.id, trip.isPromo)
                        }
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed">
            Nenhuma solicitação pendente no momento.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
