"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Personalizacao } from "@/lib/types"

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, tamanho: string, personalizacao?: Personalizacao) => void
  updateQuantity: (id: string, tamanho: string, quantidade: number, personalizacao?: Personalizacao) => void
  clearCart: () => void
  discountCode: string
  setDiscountCode: (code: string) => void
  discountAmount: number
  setDiscountAmount: (amount: number) => void
  discountPercentage: number
  setDiscountPercentage: (percentage: number) => void
  appliedDiscount: { code: string; amount: number; percentage: number } | null
  setAppliedDiscount: (discount: { code: string; amount: number; percentage: number } | null) => void
  promotionDiscount: number
  getPromotionInfo: () => { applied: boolean; savedAmount: number; freeItems: number }
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  discountCode: "",
  setDiscountCode: () => {},
  discountAmount: 0,
  setDiscountAmount: () => {},
  discountPercentage: 0,
  setDiscountPercentage: () => {},
  appliedDiscount: null,
  setAppliedDiscount: () => {},
  promotionDiscount: 0,
  getPromotionInfo: () => ({ applied: false, savedAmount: 0, freeItems: 0 }),
})

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [discountCode, setDiscountCode] = useState<string>("")
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [discountPercentage, setDiscountPercentage] = useState<number>(0)
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; percentage: number } | null>(null)

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          const validCart = parsedCart.filter(item => {
            // Validação básica do item
            if (!item || typeof item.id !== 'string' || typeof item.nome !== 'string' || 
                typeof item.preco !== 'number' || typeof item.imagem !== 'string' ||
                typeof item.quantidade !== 'number' || item.quantidade <= 0) {
              console.warn("Item inválido descartado do carrinho (campos básicos):", item)
              return false
            }

            // Validar e normalizar tamanhoSelecionado
            if (typeof item.tamanhoSelecionado !== 'string' || item.tamanhoSelecionado.trim() === "") {
              if (typeof item.tamanho === 'string' && item.tamanho.trim() !== "") {
                item.tamanhoSelecionado = item.tamanho // Usar tamanho como fallback
              } else {
                console.warn("Item inválido descartado do carrinho (tamanhoSelecionado em falta):", item)
                return false // Se nem tamanhoSelecionado nem tamanho existirem
              }
            }
            
            // Validar personalizacao (se existir)
            if (item.personalizacao) {
              if (typeof item.personalizacao.ativar !== 'boolean') {
                // Se 'ativar' não for booleano, tratar como não ativa para segurança
                item.personalizacao.ativar = false; 
              }
              if (item.personalizacao.ativar) {
                // Se ativa, nome/numero devem ser strings ou null/undefined
                if (item.personalizacao.nome && typeof item.personalizacao.nome !== 'string') item.personalizacao.nome = String(item.personalizacao.nome);
                if (item.personalizacao.numero && typeof item.personalizacao.numero !== 'string') item.personalizacao.numero = String(item.personalizacao.numero);
                
                // Patches deve ser um array de strings
                if (item.personalizacao.patches && !Array.isArray(item.personalizacao.patches)) {
                  item.personalizacao.patches = []; // Resetar se não for array
                } else if (item.personalizacao.patches) {
                  item.personalizacao.patches = item.personalizacao.patches.filter((p: any) => typeof p === 'string');
                }
              }
            }
            return true
          })
          setCart(validCart)
        }
      } catch (error) {
        console.error("Erro ao carregar ou validar o carrinho do localStorage:", error)
        localStorage.removeItem("cart") // Limpar carrinho corrompido
      }
    }
  }, [])

  // Guardar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Função para comparar personalizações
  const isSamePersonalization = (p1?: Personalizacao, p2?: Personalizacao) => {
    // Se ambas não existem ou não estão ativas, são consideradas iguais para este contexto
    const p1Active = p1?.ativar === true
    const p2Active = p2?.ativar === true

    if (!p1Active && !p2Active) return true
    if (p1Active !== p2Active) return false // Uma ativa e outra não

    // Ambas estão ativas, comparar conteúdo
    if (p1!.nome !== p2!.nome || p1!.numero !== p2!.numero || p1!.fonte !== p2!.fonte || p1!.cor !== p2!.cor) return false
    
    const patches1 = p1!.patches || []
    const patches2 = p2!.patches || []
    
    if (patches1.length !== patches2.length) return false
    
    // Verificar se todos os patches são iguais (independente da ordem)
    // Certificar que ambos são arrays de strings antes de comparar
    if (!Array.isArray(patches1) || !Array.isArray(patches2) || 
        !patches1.every(p => typeof p === 'string') || 
        !patches2.every(p => typeof p === 'string')) {
      // Se a estrutura de patches for inesperada, considerar como diferentes por segurança
      return false; 
    }
        
    const sortedPatches1 = [...patches1].sort()
    const sortedPatches2 = [...patches2].sort()
    
    return sortedPatches1.every((patch, index) => patch === sortedPatches2[index])
  }

  // Função para gerar uma chave única que inclui personalização
  const generateItemKey = (id: string, tamanho: string, personalizacao?: Personalizacao) => {
    let key = `${id}-${tamanho}`
    
          if (personalizacao?.ativar) {
        if (personalizacao.cor) {
          key += `-${personalizacao.cor}`
        }
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

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Verificar se o item já existe no carrinho (mesmo id, tamanho e personalização)
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.tamanhoSelecionado === item.tamanhoSelecionado &&
          isSamePersonalization(cartItem.personalizacao, item.personalizacao)
      )

      if (existingItemIndex !== -1) {
        // Se o item já existe, incrementar a quantidade
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        )
      } else {
        // Se o item não existe, adicionar ao carrinho
        return [...prevCart, { ...item, quantidade: 1 }]
      }
    })
  }

  const removeFromCart = (id: string, tamanho: string, personalizacao?: Personalizacao) => {
    setCart((prevCart) => 
      prevCart.filter((item) => 
        !(item.id === id && 
          item.tamanhoSelecionado === tamanho &&
          isSamePersonalization(item.personalizacao, personalizacao))
      )
    )
  }

  const updateQuantity = (id: string, tamanho: string, quantidade: number, personalizacao?: Personalizacao) => {
    setCart((prevCart) =>
      prevCart.map((item) => 
        (item.id === id && 
         item.tamanhoSelecionado === tamanho &&
         isSamePersonalization(item.personalizacao, personalizacao)) 
          ? { ...item, quantidade } 
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  // Função para calcular promoção "Leva 4 Paga 3" (apenas para camisolas, não sneakers nem capas)
  const getPromotionInfo = () => {
    // Filtrar apenas produtos que não são sneakers nem capas (camisolas)
    const camisolaItems = cart.filter(item => item.subcategoria !== "sneakers" && item.categoria !== "capas")
    const totalCamisolaItems = camisolaItems.reduce((total, item) => total + item.quantidade, 0)
    const freeItems = Math.floor(totalCamisolaItems / 4) // A cada 4 camisolas, 1 é grátis
    
    if (freeItems > 0) {
      // Encontrar os itens de camisola mais baratos para serem grátis
      const allCamisolaItems = camisolaItems.flatMap(item => 
        Array(item.quantidade).fill(null).map(() => ({
          ...item,
          totalPrice: item.preco + (item.personalizacao?.ativar ? 
            ((item.personalizacao.nome || item.personalizacao.numero) ? 3 : 0) + 
            ((item.personalizacao.patches?.length || 0) * 1) : 0)
        }))
      )
      
      // Ordenar por preço (mais barato primeiro)
      const sortedItems = allCamisolaItems.sort((a, b) => a.totalPrice - b.totalPrice)
      
      // Calcular valor poupado (soma dos itens mais baratos que ficam grátis)
      const savedAmount = sortedItems.slice(0, freeItems).reduce((total, item) => total + item.totalPrice, 0)
      
      return {
        applied: true,
        savedAmount,
        freeItems
      }
    }
    
    return {
      applied: false,
      savedAmount: 0,
      freeItems: 0
    }
  }

  const promotionInfo = getPromotionInfo()
  const promotionDiscount = promotionInfo.savedAmount

  // Reaplicar desconto quando o carrinho mudar (se houver desconto aplicado)
  useEffect(() => {
    if (appliedDiscount && cart.length > 0) {
      const subtotal = cart.reduce((total, item) => {
        const personalizationCost = item.personalizacao?.ativar ? 
          ((item.personalizacao.nome || item.personalizacao.numero) ? 3 : 0) + 
          ((item.personalizacao.patches?.length || 0) * 1) : 0
        return total + (item.preco + personalizationCost) * item.quantidade
      }, 0)
      
      setAppliedDiscount(prev => prev ? {
        ...prev,
        amount: (subtotal * prev.percentage) / 100
      } : null)
    }
  }, [cart]) // Removido appliedDiscount das dependências para evitar loop

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discountCode,
        setDiscountCode,
        discountAmount,
        setDiscountAmount,
        discountPercentage,
        setDiscountPercentage,
        appliedDiscount,
        setAppliedDiscount,
        promotionDiscount,
        getPromotionInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
