"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentMethodSelector } from "./payment-method-selector"
import { useCartPayment, CartItem } from "@/hooks/use-cart-payment"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, CreditCard, Truck } from "lucide-react"

interface CartPaymentSectionProps {
  items: CartItem[]
  shipping: number
  onProceedToCheckout: (paymentData: any) => void
  isLoading?: boolean
}

export function CartPaymentSection({ 
  items, 
  shipping, 
  onProceedToCheckout, 
  isLoading = false 
}: CartPaymentSectionProps) {
  const {
    paymentState,
    setPaymentMethod,
    canUseCashOnDelivery,
    getPaymentSummary,
    hasPersonalizedItems
  } = useCartPayment(items, shipping)

  const handleProceedToCheckout = () => {
    const paymentData = {
      method: paymentState.method,
      total: paymentState.total,
      upfrontPayment: paymentState.upfrontPayment,
      remainingPayment: paymentState.remainingPayment,
      hasPersonalizedItems,
      summary: getPaymentSummary()
    }
    
    onProceedToCheckout(paymentData)
  }

  const paymentSummary = getPaymentSummary()

  return (
    <div className="space-y-6">
      {/* Seleção de Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Método de Pagamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            selectedMethod={paymentState.method}
            onMethodChange={setPaymentMethod}
            hasPersonalizedItems={hasPersonalizedItems}
            totalAmount={paymentState.subtotal + paymentState.shipping}
          />
        </CardContent>
      </Card>

      {/* Resumo do Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Resumo do Pagamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{paymentSummary.method}</h4>
            <p className="text-sm text-gray-600">{paymentSummary.description}</p>
          </div>

          {/* Breakdown dos custos */}
          <div className="space-y-2">
            {paymentSummary.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className={item.label === 'Total' ? 'font-semibold' : ''}>
                  {item.label}:
                </span>
                <span className={item.label === 'Total' ? 'font-semibold text-lg' : ''}>
                  {item.value.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          {/* Pagamento antecipado se aplicável */}
          {paymentState.method === 'cash_on_delivery' && paymentState.upfrontPayment > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 className="font-semibold text-orange-800 mb-2">Pagamento Antecipado Necessário</h5>
              <div className="space-y-1 text-sm text-orange-700">
                <div className="flex justify-between">
                  <span>Valor antecipado:</span>
                  <span className="font-semibold">{paymentState.upfrontPayment.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Restante à cobrança:</span>
                  <span className="font-semibold">{paymentState.remainingPayment.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          {/* Aviso sobre produtos personalizados */}
          {hasPersonalizedItems && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Pagamento à cobrança:</strong> Será necessário pagar 8€ antecipadamente 
                para garantir a encomenda. O restante será pago na entrega.
              </AlertDescription>
            </Alert>
          )}

          {/* Botão de proceder */}
          <Button 
            onClick={handleProceedToCheckout}
            disabled={isLoading || !canUseCashOnDelivery()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              <>
                {paymentState.method === 'online' ? 'Pagar Agora' : 'Confirmar Encomenda'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Informações adicionais */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Pagamento à cobrança: Taxa adicional de 8€</p>
            <p>• Produtos personalizados: Requerem pagamento antecipado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
