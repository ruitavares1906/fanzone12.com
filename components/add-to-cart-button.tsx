"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useCart } from "./cart-provider"
import type { Product, Personalizacao } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { CartNotification } from "./cart-notification"

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface AddToCartButtonProps {
  produto: Product
  tamanho: string
  personalizacao?: Personalizacao
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  className?: string
  onError?: () => void
}

export function AddToCartButton({
  produto,
  tamanho,
  personalizacao,
  variant = "default",
  className = "",
  onError
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [added, setAdded] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = () => {
    if (!tamanho) {
      if (onError) {
        onError()
      }
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      })
      return
    }

    const patches = Array.isArray(personalizacao?.patches) ? personalizacao.patches : []
    const patchCost = patches.reduce((total, patch) => {
      if (patch === 'nations-foundation') {
        return total + 2;
      }
      return total + 1;
    }, 0);

    const price = personalizacao?.ativar ? 
      produto.preco + patchCost : 
      produto.preco

    addToCart({
      ...produto,
      quantidade: 1,
      tamanho: tamanho,
      tamanhoSelecionado: tamanho,
      personalizacao: {
        ...personalizacao,
        patches: patches,
        ativar: personalizacao?.ativar || false
      },
      preco: price
    })

    // Meta Pixel AddToCart Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: price,
        currency: 'EUR',
        content_name: produto.nome,
        content_ids: [produto.id],
        contents: [{
          id: produto.id,
          name: produto.nome,
          quantity: 1,
          price: price
        }]
      });
    }

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setShowNotification(true)
    setError(null)
  }

  return (
    <>
      {!added ? (
        <Button
          variant={variant}
          className={`${className} transition-all`}
          onClick={handleAddToCart}
          aria-label="Adicionar ao carrinho"
        >
          Adicionar
        </Button>
      ) : (
        <Button
          variant="outline"
          className={`${className} bg-green-50 text-green-600 border-green-200 transition-all md:animate-pulse motion-reduce:animate-none`}
          onClick={() => setAdded(false)}
        >
          <Check className="h-4 w-4 mr-2" />
          Adicionado!
        </Button>
      )}

      {showNotification && (
        <CartNotification
          produto={produto}
          tamanho={tamanho}
          personalizacao={personalizacao}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  )
}
