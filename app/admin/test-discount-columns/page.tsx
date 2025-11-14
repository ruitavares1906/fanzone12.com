"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestDiscountColumnsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const setupDiscountColumns = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch("/api/admin/setup-discount-columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Erro desconhecido")
      }
    } catch (err: any) {
      setError(err.message || "Erro ao configurar colunas")
    } finally {
      setLoading(false)
    }
  }

  const testOrdersWithDiscount = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/orders")
      const data = await response.json()

      if (data.success) {
        const ordersWithDiscount = data.orders.filter((order: any) => 
          order.discount_code || order.discount_amount > 0
        )

        setResult({
          totalOrders: data.orders.length,
          ordersWithDiscount: ordersWithDiscount.length,
          sampleOrders: ordersWithDiscount.slice(0, 5)
        })
      } else {
        setError(data.error || "Erro ao buscar encomendas")
      }
    } catch (err: any) {
      setError(err.message || "Erro ao testar encomendas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teste de Colunas de Desconto</h1>
          <p className="text-gray-600 mt-2">
            Configure e teste as colunas de desconto na tabela de encomendas
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurar Colunas de Desconto</CardTitle>
            <CardDescription>
              Adiciona as colunas discount_code e discount_amount à tabela orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={setupDiscountColumns} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Configurando...
                </>
              ) : (
                "Configurar Colunas"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testar Encomendas com Desconto</CardTitle>
            <CardDescription>
              Verifica quantas encomendas têm códigos de desconto aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testOrdersWithDiscount} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar Encomendas"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Erro:</span>
              </div>
              <p className="text-red-600 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Resultado:</span>
              </div>
              
              {result.message && (
                <p className="text-green-600 mb-4">{result.message}</p>
              )}

              {result.columns && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Colunas Configuradas:</h4>
                  <div className="flex gap-2">
                    {result.columns.map((col: any) => (
                      <Badge key={col.column_name} variant="outline">
                        {col.column_name} ({col.data_type})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.totalOrders !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Total de Encomendas:</span>
                    <Badge variant="outline">{result.totalOrders}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Com Desconto:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {result.ordersWithDiscount}
                    </Badge>
                  </div>
                  
                  {result.sampleOrders && result.sampleOrders.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Exemplos de Encomendas com Desconto:</h4>
                      <div className="space-y-2">
                        {result.sampleOrders.map((order: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{order.order_number || order.id.substring(0, 8)}</span>
                              <div className="flex gap-2">
                                {order.discount_code && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    {order.discount_code}
                                  </Badge>
                                )}
                                {order.discount_amount > 0 && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    -{order.discount_amount.toFixed(2)}€
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
