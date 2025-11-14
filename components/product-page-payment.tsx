"use client"

import { ProductPaymentInfo } from "./product-payment-info"
import { useState } from "react"

interface ProductPagePaymentProps {
  product: {
    id: string
    name: string
    price: number
    hasPersonalization?: boolean
    personalizationOptions?: {
      name?: boolean
      number?: boolean
      patches?: string[]
    }
  }
  onAddToCart: (item: any) => void
}

export function ProductPagePayment({ product, onAddToCart }: ProductPagePaymentProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [personalization, setPersonalization] = useState({
    name: "",
    number: "",
    patches: [] as string[]
  })
  const [quantity, setQuantity] = useState(1)

  const hasPersonalization = product.hasPersonalization || 
    (product.personalizationOptions && 
     (product.personalizationOptions.name || product.personalizationOptions.number))

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      customization: hasPersonalization ? personalization : undefined,
      isPersonalized: hasPersonalization && (personalization.name || personalization.number)
    }

    onAddToCart(cartItem)
  }

  return (
    <div className="space-y-6">
      {/* Informações do produto */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <p className="text-3xl font-bold text-blue-600 mb-4">{product.price.toFixed(2)}€</p>
        
        {/* Seleção de tamanho */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Size</label>
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        {/* Personalização */}
        {hasPersonalization && (
          <div className="mb-4 space-y-3">
            <h3 className="font-medium">Personalization</h3>
            
            {product.personalizationOptions?.name && (
              <div>
                <label className="block text-sm font-medium mb-1">Name (€3)</label>
                <input
                  type="text"
                  value={personalization.name}
                  onChange={(e) => setPersonalization(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: John"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {product.personalizationOptions?.number && (
              <div>
                <label className="block text-sm font-medium mb-1">Number (€3)</label>
                <input
                  type="text"
                  value={personalization.number}
                  onChange={(e) => setPersonalization(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="Ex: 10"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {product.personalizationOptions?.patches && (
              <div>
                <label className="block text-sm font-medium mb-1">Patches (1€ cada)</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.personalizationOptions.patches.map((patch, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={personalization.patches.includes(patch)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPersonalization(prev => ({ 
                              ...prev, 
                              patches: [...prev.patches, patch] 
                            }))
                          } else {
                            setPersonalization(prev => ({ 
                              ...prev, 
                              patches: prev.patches.filter(p => p !== patch) 
                            }))
                          }
                        }}
                      />
                      <span className="text-sm">{patch}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantidade */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center"
            >
              -
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Botão adicionar ao carrinho */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>

      {/* Informações sobre pagamento à cobrança */}
      <ProductPaymentInfo
        productId={product.id}
        productName={product.name}
        hasPersonalization={hasPersonalization}
      />
    </div>
  )
}
