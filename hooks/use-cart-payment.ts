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
  method: "online"
  hasPersonalizedItems: boolean
  subtotalOriginal: number
  totalDiscounts: number
  subtotalWithDiscounts: number
  shipping: number
  total: number
}

export interface PaymentSummary {
  method: string
  description: string
  total: number
  breakdown: Array<{
    label: string
    value: number
  }>
}

const DEFAULT_SHIPPING = 3.99
const FREE_SHIPPING_THRESHOLD = 68
const FREE_SHIPPING_QUANTITY = 3

// Função auxiliar para arredondar valores
const roundTo2 = (value: number): number => Math.round(value * 100) / 100

export function useCartPayment(
  items: CartItem[] = [],
  discounts: Discount[] = []
) {
  const safeItems = Array.isArray(items) ? items : []
  const safeDiscounts = Array.isArray(discounts) ? discounts : []

  // 1. Calculate original subtotal
  const subtotalOriginal = roundTo2(
    safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // 2. Calculate total discounts
  const totalDiscounts = roundTo2(
    safeDiscounts.reduce((sum, discount) => sum + discount.amount, 0)
  )

  // 3. Calculate subtotal with discounts applied
  const subtotalWithDiscounts = roundTo2(
    Math.max(0, subtotalOriginal - totalDiscounts)
  )

  // 4. Check if there are personalized items
  const hasPersonalizedItems = safeItems.some(
    (item) =>
      item.isPersonalized ||
      (item.customization &&
        (item.customization.name || item.customization.number))
  )

  // 5. Calculate total quantity
  const totalQuantity = safeItems.reduce((sum, item) => sum + item.quantity, 0)

  // 6. Calculate free shipping
  const isFreeShipping = 
    totalQuantity >= FREE_SHIPPING_QUANTITY || 
    subtotalOriginal >= FREE_SHIPPING_THRESHOLD
  const shipping = isFreeShipping ? 0 : DEFAULT_SHIPPING

  // 7. Calculate final total
  const total = roundTo2(subtotalWithDiscounts + shipping)

  // 8. Create paymentState
  const paymentState: PaymentState = {
    method: "online",
    hasPersonalizedItems,
    subtotalOriginal,
    totalDiscounts,
    subtotalWithDiscounts,
    shipping,
    total,
  }

  // 9. Function to get payment summary
  const getPaymentSummary = (): PaymentSummary => {
    return {
      method: "Online Payment",
      description: "Pay securely with credit/debit card",
      total: paymentState.total,
      breakdown: [
        { label: "Subtotal", value: paymentState.subtotalOriginal },
        ...(paymentState.totalDiscounts > 0 ? [
          { label: "Discounts", value: -paymentState.totalDiscounts }
        ] : []),
        { label: "Shipping", value: paymentState.shipping },
        { label: "Total", value: paymentState.total },
      ],
    }
  }

  return {
    paymentState,
    getPaymentSummary,
    hasPersonalizedItems,
  }
}