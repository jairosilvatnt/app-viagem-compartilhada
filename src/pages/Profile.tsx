import useAppStore from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, ShieldCheck } from 'lucide-react'

export default function Profile() {
  const { currentUser } = useAppStore()

  if (!currentUser) return <div>Faça login para ver seu perfil.</div>

  const nextLevelPoints = 2000
  const progress = (currentUser.loyaltyPoints / nextLevelPoints) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
          <AvatarImage src={currentUser.avatarUrl} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
        <p className="text-muted-foreground capitalize">
          {currentUser.role === 'admin'
            ? 'Motorista Parceiro'
            : 'Passageiro Vip'}
        </p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-900 to-primary text-white border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-indigo-200 font-medium mb-1">
                Nível de Fidelidade
              </p>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" /> Gold Member
              </h2>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{currentUser.loyaltyPoints}</p>
              <p className="text-xs text-indigo-200">Pontos Totais</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indigo-200">
              <span>Progresso para Platinum</span>
              <span>
                {currentUser.loyaltyPoints} / {nextLevelPoints}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-indigo-950" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Viagens Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.tripsTaken}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              4.9 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
