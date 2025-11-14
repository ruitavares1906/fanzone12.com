"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Truck, CreditCard, AlertTriangle } from "lucide-react"

interface CashOnDeliveryInfoProps {
  hasPersonalizedItems?: boolean
  className?: string
}

export function CashOnDeliveryInfo({ hasPersonalizedItems = false, className = "" }: CashOnDeliveryInfoProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Informação geral sobre pagamento à cobrança */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Truck className="h-5 w-5" />
            <span>Pagamento à Cobrança Disponível</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-blue-700 text-sm font-medium">
              💰 Pague apenas 8€ agora e o restante quando receber o produto!
            </p>
            
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-blue-800 font-semibold mb-2">✅ Como funciona:</p>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>8€ pagos agora</strong> (taxa de garantia)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Restante pago na entrega</strong> (quando receber)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong>Sem cartão necessário</strong> para o restante</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Condições detalhadas */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Info className="h-5 w-5" />
            <span>Condições do Pagamento à Cobrança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Taxa de garantia:</span>
              <span className="font-semibold text-green-600">8€ (sempre antecipada)</span>
            </div>
            <div className="flex justify-between">
              <span>Restante do valor:</span>
              <span className="font-semibold text-blue-600">Pago na entrega</span>
            </div>
            <div className="flex justify-between">
              <span>Segurança:</span>
              <span className="font-semibold text-purple-600">Só paga quando receber</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vantagens */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">🎯 Vantagens do Pagamento à Cobrança:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Mais seguro:</strong> Só paga o restante quando receber</li>
          <li>• <strong>Sem cartão:</strong> Não precisa de cartão para o restante</li>
          <li>• <strong>Garantia:</strong> 8€ antecipados garantem a encomenda</li>
          <li>• <strong>Flexibilidade:</strong> Ideal para compras de valor elevado</li>
        </ul>
      </div>
    </div>
  )
}

// Componente compacto para usar no carrinho
export function CashOnDeliveryInfoCompact({ hasPersonalizedItems = false }: CashOnDeliveryInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm space-y-2">
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
    </div>
  )
}
