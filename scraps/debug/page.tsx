"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function DebugPage() {
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/debug-config")
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        const data = await response.json()
        setConfig(data)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar configuração")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const refreshConfig = () => {
    setIsLoading(true)
    setError(null)
    fetch("/api/debug-config")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        setConfig(data)
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar configuração")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Configuração</CardTitle>
          <CardDescription>
            Esta página mostra informações sobre a configuração atual do ambiente para ajudar a diagnosticar problemas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-2" />
              <span>Carregando configuração...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Erro ao carregar configuração</span>
              </div>
              <p className="mt-2">{error}</p>
            </div>
          ) : config ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 mb-2">Ambiente</h3>
                  <p className="text-sm">{config.environment}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 mb-2">Timestamp</h3>
                  <p className="text-sm">{new Date(config.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">URL do Site</h3>
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">{config.siteUrl || "Não definido"}</span>
                  {config.isValidUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {!config.isValidUrl && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-700 flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">URL inválida</p>
                      <p className="mt-1">
                        A URL do site não é válida. Isso pode causar problemas com o checkout do Stripe. Certifique-se
                        de que NEXT_PUBLIC_SITE_URL está configurado corretamente com um formato válido (ex:
                        https://seudominio.com).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">Configuração do Stripe</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">STRIPE_SECRET_KEY:</span>
                    {config.hasStripeKey ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</span>
                    {config.hasStripePublishableKey ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">URL de Teste</h3>
                <p className="text-sm mb-2">{config.testUrl || "Não disponível"}</p>
                {config.isValidUrl ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700 flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">URL válida</p>
                      <p className="mt-1">A URL de teste é válida e deve funcionar com o Stripe.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex items-start">
                    <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">URL inválida</p>
                      <p className="mt-1">
                        A URL de teste não é válida. Isso causará problemas com o checkout do Stripe.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">Informações do Vercel</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Host:</span>
                    <span className="text-sm ml-2">{config.headers?.host || "Não disponível"}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">URL:</span>
                    <span className="text-sm ml-2">{config.headers?.url || "Não disponível"}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button onClick={refreshConfig} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Configuração"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
