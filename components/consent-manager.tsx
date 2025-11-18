"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    __allow_tracking?: boolean;
    fbq?: (...args: any[]) => void;
  }
}

export function ConsentManager() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Marcar como cliente após hidratação
    setIsClient(true)
    
    // Verificar se já existe consentimento
    if (typeof window !== 'undefined') {
      const existingConsent = localStorage.getItem('fanzone12_tracking_consent')
      if (existingConsent) {
        const consent = existingConsent === 'true'
        setHasConsent(consent)
        window.__allow_tracking = consent
      } else {
        setHasConsent(null)
      }
    }
  }, [])

  const acceptTracking = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fanzone12_tracking_consent', 'true')
      setHasConsent(true)
      window.__allow_tracking = true
    }
  }

  const rejectTracking = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fanzone12_tracking_consent', 'false')
      setHasConsent(false)
      window.__allow_tracking = false
    }
  }

  // Não renderizar no servidor
  if (!isClient) {
    return null
  }

  // Não mostrar banner se já tem consentimento
  if (hasConsent !== null) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="text-sm text-gray-800 mb-3">
        <strong>Cookies and Privacy</strong>
        <p className="mt-1">
          We use cookies to improve your experience and analyze website traffic. 
          You can accept or decline analytics cookies.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            acceptTracking()
          }}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer border-0 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ cursor: 'pointer' }}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            rejectTracking()
          }}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer border-0 outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          style={{ cursor: 'pointer' }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
