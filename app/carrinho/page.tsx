"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight, Loader2, ArrowLeft, Minus, Plus, X, CreditCard, Shield, Truck, Check, Tag, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { ClientAnimationWrapper } from "@/components/client-animation-wrapper"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { useCartPayment } from "@/hooks/use-cart-payment"

export default function CarrinhoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, discountCode, setDiscountCode, appliedDiscount, setAppliedDiscount, promotionDiscount, getPromotionInfo } = useCart()
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showMBWayModal, setShowMBWayModal] = useState(false)
  const [discountError, setDiscountError] = useState("")
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Converter carrinho para formato do hook de pagamento
  const cartItems = cart.map(item => {
    // Calcular custo da personalização (mesmo cálculo do backend)
    // Capas têm personalização GRATUITA
    let personalizationCost = 0
    if (item.personalizacao?.ativar && item.categoria !== 'capas') {
      if (item.personalizacao.nome || item.personalizacao.numero) personalizationCost += 3
      personalizationCost += (item.personalizacao.patches || []).length * 1
    }
    
    return {
      id: item.id,
      name: item.nome,
      price: item.preco + personalizationCost, // Incluir custo da personalização
      quantity: item.quantidade,
      size: item.tamanhoSelecionado,
      customization: item.personalizacao?.ativar ? {
        name: item.personalizacao.nome,
        number: item.personalizacao.numero?.toString(),
        patches: item.personalizacao.patches || []
      } : undefined,
      isPersonalized: !!(item.personalizacao?.ativar && (item.personalizacao.nome || item.personalizacao.numero))
    }
  })

  // Preparar descontos para o hook
  const discounts = []
  if (appliedDiscount?.amount) {
    discounts.push({
      label: appliedDiscount.code || 'Discount',
      amount: appliedDiscount.amount
    })
  }
  if (promotionDiscount > 0) {
    discounts.push({
      label: 'Buy 4 Pay 3',
      amount: promotionDiscount
    })
  }

  // Hook de pagamento
  const paymentResult = useCartPayment(cartItems, discounts)
  const paymentState = paymentResult?.paymentState ?? {
    method: "online" as const,
    hasPersonalizedItems: false,
    subtotalOriginal: 0,
    totalDiscounts: 0,
    subtotalWithDiscounts: 0,
    shipping: 0,
    total: 0
  }
  const getPaymentSummary = paymentResult?.getPaymentSummary ?? (() => ({
    method: "Online Payment",
    description: "Pay securely with credit/debit card",
    total: 0,
    breakdown: []
  }))
  const hasPersonalizedItems = paymentResult?.hasPersonalizedItems ?? false

  // Remover useEffect desnecessário - o hook já gerencia o estado

  // Preencher o email com o do usuário autenticado
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  // Aplicar código de desconto automaticamente da URL
  useEffect(() => {
    if (typeof window !== 'undefined' && !appliedDiscount) {
      const urlParams = new URLSearchParams(window.location.search)
      const urlDiscountCode = urlParams.get('discount') || urlParams.get('d')
      if (urlDiscountCode && !discountCode) {
        setDiscountCode(urlDiscountCode.toUpperCase())
        // Aplicar automaticamente
        applyDiscountFromUrl(urlDiscountCode.toUpperCase())
      }
    }
  }, [appliedDiscount, discountCode])

  // Função para aplicar desconto automaticamente da URL
  const applyDiscountFromUrl = async (code: string) => {
    try {
      const res = await fetch("/api/partners/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (data.valid) {
        const partnerPercent = 10 // 10% para parceiros
        const currentSubtotal = paymentState?.subtotalOriginal ?? 0
        setAppliedDiscount({ 
          code: data.code, 
          amount: (currentSubtotal * partnerPercent) / 100, 
          percentage: partnerPercent 
        })
        setDiscountError("")
        toast({
          title: "Code applied automatically!",
          description: `Code ${data.code} applied from URL`,
        })
      }
    } catch (error) {
      console.error("Error applying discount from URL:", error)
    }
  }

  // Função para gerar uma chave única que inclui personalização
  const generateItemKey = (id: string, tamanhoSelecionado: string, personalizacao?: any) => {
    let key = `${id}-${tamanhoSelecionado}`
    
    if (personalizacao?.ativar) {
      if (personalizacao.nome || personalizacao.numero) {
        key += `-${personalizacao.nome || ''}-${personalizacao.numero || ''}`
      }
      if (personalizacao.fonte) {
        key += `-${personalizacao.fonte}`
      }
      if (personalizacao.patches && personalizacao.patches.length > 0) {
        const sortedPatches = [...personalizacao.patches].sort()
        key += `-${sortedPatches.join('-')}`
      }
    }
    
    return key
  }

  // Usar valores do hook de pagamento
  const subtotal = paymentState?.subtotalOriginal ?? 0
  const envio = paymentState?.shipping ?? 0
  const total = paymentState?.total ?? 0
  const totalDiscounts = paymentState?.totalDiscounts ?? 0
  
  const totalItems = cart.length > 0 ? cart.reduce((total, item) => total + item.quantidade, 0) : 0
  const promotionInfo = getPromotionInfo() ?? { applied: false, savedAmount: 0, freeItems: 0 }
  const camisolaCount = cart.filter(item => item.subcategoria !== "sneakers" && item.categoria !== "capas").reduce((sum, item) => sum + item.quantidade, 0)
  // Lógica igual ao backend: se compra >= 68€, desconto fixo de 7€, senão 10%
  const partnerHasFixed = appliedDiscount?.code ? subtotal >= 68 : false
  const discountValue = appliedDiscount?.code
    ? partnerHasFixed
      ? 7
      : Number((((subtotal ?? 0) * 10) / 100).toFixed(2))
    : 0

  const handleQuantityChange = (id: string, tamanhoSelecionado: string, quantidade: number, personalizacao?: any) => {
    if (quantidade <= 0) {
      // Se a quantidade for zero ou negativa, remover o item
      removeFromCart(id, tamanhoSelecionado, personalizacao)
    } else {
      // Caso contrário, atualizar a quantidade
      updateQuantity(id, tamanhoSelecionado, quantidade, personalizacao)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError("")
  }

  const validateEmailField = () => {
    if (!email) {
      setEmailError("Please enter your email")
      return false
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email")
      return false
    }
    return true
  }

  const handleCheckout = async () => {
    if (!validateEmailField()) {
      return
    }

    setIsLoading(true)

    try {
      toast({
        title: "Processing",
        description: "Preparing your checkout...",
      })

      // Verificar se o carrinho está vazio
      if (cart.length === 0) {
        throw new Error("Cart is empty")
      }

      // Process online payment (Stripe)
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart,
          customerEmail: email,
          discountCode: (discountCode && discountCode.trim()) ? discountCode.trim() : (appliedDiscount?.code || null),
          promotionInfo: promotionInfo,
        }),
      })

      // Verificar se a resposta é OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response not OK:", response.status, errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      // Analisar a resposta JSON
      let data
      try {
        data = await response.json()
      } catch (e) {
        console.error("Error parsing JSON:", e)
        throw new Error("Error processing server response")
      }

      // Verificar se há erro na resposta
      if (data.error) {
        console.error("Error in response:", data.error)
        throw new Error(data.error)
      }

      // Verificar se a URL está presente
      if (!data.url) {
        console.error("URL missing in response:", data)
        throw new Error("Checkout URL not received")
      }

      // Verificar se a URL é válida
      if (typeof data.url !== "string" || !isValidUrl(data.url)) {
        console.error("Invalid URL:", data.url)
        throw new Error("Invalid checkout URL")
      }

      console.log("Redirecting to:", data.url)

      // Usar window.location.href para garantir um redirecionamento completo
      window.location.href = data.url
    } catch (error: any) {
      console.error("Error processing order:", error)
      toast({
        title: "Error processing",
        description: error.message || "An error occurred while processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para validar se uma string é uma URL válida
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  }

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value)
    setDiscountError("")
  }

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code")
      return
    }

    setIsValidatingDiscount(true)
    try {
      const res = await fetch("/api/partners/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode.trim() })
      })
      const data = await res.json()
      if (!data.valid) {
        setDiscountError(data.error || "Invalid code")
        return
      }

      const code = String(data.code).toUpperCase()
      const currentSubtotal = paymentState?.subtotalOriginal ?? 0
      const isFixed = currentSubtotal >= 68
      const discountAmount = isFixed ? 7 : (currentSubtotal * 10) / 100
      setAppliedDiscount({ code, amount: discountAmount, percentage: isFixed ? 0 : 10 })
      setDiscountError("")
      toast({
        title: "Code applied!",
        description: `Code ${code} validated${isFixed ? " (fixed discount €7)" : " (10%)"}`,
      })
    } catch (e) {
      setDiscountError("Error validating code. Please try again.")
    } finally {
      setIsValidatingDiscount(false)
    }
  }

  const removeDiscountCode = () => {
    setDiscountCode("")
    setAppliedDiscount(null)
    setDiscountError("")
    toast({
      title: "Code removed",
      description: "The discount code has been removed from the cart",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Hero Section */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl md:animate-pulse motion-reduce:animate-none" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl md:animate-pulse motion-reduce:animate-none delay-1000" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <ClientAnimationWrapper delay={0.1} className="animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full p-2 hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span>Back</span>
            </div>
          </ClientAnimationWrapper>

          {/* Header */}
          <ClientAnimationWrapper delay={0.2} className="animate-slide-up">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Shopping Cart</h1>
              <p className="text-lg text-muted-foreground">
                {cart.length === 0 
                  ? "Your cart is empty" 
                  : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
                }
              </p>
            </div>
          </ClientAnimationWrapper>

      {cart.length === 0 ? (
            // Empty Cart State
            <ClientAnimationWrapper delay={0.3} className="animate-scale-in">
              <div className="glass-effect rounded-3xl p-16 text-center shadow-modern max-w-2xl mx-auto">
                <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8 text-lg">Discover our collection of official jerseys</p>
                <Link href="/catalogo">
                  <Button className="px-8 py-4 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Explore Products
          </Button>
                </Link>
        </div>
            </ClientAnimationWrapper>
      ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
          <div className="lg:col-span-2">
                <ClientAnimationWrapper delay={0.3} className="animate-slide-up">
                  <div className="glass-effect rounded-3xl p-8 shadow-modern">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-foreground">Cart Items</h2>
                      <Button 
                        variant="ghost" 
                        onClick={clearCart}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cart
                      </Button>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-3 lg:space-y-6">
                      {cart.map((item, index) => {
                        const itemKey = generateItemKey(item.id, item.tamanhoSelecionado, item.personalizacao)
                        return (
                          <ClientAnimationWrapper
                            key={itemKey}
                            delay={0.1 + index * 0.1}
                            className="animate-fade-in"
                          >
                            <div className="glass-effect rounded-2xl p-3 lg:p-6 border border-border shadow-modern bg-card text-card-foreground">
                              <div className="flex gap-3 lg:gap-6">
                                {/* Product Image - More visible */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedImage({ src: item.imagem, alt: item.nome })
                                  }}
                                  className="relative w-20 h-20 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity group"
                                  aria-label={`Ver imagem de ${item.nome} em grande`}
                                >
                              <Image
                                src={item.imagem}
                                alt={item.nome}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                              />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col gap-2 lg:gap-4">
                                    <div className="flex-1">
                                      <Link href={`/produto/${item.id}`}>
                                        <h3 className="text-sm lg:text-lg font-semibold text-foreground mb-1 lg:mb-2 truncate hover:text-primary transition-colors cursor-pointer">{item.nome}</h3>
                                      </Link>
                                      <div className="space-y-1 text-xs lg:text-sm text-muted-foreground">
                                        <div className="flex gap-4">
                                        <p>Size: <span className="font-medium text-foreground">{item.tamanhoSelecionado?.replace(' anos', ' years') || item.tamanhoSelecionado}</span></p>
                                          <p>Qty: <span className="font-medium text-foreground">{item.quantidade}</span></p>
                                        </div>
                                        
                                        {/* Personalization Details - More compact on mobile */}
                              {item.personalizacao?.ativar && (
                                          <div className="mt-2 p-2 lg:p-3 bg-accent rounded-lg border border-border">
                                            <h4 className="font-medium text-foreground mb-1 text-xs lg:text-sm">Customization:</h4>
                                            <div className="text-xs lg:text-sm space-y-1 text-foreground">
                                              {item.personalizacao.cor && (
                                                <p>Color: <span className="font-semibold">{item.personalizacao.cor}</span></p>
                                              )}
                                              {item.personalizacao.padrao && (
                                                <p>Pattern: <span className="font-semibold">{item.personalizacao.padrao}</span></p>
                                              )}
                                              {item.personalizacao.nome && (
                                                <p>Name: {item.personalizacao.nome}</p>
                                              )}
                                              {item.personalizacao.numero && (
                                                <p>Number: {item.personalizacao.numero}</p>
                                              )}
                                              {item.personalizacao.fonte && (
                                                <p>Font: {
                                                  item.personalizacao.fonte === "liga-betclic" ? "LIGA BETCLIC" :
                                                  item.personalizacao.fonte === "clube" ? "CLUBE" :
                                                  item.personalizacao.fonte === "champions-liga-europa" ? "CHAMPIONS / LIGA EUROPA" :
                                                  item.personalizacao.fonte
                                                }</p>
                                              )}
                                              {item.personalizacao.patches && item.personalizacao.patches.length > 0 && (
                                                <p>Patches: {item.personalizacao.patches.map(patch => {
                                                  const patchNames: { [key: string]: string } = {
                                                    "diogo-jota": "Diogo Jota",
                                                    "diogo-jota-manga": "Diogo Jota Manga",
                                                    "portugal": "Campeão Português",
                                                    "liga": "Campeão Liga Portuguesa",
                                                    "champions": "Champions League",
                                                    "betclic": "Liga Portugal Betclic",
                                                    "premier-champion-gold": "Campeão Premier League",
                                                    "premier-league-blue": "Premier League",
                                                    "no-room-racism": "No Room for Racism",
                                                    "la-liga": "La Liga",
                                                    "la-liga-24-25": "La Liga 24/25",
                                                    "ligue-1-black": "Ligue 1 Preto",
                                                    "ligue-1": "Ligue 1",
                                                    "ligue-1-2025": "Ligue 1 2025",
                                                    "bundesliga": "Bundesliga",
                                                    "serie-a-enilive": "2024-26 Patch Serie A Enilive",
                                                    "serie-a-tim": "23/24 Patch Serie A TIM"
                                                  }
                                                  return patchNames[patch] || patch
                                                }).join(', ')}</p>
                                              )}
                                            </div>
                                </div>
                              )}
                            </div>
                                    </div>

                                    {/* Price and Controls - Different layout for mobile and desktop */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-2">
                                      {/* Mobile: Price on top, then controls */}
                                      {/* Desktop: Controls on left, price on right */}
                                      
                                      {/* Item Price - Full width on mobile, right-aligned on desktop */}
                                      <div className="flex flex-col lg:items-end gap-1.5 w-full lg:min-w-[120px] lg:text-right">
                                        {/* Base Price */}
                                        <div className="flex flex-col lg:items-end">
                                          <p className="text-xs text-muted-foreground">
                                            Base: €{((item.preco ?? 0) * (item.quantidade ?? 0)).toFixed(2)}
                                          </p>
                                          {/* Personalization Costs - Show separately */}
                                          {item.personalizacao?.ativar && item.categoria !== 'capas' && (() => {
                                            let detalhes = [];
                                            
                                            // Customization cost (name and number)
                                            if (item.personalizacao.nome || item.personalizacao.numero) {
                                              detalhes.push(`€${(3 * (item.quantidade ?? 0)).toFixed(2)} customization`);
                                            }
                                            
                                            // Patches cost
                                            if (Array.isArray(item.personalizacao?.patches) && item.personalizacao.patches.length > 0) {
                                              const patchCost = item.personalizacao.patches.length * 1 * (item.quantidade ?? 0);
                                              detalhes.push(`€${patchCost.toFixed(2)} patches`);
                                            }
                                            
                                            return detalhes.length > 0 ? (
                                              <div className="flex flex-col lg:items-end gap-0.5 mt-0.5">
                                                {detalhes.map((detail, idx) => (
                                                  <p key={idx} className="text-xs text-muted-foreground">
                                                    + {detail}
                                                  </p>
                                                ))}
                                              </div>
                                            ) : null;
                                          })()}
                                        </div>
                                        
                                        {/* Total Price */}
                                        <p className="text-lg lg:text-xl font-bold text-primary border-t border-border pt-1.5 w-full lg:text-right">
                                          €{(() => {
                                            let itemTotal = (item.preco ?? 0) * (item.quantidade ?? 0);
                                            
                                            // Capas têm personalização GRATUITA
                                            if (item.personalizacao?.ativar && item.categoria !== 'capas') {
                                              // Custo da personalização (nome e número) - só se tiver nome OU número
                                              if (item.personalizacao.nome || item.personalizacao.numero) {
                                                itemTotal += 3 * (item.quantidade ?? 0);
                                              }
                                              
                                              // Custo dos patches - 1€ por patch
                                              if (Array.isArray(item.personalizacao?.patches) && item.personalizacao.patches.length > 0) {
                                                itemTotal += item.personalizacao.patches.length * 1 * (item.quantidade ?? 0);
                                              }
                                            }
                                            
                                            return (itemTotal ?? 0).toFixed(2);
                                          })()}
                                        </p>
                                      </div>

                                      {/* Controls - Quantity and Remove */}
                                      <div className="flex items-center justify-between lg:justify-start gap-2">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleQuantityChange(item.id, item.tamanhoSelecionado, item.quantidade - 1, item.personalizacao)
                                            }}
                                            disabled={item.quantidade <= 1}
                                            className="w-7 h-7 lg:w-8 lg:h-8 p-0 rounded-full"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="font-medium text-gray-900 w-6 lg:w-8 text-center text-sm lg:text-base">{item.quantidade}</span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleQuantityChange(item.id, item.tamanhoSelecionado, item.quantidade + 1, item.personalizacao)
                                            }}
                                            className="w-7 h-7 lg:w-8 lg:h-8 p-0 rounded-full"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            removeFromCart(item.id, item.tamanhoSelecionado, item.personalizacao)
                                          }}
                                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 lg:p-2"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ClientAnimationWrapper>
                        )
                      })}
                    </div>


                  </div>
                </ClientAnimationWrapper>
                </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <ClientAnimationWrapper delay={0.3} className="animate-slide-in-right">
                    <div className="glass-effect rounded-3xl p-8 shadow-modern bg-card text-card-foreground border border-border">
                      <h2 className="text-2xl font-bold text-foreground mb-8">Order Summary</h2>
                      
                      {/* Order Details */}
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal ({cart.reduce((total, item) => total + item.quantidade, 0)} {cart.reduce((total, item) => total + item.quantidade, 0) === 1 ? 'item' : 'items'})</span>
                          <span className="font-medium text-foreground">€{(subtotal ?? 0).toFixed(2)}</span>
            </div>

                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          {envio === 0 ? (
                          <span className="font-medium text-primary">Free</span>
                          ) : (
                            <span className="font-medium text-foreground">€{(envio ?? 0).toFixed(2)}</span>
                          )}
          </div>
                        
                        {/* Shipping Info */}
                        {envio > 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            💡 <strong>Free shipping</strong> from 3 products or orders above €68! Add {3 - totalItems} more {3 - totalItems === 1 ? 'product' : 'products'} or €{Math.max(0, 68 - (subtotal ?? 0)).toFixed(2)} for free shipping.
                          </div>
                        )}
                        
                        {envio === 0 && totalItems >= 3 && (
                          <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                            🎉 <strong>Congratulations!</strong> You have free shipping for 3 or more products or orders above €68!
                          </div>
                        )}

                        {/* Promoção Leva 4 Paga 3 */}
                        {promotionInfo?.applied && (
                          <div className="text-xs text-primary bg-accent border border-border rounded-lg p-3">
                            🎁 <strong>Active Promotion!</strong> Buy 4 jerseys pay for 3 - {promotionInfo?.freeItems ?? 0} {(promotionInfo?.freeItems ?? 0) === 1 ? 'free jersey' : 'free jerseys'}!
                          </div>
                        )}

                        {/* Informação sobre promoção quando não aplicada */}
                        {!promotionInfo?.applied && totalItems > 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            🔥 <strong>Buy 4 Pay 3 Promotion!</strong> Applies only to jerseys. Add {4 - (camisolaCount % 4)} more {4 - (camisolaCount % 4) === 1 ? 'jersey' : 'jerseys'} to get 1 free item!
                          </div>
                        )}

                        {/* Discount Code Section */}
                        <div className="border-t border-border pt-4">
                          <div className="mb-4">
                            <Label htmlFor="discount-code" className="text-sm font-semibold text-foreground mb-2 block">
                              Discount Code
                            </Label>
                            {!appliedDiscount ? (
                              <div className="flex gap-2">
                                <Input
                                  id="discount-code"
                                  type="text"
                                  placeholder={"Enter discount code"}
                                  value={discountCode}
                                  onChange={handleDiscountCodeChange}
                                  className={`flex-1 ${discountError ? 'border-red-500' : 'border-border'} rounded-lg`}
                                />
                                <Button
                                  onClick={validateDiscountCode}
                                  disabled={isValidatingDiscount || !discountCode.trim()}
                                  className={`px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground`}
                                >
                                  {isValidatingDiscount ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Tag className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-3 bg-accent border border-border rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium text-foreground">
                                    {appliedDiscount.code}
                                  </span>
                                </div>
                                <Button
                                  onClick={removeDiscountCode}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {discountError && (
                              <p className="text-red-500 text-sm mt-1">{discountError}</p>
                            )}
                            {appliedDiscount?.code && (
                              <p className="text-primary text-sm mt-1">
                                Code {appliedDiscount.code} applied: {partnerHasFixed ? "fixed discount €7" : "10% discount"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Discount Applied */}
                        {appliedDiscount && (
                          <div className="flex justify-between text-primary">
                            <span>Partner discount {partnerHasFixed ? "(fixed)" : "(10%)"}</span>
                            <span className="font-medium">-€{(discountValue ?? 0).toFixed(2)}</span>
                          </div>
                        )}

                        {/* Promotion Applied */}
                        {promotionInfo?.applied && (
                          <div className="flex justify-between text-purple-600">
                            <span>Buy 4 Pay 3 Promotion - Jerseys ({promotionInfo?.freeItems ?? 0} {(promotionInfo?.freeItems ?? 0) === 1 ? 'free jersey' : 'free jerseys'})</span>
                            <span className="font-medium">-€{((promotionInfo?.savedAmount ?? 0)).toFixed(2)}</span>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          {totalDiscounts > 0 && (
                          <div className="flex justify-between text-muted-foreground mb-2">
                              <span>Total discounts</span>
                              <span className="font-medium">-€{(totalDiscounts ?? 0).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xl font-bold text-foreground">
                            <span>Total</span>
                            <span className="text-primary">€{(total ?? 0).toFixed(2)}</span>
                  </div>
                  </div>
                  </div>

                      {/* Security Features */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-2 p-3 bg-accent rounded-xl">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-foreground">Secure Payment</span>
                    </div>
                        <div className="flex items-center gap-2 p-3 bg-accent rounded-xl">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-foreground">SSL Protected</span>
                  </div>
                </div>


                      {/* Payment Method Selection */}
                      <div className="mb-6">
                        <PaymentMethodSelector
                          onCheckout={handleCheckout}
                          isLoading={isLoading}
                          email={email}
                          onEmailChange={setEmail}
                          emailError={emailError}
                        />
                      </div>

                      <div className="text-center">
                          <Link href="/catalogo">
                            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-accent rounded-xl">
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              Continue Shopping
                            </Button>
                          </Link>
                  </div>
                </div>
                  </ClientAnimationWrapper>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none"
          >
            <div className="relative bg-white rounded-lg p-2 sm:p-4 max-w-[95vw] max-h-[95vh] pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20 bg-black hover:bg-gray-800 text-white rounded-full p-1.5 sm:p-2 transition-colors shadow-lg"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={1200}
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded"
                sizes="(max-width: 768px) 95vw, 90vw"
                quality={95}
              />
            </div>
          </div>
        </div>
      )}

      {/* MB WAY Modal */}
      {showMBWayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Image 
                  src="/images/logo-mbway-1536x960.png" 
                  alt="MB WAY" 
                  width={50} 
                  height={30}
                  className="h-8 w-auto object-contain"
                />
                <h2 className="text-2xl font-bold text-gray-900">MB WAY Payment</h2>
              </div>
              <button
                onClick={() => setShowMBWayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">How does it work?</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <p className="text-sm text-yellow-800">Complete your order normally and <strong>select the Multibanco option</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <p className="text-sm text-yellow-800">Your order will be <strong>registered in the system</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <p className="text-sm text-yellow-800">Then, send a message to our <strong>TikTok or fanzone12.com</strong> requesting MB WAY payment.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <p className="text-sm text-yellow-800">We will send you the <strong>MB WAY payment details</strong> via message!</p>
                  </div>
                </div>

                {/* Email Field for MB WAY */}
                <div className="mb-6 p-4 bg-white rounded-xl border border-yellow-300">
                  <Label htmlFor="mbway-email" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Email for confirmation *
                  </Label>
                  <Input
                    id="mbway-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    You will receive the order confirmation at this email
                  </p>
                </div>

                {/* Social Media Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <a 
                    href="https://tiktok.com/@fanzone12.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    <span className="text-xs">TikTok</span>
                  </a>
                  <a 
                    href="https://instagram.com/fanzone12.pt__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                      <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-xs">fanzone12.pt__</span>
                  </a>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61582728350804" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs">Facebook</span>
                  </a>
                  <a 
                    href="https://wa.me/351934244455" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span className="text-xs">WhatsApp</span>
                  </a>
                </div>

                {/* Important Note */}
                <div className="bg-yellow-200 border border-yellow-300 rounded-xl p-4 mb-6">
                  <p className="text-xs text-yellow-800 text-center">
                    <strong>Attention:</strong> We can only register the order if you choose <strong>Multibanco</strong> at checkout!
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Checkout Button */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMBWayModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowMBWayModal(false)
                    handleCheckout()
                  }}
                  disabled={isLoading || cart.length === 0}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
