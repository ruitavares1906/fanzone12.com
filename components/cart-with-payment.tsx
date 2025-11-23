"use client"

import { useState } from "react"
import { useCartPayment, CartItem } from "@/hooks/use-cart-payment"
import { PaymentMethodSelector } from "./payment-method-selector"
import { CartPaymentSection } from "./cart-payment-section"
import { CashOnDeliveryInfoCompact } from "./cash-on-delivery-info"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Image from "next/image"

interface CartWithPaymentProps {
  items: CartItem[]
  shipping: number
  onProceedToCheckout: (paymentData: any) => void
  isLoading?: boolean
}

export function CartWithPayment({ 
  items, 
  shipping, 
  onProceedToCheckout, 
  isLoading = false 
}: CartWithPaymentProps) {
  const {
    paymentState,
    setPaymentMethod,
    canUseCashOnDelivery,
    getPaymentSummary,
    hasPersonalizedItems
  } = useCartPayment(items, shipping)

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal + shipping + (paymentState.method === 'cash_on_delivery' ? 8 : 0)

  return (
    <div className="space-y-6">
      {/* Resumo do carrinho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Cart Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {item.size?.replace(' anos', ' years') || item.size} | Quantity: {item.quantity}
                    {item.customization && (
                      <span className="text-blue-600 ml-2">
                        (Customized)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                </div>
              </div>
            ))}
            
            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shipping.toFixed(2)}€</span>
              </div>
              {paymentState.method === 'cash_on_delivery' && (
                <div className="flex justify-between">
                  <span>Cash on delivery fee:</span>
                  <span>8.00€</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre pagamento à cobrança */}
      <CashOnDeliveryInfoCompact hasPersonalizedItems={hasPersonalizedItems} />

      {/* Seleção de método de pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            selectedMethod={paymentState.method}
            onMethodChange={setPaymentMethod}
            hasPersonalizedItems={hasPersonalizedItems}
            totalAmount={subtotal + shipping}
          />
        </CardContent>
      </Card>

      {/* Resumo do pagamento */}
      {paymentState.method === 'cash_on_delivery' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Cash on Delivery Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Upfront payment:</span>
                <span className="font-bold text-orange-600">8.00€</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining on delivery:</span>
                <span className="font-bold text-green-600">{paymentState.remainingPayment.toFixed(2)}€</span>
              </div>
              <p className="text-orange-700 text-xs mt-2">
                ⚠️ Personalized products require upfront payment
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão de proceder */}
      <Button 
        onClick={() => onProceedToCheckout({
          method: paymentState.method,
          total,
          upfrontPayment: paymentState.upfrontPayment,
          remainingPayment: paymentState.remainingPayment,
          hasPersonalizedItems,
          summary: getPaymentSummary()
        })}
        disabled={isLoading || !canUseCashOnDelivery()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing...
          </>
        ) : (
          <>
            {paymentState.method === 'online' ? 'Pay Now' : 'Confirm Order'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
