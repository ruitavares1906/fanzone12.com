"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product, Personalizacao } from "@/lib/types"

interface CartNotificationProps {
  produto: Product
  tamanho: string
  personalizacao?: Personalizacao
  onClose: () => void
}

export function CartNotification({ produto, tamanho, personalizacao, onClose }: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar a notificação com um pequeno atraso para efeito de animação
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Fechar automaticamente após 8 segundos
    const closeTimer = setTimeout(() => {
      handleClose()
    }, 8000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Pequeno atraso antes de remover completamente o componente para permitir a animação de saída
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // Descrição do produto
  let descricao = `${produto.nome} (Tamanho: ${tamanho})`
  if (personalizacao?.ativar) {
    descricao += ` com personalização: ${personalizacao.nome || ""} ${personalizacao.numero || ""}`
    if (personalizacao.fonte) {
      const fonteNames = {
        "liga-betclic": "LIGA BETCLIC",
        "clube": "CLUBE",
        "champions-liga-europa": "CHAMPIONS / LIGA EUROPA"
      }
      descricao += ` (${fonteNames[personalizacao.fonte] || personalizacao.fonte})`
    }
    if (personalizacao.patches && personalizacao.patches.length > 0) {
      const patchNames = {
        portugal: "Campeão Português",
        liga: "Campeão Liga Portuguesa",
        champions: "Champions League",
        betclic: "Liga Portugal Betclic",
        "premier-champion-gold": "Campeão Premier League",
        "premier-league-blue": "Premier League", 
        "no-room-racism": "No Room for Racism",
        "la-liga": "La Liga",
        "la-liga-24-25": "La Liga 24/25",
        "ligue-1-black": "Ligue 1 Preto",
        "ligue-1": "Ligue 1",
        "ligue-1-2025": "Ligue 1 2025",
        "bundesliga": "Bundesliga",
        "serie-a-enilive": "2024-26 Patch Serie A Enilive",
        "serie-a-tim": "23/24 Patch Serie A TIM",
        "nations-2025": "Patch Liga das Nações 2025",
        "nations-foundation": "Patch Liga das Nações 2025 + UEFA Foundation",
        "diogo-jota": "Diogo Jota",
        "diogo-jota-manga": "Diogo Jota Manga"
      }
      const patchDescriptions = personalizacao.patches.map(patch => 
        patchNames[patch as keyof typeof patchNames] || patch
      )
      descricao += `, patches: ${patchDescriptions.join(", ")}`
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-green-50 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="ml-2 text-lg font-medium text-green-800">Produto adicionado ao carrinho</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
              <Image
                src={produto.imagem || "/placeholder.svg"}
                alt={produto.nome}
                unoptimized
                width={64}
                height={64}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-900">{produto.nome}</h4>
              <p className="mt-1 text-sm text-gray-500">{descricao}</p>
              <p className="mt-1 text-sm font-semibold">{produto.preco.toFixed(2)} €</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 justify-center" onClick={handleClose}>
              Continuar comprando
            </Button>
            <Button asChild className="flex-1 justify-center" onClick={handleClose}>
              <Link href="/carrinho">
                Ver carrinho <ShoppingCart className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
