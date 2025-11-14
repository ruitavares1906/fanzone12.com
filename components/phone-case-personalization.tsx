"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhoneCasePersonalizationProps {
  onChange: (personalization: PersonalizacaoCapa) => void
  enabled?: boolean
  cores?: string[]
  padrao?: string[]
}

export interface PersonalizacaoCapa {
  ativar: boolean
  nome?: string
  numero?: string
  cor?: string
  padrao?: string
}

export function PhoneCasePersonalization({ onChange, enabled = true, cores, padrao }: PhoneCasePersonalizationProps) {
  const [ativar, setAtivar] = useState(true) // Já começa ativo por padrão
  const [nome, setNome] = useState("")
  const [numero, setNumero] = useState("")
  const [cor, setCor] = useState<string>("")
  const [padraoSelecionado, setPadraoSelecionado] = useState<string>("")
  
  // Se tiver cores disponíveis, a cor é obrigatória
  const isCorObrigatoria = cores && cores.length > 0
  const isPadraoObrigatorio = padrao && padrao.length > 0

  // Notificar que está ativo por padrão
  useEffect(() => {
    onChange({ ativar: true })
  }, [])

  if (!enabled) {
    return null
  }

  const handleToggle = (checked: boolean) => {
    setAtivar(checked)
    if (!checked) {
      setNome("")
      setNumero("")
      setCor("")
      setPadraoSelecionado("")
      onChange({ ativar: false })
    } else {
      onChange({
        ativar: true,
        nome: nome || undefined,
        numero: numero || undefined,
        cor: cor || undefined,
        padrao: padraoSelecionado || undefined,
      })
    }
  }

  const handleNomeChange = (value: string) => {
    setNome(value)
    onChange({
      ativar,
      nome: value || undefined,
      numero: numero || undefined,
      cor: cor || undefined,
      padrao: padraoSelecionado || undefined,
    })
  }

  const handleNumeroChange = (value: string) => {
    setNumero(value)
    onChange({
      ativar,
      nome: nome || undefined,
      numero: value || undefined,
      cor: cor || undefined,
      padrao: padraoSelecionado || undefined,
    })
  }

  const handleCorChange = (value: string) => {
    setCor(value)
    onChange({
      ativar,
      nome: nome || undefined,
      numero: numero || undefined,
      cor: value || undefined,
      padrao: padraoSelecionado || undefined,
    })
  }

  const handlePadraoChange = (value: string) => {
    setPadraoSelecionado(value)
    onChange({
      ativar,
      nome: nome || undefined,
      numero: numero || undefined,
      cor: cor || undefined,
      padrao: value || undefined,
    })
  }

  // Função para obter a cor de fundo Tailwind baseada no nome da cor
  const getCorClass = (corNome: string): string => {
    const coresMap: { [key: string]: string } = {
      "Preto": "bg-black border-black",
      "Branco": "bg-white border-gray-300",
      "Azul": "bg-blue-500 border-blue-500",
      "Cinzento": "bg-gray-400 border-gray-400",
      "Cinza": "bg-gray-400 border-gray-400",
      "Laranja": "bg-orange-400 border-orange-400",
      "Verde": "bg-green-500 border-green-500",
      "Rosa": "bg-pink-400 border-pink-400",
      "Amarelo": "bg-yellow-400 border-yellow-400",
      "Roxo": "bg-purple-500 border-purple-500",
      "Vermelho": "bg-red-500 border-red-500",
      "Castanho": "bg-amber-900 border-amber-900",
      "Branco e Castanho": "bg-gradient-to-br from-white via-amber-100 to-amber-900 border-amber-900",
    }
    return coresMap[corNome] || "bg-gray-200 border-gray-300"
  }

  // Se tiver padrões, mostrar apenas seleção de padrões
  if (isPadraoObrigatorio) {
    return (
      <Card className="p-5 mb-6 border-2 border-blue-500">
        <div className="space-y-4">
          {/* Título */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🔢</span>
            <div>
              <h3 className="font-semibold text-gray-900">Selecione o Padrão</h3>
              <p className="text-sm text-gray-600">
                Escolha o padrão desejado
              </p>
            </div>
          </div>

          {/* Seleção de Padrões */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {padrao!.map((padraoNome) => (
                <button
                  key={padraoNome}
                  type="button"
                  onClick={() => handlePadraoChange(padraoNome)}
                  className={`relative px-4 py-3 border-2 rounded-lg transition-all font-semibold ${
                    padraoSelecionado === padraoNome 
                      ? 'bg-blue-500 text-white border-blue-500 ring-4 ring-blue-300 scale-105' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:scale-105'
                  }`}
                >
                  {padraoSelecionado === padraoNome && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                  {padraoNome}
                </button>
              ))}
            </div>
            {padraoSelecionado && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Padrão selecionado: <span className="font-bold text-lg">{padraoSelecionado}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Se tiver cores, mostrar apenas seleção de cor
  if (isCorObrigatoria) {
    return (
      <Card className="p-5 mb-6 border-2 border-blue-500">
        <div className="space-y-4">
          {/* Título */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <div>
              <h3 className="font-semibold text-gray-900">Selecione a Cor da Capa</h3>
              <p className="text-sm text-gray-600">
                Escolha a cor da sua capa personalizada
              </p>
            </div>
          </div>

          {/* Seleção de Cor */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {cores.map((corNome) => (
                <button
                  key={corNome}
                  type="button"
                  onClick={() => handleCorChange(corNome)}
                  className={`relative w-14 h-14 rounded-full border-4 transition-all ${
                    getCorClass(corNome)
                  } ${cor === corNome ? 'ring-4 ring-blue-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                  title={corNome}
                >
                  {cor === corNome && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {cor && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Cor selecionada: <span className="font-bold text-lg">{cor}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Se não tiver cores, mostrar campos de nome/número originais
  return (
    <Card className="p-5 mb-6 border-2 border-gray-200">
      <div className="space-y-4">
        {/* Toggle de Personalização */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <div>
              <h3 className="font-semibold text-gray-900">Personalização</h3>
              <p className="text-sm text-gray-600">
                Adicione nome e/ou número à sua capa
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ativar}
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Campos de Personalização */}
        {ativar && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Personalização GRATUITA</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Adicione nome e/ou número sem custo adicional
                  </p>
                </div>
              </div>
            </div>

            {/* Campo Nome */}
            <div className="space-y-2">
              <Label htmlFor="personalizacao-nome" className="text-sm font-medium flex items-center gap-2">
                <span>👤</span>
                <span>Nome</span>
                <span className="text-xs text-gray-500 font-normal">(opcional)</span>
              </Label>
              <Input
                id="personalizacao-nome"
                type="text"
                value={nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                placeholder="Ex: João Silva"
                maxLength={20}
                className="border-2 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Máximo 20 caracteres. {nome.length}/20
              </p>
            </div>

            {/* Campo Número */}
            <div className="space-y-2">
              <Label htmlFor="personalizacao-numero" className="text-sm font-medium flex items-center gap-2">
                <span>#️⃣</span>
                <span>Número</span>
                <span className="text-xs text-gray-500 font-normal">(opcional)</span>
              </Label>
              <Input
                id="personalizacao-numero"
                type="text"
                value={numero}
                onChange={(e) => handleNumeroChange(e.target.value)}
                placeholder="Ex: 10"
                maxLength={10}
                className="border-2 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Máximo 10 caracteres. {numero.length}/10
              </p>
            </div>

            {/* Preview */}
            {(nome || numero) && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-2 font-medium">
                  Pré-visualização:
                </p>
                <div className="flex flex-col gap-1">
                  {nome && (
                    <div className="text-sm">
                      <span className="text-gray-600">Nome: </span>
                      <span className="font-semibold text-gray-900">{nome}</span>
                    </div>
                  )}
                  {numero && (
                    <div className="text-sm">
                      <span className="text-gray-600">Número: </span>
                      <span className="font-semibold text-gray-900">{numero}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

