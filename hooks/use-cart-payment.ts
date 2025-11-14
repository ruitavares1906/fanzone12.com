"use client"

import { useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  isPersonalized?: boolean
  customization?: {
    name?: string
    number?: string
  }
}

export interface Discount {
  label: string
  amount: number // valor positivo (ex: 7 = desconto de 7€)
}

export interface PaymentState {
  method: "online" | "cash_on_delivery"
  hasPersonalizedItems: boolean
  subtotalOriginal: number
  totalDiscounts: number
  subtotalWithDiscounts: number
  shipping: number
  cashOnDeliveryFee: number
  total: number
  upfrontPayment: number
  remainingPayment: number
}

export interface PaymentSummary {
  method: string
  description: string
  total: number
  breakdown: Array<{
    label: string
    value: number
  }>
  upfrontPayment?: number
  remainingPayment?: number
}

const CASH_ON_DELIVERY_FEE = 8
const DEFAULT_SHIPPING = 3.99
const FREE_SHIPPING_THRESHOLD = 68
const FREE_SHIPPING_QUANTITY = 3

// Função auxiliar para arredondar valores
const roundTo2 = (value: number): number => Math.round(value * 100) / 100

export function useCartPayment(
  items: CartItem[] = [],
  discounts: Discount[] = []
) {
  const [paymentMethod, setPaymentMethod] = useState<
    "online" | "cash_on_delivery"
  >("online")

  const safeItems = Array.isArray(items) ? items : []
  const safeDiscounts = Array.isArray(discounts) ? discounts : []

  // 1. Calcular subtotal original
  const subtotalOriginal = roundTo2(
    safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // 2. Calcular total de descontos
  const totalDiscounts = roundTo2(
    safeDiscounts.reduce((sum, discount) => sum + discount.amount, 0)
  )

  // 3. Calcular subtotal com descontos aplicados
  const subtotalWithDiscounts = roundTo2(
    Math.max(0, subtotalOriginal - totalDiscounts)
  )

  // 4. Verificar se há produtos personalizados
  const hasPersonalizedItems = safeItems.some(
    (item) =>
      item.isPersonalized ||
      (item.customization &&
        (item.customization.name || item.customization.number))
  )

  // 5. Calcular quantidade total
  const totalQuantity = safeItems.reduce((sum, item) => sum + item.quantity, 0)

  // 6. Calcular portes grátis
  const isFreeShipping = 
    totalQuantity >= FREE_SHIPPING_QUANTITY || 
    subtotalOriginal >= FREE_SHIPPING_THRESHOLD
  const shipping = isFreeShipping ? 0 : DEFAULT_SHIPPING

  // 7. Calcular taxa à cobrança
  const cashOnDeliveryFee = paymentMethod === "cash_on_delivery" ? CASH_ON_DELIVERY_FEE : 0

  // 8. Calcular total final
  const total = roundTo2(subtotalWithDiscounts + shipping + cashOnDeliveryFee)
  

  // 9. Calcular pagamento antecipado e restante
  let upfrontPayment = 0
  let remainingPayment = total

  if (paymentMethod === "cash_on_delivery") {
    // SEMPRE: 8€ antecipadamente + restante = total - 8€
    upfrontPayment = CASH_ON_DELIVERY_FEE
    remainingPayment = roundTo2(total - CASH_ON_DELIVERY_FEE)
  }

  // 10. Criar paymentState
  const paymentState: PaymentState = {
    method: paymentMethod,
    hasPersonalizedItems,
    subtotalOriginal,
    totalDiscounts,
    subtotalWithDiscounts,
    shipping,
    cashOnDeliveryFee,
    total,
    upfrontPayment,
    remainingPayment,
  }

  // 11. Função para trocar método de pagamento
  const setPaymentMethodHook = (method: "online" | "cash_on_delivery") => {
    setPaymentMethod(method)
  }

  // 12. Função para obter resumo do pagamento
  const getPaymentSummary = (): PaymentSummary => {
    if (paymentState.method === "online") {
      return {
        method: "Pagamento Online",
        description: "Pague com cartão de crédito/débito de forma segura",
        total: paymentState.total,
        breakdown: [
          { label: "Subtotal", value: paymentState.subtotalOriginal },
          ...(paymentState.totalDiscounts > 0 ? [
            { label: "Descontos", value: -paymentState.totalDiscounts }
          ] : []),
          { label: "Envio", value: paymentState.shipping },
          { label: "Total", value: paymentState.total },
        ],
      }
    } else {
      return {
        method: "Pagamento à Cobrança",
        description: hasPersonalizedItems
          ? "8€ antecipadamente + restante à cobrança"
          : "Pague quando receber o produto",
        total: paymentState.total,
        breakdown: [
          { label: "Subtotal", value: paymentState.subtotalOriginal },
          ...(paymentState.totalDiscounts > 0 ? [
            { label: "Descontos", value: -paymentState.totalDiscounts }
          ] : []),
          { label: "Envio", value: paymentState.shipping },
          { label: "Taxa à cobrança", value: paymentState.cashOnDeliveryFee },
          { label: "Total", value: paymentState.total },
        ],
        upfrontPayment: paymentState.upfrontPayment,
        remainingPayment: paymentState.remainingPayment,
      }
    }
  }

  return {
    paymentState,
    setPaymentMethod: setPaymentMethodHook,
    getPaymentSummary,
    hasPersonalizedItems,
  }
}