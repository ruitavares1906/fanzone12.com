"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalCustomers: number
  recentOrders: any[]
  lowStockProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar total de pedidos
        const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

        // Buscar pedidos pendentes
        const { count: pendingOrders } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        // Buscar receita total
        const { data: revenueData } = await supabase.from("orders").select("total").eq("status", "paid")

        const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

        // Buscar total de clientes
        const { count: totalCustomers } = await supabase.from("customers").select("*", { count: "exact", head: true })

        // Buscar pedidos recentes
        const { data: recentOrders } = await supabase
          .from("orders")
          .select("*, customers(first_name, last_name)")
          .order("created_at", { ascending: false })
          .limit(5)

        // Simular produtos com estoque baixo (em um sistema real, você teria uma tabela de produtos com campo de estoque)
        const lowStockProducts = [
          { id: 1, name: "Camisola Benfica 2024/25", stock: 3 },
          { id: 2, name: "Camisola Sporting 2024/25", stock: 2 },
          { id: 3, name: "Camisola Porto 2024/25", stock: 4 },
        ]

        setStats({
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          totalRevenue,
          totalCustomers: totalCustomers || 0,
          recentOrders: recentOrders || [],
          lowStockProducts,
        })
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold px-2 md:px-0">Painel de Administração</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500">{stats.pendingOrders} pedidos pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              Desde o início
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-gray-500">Clientes registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts.length}</div>
            <p className="text-xs text-gray-500">Produtos com estoque baixo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">Pedido #{order.id.substring(0, 8)}</p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">
                        {order.customers?.first_name} {order.customers?.last_name}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-medium text-sm md:text-base">€{order.total.toFixed(2)}</p>
                      <p
                        className={`text-xs ${
                          order.status === "paid"
                            ? "text-green-500"
                            : order.status === "pending"
                              ? "text-orange-500"
                              : order.status === "shipped"
                                ? "text-blue-500"
                                : "text-gray-500"
                        }`}
                      >
                        {order.status === "paid"
                          ? "Pago"
                          : order.status === "pending"
                            ? "Pendente"
                            : order.status === "shipped"
                              ? "Enviado"
                              : order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhum pedido recente</p>
            )}
            <div className="mt-4">
              <Link href="/admin/encomendas" className="text-sm text-green-600 hover:text-green-800">
                Ver todos os pedidos →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{product.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">ID: {product.id}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className={`font-medium text-sm md:text-base ${product.stock <= 2 ? "text-red-500" : "text-orange-500"}`}>
                        {product.stock} em estoque
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhum produto com estoque baixo</p>
            )}
            <div className="mt-4">
              <Link href="/admin/produtos" className="text-sm text-green-600 hover:text-green-800">
                Gerenciar produtos →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
