import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/useAppStore'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Login() {
  const [email, setEmail] = useState('alex@example.com')
  const { login } = useAppStore()
  const navigate = useNavigate()

  const handleLogin = (role: 'passenger' | 'admin') => {
    login(email, role)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-elevation border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center mb-2">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao SwiftRide
          </CardTitle>
          <p className="text-muted-foreground">Escolha como deseja entrar</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="passenger">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="passenger">Passageiro</TabsTrigger>
              <TabsTrigger value="admin">Motorista</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <TabsContent value="passenger" className="mt-6">
              <Button
                onClick={() => handleLogin('passenger')}
                className="w-full h-11 text-base"
              >
                Entrar como Passageiro
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <Button
                onClick={() => handleLogin('admin')}
                className="w-full h-11 text-base bg-slate-800 hover:bg-slate-700"
              >
                Entrar como Motorista
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos Termos de Uso.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
