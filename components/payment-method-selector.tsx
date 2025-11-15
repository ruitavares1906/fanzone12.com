"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface PaymentMethod {
  id: string
  name: string
  icon: string
}

interface PaymentMethodSelectorProps {
  onCheckout?: () => void
  isLoading?: boolean
  email?: string
  onEmailChange?: (email: string) => void
  emailError?: string
}

export function PaymentMethodSelector({ 
  onCheckout,
  isLoading = false,
  email,
  onEmailChange,
  emailError
}: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loadingMethods, setLoadingMethods] = useState(true)

  useEffect(() => {
    // Buscar métodos de pagamento disponíveis da API
    const fetchPaymentMethods = async () => {
      try {
        setLoadingMethods(true)
        const response = await fetch('/api/payment-methods')
        const data = await response.json()
        
        if (data.methods && Array.isArray(data.methods)) {
          setPaymentMethods(data.methods)
        } else {
          // Fallback para métodos padrão se a API não retornar dados válidos
          setPaymentMethods([
            { id: "visa", name: "Visa", icon: "/images/payment-visa.webp" },
            { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
          ])
        }
      } catch (error) {
        console.error("Erro ao buscar métodos de pagamento:", error)
        // Fallback para métodos padrão em caso de erro
        setPaymentMethods([
          { id: "visa", name: "Visa", icon: "/images/payment-visa.webp" },
          { id: "mastercard", name: "Mastercard", icon: "/images/payment-mastercard.webp" },
        ])
      } finally {
        setLoadingMethods(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      
      {/* Online Payment */}
      <Card className="ring-2 ring-green-500 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-green-600" />
            <span className="font-medium">Online Payment</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>
            Pay securely with credit/debit card, PayPal, Klarna, and other payment methods
          </CardDescription>
          
          {/* Available payment methods */}
          <div className="mt-3">
            <h4 className="font-semibold text-foreground mb-3 text-center text-sm">Available Payment Methods</h4>
            {loadingMethods ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className="bg-card rounded-lg p-3 shadow-sm border border-border flex items-center justify-center"
                    title={method.name}
                  >
                    <Image 
                      src={method.icon} 
                      alt={method.name} 
                      width={60} 
                      height={30} 
                      className="h-6 w-auto object-contain mx-auto"
                      onError={(e) => {
                        // Fallback para um ícone genérico se a imagem não carregar
                        const target = e.target as HTMLImageElement
                        target.src = "/images/payment-visa.webp"
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 py-4">
                Loading payment methods...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Field */}
      {onCheckout && email !== undefined && onEmailChange && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <Label htmlFor="checkout-email" className="text-sm font-semibold text-gray-900 mb-2 block">
            Email for confirmation *
          </Label>
          <input
            id="checkout-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
          <p className="text-xs text-gray-600 mt-2">
            You will receive order confirmation at this email
          </p>
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <div className="mt-6">
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Complete Order</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
