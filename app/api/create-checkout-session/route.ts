import { NextResponse } from "next/server"
import Stripe from "stripe"
import type { CartItem } from "@/lib/types"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as Stripe.LatestApiVersion,
})

// Função para garantir que a URL seja absoluta e válida
function ensureValidUrl(url: string | undefined): string {
  // Se a URL for undefined ou vazia, usar um domínio padrão
  if (!url || url.trim() === "") {
    return "https://www.fanzone12.com"
  }

  // Se a URL já começar com http:// ou https://, está correta
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // Caso contrário, adicionar https://
  return `https://${url}`
}

// Calcula a promoção "Leva 4 Paga 3" no servidor com base no carrinho (camisolas apenas)
function computePromotionInfo(cartItems: CartItem[]) {
  // Expandir camisolas por unidade, com preço total unitário (inclui personalização e patches)
  const expanded: number[] = []
  for (const item of cartItems) {
    if (item.subcategoria === "sneakers" || item.categoria === "capas") continue
    const patches = Array.isArray(item.personalizacao?.patches) ? item.personalizacao.patches : []
    let personalizationCost = 0
    // Capas têm personalização GRATUITA
    if (item.personalizacao?.ativar && item.categoria !== 'capas') {
      if (item.personalizacao.nome || item.personalizacao.numero) personalizationCost += 3
      personalizationCost += patches.length * 1
    }
    const unit = item.preco + personalizationCost
    for (let i = 0; i < (item.quantidade || 1); i++) expanded.push(unit)
  }

  if (expanded.length < 4) {
    return { applied: false, savedAmount: 0, freeItems: 0, camisolaCount: expanded.length }
  }

  // Ordenar crescente e escolher 1 grátis a cada 4 unidades
  expanded.sort((a, b) => a - b)
  const freeItems = Math.floor(expanded.length / 4)
  const savedAmount = expanded.slice(0, freeItems).reduce((sum, v) => sum + v, 0)
  return { applied: freeItems > 0, savedAmount, freeItems, camisolaCount: expanded.length }
}

export async function POST(request: Request) {
  try {
    const { cartItems, customerEmail, discountCode } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Obter a URL base do site e garantir que seja válida
    const siteUrl = ensureValidUrl(process.env.NEXT_PUBLIC_SITE_URL)

    console.log("URL base do site:", siteUrl)
    console.log("Criando sessão de checkout para:", customerEmail)

    // Validar código de parceiro contra a tabela partners
    let validPartnerCode: string | null = null
    if (typeof discountCode === 'string' && discountCode.trim().length > 0) {
      const code = discountCode.trim()
      const { data: partner, error } = await supabaseAdmin
        .from('partners')
        .select('id, discount_code')
        .ilike('discount_code', code)
        .single()
      if (!error && partner) {
        validPartnerCode = partner.discount_code
      }
    }

    // Promoção calculada no servidor (independente do client)
    const serverPromo = computePromotionInfo(cartItems)
    const hasCode = Boolean(validPartnerCode)
    const promotionActive = Boolean(serverPromo.applied && Number(serverPromo.savedAmount) > 0)

    // Subtotal dos itens (€) para distribuir o desconto combinado
    const itemsSubtotal = cartItems.reduce((total: number, item: CartItem) => {
      const patches = Array.isArray(item.personalizacao?.patches) ? item.personalizacao.patches : []
      let personalizationCost = 0
      // Capas têm personalização GRATUITA
      if (item.personalizacao?.ativar && item.categoria !== 'capas') {
        if (item.personalizacao.nome || item.personalizacao.numero) personalizationCost += 3
        personalizationCost += patches.length * 1
      }
      const unit = item.preco + personalizationCost
      const itemTotal = unit * item.quantidade
      
      
      return total + itemTotal
    }, 0)

     // Regra: se compra >= 68€, desconto fixo de 7€, senão 10%
     let partnerDiscountAmount = 0
     if (hasCode) {
       if (itemsSubtotal >= 68) {
         partnerDiscountAmount = 7
       } else {
         partnerDiscountAmount = (itemsSubtotal * 10) / 100
       }
     }

    const promoDiscountAmount = promotionActive ? Number(serverPromo.savedAmount) || 0 : 0
    const itemsSubtotalCents = Math.round(itemsSubtotal * 100)
    const totalDiscountCents = Math.min(Math.round((partnerDiscountAmount + promoDiscountAmount) * 100), itemsSubtotalCents)
    const discountRatio = itemsSubtotalCents > 0 ? totalDiscountCents / itemsSubtotalCents : 0

     console.log("=== DESCONTOS (SERVER) ===", {
       discountCode,
       validPartnerCode,
       promotionActive,
       serverPromo,
       itemsSubtotal: itemsSubtotal.toFixed(2),
       partnerDiscountAmount: partnerDiscountAmount.toFixed(2),
       promoDiscountAmount: promoDiscountAmount.toFixed(2),
       totalDiscountCents,
       itemsSubtotalCents,
       discountRatio,
     })
    
    // Debug adicional para verificar o cálculo
    console.log("=== DEBUG CÁLCULO DESCONTO ===")
    console.log("Items subtotal:", itemsSubtotal)
    console.log("Partner discount amount:", partnerDiscountAmount)
    console.log("Promo discount amount:", promoDiscountAmount)
    console.log("Total discount cents:", totalDiscountCents)
    console.log("Items subtotal cents:", itemsSubtotalCents)
    console.log("Discount ratio:", discountRatio)
    console.log("Expected total after discount:", (itemsSubtotal - (totalDiscountCents / 100)).toFixed(2))
    
    // Debug detalhado para cada item
    console.log("=== DEBUG ITENS INDIVIDUAIS ===")
    cartItems.forEach((item: CartItem, index: number) => {
      const patches = Array.isArray(item.personalizacao?.patches) ? item.personalizacao.patches : []
      let personalizationCost = 0
      // Capas têm personalização GRATUITA
      if (item.personalizacao?.ativar && item.categoria !== 'capas') {
        if (item.personalizacao.nome || item.personalizacao.numero) personalizationCost += 3
        personalizationCost += patches.length * 1
      }
      const unit = item.preco + personalizationCost
      const itemTotal = unit * item.quantidade
      console.log(`Item ${index + 1}: ${item.nome}`)
      console.log(`  Preço base: ${item.preco}`)
      console.log(`  Personalização: ${personalizationCost}`)
      console.log(`  Unit total: ${unit}`)
      console.log(`  Quantidade: ${item.quantidade}`)
      console.log(`  Item total: ${itemTotal}`)
    })

    // Criar os line items para o Stripe
    const lineItems = cartItems.map((item: CartItem, index: number): Stripe.Checkout.SessionCreateParams.LineItem => {
      const patches = Array.isArray(item.personalizacao?.patches) ? item.personalizacao.patches : []
      
      // Calcular custo da personalização usando a mesma lógica do carrinho
      // Capas têm personalização GRATUITA
      let personalizationCost = 0;
      if (item.personalizacao?.ativar && item.categoria !== 'capas') {
        // Só adiciona 3€ se tiver nome OU número
        if (item.personalizacao.nome || item.personalizacao.numero) {
          personalizationCost += 3;
        }
        // Adiciona 1€ por cada patch
        personalizationCost += patches.length * 1;
      }
      
      const unitAmount = Math.round((item.preco + personalizationCost) * 100)

      // Mapear os patches para os nomes corretos
      const patchNames = {
        portugal: "Campeão Português",
        liga: "Campeão Liga Portuguesa",
        champions: "Champions League",
        betclic: "Liga Portugal Betclic",
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
        "serie-a-tim": "23/24 Patch Serie A TIM",
        "diogo-jota": "Patch Diogo Jota Peito",
        "diogo-jota-manga": "Patch Diogo Jota Manga"
      }

      const patchDescriptions = patches.map(patch => 
        patchNames[patch as keyof typeof patchNames] || patch
      )

      // Criar string de personalização completa incluindo fonte, cor e padrão
      let personalizationString = ""
      if (item.personalizacao?.ativar) {
        const personalizationParts = []
        if (item.personalizacao.cor) personalizationParts.push(`Cor: ${item.personalizacao.cor}`)
        if (item.personalizacao.padrao) personalizationParts.push(`Padrão: ${item.personalizacao.padrao}`)
        if (item.personalizacao.nome) personalizationParts.push(item.personalizacao.nome)
        if (item.personalizacao.numero) personalizationParts.push(item.personalizacao.numero)
        if (item.personalizacao.fonte) {
          const fonteNames = {
            "liga-betclic": "LIGA BETCLIC",
            "clube": "CLUBE", 
            "champions-liga-europa": "CHAMPIONS / LIGA EUROPA"
          }
          personalizationParts.push(fonteNames[item.personalizacao.fonte] || item.personalizacao.fonte)
        }
        personalizationString = personalizationParts.join(" ")
      }

      // Criar descrição para exibição
      const description = [
        `Tamanho: ${item.tamanhoSelecionado || item.tamanho || "N/A"}`,
        personalizationString ? `Personalização: ${personalizationString}` : null,
        patchDescriptions.length > 0 ? `Patches: ${patchDescriptions.join(", ")}` : null
      ].filter(Boolean).join(", ")

      // Criar nome do produto com todas as informações (já que description não é preservada)
      const productName = [
        item.nome,
        `Tamanho: ${item.tamanhoSelecionado || item.tamanho || "N/A"}`,
        personalizationString ? `Personalização: ${personalizationString}` : null,
        patchDescriptions.length > 0 ? `Patches: ${patchDescriptions.join(", ")}` : null
      ].filter(Boolean).join(" - ")

      // Preparar metadados para o Stripe
      const productMetadata: { [key: string]: string } = {
        size: item.tamanhoSelecionado || item.tamanho || "M",
        product_id: item.id || ""
      }

      // Adicionar personalização aos metadados se existir
      if (item.personalizacao?.ativar) {
        if (personalizationString) {
          productMetadata.customization = personalizationString
        }
        
        if (item.personalizacao.cor) {
          productMetadata.cor = String(item.personalizacao.cor)
        }
        if (item.personalizacao.padrao) {
          productMetadata.padrao = String(item.personalizacao.padrao)
        }
        if (item.personalizacao.nome) {
          productMetadata.nome = String(item.personalizacao.nome)
        }
        if (item.personalizacao.numero) {
          productMetadata.numero = String(item.personalizacao.numero)
        }
        if (item.personalizacao.fonte) {
          productMetadata.fonte = String(item.personalizacao.fonte)
        }
        if (patches.length > 0) {
          productMetadata.patches = patches.join(",")
        }
      }

      console.log(`=== METADADOS PARA ITEM ${index + 1} ===`)
      console.log("Metadados criados:", JSON.stringify(productMetadata, null, 2))
      console.log("Nome do produto:", productName)
      console.log("Descrição:", description)

      // Garantir que a URL da imagem seja absoluta e válida
      let imageUrl = item.imagem
      const discountedUnitAmount = Math.max(0, Math.round(unitAmount * (1 - discountRatio)))
      
      // Debug logs para cada item
      console.log(`=== ITEM ${index + 1} DEBUG ===`)
      console.log("Item name:", item.nome)
      console.log("Unit amount (original):", unitAmount)
      console.log("Discount ratio:", discountRatio)
      console.log("Discounted unit amount:", discountedUnitAmount)
      console.log("Quantity:", item.quantidade)
      console.log("Total for this item:", discountedUnitAmount * item.quantidade)
      if (!imageUrl) {
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: description,
              metadata: productMetadata,
            },
            unit_amount: discountedUnitAmount,
          },
          quantity: item.quantidade,
        }
      }

      // Tratar URLs relativas
      if (!imageUrl.startsWith("http")) {
        imageUrl = new URL(
          imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl,
          siteUrl
        ).toString()
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
            description: description,
            images: [imageUrl],
            metadata: productMetadata,
          },
          unit_amount: discountedUnitAmount,
        },
        quantity: item.quantidade,
      }
    })

    // Calcular o envio
    const totalItems = cartItems.reduce((total: number, item: CartItem) => total + item.quantidade, 0)
    
    // Calcular o subtotal (sem descontos)
    const subtotal = itemsSubtotal
    
    // Portes grátis: 3+ produtos OU valor acima de 68€
    const shippingAmount = (totalItems < 3 && subtotal < 68) ? 399 : 0
    
    console.log("=== CÁLCULO DE ENVIO ===")
    console.log("Total de itens:", totalItems)
    console.log("Subtotal:", subtotal)
    console.log("Critério 3+ produtos:", totalItems >= 3)
    console.log("Critério 68€+:", subtotal >= 68)
    console.log("Envio gratuito:", shippingAmount === 0)
    console.log("Valor do envio:", shippingAmount / 100, "€")
    
    // Construir URLs absolutas para sucesso e cancelamento
    const successUrl = `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${siteUrl}/carrinho`

    console.log("URL de sucesso:", successUrl)
    console.log("URL de cancelamento:", cancelUrl)

    // Preparar opções de envio internacionais
    const finalShippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingAmount,
            currency: 'eur',
          },
          display_name: (totalItems >= 3 || subtotal >= 68) ? 'Standard Shipping (Free)' : 'Standard Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as const,
              value: 7,
            },
            maximum: {
              unit: 'business_day' as const,
              value: 12,
            },
          },
        },
      },
    ]

    // Lista completa de países UE/EEE + UK
    const allowedCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 
      'SE', 'IS', 'LI', 'NO', 'CH', 'GB'
    ]

    // Preparar opções da sessão
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: allowedCountries,
      },
      shipping_options: finalShippingOptions as Stripe.Checkout.SessionCreateParams.ShippingOption[],
      locale: 'en',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: 'shipping_notes',
          label: {
            type: 'custom',
            custom: 'Delivery notes (optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
      customer_creation: 'always',
      metadata: {},
      allow_promotion_codes: false,
    }

    // Metadata para tracking do parceiro e método de pagamento
    // Limitar tamanho dos metadados (máximo 500 caracteres por campo)
    const cartItemsSummary = cartItems.map((item: CartItem) => ({
      id: item.id,
      nome: item.nome,
      quantidade: item.quantidade,
      tamanho: item.tamanhoSelecionado || item.tamanho,
      personalizado: item.personalizacao?.ativar || false
    }))
    
    // Função para truncar string se exceder limite
    const truncateString = (str: string, maxLength: number = 500): string => {
      if (str.length <= maxLength) return str
      return str.substring(0, maxLength - 3) + '...'
    }
    
    const cartItemsJson = JSON.stringify(cartItemsSummary)
    const truncatedCartItems = truncateString(cartItemsJson, 500)
    
     const sessionMetadata: Record<string, string> = {
       payment_method: 'online',
       customer_email: customerEmail,
       cart_items: truncatedCartItems,
       original_total: (itemsSubtotal - (totalDiscountCents / 100) + (shippingAmount / 100)).toString(),
       store: 'fanzone12' // Identificador único da loja
     }
     if (validPartnerCode) {
       sessionMetadata.discount_code = String(validPartnerCode)
     }
    
    console.log("=== SESSION METADATA ===")
    console.log("Payment method: online")
    console.log("Customer email:", customerEmail)
    console.log("Valid partner code:", validPartnerCode)
    console.log("Original total:", sessionMetadata.original_total)
    console.log("Cart items length:", truncatedCartItems.length)
    console.log("Metadata keys:", Object.keys(sessionMetadata))

    // Anexar metadata, se existir
    if (Object.keys(sessionMetadata).length > 0) {
      sessionOptions.metadata = sessionMetadata
    }

    // Criar a sessão do Stripe
    const session = await stripe.checkout.sessions.create(sessionOptions)

    console.log("Sessão criada com sucesso:", session.id)
    console.log("URL de checkout:", session.url)

    // Verificar se a URL de checkout é válida
    if (!session.url) {
      throw new Error("Stripe did not return a valid checkout URL")
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating Stripe session:", error)
    return NextResponse.json({ error: error.message || "Error processing payment" }, { status: 500 })
  }
}
