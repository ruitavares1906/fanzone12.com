"use client"

import { useEffect, useRef, useState } from "react"
import { useCart } from "./cart-provider"

export function DiscountUrlHandler() {
  const { setDiscountCode, appliedDiscount, setAppliedDiscount, cart } = useCart()
  const hasAppliedRef = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

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
        // Calcular subtotal atual para aplicar o desconto
        const subtotal = cart.reduce((total, item) => {
          const personalizationCost = item.personalizacao?.ativar ? 
            ((item.personalizacao.nome || item.personalizacao.numero) ? 3 : 0) + 
            ((item.personalizacao.patches?.length || 0) * 1) : 0
          return total + (item.preco + personalizationCost) * item.quantidade
        }, 0)
        
        // Lógica igual ao backend: se compra >= 68€, desconto fixo de 7€, senão 10%
        const isFixed = subtotal >= 68
        const discountAmount = isFixed ? 7 : (subtotal * 10) / 100
        setAppliedDiscount({ 
          code: data.code, 
          amount: discountAmount, 
          percentage: isFixed ? 0 : 10 
        })
        console.log("Código aplicado automaticamente:", data.code)
      }
    } catch (error) {
      console.error("Erro ao aplicar desconto da URL:", error)
    }
  }

  // Verificar se há código de desconto na URL ao carregar (apenas uma vez)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !hasAppliedRef.current) {
      const urlParams = new URLSearchParams(window.location.search)
      const urlDiscountCode = urlParams.get('discount') || urlParams.get('d') || urlParams.get('D')
      if (urlDiscountCode && !appliedDiscount) {
        hasAppliedRef.current = true
        setDiscountCode(urlDiscountCode.toUpperCase())
        // Aplicar automaticamente se houver código na URL
        applyDiscountFromUrl(urlDiscountCode.toUpperCase())
      }
    }
  }, [isMounted, appliedDiscount, setDiscountCode, setAppliedDiscount])

  return null // Este componente não renderiza nada
}
