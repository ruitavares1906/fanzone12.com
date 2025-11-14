"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { modelosApple, modelosSamsung } from "@/lib/types"
import type { Product } from "@/lib/types"

interface PhoneCaseSelectorProps {
  product: Product
  onSelectionChange?: (marca: string, modelo: string) => void
}

export function PhoneCaseSelector({ product, onSelectionChange }: PhoneCaseSelectorProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<"Apple" | "Samsung" | "">("")
  const [selectedModel, setSelectedModel] = useState("")

  // Garantir hidratação consistente
  useEffect(() => {
    setMounted(true)
    // Se o produto já tem marca e modelo definidos, considere-os selecionados
    if (product.marcaTelemovel) {
      setSelectedBrand(product.marcaTelemovel)
    }
    if (product.modeloTelemovel) {
      setSelectedModel(product.modeloTelemovel)
    }
  }, [])

  useEffect(() => {
    if (onSelectionChange) {
      if (selectedBrand && selectedModel) {
        onSelectionChange(selectedBrand, selectedModel)
      } else {
        // Se não tiver ambos selecionados, envia string vazia
        onSelectionChange("", "")
      }
    }
  }, [selectedBrand, selectedModel, onSelectionChange])

  const handleBrandChange = (brand: "Apple" | "Samsung") => {
    setSelectedBrand(brand)
    setSelectedModel("") // Reset modelo quando mudar a marca
  }

  const getModels = () => {
    if (selectedBrand === "Apple") return modelosApple
    if (selectedBrand === "Samsung") return modelosSamsung
    return []
  }

  // Renderizar placeholder durante SSR para evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold">Selecione o seu telemóvel</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Selecione o seu telemóvel</h3>

      {/* Seletor de Marca */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Marca *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleBrandChange("Apple")}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center justify-center gap-2
              ${
                selectedBrand === "Apple"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }
            `}
          >
            <Image
              src="/images/apple.png"
              alt="Apple"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className={`font-medium ${selectedBrand === "Apple" ? "text-blue-700" : "text-gray-700"}`}>
              Apple
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleBrandChange("Samsung")}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center justify-center gap-2
              ${
                selectedBrand === "Samsung"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }
            `}
          >
            <Image
              src="/images/samsung.png"
              alt="Samsung"
              width={60}
              height={60}
              className="object-contain"
            />
            <span className={`font-medium ${selectedBrand === "Samsung" ? "text-blue-700" : "text-gray-700"}`}>
              Samsung
            </span>
          </button>
        </div>
      </div>

      {/* Seletor de Modelo */}
      {selectedBrand && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Modelo *
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="">Selecione o modelo...</option>
            {getModels().map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {selectedBrand === "Apple" ? `${modelosApple.length} modelos disponíveis` : `${modelosSamsung.length} modelos disponíveis`}
          </p>
        </div>
      )}

      {/* Confirmação da seleção */}
      {selectedBrand && selectedModel && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm font-medium text-green-800">
              Capa para {selectedBrand} {selectedModel}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

