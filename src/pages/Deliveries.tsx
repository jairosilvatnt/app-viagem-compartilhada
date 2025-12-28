import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Plus } from 'lucide-react'

export default function Deliveries() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Entregas</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Solicitação
        </Button>
      </div>

      <Card className="border-dashed border-2 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma entrega ativa</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Você ainda não solicitou nenhum envio de encomenda. Aproveite os
            porta-malas vazios e economize.
          </p>
          <Button variant="outline">Entender como funciona</Button>
        </CardContent>
      </Card>
    </div>
  )
}
