"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { useState, useEffect } from "react"

export function SneakersFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [precoMin, setPrecoMin] = useState(searchParams.get("precoMin") || "")
  const [precoMax, setPrecoMax] = useState(searchParams.get("precoMax") || "")
  const [pesquisa, setPesquisa] = useState(searchParams.get("pesquisa") || "")
  const [cores, setCores] = useState<string[]>(searchParams.get("cor")?.split(",") || [])
  const [marcas, setMarcas] = useState<string[]>(searchParams.get("marca")?.split(",") || [])

  const coresDisponiveis = ["branco", "preto", "azul", "vermelho", "verde", "amarelo", "cinza", "rosa"]
  const marcasDisponiveis = ["nike", "adidas", "puma"]

  const updateURL = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })
    
    router.push(`?${newSearchParams.toString()}`)
  }

  const handlePrecoChange = (values: number[]) => {
    setPrecoMin(values[0].toString())
    setPrecoMax(values[1].toString())
    updateURL({ precoMin: values[0].toString(), precoMax: values[1].toString() })
  }

  const handlePesquisa = () => {
    updateURL({ pesquisa })
  }

  const handleCorChange = (cor: string) => {
    const novasCores = cores.includes(cor)
      ? cores.filter(c => c !== cor)
      : [...cores, cor]
    setCores(novasCores)
    updateURL({ cor: novasCores.length > 0 ? novasCores.join(",") : undefined })
  }

  const handleMarcaChange = (marca: string) => {
    const novasMarcas = marcas.includes(marca)
      ? marcas.filter(m => m !== marca)
      : [...marcas, marca]
    setMarcas(novasMarcas)
    updateURL({ marca: novasMarcas.length > 0 ? novasMarcas.join(",") : undefined })
  }

  const limparFiltros = () => {
    setPrecoMin("")
    setPrecoMax("")
    setPesquisa("")
    setCores([])
    setMarcas([])
    router.push("")
  }

  const filtrosAtivos = [
    precoMin || precoMax ? "Preço" : null,
    pesquisa ? "Pesquisa" : null,
    cores.length > 0 ? "Cor" : null,
    marcas.length > 0 ? "Marca" : null,
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        {filtrosAtivos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limparFiltros}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {filtrosAtivos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtrosAtivos.map((filtro) => (
            <Badge key={filtro} variant="secondary" className="text-xs">
              {filtro}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Search */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Pesquisar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar sneakers..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePesquisa()}
            className="pl-10"
          />
        </div>
        <Button onClick={handlePesquisa} size="sm" className="w-full">
          Pesquisar
        </Button>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Intervalo de Preço</Label>
        <div className="space-y-4">
          <Slider
            value={[parseInt(precoMin) || 0, parseInt(precoMax) || 200]}
            onValueChange={handlePrecoChange}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-gray-500">Mín</Label>
              <Input
                type="number"
                placeholder="0"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-gray-500">Máx</Label>
              <Input
                type="number"
                placeholder="200"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Cor</Label>
        <div className="space-y-2">
          {coresDisponiveis.map((cor) => (
            <div key={cor} className="flex items-center space-x-2">
              <Checkbox
                id={`cor-${cor}`}
                checked={cores.includes(cor)}
                onCheckedChange={() => handleCorChange(cor)}
              />
              <Label
                htmlFor={`cor-${cor}`}
                className="text-sm font-normal capitalize cursor-pointer"
              >
                {cor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Marca</Label>
        <div className="space-y-2">
          {marcasDisponiveis.map((marca) => (
            <div key={marca} className="flex items-center space-x-2">
              <Checkbox
                id={`marca-${marca}`}
                checked={marcas.includes(marca)}
                onCheckedChange={() => handleMarcaChange(marca)}
              />
              <Label
                htmlFor={`marca-${marca}`}
                className="text-sm font-normal capitalize cursor-pointer"
              >
                {marca}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 