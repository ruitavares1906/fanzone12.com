"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface SneakersColorFilterProps {
  basePath: string
}

export function SneakersColorFilter({ basePath }: SneakersColorFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [cores, setCores] = useState<string[]>(searchParams.get("cor")?.split(",") || [])

  const coresDisponiveis = [
    { id: "branco", label: "Branco", color: "bg-white border-gray-300" },
    { id: "preto", label: "Preto", color: "bg-black border-gray-300" },
    { id: "azul", label: "Azul", color: "bg-blue-500 border-gray-300" },
    { id: "vermelho", label: "Vermelho", color: "bg-red-500 border-gray-300" },
    { id: "verde", label: "Verde", color: "bg-green-500 border-gray-300" },
    { id: "amarelo", label: "Amarelo", color: "bg-yellow-400 border-gray-300" },
    { id: "cinza", label: "Cinza", color: "bg-gray-400 border-gray-300" },
    { id: "rosa", label: "Rosa", color: "bg-pink-400 border-gray-300" },
    { id: "laranja", label: "Laranja", color: "bg-orange-400 border-gray-300" },
    { id: "roxo", label: "Roxo", color: "bg-purple-500 border-gray-300" },
    { id: "bege", label: "Bege", color: "bg-amber-200 border-gray-300" },
    { id: "marrom", label: "Castanho", color: "bg-amber-800 border-gray-300" }
  ]

  const updateURL = (newCores: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    if (newCores.length > 0) {
      newSearchParams.set("cor", newCores.join(","))
    } else {
      newSearchParams.delete("cor")
    }
    
    // Remover parâmetro de página quando mudar de cor para voltar à página 1
    newSearchParams.delete("pagina")
    
    router.push(`${basePath}?${newSearchParams.toString()}`)
  }

  const handleCorChange = (cor: string) => {
    // Seleção única: se a cor já está selecionada, desmarca; senão, seleciona apenas esta cor
    const newCores = cores.includes(cor) ? [] : [cor]
    
    setCores(newCores)
    updateURL(newCores)
  }

  const clearAllFilters = () => {
    setCores([])
    // Limpar filtros também remove a página para voltar à página 1
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("cor")
    newSearchParams.delete("pagina")
    router.push(`${basePath}?${newSearchParams.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filtrar por Cor</h3>
        {cores.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Limpar</span>
            <span className="sm:hidden">×</span>
          </Button>
        )}
      </div>

      {/* Cores Selecionadas - mais compacto no mobile */}
      {cores.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {cores.map((cor) => {
              const corInfo = coresDisponiveis.find(c => c.id === cor)
              return (
                <Badge
                  key={cor}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 text-xs"
                >
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${corInfo?.color}`}></div>
                  <span className="hidden sm:inline">{corInfo?.label}</span>
                  <button
                    onClick={() => handleCorChange(cor)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Grid de Cores - mais compacto no mobile */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2">
        {coresDisponiveis.map((cor) => (
          <button
            key={cor.id}
            onClick={() => handleCorChange(cor.id)}
            className={`
              flex flex-col items-center p-1 sm:p-2 rounded-md sm:rounded-lg border-2 transition-all duration-200 hover:scale-105
              ${cores.includes(cor.id) 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${cor.color} mb-0.5 sm:mb-1`}></div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {cor.label}
            </span>
          </button>
        ))}
      </div>

      {/* Contador de Filtros - mais compacto */}
      {cores.length > 0 && (
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
          Cor selecionada: {coresDisponiveis.find(c => c.id === cores[0])?.label}
        </div>
      )}
    </div>
  )
}
