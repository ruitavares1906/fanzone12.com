"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Save,
  Truck,
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Mail,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Trash,
  XCircle,
  CheckSquare,
  RefreshCw,
  Ban,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { shippingCarriers, getTrackingUrl, getCarrierLabel } from "@/lib/shipping-carriers"

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const orderId = resolvedParams.id
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [status, setStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [shippingMethod, setShippingMethod] = useState("")
  const [carrier, setCarrier] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        
        // Buscar dados da encomenda via API admin
        const response = await fetch(`/api/admin/orders/${orderId}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Erro ao buscar detalhes da encomenda")
        }

        const orderDetails = result.order

        setOrder(orderDetails)
        setTrackingNumber(orderDetails.tracking_number || "")
        setStatus(orderDetails.status || "")
        setPaymentStatus(orderDetails.payment_status || "")
        setEstimatedDelivery(orderDetails.estimated_delivery || "")
        setShippingMethod(orderDetails.shipping_method || "")
        setCarrier(orderDetails.carrier || "")
        setNotes(orderDetails.notes || "")
      } catch (error: any) {
        console.error("Erro ao buscar detalhes da encomenda:", error.message)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes da encomenda.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, toast])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          status: status,
          payment_status: paymentStatus,
          estimated_delivery: estimatedDelivery,
          shipping_method: shippingMethod,
          carrier: carrier,
          tracking_url: carrier && trackingNumber ? getTrackingUrl(carrier, trackingNumber) : null,
          notes: notes,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro ao atualizar encomenda")
      }

      // Atualizar o objeto order local
      setOrder({
        ...order,
        tracking_number: trackingNumber,
        status: status,
        payment_status: paymentStatus,
        estimated_delivery: estimatedDelivery,
        shipping_method: shippingMethod,
        carrier: carrier,
        tracking_url: carrier && trackingNumber ? getTrackingUrl(carrier, trackingNumber) : null,
        notes: notes,
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "Sucesso",
        description: "Informações da encomenda atualizadas com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar encomenda:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações da encomenda.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const sendShippingEmail = async () => {
    if (!trackingNumber) {
      toast({
        variant: "destructive",
        title: "Informações incompletas",
        description: "Por favor, preencha o número de rastreio.",
      })
      return
    }

    try {
      setIsSendingEmail(true)

      // Primeiro, salvar as alterações
      await handleSave()

      // Enviar email de confirmação de envio
      const response = await fetch("/api/admin/send-shipping-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          trackingNumber,
          carrier: carrier,
          estimatedDelivery: estimatedDelivery || "7 a 12 dias úteis",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar email")
      }

      toast({
        title: "Email enviado",
        description: "Email de confirmação de envio enviado com sucesso para o cliente.",
      })
    } catch (error: any) {
      console.error("Erro ao enviar email:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível enviar o email: ${error.message}`,
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleDeleteOrder = async () => {
    try {
      setIsDeleting(true)

      // Enviar email de notificação de exclusão
      const emailResponse = await fetch("/api/admin/send-order-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          notificationType: "delete",
          message: "A sua encomenda foi removida do nosso sistema.",
        }),
      })

      if (!emailResponse.ok) {
        const emailResult = await emailResponse.json()
        console.error("Erro ao enviar email de exclusão:", emailResult.error)
      }

      // Excluir a encomenda
      const { error } = await supabase.from("orders").delete().eq("id", orderId)

      if (error) {
        throw error
      }

      toast({
        title: "Encomenda excluída",
        description: "A encomenda foi excluída com sucesso.",
      })

      // Redirecionar para a lista de encomendas
      router.push("/admin/encomendas")
    } catch (error: any) {
      console.error("Erro ao excluir encomenda:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a encomenda.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOrderAction = async (newStatus: string, actionType: string) => {
    try {
      setIsProcessingAction(true)

      // Atualizar o status da encomenda via API
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro ao atualizar status")
      }

      // Atualizar o estado local
      setStatus(newStatus)
      setOrder({
        ...order,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })

      // Enviar email de notificação
      const emailResponse = await fetch("/api/admin/send-order-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          notificationType: actionType,
          newStatus,
        }),
      })

      if (!emailResponse.ok) {
        const emailResult = await emailResponse.json()
        console.error(`Erro ao enviar email de ${actionType}:`, emailResult.error)
        // Não interromper o fluxo se o email falhar
      }

      toast({
        title: "Status atualizado",
        description: `A encomenda foi marcada como "${newStatus}" e o cliente foi notificado.`,
      })
    } catch (error: any) {
      console.error(`Erro ao processar ação ${actionType}:`, error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível processar a ação: ${error.message}`,
      })
    } finally {
      setIsProcessingAction(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Encomenda não encontrada</h2>
        <Button asChild>
          <Link href="/admin/encomendas">Voltar para lista de encomendas</Link>
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    } catch (e) {
      return dateString || "Data não disponível"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Em Processamento</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Enviado</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Entregue</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Reembolsado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Encomenda #{order.order_number || order.id.substring(0, 8)}</h2>
          <p className="text-muted-foreground">Criada em {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <span className="sr-only">Ações</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações da Encomenda</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOrderAction("processing", "processing")}
                disabled={isProcessingAction || status === "processing"}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Marcar como Em Processamento
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderAction("shipped", "shipped")}
                disabled={isProcessingAction || status === "shipped"}
              >
                <Truck className="h-4 w-4 mr-2" />
                Marcar como Enviado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderAction("completed", "completed")}
                disabled={isProcessingAction || status === "completed"}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Marcar como Entregue
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOrderAction("cancelled", "cancelled")}
                disabled={isProcessingAction || status === "cancelled"}
              >
                <Ban className="h-4 w-4 mr-2" />
                Cancelar Encomenda
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Apagar Encomenda
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a encomenda #
                      {order.order_number || order.id.substring(0, 8)} e removerá os dados do nosso servidor.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteOrder}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Excluindo..." : "Sim, excluir encomenda"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/encomendas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      {/* Barra de status */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <div className="mt-1">{getStatusBadge(status)}</div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Pagamento:</span>
            <div className="mt-1">{getPaymentStatusBadge(paymentStatus)}</div>
          </div>
          {trackingNumber && (
            <div>
              <span className="text-sm font-medium text-gray-500">Rastreio:</span>
              <div className="mt-1">
                <a
                  href={`https://www.cttexpress.com/localizador-de-envios/?sc=${trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center text-sm"
                >
                  {trackingNumber} <Truck className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOrderAction("processing", "processing")}
              disabled={isProcessingAction || status === "processing"}
              className="hidden sm:flex"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Em Processamento
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOrderAction("shipped", "shipped")}
              disabled={isProcessingAction || status === "shipped"}
              className="hidden sm:flex"
            >
              <Truck className="h-4 w-4 mr-2" />
              Enviado
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOrderAction("completed", "completed")}
              disabled={isProcessingAction || status === "completed"}
              className="hidden sm:flex"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Entregue
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOrderAction("cancelled", "cancelled")}
              disabled={isProcessingAction || status === "cancelled"}
              className="hidden sm:flex text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Rastreio em Destaque */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-blue-700">
            <Truck className="h-5 w-5 mr-2" />
            Informações de Envio e Rastreio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carrier" className="text-blue-700 font-medium">
                Transportadora Internacional
              </Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier" className="mt-1 border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Selecione a transportadora" />
                </SelectTrigger>
                <SelectContent>
                  {shippingCarriers.map((carrierOption) => (
                    <SelectItem key={carrierOption.id} value={carrierOption.id}>
                      {carrierOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tracking-number" className="text-blue-700 font-medium">
                Número de Rastreio
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Adicionar número de rastreio"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
          
          {carrier && trackingNumber && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Link de Rastreio Gerado:
              </p>
              <a
                href={getTrackingUrl(carrier, trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {getTrackingUrl(carrier, trackingNumber)}
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Informações de Envio"}
            </Button>

            <Button
              variant="outline"
              onClick={sendShippingEmail}
              disabled={isSendingEmail || !trackingNumber || !carrier}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSendingEmail ? "Enviando..." : "Enviar Email de Rastreio ao Cliente"}
            </Button>
          </div>

          {trackingNumber && carrier && (
            <div className="mt-4 p-3 bg-white rounded-md border border-blue-200">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">
                    Transportadora: {getCarrierLabel(carrier)}
                  </p>
                  <p className="font-medium text-gray-700 mt-1">
                    Número de rastreio: {trackingNumber}
                  </p>
                  {getTrackingUrl(carrier, trackingNumber) && (
                    <a
                      href={getTrackingUrl(carrier, trackingNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center mt-1"
                    >
                      Rastrear encomenda <Truck className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Detalhes da Encomenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Método de Pagamento</Label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    {order.payment_method || "Cartão de Crédito"}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status da Encomenda</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Em Processamento</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="completed">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment-status">Status do Pagamento</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger id="payment-status" className="mt-1">
                      <SelectValue placeholder="Selecione o status de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicionar notas sobre a encomenda"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens da Encomenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">{item.product_name || "Produto"}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size && `Tamanho: ${item.size} • `}
                          Quantidade: {item.quantity}
                          {item.customization && ` • Personalização: ${item.customization}`}
                        </p>
                      </div>
                      <p className="font-medium">{((item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} €</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>Nenhum item encontrado nesta encomenda.</p>
                    <p className="text-sm mt-1">Verifique se os itens foram processados corretamente no webhook.</p>
                  </div>
                )}

                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {order.subtotal?.toFixed(2) || (order.total - (order.shipping_cost || 0)).toFixed(2) || "0.00"} €
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envio</span>
                    <span>{order.shipping_cost?.toFixed(2) || "0.00"} €</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{order.total?.toFixed(2) || "0.00"} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p>{order.customer_name || order.shipping_address?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{order.email || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p>{order.customer_phone || order.shipping_address?.phone || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_address ? (
                <div className="space-y-2">
                  {typeof order.shipping_address === "string" ? (
                    (() => {
                      try {
                        const address = JSON.parse(order.shipping_address)
                        return (
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="space-y-1">
                              <p className="font-semibold text-lg">{address.name || order.customer_name}</p>
                              <p className="text-gray-600">{address.line1}</p>
                              {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                              <p className="text-gray-600">
                                <strong>{address.postal_code}</strong> {address.city}
                              </p>
                              {address.state && address.state !== address.city && (
                                <p className="text-gray-600">{address.state}</p>
                              )}
                              <p className="text-gray-900 font-medium">{address.country}</p>
                              {(address.phone || order.customer_phone) && (
                                <p className="text-gray-600 text-sm mt-2">
                                  📞 {address.phone || order.customer_phone}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      } catch (e) {
                        return (
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-red-600 text-sm mb-2">Erro ao processar morada:</p>
                            <pre className="text-xs whitespace-pre-wrap text-gray-600">{order.shipping_address}</pre>
                          </div>
                        )
                      }
                    })()
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-semibold text-lg">{order.shipping_address.name || order.customer_name}</p>
                        <p className="text-gray-600">{order.shipping_address.line1}</p>
                        {order.shipping_address.line2 && <p className="text-gray-600">{order.shipping_address.line2}</p>}
                        <p className="text-gray-600">
                          <strong>{order.shipping_address.postal_code}</strong> {order.shipping_address.city}
                        </p>
                        {order.shipping_address.state && order.shipping_address.state !== order.shipping_address.city && (
                          <p className="text-gray-600">{order.shipping_address.state}</p>
                        )}
                        <p className="text-gray-900 font-medium">{order.shipping_address.country}</p>
                        {(order.shipping_address.phone || order.customer_phone) && (
                          <p className="text-gray-600 text-sm mt-2">
                            📞 {order.shipping_address.phone || order.customer_phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-600">⚠️ Endereço de entrega não disponível.</p>
                  <p className="text-sm text-yellow-500 mt-1">Esta encomenda pode precisar de verificação manual.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Ações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Reenviar email de confirmação
                    fetch("/api/admin/resend-confirmation-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderId: order.id })
                    }).then(() => {
                      toast({
                        title: "Email enviado",
                        description: "Email de confirmação reenviado para o cliente."
                      })
                    })
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reenviar Confirmação
                </Button>
                
                {status === "shipped" && trackingNumber && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={sendShippingEmail}
                    disabled={isSendingEmail}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {isSendingEmail ? "Enviando..." : "Enviar Email de Tracking"}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Enviar email personalizado
                    const message = prompt("Digite a mensagem para o cliente:")
                    if (message) {
                      fetch("/api/admin/send-custom-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          orderId: order.id, 
                          message,
                          customerEmail: order.email,
                          customerName: order.customer_name
                        })
                      }).then(() => {
                        toast({
                          title: "Email enviado",
                          description: "Mensagem personalizada enviada para o cliente."
                        })
                      })
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Mensagem Personalizada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
