"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Truck, Info } from "lucide-react"
import Image from "next/image"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  hasPersonalizedItems: boolean
  totalAmount: number
  paymentState?: {
    total: number
    upfrontPayment: number
    remainingPayment: number
    cashOnDeliveryFee: number
  }
  onCheckout?: () => void
  isLoading?: boolean
  email?: string
  onEmailChange?: (email: string) => void
  emailError?: string
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange, 
  hasPersonalizedItems, 
  totalAmount,
  paymentState,
  onCheckout,
  isLoading = false,
  email,
  onEmailChange,
  emailError
}: PaymentMethodSelectorProps) {
  const [showInfo, setShowInfo] = useState(false)

  // Calcular total com taxa de 8€ para pagamento à cobrança
  const totalWithFee = paymentState ? paymentState.total : totalAmount + 8

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Método de Pagamento</h3>
      
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => {
          // Impedir seleção de pagamento à cobrança
          if (value === 'cash_on_delivery') {
            return;
          }
          onMethodChange(value);
        }} 
        className="space-y-4"
      >
        {/* Pagamento Online */}
        <Card className={`cursor-pointer transition-all ${
          selectedMethod === 'online' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span className="font-medium">Pagamento Online</span>
              </Label>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>
              Pague com cartão de crédito/débito/paypal/klarna de forma segura
            </CardDescription>
            
            {/* Métodos de pagamento disponíveis */}
            <div className="mt-3">
              <h4 className="font-semibold text-foreground mb-3 text-center text-sm">Métodos de Pagamento Disponíveis</h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/payment-visa.png" alt="Visa" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/payment-mastercard.webp" alt="Mastercard" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/payment-multibanco.png" alt="Multibanco" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/payment-klarna.webp" alt="Klarna" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/paypal-logo-small-min-1.png" alt="PayPal" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
                  <Image src="/images/logo-mbway-1536x960.png" alt="MB WAY" width={60} height={30} className="h-6 w-auto object-contain mx-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagamento à Cobrança */}
        <Card className={`cursor-pointer transition-all relative ${
          selectedMethod === 'cash_on_delivery' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
        }`}>
          {/* Sobreposição transparente com mensagem de indisponibilidade */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold text-lg shadow-lg">
                Temporariamente Indisponível
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Esta opção estará disponível em breve
              </p>
            </div>
          </div>
          
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" disabled />
              <Label htmlFor="cash_on_delivery" className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                <Truck className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Pagamento à Cobrança</span>
                <span className="text-sm text-gray-500">(+8€)</span>
              </Label>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>
              Pague quando receber o produto em casa
            </CardDescription>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Total com taxa:</strong> {totalWithFee.toFixed(2)}€</p>
              {paymentState && (
                <div className="mt-2 text-xs text-blue-600">
                  <p>• Pagamento antecipado: {paymentState.upfrontPayment.toFixed(2)}€</p>
                  <p>• Restante à cobrança: {paymentState.remainingPayment.toFixed(2)}€</p>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Image 
                src="/images/cobranca_logo.jpg" 
                alt="Pagamento à Cobrança" 
                width={150} 
                height={150} 
                className="rounded"
              />
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {/* Informações sobre produtos personalizados */}
      {hasPersonalizedItems && selectedMethod === 'cash_on_delivery' && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Atenção:</strong> Para pagamento à cobrança, será necessário 
            pagar 8€ antecipadamente para garantir a encomenda. O restante valor 
            será pago à cobrança.
          </AlertDescription>
        </Alert>
      )}

      {/* Informações gerais sobre pagamento à cobrança */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Info className="h-4 w-4" />
          <span>Informações sobre pagamento à cobrança</span>
        </button>
        
        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="space-y-3">
              <p className="text-blue-800 font-semibold">💰 Pagamento à Cobrança</p>
              <div className="space-y-1 text-blue-700">
                <p className="font-medium">✅ Como funciona:</p>
                <ul className="ml-4 space-y-1">
                  <li>• <strong>8€ pagos agora</strong> (taxa de garantia)</li>
                  <li>• <strong>Restante pago na entrega</strong> (quando receber)</li>
                  <li>• <strong>Sem cartão necessário</strong> para o restante</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Mais seguro: só paga o restante quando receber o produto!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Campo de Email */}
      {onCheckout && email !== undefined && onEmailChange && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <Label htmlFor="checkout-email" className="text-sm font-semibold text-gray-900 mb-2 block">
            Email para confirmação *
          </Label>
          <input
            id="checkout-email"
            type="email"
            placeholder="seu@email.com"
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
            Receberá a confirmação da encomenda neste email
          </p>
        </div>
      )}

      {/* Botão de Finalizar Encomenda */}
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
                <span>Processando...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>
                  {selectedMethod === 'cash_on_delivery' 
                    ? 'Finalizar Encomenda à Cobrança' 
                    : 'Finalizar Encomenda Online'
                  }
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
