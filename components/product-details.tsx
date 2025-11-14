"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Product, tamanhosCrianca } from "@/lib/types"
import { useCart } from "@/components/cart-provider"
import { SizeSelector } from "./size-selector"
import { ProductPersonalizacao } from "./product-personalizacao"
import { Truck, RotateCcw } from "lucide-react"

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function ProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("")
  const { addToCart } = useCart()
  const [sizeError, setSizeError] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    
    addToCart({
      ...product,
      quantidade: 1,
      tamanho: selectedSize,
      tamanhoSelecionado: selectedSize
    })

    // Meta Pixel AddToCart Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: product.preco,
        currency: 'EUR',
        content_name: product.nome,
        content_ids: [product.id],
        contents: [{
          id: product.id,
          name: product.nome,
          quantity: 1,
          price: product.preco
        }]
      });
    }

    setSizeError(false)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square relative">
        <img
          src={product.imagem}
          alt={product.nome}
          className="object-cover w-full h-full rounded-xl"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.nome}</h1>
          <p className="text-xl font-semibold mt-2 text-red-600">{product.preco}€</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Selecione o Tamanho</h3>
          <SizeSelector 
            onChange={(size) => {
              setSelectedSize(size)
              setSizeError(false)
            }}
            categoria={product.categoria}
            subcategoria={product.subcategoria}
          />
          {sizeError && (
            <p className="text-red-500 mt-2">Por favor, selecione um tamanho</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Descrição</h3>
          <p className="text-muted-foreground">{product.descricaoLonga}</p>
        </div>

        <Button onClick={handleAddToCart} className="w-full">
          Adicionar ao Carrinho
        </Button>

        <ProductPersonalizacao produto={product} />

        <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2">Informações de Envio e Devolução</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="h-4 w-4 text-primary" />
            <p>Entrega em 7-12 dias úteis</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <RotateCcw className="h-4 w-4 text-primary" />
            <p>Devolução gratuita em 30 dias</p>
          </div>
        </div>
      </div>
    </div>
  )
} 