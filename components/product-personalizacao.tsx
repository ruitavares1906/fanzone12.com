"use client"

import { PersonalizacaoForm } from "./personalizacao-form"
import type { Product, Personalizacao } from "@/lib/types"

interface ProductPersonalizacaoProps {
  produto: Product
  onChange?: (personalizacao: Personalizacao) => void
}

export function ProductPersonalizacao({ produto, onChange }: ProductPersonalizacaoProps) {
  // Se for sneakers, não mostrar personalização
  if (produto.subcategoria === "sneakers") {
    return null
  }

  return (
    <div className="space-y-4">
      <PersonalizacaoForm 
        onChange={onChange || (() => {})}
        clube={produto.clube}
      />
    </div>
  )
} 