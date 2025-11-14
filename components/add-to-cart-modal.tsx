"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/types"

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  selectedSize: string
  quantidade: number
}

export function AddToCartModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  quantidade
}: AddToCartModalProps) {
  const router = useRouter()

  const handleGoToCart = () => {
    router.push('/carrinho')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Produto adicionado ao carrinho</DialogTitle>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Adicionado ao Carrinho!</h2>
          <p className="text-gray-600 mb-6">O item foi adicionado ao seu carrinho com sucesso.</p>

          <div className="bg-gray-50 w-full p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={product.imagem || "/placeholder.svg"}
                  alt={product.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 mb-1">{product.nome}</h3>
                <p className="text-sm text-gray-600">Tamanho: {selectedSize}</p>
                <p className="text-sm text-gray-600">Quantidade: {quantidade}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 text-base py-6"
              onClick={onClose}
            >
              Continuar Comprando
            </Button>
            <Button
              className="flex-1 text-base py-6 bg-primary"
              onClick={handleGoToCart}
            >
              <span>Ver Carrinho</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
            <ShoppingCart className="h-4 w-4" />
            <span>{quantidade} {quantidade === 1 ? 'item' : 'itens'} no carrinho</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 