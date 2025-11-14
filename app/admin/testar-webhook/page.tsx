"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function TestWebhookPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const simulateEvent = async (eventType: string) => {
    setLoading(eventType)
    setResult(null)

    try {
      const response = await fetch("/api/admin/simulate-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Evento simulado com sucesso!",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Erro ao simular evento.",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao conectar com o servidor.",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Testar Webhook do Stripe</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulador de Eventos</CardTitle>
            <CardDescription>
              Use esta ferramenta para simular eventos do Stripe e testar o processamento do webhook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payment">
              <TabsList className="mb-4">
                <TabsTrigger value="payment">Eventos de Pagamento</TabsTrigger>
                <TabsTrigger value="checkout">Eventos de Checkout</TabsTrigger>
              </TabsList>

              <TabsContent value="payment">
                <div className="grid gap-4">
                  <Button
                    onClick={() => simulateEvent("payment_intent.succeeded")}
                    disabled={loading !== null}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading === "payment_intent.succeeded" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Simulando...
                      </>
                    ) : (
                      "Simular Pagamento Bem-sucedido"
                    )}
                  </Button>

                  <Button
                    onClick={() => simulateEvent("payment_intent.payment_failed")}
                    disabled={loading !== null}
                    variant="destructive"
                  >
                    {loading === "payment_intent.payment_failed" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Simulando...
                      </>
                    ) : (
                      "Simular Falha de Pagamento"
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="checkout">
                <div className="grid gap-4">
                  <Button onClick={() => simulateEvent("checkout.session.completed")} disabled={loading !== null}>
                    {loading === "checkout.session.completed" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Simulando...
                      </>
                    ) : (
                      "Simular Checkout Completo"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="w-full">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações sobre Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Endpoint do Webhook</h3>
                <p className="text-sm text-gray-500">
                  O endpoint do webhook deve ser configurado no painel do Stripe como:
                </p>
                <code className="bg-gray-100 p-2 rounded block mt-1">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/api/webhooks/stripe`
                    : "https://www.fanzone12.pt/api/webhooks/stripe"}
                </code>
              </div>

              <div>
                <h3 className="font-medium">Eventos a Escutar</h3>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-1">
                  <li>checkout.session.completed</li>
                  <li>payment_intent.succeeded</li>
                  <li>payment_intent.payment_failed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Variáveis de Ambiente Necessárias</h3>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-1">
                  <li>STRIPE_SECRET_KEY</li>
                  <li>STRIPE_WEBHOOK_SECRET</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
