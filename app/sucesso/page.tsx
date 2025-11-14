"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, ShoppingBag, Package, Printer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Script from "next/script" // ✅ Adicionado

interface OrderItem {
  name: string
  price: number
  quantity: number
  size: string
  customization?: string
}

export default function SucessoPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("payment")
  const orderParam = searchParams.get("order")
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [orderNumber, setOrderNumber] = useState<string>("")
  const orderNumberGenerated = useRef(false)
  const [orderDate, setOrderDate] = useState<string>("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orderTotal, setOrderTotal] = useState<number>(0)
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [customerEmail, setCustomerEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const dataFetched = useRef(false)
  const [isUpfrontPayment, setIsUpfrontPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  // Efeito para buscar detalhes da sessão do Stripe
  useEffect(() => {
    if (!sessionId && !orderParam) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Sessão de pagamento não encontrada.",
      })
      setIsLoading(false)
      return;
    }

    if (dataFetched.current) {
      return;
    }

    const fetchSessionDetails = async () => {
      try {
        dataFetched.current = true;
        
        // Verificar se é um pagamento antecipado
        console.log("=== VERIFICANDO PAGAMENTO ANTECIPADO ===")
        console.log("Payment type:", paymentType)
        console.log("Order param:", orderParam)
        console.log("Session ID:", sessionId)
        console.log("URL completa:", typeof window !== 'undefined' ? window.location.href : 'SSR')
        
        // Buscar dados do pedido usando session_id
        if (sessionId) {
          console.log("=== BUSCANDO DADOS DO PEDIDO ===")
          console.log("Session ID:", sessionId)
          
          const response = await fetch(`/api/orders/session/${sessionId}`)
          console.log("Response status:", response.status)
          
          if (!response.ok) {
            console.error("Erro ao buscar pedido:", response.status, response.statusText)
            throw new Error("Falha ao buscar dados do pedido")
          }

          const orderData = await response.json()
          console.log("Dados do pedido recebidos:", orderData)
          
          if (!orderData) {
            throw new Error("Dados do pedido inválidos")
          }

          setOrderNumber(orderData.order_number || "")
          setCustomerEmail(orderData.customer_email || "")
          setOrderDate(new Date(orderData.created_at).toLocaleDateString("pt-PT") + " " + 
                      new Date(orderData.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }))
          
          // Definir método de pagamento baseado nos dados do pedido
          console.log("=== DADOS DO PEDIDO PARA MÉTODO DE PAGAMENTO ===")
          console.log("Payment method from DB:", orderData.payment_method)
          console.log("Upfront payment:", orderData.upfront_payment)
          console.log("Remaining payment:", orderData.remaining_payment)
          
          if (orderData.payment_method === 'cash_on_delivery') {
            setPaymentMethod('Pagamento à Cobrança')
            setIsUpfrontPayment(true)
            console.log("✅ Definido como Pagamento à Cobrança")
          } else {
            setPaymentMethod('Pagamento Online')
            setIsUpfrontPayment(false)
            console.log("✅ Definido como Pagamento Online")
          }
          
          // Processar itens do pedido
          const items = orderData.order_items?.map((item: any) => ({
            name: item.product_name,
            price: item.unit_price,
            quantity: item.quantity,
            size: item.size || "M",
            customization: item.customization,
          })) || []

          console.log("Itens processados:", items)
          setOrderItems(items)
          setOrderTotal(orderData.total_amount || 0)
          setShippingCost(orderData.shipping_cost || 0)

          // Limpar o carrinho após confirmar que o pagamento foi bem-sucedido
          clearCart()
          setIsLoading(false)
          return
        }
        
        // Buscar detalhes da sessão do Stripe (pagamento normal)
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`)
        if (!response.ok) {
          throw new Error("Falha ao buscar detalhes da sessão")
        }

        const session = await response.json()
        if (!session || !session.line_items?.data) {
          throw new Error("Dados da sessão inválidos")
        }

        // Verificar se já existe um número de pedido para esta sessão
        if (!orderNumberGenerated.current) {
          const storedOrderNumber = localStorage.getItem(`order_number_${sessionId}`)
          if (storedOrderNumber) {
            setOrderNumber(storedOrderNumber)
          } else {
            const newOrderNumber = Math.floor(100000 + Math.random() * 900000).toString()
            localStorage.setItem(`order_number_${sessionId}`, newOrderNumber)
            setOrderNumber(newOrderNumber)
          }
          orderNumberGenerated.current = true
        }

        // Atualizar o estado com os dados da sessão
        setCustomerEmail(session.customer_details?.email || "")
        setOrderDate(new Date(session.created * 1000).toLocaleDateString("pt-PT") + " " + 
                    new Date(session.created * 1000).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }))
        
        // Definir método de pagamento baseado na sessão do Stripe
        console.log("=== DADOS DA SESSÃO STRIPE ===")
        console.log("Session metadata:", session.metadata)
        console.log("Payment method from metadata:", session.metadata?.payment_method)
        
        if (session.metadata?.payment_method === 'cash_on_delivery') {
          setPaymentMethod('Pagamento à Cobrança')
          setIsUpfrontPayment(true)
          console.log("✅ Definido como Pagamento à Cobrança (via metadata)")
        } else {
          setPaymentMethod('Pagamento Online')
          setIsUpfrontPayment(false)
          console.log("✅ Definido como Pagamento Online (via metadata)")
        }
        
        // Processar itens do pedido
        const items = session.line_items.data.map((item: any) => {
          const description = item.description || ""
          const size = description.match(/Tamanho: ([A-Z]+)/)?.[1] || "M"
          const customization = description.includes("Personalização")
            ? description.match(/Personalização: (.+?)(?:,|$)/)?.[1]
            : undefined

          return {
            name: description.split("Tamanho:")[0].trim(),
            price: item.amount_total / 100,
            quantity: item.quantity,
            size,
            customization,
          }
        })

        setOrderItems(items)
        setOrderTotal(session.amount_subtotal / 100)
        setShippingCost(session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0)

        // Limpar o carrinho após confirmar que o pagamento foi bem-sucedido
        clearCart()
        setIsLoading(false)

      } catch (error) {
        console.error("Erro ao buscar detalhes da sessão:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes do pedido.",
        })
        setIsLoading(false)
        dataFetched.current = false
      }
    }

    fetchSessionDetails()
  }, [sessionId, orderParam, paymentType, clearCart, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {/* ✅ Meta Pixel Purchase Event */}
      {orderNumber && orderTotal > 0 && (
        <Script id="meta-pixel-purchase" strategy="afterInteractive">
          {`
            if (typeof window.fbq !== 'undefined') {
              window.fbq('track', 'Purchase', {
                value: ${orderTotal + shippingCost},
                currency: 'EUR'
              });
            }
          `}
        </Script>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-accent p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Pedido Confirmado!</h1>
          <p className="text-xl text-muted-foreground">
            {isUpfrontPayment 
              ? 'Obrigado! Pagou 8€ antecipadamente. O restante será cobrado na entrega.'
              : 'Obrigado pela sua compra. O seu pedido foi recebido e está a ser processado.'
            }
          </p>
        </div>

        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Detalhes do Pedido</h2>
                <p className="text-muted-foreground">Enviámos um email de confirmação para {customerEmail}</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                <div className="text-sm text-muted-foreground">Número do Pedido</div>
                <div className="font-semibold">{orderNumber}</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data do Pedido</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado do Pedido</span>
                <span className="bg-accent text-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                  Pagamento Confirmado
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método de Pagamento</span>
                <span>{paymentMethod || (isUpfrontPayment ? 'Pagamento à Cobrança (8€ antecipados)' : 'Pagamento Online')}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <h3 className="font-medium mb-3">Itens do Pedido</h3>
            <div className="space-y-3 mb-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Tamanho: {item.size} • Quantidade: {item.quantity}
                      {item.customization && ` • Personalização: ${item.customization}`}
                    </div>
                  </div>
                  <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{orderTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envio</span>
                <span>{shippingCost.toFixed(2)} €</span>
              </div>
              {isUpfrontPayment && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Pago Antecipadamente</span>
                    <span>8.00 €</span>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Restante à Cobrança</span>
                    <span>{(orderTotal + shippingCost - 8).toFixed(2)} €</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span className="text-primary">{(orderTotal + shippingCost).toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Informações de Envio</h3>
              </div>
              <p className="text-muted-foreground mb-2">Prazo estimado de entrega: 7-12 dias úteis</p>
              <p className="text-muted-foreground">
                Você receberá um email com o código de rastreio assim que o seu pedido for expedido.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Printer className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Precisa de Ajuda?</h3>
              </div>
              <p className="text-muted-foreground mb-3">Se tiver alguma dúvida sobre o seu pedido, entre em contacto connosco.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/contacto">Contactar Suporte</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/catalogo">
              <Package className="mr-2 h-5 w-5" />
              Ver Catálogo
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/catalogo">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
