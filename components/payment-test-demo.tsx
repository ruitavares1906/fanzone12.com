"use client"

import { useState } from "react"
import { CartWithPayment } from "./cart-with-payment"
import { ProductPagePayment } from "./product-page-payment"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { CartItem } from "@/hooks/use-cart-payment"

// Dados de exemplo para teste
const sampleProducts = [
  {
    id: "1",
    name: "Camisola SL Benfica 2024/25",
    price: 45.99,
    hasPersonalization: true,
    personalizationOptions: {
      name: true,
      number: true,
      patches: ["Capitão", "Bandeira", "Troféu"]
    }
  },
  {
    id: "2", 
    name: "Ténis Nike Air Force 1",
    price: 89.99,
    hasPersonalization: false
  }
]

export function PaymentTestDemo() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => [...prev, item])
  }

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const handleProceedToCheckout = async (paymentData: any) => {
    setIsLoading(true)
    
    console.log("=== DADOS DO PAGAMENTO ===")
    console.log("Método:", paymentData.method)
    console.log("Total:", paymentData.total)
    console.log("Pagamento antecipado:", paymentData.upfrontPayment)
    console.log("Restante:", paymentData.remainingPayment)
    console.log("Tem produtos personalizados:", paymentData.hasPersonalizedItems)
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (paymentData.method === 'cash_on_delivery') {
      // Simular criação de pedido à cobrança
      console.log("Criando pedido à cobrança...")
      // Aqui chamaria a API /api/create-cash-on-delivery-order
    } else {
      // Simular redirecionamento para Stripe
      console.log("Redirecionando para Stripe...")
      // Aqui chamaria a API /api/create-checkout-session
    }
    
    setIsLoading(false)
    
    // Simular sucesso
    alert(`Pedido criado com sucesso!\nMétodo: ${paymentData.method}\nTotal: ${paymentData.total}€`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Demo: Pagamento à Cobrança</h1>
        <p className="text-gray-600">
          Teste o sistema de pagamento à cobrança com produtos normais e personalizados
        </p>
      </div>

      {/* Produtos disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <ProductPagePayment
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Carrinho */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Carrinho ({cart.length} itens)</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCart([])}
              >
                Limpar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Tamanho: {item.size} | Quantidade: {item.quantity}
                      {item.isPersonalized && (
                        <Badge variant="secondary" className="ml-2">Personalizado</Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <CartWithPayment
              items={cart}
              shipping={5}
              onProceedToCheckout={handleProceedToCheckout}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Instruções de teste */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Como Testar</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-2 text-sm">
            <p><strong>1. Produtos Normais:</strong> Adicione ténis ao carrinho e escolha pagamento à cobrança</p>
            <p><strong>2. Produtos Personalizados:</strong> Adicione camisola com personalização e veja a diferença</p>
            <p><strong>3. Mistura:</strong> Adicione ambos os tipos e veja como o sistema calcula</p>
            <p><strong>4. Emails:</strong> Os emails serão enviados com informações detalhadas sobre o pagamento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
