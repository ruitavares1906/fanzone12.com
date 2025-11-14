"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, BarChart3, LineChart, PieChart, TrendingUp, TrendingDown } from "lucide-react"
import { DatePickerWithRange } from "./date-range-picker"

export default function RelatoriosPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Relatórios</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <DatePickerWithRange className="w-full" />
        </div>
        <div>
          <Select defaultValue="daily">
            <SelectTrigger>
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€4,235.89</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12.5% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Número de Pedidos</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8.2% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                <CardDescription>Por pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€54.30</div>
                <div className="flex items-center text-xs text-red-500 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-2.1% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Vendas</CardTitle>
              <CardDescription>Vendas diárias no período selecionado</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full flex items-center justify-center">
                <LineChart className="h-16 w-16 text-gray-300" />
                <span className="ml-2 text-gray-500">Gráfico de tendência de vendas</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por método</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] w-full flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-gray-300" />
                  <span className="ml-2 text-gray-500">Gráfico de métodos de pagamento</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] w-full flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <span className="ml-2 text-gray-500">Gráfico de vendas por categoria</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="produtos" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Top 10 produtos por quantidade vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Camisola Sporting 2024/25", quantity: 32, revenue: 1920 },
                  { name: "Camisola Benfica 2024/25", quantity: 28, revenue: 1680 },
                  { name: "Camisola Porto 2024/25", quantity: 24, revenue: 1440 },
                  { name: "Camisola Portugal 2024", quantity: 18, revenue: 1260 },
                  { name: "Camisola Personalizada", quantity: 15, revenue: 1050 },
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+15.3% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                <CardDescription>Clientes que voltaram</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.4%</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+3.2% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio por Cliente</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€78.50</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+5.7% vs. período anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>De onde vêm os clientes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] w-full flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-gray-300" />
                  <span className="ml-2 text-gray-500">Gráfico de fontes de tráfego</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversão por Campanha</CardTitle>
                <CardDescription>Taxa de conversão por campanha</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] w-full flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <span className="ml-2 text-gray-500">Gráfico de conversão por campanha</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
