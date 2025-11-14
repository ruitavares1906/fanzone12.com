"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsSort() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("ordenar", value)
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <Select defaultValue={searchParams.get("ordenar") || "recentes"} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recentes">Mais Recentes</SelectItem>
        <SelectItem value="preco-asc">Preço: Menor para Maior</SelectItem>
        <SelectItem value="preco-desc">Preço: Maior para Menor</SelectItem>
        <SelectItem value="populares">Mais Populares</SelectItem>
        <SelectItem value="avaliacao">Melhor Avaliados</SelectItem>
      </SelectContent>
    </Select>
  )
}
