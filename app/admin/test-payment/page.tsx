"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

// Chave pública do Stripe (deve estar nas variáveis de ambiente)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTestPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Criar um item de carrinho simulado para o produto de teste
      const testCartItem = {
        id: "test-product-050",
        nome: "Produto de Teste (0.50€)",
        preco: 0.50,
        quantidade: 1,
        imagem: "https://placehold.co/400x400/png?text=Test+Product", // Imagem placeholder
        tamanho: "M",
        categoria: "teste",
        subcategoria: "teste",
        personalizacao: {
          ativar: false
        }
      }

      // 2. Chamar a API de checkout existente
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: [testCartItem],
          customerEmail: "admin-test@fanzone12.pt", // Email placeholder, será substituído no checkout
          discountCode: ""
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento")
      }

      // 3. Redirecionar para o Checkout do Stripe
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("URL de checkout não recebida")
      }

    } catch (err: any) {
      console.error("Erro no pagamento de teste:", err)
      setError(err.message || "Ocorreu um erro ao iniciar o pagamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Teste de Pagamentos Reais</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pagamento de 0.50€</CardTitle>
            <CardDescription>
              Use este botão para iniciar um fluxo real de checkout com um valor baixo (0.50€).
              Isso permite testar todo o ciclo: Checkout -> Webhook -> Base de Dados -> Emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              <strong>Atenção:</strong> Isto é um pagamento REAL se estiver em modo Live (Production).
              Será cobrado 0.50€ no seu cartão ou gerada uma referência Multibanco válida.
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                {error}
              </div>
            )}

            <Button 
              onClick={handleTestPayment} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando Checkout...
                </>
              ) : (
                "Pagar 0.50€ (Teste Real)"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>O que testar?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li><strong>Cartão de Crédito:</strong> O pagamento deve ser confirmado imediatamente. O email deve chegar em instantes.</li>
              <li><strong>Multibanco:</strong> 
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Gere a referência.</li>
                  <li>Verifique se a encomenda foi criada como "Pending" no admin.</li>
                  <li>Pague a referência (se possível) ou aguarde (em modo teste simula-se o pagamento).</li>
                  <li>Verifique se o status muda para "Paid" e se o email chega <strong>após</strong> o pagamento.</li>
                </ul>
              </li>
              <li><strong>Morada:</strong> Preencha dados diferentes de faturação e envio para testar a correção dos nomes/moradas.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






