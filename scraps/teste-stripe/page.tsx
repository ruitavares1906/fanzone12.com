"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TesteStripePage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [configStatus, setConfigStatus] = useState<{
    isValid?: boolean
    missingVars?: string[]
    siteUrl?: string
    environment?: string
  } | null>(null)
  const [isCheckingConfig, setIsCheckingConfig] = useState(true)
  const { toast } = useToast()

  // Verificar a configuração ao carregar a página
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch("/api/check-config")
        const data = await response.json()
        setConfigStatus(data)
      } catch (error) {
        console.error("Erro ao verificar configuração:", error)
        setConfigStatus({ isValid: false })
      } finally {
        setIsCheckingConfig(false)
      }
    }

    checkConfig()
  }, [])

  const handleTestCheckout = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email para o teste.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Criar um item de teste para o checkout
      const testItem = {
        id: "test-item",
        nome: "Produto de Teste",
        preco: 0.5, // 50 centavos para teste
        imagem: "/images/logo-new.webp",
        tamanho: "M",
        quantidade: 1,
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: [testItem],
          customerEmail: email,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.url) {
        throw new Error("URL de checkout não recebida")
      }

      console.log("Redirecionando para:", data.url)

      // Usar window.location.href para garantir um redirecionamento completo
      window.location.href = data.url
    } catch (error: any) {
      console.error("Erro ao testar checkout:", error)
      toast({
        title: "Erro no teste",
        description: error.message || "Ocorreu um erro ao testar o checkout do Stripe.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Teste do Checkout do Stripe</CardTitle>
          <CardDescription>
            Esta página permite testar se o checkout do Stripe está funcionando corretamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCheckingConfig ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
              <span>Verificando configuração...</span>
            </div>
          ) : configStatus && !configStatus.isValid ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuração incompleta</AlertTitle>
              <AlertDescription>
                <p>As seguintes variáveis de ambiente estão ausentes:</p>
                <ul className="list-disc pl-5 mt-2">
                  {configStatus.missingVars?.map((variable) => (
                    <li key={variable}>{variable}</li>
                  ))}
                </ul>
                <p className="mt-2">
                  Adicione estas variáveis ao seu arquivo .env.local ou nas configurações do projeto.
                </p>
              </AlertDescription>
            </Alert>
          ) : configStatus ? (
            <Alert variant="default" className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Configuração válida</AlertTitle>
              <AlertDescription>
                <p>Todas as variáveis de ambiente necessárias estão configuradas.</p>
                <p className="mt-2">
                  <strong>URL do site:</strong> {configStatus.siteUrl}
                </p>
                <p>
                  <strong>Ambiente:</strong> {configStatus.environment}
                </p>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="test-email">Email para Teste</Label>
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>Este teste criará uma sessão de checkout com um produto de teste de 0,50€.</p>
            <p>Nenhuma cobrança real será feita.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleTestCheckout}
            disabled={isLoading || isCheckingConfig || (configStatus && !configStatus.isValid)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Testar Checkout do Stripe"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
