"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { tamanhosCrianca, tamanhosBebe } from "@/lib/types"

interface SizeSelectorProps {
  onChange?: (size: string) => void
  categoria?: string
  subcategoria?: string
}

export function SizeSelector({ onChange, categoria, subcategoria }: SizeSelectorProps) {
  const tamanhosAdulto = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
  const tamanhosSneakers = ["36", "36.5", "37.5", "38", "38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "45"]
  const [selectedSize, setSelectedSize] = useState<string>("")

  // Se for categoria criança, usar apenas tamanhos de criança
  // Se for subcategoria bebé, usar apenas tamanhos de bebé
  // Se for sneakers, usar apenas tamanhos de calçado (36-45)
  // Se for outra categoria, usar tamanhos adulto + infantis
  const tamanhos = categoria === "body"
    ? tamanhosBebe
    : categoria === "crianca" 
    ? tamanhosCrianca 
    : subcategoria === "sneakers" 
    ? tamanhosSneakers
    : [...tamanhosAdulto, ...tamanhosCrianca.map(t => `${t} years`)]

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    if (onChange) {
      onChange(size)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tamanhos.map((size) => (
        <button
          key={size}
          type="button"
          className={cn(
            "rounded-md border font-medium transition-colors px-3 py-2",
            selectedSize === size
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background hover:bg-muted",
          )}
          onClick={() => handleSizeChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
