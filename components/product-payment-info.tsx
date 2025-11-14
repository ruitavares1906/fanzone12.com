"use client"

import { CashOnDeliveryInfo } from "./cash-on-delivery-info"
import { useState } from "react"
import { Button } from "./ui/button"
import { Info } from "lucide-react"

interface ProductPaymentInfoProps {
  productId: string
  productName: string
  hasPersonalization?: boolean
  className?: string
}

export function ProductPaymentInfo({ 
  productId, 
  productName, 
  hasPersonalization = false,
  className = "" 
}: ProductPaymentInfoProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Botão para mostrar/ocultar informações */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full justify-start"
      >
        <Info className="h-4 w-4 mr-2" />
        {showDetails ? 'Ocultar' : 'Ver'} informações sobre pagamento à cobrança
      </Button>

      {/* Informações detalhadas */}
      {showDetails && (
        <CashOnDeliveryInfo 
          hasPersonalizedItems={hasPersonalization}
          className="mt-4"
        />
      )}

      {/* Resumo rápido sempre visível */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium text-gray-800">Pagamento à Cobrança Disponível</span>
        </div>
        <p className="text-gray-600">
          {hasPersonalization 
            ? `Para "${productName}": 8€ antecipadamente + restante à cobrança`
            : `Para "${productName}": Pode pagar tudo à cobrança (+8€ de taxa)`
          }
        </p>
      </div>
    </div>
  )
}
