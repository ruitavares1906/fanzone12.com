"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function TestePage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Iniciando teste com email:", email)
      
      const response = await fetch("/api/test-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log("Resposta do servidor:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Erro ao criar checkout")
      }

      if (!data.url) {
        throw new Error("URL do checkout não foi gerada")
      }

      // Redirecionar para o Stripe
      console.log("Redirecionando para:", data.url)
      window.location.href = data.url
    } catch (error: any) {
      console.error("Erro no teste:", error)
      toast({
        variant: "destructive",
        title: "Erro no Teste",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout de Teste</h1>
        <p className="text-gray-600 mb-6 text-center">
          Este é um checkout de teste que cria uma sessão com um produto de 50 cêntimos.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processando..." : "Testar Checkout (50 cêntimos)"}
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Após o teste, você será redirecionado para o Stripe para simular um pagamento.
            O valor é de apenas 50 cêntimos (valor mínimo aceito pelo Stripe) e não há custos de envio.
          </p>
        </form>
      </div>
    </div>
  )
} 