"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CriarEncomendaTestePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreateTestOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/create-test-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setOrderCreated(true)
        setOrderId(data.order.id)
        setOrderNumber(data.order.order_number)
        toast({
          title: "Encomenda criada com sucesso",
          description: "A encomenda de teste foi criada e já está disponível na lista de encomendas.",
        })
      } else {
        throw new Error(data.message || "Erro ao criar encomenda de teste")
      }
    } catch (error: any) {
      console.error("Erro:", error)
      setError(error.message || "Não foi possível criar a encomenda de teste.")
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível criar a encomenda de teste.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Criar Encomenda de Teste</CardTitle>
          <CardDescription>Crie uma encomenda de teste para verificar o funcionamento do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {orderCreated ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Encomenda criada com sucesso!</p>
                <p className="text-sm mt-1">Número da encomenda: {orderNumber}</p>
                <p className="text-sm mt-1">ID da encomenda: {orderId}</p>
              </div>
              <p>A encomenda de teste foi criada e já está disponível na lista de encomendas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Esta ferramenta irá criar uma encomenda de teste com os seguintes detalhes:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Cliente: Cliente Teste</li>
                <li>Email: cliente.teste@exemplo.com</li>
                <li>Status: Pendente</li>
                <li>Total: €149.97</li>
                <li>Produtos: 2 camisolas</li>
                <li>Método de envio: CTT</li>
                <li>Método de pagamento: Multibanco</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {orderCreated ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/admin">Voltar ao Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/encomendas">Ver Encomendas</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/admin">Cancelar</Link>
              </Button>
              <Button onClick={handleCreateTestOrder} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Encomenda de Teste"
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
