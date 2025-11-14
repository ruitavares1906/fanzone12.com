"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Search, RefreshCw, Mail, Plus, AlertCircle, CheckSquare, Square, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(20)
  const { toast } = useToast()
  const [trackingInputs, setTrackingInputs] = useState<{[key: string]: string}>({})
  const [trackingLoading, setTrackingLoading] = useState<{[key: string]: boolean}>({})
  const [paymentInputs, setPaymentInputs] = useState<{[key: string]: string}>({})
  const [paymentLoading, setPaymentLoading] = useState<{[key: string]: boolean}>({})

  // Mover filteredOrders para antes dos useEffect
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      (order.order_number && order.order_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  // Calcular paginação
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Reset para primeira página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, paymentStatusFilter])

  useEffect(() => {
    fetchOrders()
  }, [])

  // Atualizar selectAll quando selectedOrders muda
  useEffect(() => {
    const currentOrderIds = currentOrders.map(order => order.id)
    setSelectAll(selectedOrders.length > 0 && selectedOrders.length === currentOrderIds.length)
  }, [selectedOrders, currentOrders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log("🔍 Buscando encomendas...")
      
      const debugResponse = await fetch("/api/check-orders")
      const debugData = await debugResponse.json()
      setDebugInfo(debugData)
      console.log("Debug info:", debugData)

      const response = await fetch("/api/admin/orders")
      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error("Erro ao buscar encomendas:", result.error)
        throw new Error(result.error || "Erro ao buscar encomendas")
      }

      const data = result.orders || []
      console.log("📋 Encomendas encontradas:", data?.length || 0)
      setOrders(data)
    } catch (error: any) {
      console.error("Erro ao buscar encomendas:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as encomendas: " + error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para selecionar/desselecionar todas as encomendas da página atual
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentOrderIds = currentOrders.map(order => order.id)
      setSelectedOrders(prev => [...new Set([...prev, ...currentOrderIds])])
    } else {
      const currentOrderIds = currentOrders.map(order => order.id)
      setSelectedOrders(prev => prev.filter(id => !currentOrderIds.includes(id)))
    }
  }

  // Função para selecionar/desselecionar uma encomenda individual
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  // Função para atualizar status em lote
  const updateBatchStatus = async (newStatus: string, field: 'status' | 'payment_status') => {
    if (selectedOrders.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma encomenda selecionada",
        description: "Por favor, selecione pelo menos uma encomenda.",
      })
      return
    }

    try {
      setBatchLoading(true)
      
      const response = await fetch("/api/admin/orders/batch-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          field: field,
          value: newStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar encomendas")
      }

      toast({
        title: "Encomendas atualizadas",
        description: `${selectedOrders.length} encomenda(s) atualizada(s) com sucesso!${result.emailsSent ? ` ${result.emailsSent} email(s) enviado(s).` : ''}`,
      })

      // Limpar seleção e recarregar encomendas
      setSelectedOrders([])
      await fetchOrders()
    } catch (error: any) {
      console.error("Erro ao atualizar encomendas em lote:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atualizar as encomendas: ${error.message}`,
      })
    } finally {
      setBatchLoading(false)
    }
  }

  const createTestOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/create-test-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Encomenda de teste criada",
          description: `Encomenda ${result.order.order_number} criada com sucesso!`,
        })
        await fetchOrders()
      } else {
        throw new Error(result.message || "Erro ao criar encomenda de teste")
      }
    } catch (error: any) {
      console.error("Erro ao criar encomenda de teste:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const sendShippingEmail = async (orderId: string) => {
    try {
      const order = orders.find((o) => o.id === orderId)

      if (!order.tracking_number || !order.estimated_delivery) {
        toast({
          variant: "destructive",
          title: "Informações incompletas",
          description: "Esta encomenda não tem número de rastreio ou data estimada de entrega.",
        })
        return
      }

      const response = await fetch("/api/admin/send-shipping-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          trackingNumber: order.tracking_number,
          estimatedDelivery: order.estimated_delivery,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Email enviado",
          description: "Email de rastreio enviado com sucesso!",
        })
      } else {
        throw new Error(result.error || "Erro ao enviar email")
      }
    } catch (error: any) {
      console.error("Erro ao enviar email:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível enviar o email: ${error.message}`,
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Em Processamento
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Enviado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Entregue
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Pago
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Falhou
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Reembolsado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Função para atualizar o número de rastreio e enviar email
  const handleSaveTracking = async (order: any) => {
    const trackingNumber = trackingInputs[order.id]?.trim()
    if (!trackingNumber) return
    setTrackingLoading(prev => ({ ...prev, [order.id]: true }))
    try {
      // Atualizar encomenda e enviar email
      const response = await fetch("/api/admin/send-shipping-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          trackingNumber,
          estimatedDelivery: "7 a 12 dias úteis"
        })
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: "Rastreio enviado", description: "O email de envio foi enviado ao cliente!" })
        setTrackingInputs(prev => ({ ...prev, [order.id]: "" }))
        await fetchOrders()
      } else {
        throw new Error(result.error || "Erro ao enviar email")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message })
    } finally {
      setTrackingLoading(prev => ({ ...prev, [order.id]: false }))
    }
  }

  // Função para atualizar o status do pagamento
  const handleSavePayment = async (order: any) => {
    const paymentStatus = paymentInputs[order.id] ?? order.payment_status
    setPaymentLoading(prev => ({ ...prev, [order.id]: true }))
    try {
      const response = await fetch("/api/admin/orders/batch-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: [order.id],
          field: "payment_status",
          value: paymentStatus
        })
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: "Pagamento atualizado", description: "O status do pagamento foi atualizado!" })
        setPaymentInputs(prev => ({ ...prev, [order.id]: undefined }))
        await fetchOrders()
      } else {
        throw new Error(result.error || "Erro ao atualizar pagamento")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message })
    } finally {
      setPaymentLoading(prev => ({ ...prev, [order.id]: false }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Encomendas</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={createTestOrder} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Teste
          </Button>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Atualizar</span>
          </Button>
        </div>
        </div>

        {/* Barra de ações em lote fixa */}
        {selectedOrders.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 mt-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedOrders.length} encomenda(s) selecionada(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrders([])}
                    className="text-blue-600 border-blue-300"
                  >
                    Limpar Seleção
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateBatchStatus('shipped', 'status')}
                    disabled={batchLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    📦 Marcar como Enviado
                  </Button>
                  <Select onValueChange={(value) => updateBatchStatus(value, 'status')} disabled={batchLoading}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status da Encomenda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Em Processamento</SelectItem>
                      <SelectItem value="completed">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => updateBatchStatus(value, 'payment_status')} disabled={batchLoading}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status do Pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                    </SelectContent>
                  </Select>
                  {batchLoading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Atualizando...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar Encomendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="text-sm font-medium mb-1 block">
                Pesquisar
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Número, email, ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-medium mb-1 block">
                Status da Encomenda
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Em Processamento</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="completed">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="payment-status" className="text-sm font-medium mb-1 block">
                Status do Pagamento
              </label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger id="payment-status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todas"
                    />
                  </TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Rastreio</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Carregando encomendas...</p>
                    </TableCell>
                  </TableRow>
                ) : currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      <div className="space-y-2">
                        <p className="text-gray-500">Nenhuma encomenda encontrada.</p>
                        {orders.length === 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-400">
                              {debugInfo?.totalOrders === 0 
                                ? "Não há encomendas na base de dados." 
                                : "Verifique os filtros aplicados."}
                            </p>
                            <Button variant="outline" size="sm" onClick={createTestOrder}>
                              <Plus className="h-4 w-4 mr-2" />
                              Criar Encomenda de Teste
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                          aria-label={`Selecionar encomenda ${order.order_number}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.order_number || order.id.substring(0, 8)}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name || order.email}</div>
                          {order.customer_name && (
                            <div className="text-sm text-gray-500">{order.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{order.total?.toFixed(2) || "0.00"} €</TableCell>
                      <TableCell>
                        {order.discount_code ? (
                          <div className="text-sm">
                            <div className="font-medium text-green-600">{order.discount_code}</div>
                            {order.discount_amount && order.discount_amount > 0 && (
                              <div className="text-xs text-gray-500">-{order.discount_amount.toFixed(2)} €</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem desconto</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={paymentInputs[order.id] ?? order.payment_status}
                            onChange={e => setPaymentInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                            disabled={paymentLoading[order.id]}
                          >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="failed">Falhou</option>
                            <option value="refunded">Reembolsado</option>
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSavePayment(order)}
                            disabled={paymentLoading[order.id] || (paymentInputs[order.id] === undefined || paymentInputs[order.id] === order.payment_status)}
                            className="px-2"
                          >
                            {paymentLoading[order.id] ? "A salvar..." : "Salvar"}
                          </Button>
                          {getPaymentStatusBadge(order.payment_status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.tracking_number ? (
                          <a
                            href={`https://www.cttexpress.com/localizador-de-envios/?sc=${order.tracking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {order.tracking_number}
                          </a>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Nº rastreio"
                              className="border rounded px-2 py-1 text-sm w-32"
                              value={trackingInputs[order.id] ?? ""}
                              onChange={e => setTrackingInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                              disabled={trackingLoading[order.id]}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveTracking(order)}
                              disabled={trackingLoading[order.id] || !(trackingInputs[order.id]?.trim())}
                              className="px-2"
                            >
                              {trackingLoading[order.id] ? "A enviar..." : "Enviar"}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/encomendas/${order.id}`} title="Ver detalhes">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {loading ? (
              <div className="text-center py-10">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Carregando encomendas...</p>
              </div>
            ) : currentOrders.length === 0 ? (
              <div className="text-center py-10">
                <div className="space-y-2">
                  <p className="text-gray-500">Nenhuma encomenda encontrada.</p>
                  {orders.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        {debugInfo?.totalOrders === 0 
                          ? "Não há encomendas na base de dados." 
                          : "Verifique os filtros aplicados."}
                      </p>
                      <Button variant="outline" size="sm" onClick={createTestOrder}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Encomenda de Teste
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {currentOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      {/* Nome do cliente apenas */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Cliente</p>
                        <h3 className="font-semibold text-sm text-gray-900">{order.customer_name || order.email}</h3>
                      </div>

                      {/* Desconto (se existir) */}
                      {order.discount_code && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Desconto</p>
                          <div className="text-green-600 text-sm">
                            {order.discount_code}
                            {order.discount_amount && order.discount_amount > 0 && (
                              <span className="text-xs"> (-{order.discount_amount.toFixed(2)} €)</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pagamento: definir pago/não pago */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Pagamento</p>
                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded px-2 py-1 text-xs flex-1"
                            value={paymentInputs[order.id] ?? order.payment_status}
                            onChange={e => setPaymentInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                            disabled={paymentLoading[order.id]}
                          >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="failed">Falhou</option>
                            <option value="refunded">Reembolsado</option>
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSavePayment(order)}
                            disabled={paymentLoading[order.id] || (paymentInputs[order.id] === undefined || paymentInputs[order.id] === order.payment_status)}
                            className="px-2 text-xs"
                          >
                            {paymentLoading[order.id] ? "..." : "Guardar"}
                          </Button>
                        </div>
                        <div className="mt-1">
                          {getPaymentStatusBadge(order.payment_status)}
                        </div>
                      </div>

                      {/* Rastreio - enviar */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Rastreio</p>
                        <div className="mt-1">
                          {order.tracking_number ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://www.ctt.pt/particulares/enviar/rastrear-envios?trackingNumber=${order.tracking_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs underline"
                              >
                                {order.tracking_number}
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendShippingEmail(order.id)}
                                className="px-2 text-xs"
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Número de rastreio"
                                className="border rounded px-2 py-1 text-xs flex-1"
                                value={trackingInputs[order.id] || ""}
                                onChange={e => setTrackingInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                disabled={trackingLoading[order.id]}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveTracking(order)}
                                disabled={trackingLoading[order.id] || !trackingInputs[order.id]?.trim()}
                                className="px-2 text-xs"
                              >
                                {trackingLoading[order.id] ? "..." : "Enviar"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex justify-end mt-3 pt-3 border-t">
                        <Link href={`/admin/encomendas/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredOrders.length)} de {filteredOrders.length} encomendas
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1">Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      {debugInfo && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Estado da Base de Dados:</strong> {debugInfo.totalOrders} encomendas encontradas
            {debugInfo.error && (
              <div className="text-red-600 mt-1">
                <strong>Erro:</strong> {debugInfo.error}
              </div>
            )}
            {debugInfo.orders?.length > 0 && (
              <div className="mt-2">
                <strong>Últimas encomendas:</strong>
                <ul className="text-sm mt-1">
                  {debugInfo.orders.slice(0, 3).map((order: any, index: number) => (
                    <li key={index}>
                      • {order.order_number || order.id?.substring(0, 8)} - {order.email} - {order.total}€ - {order.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
