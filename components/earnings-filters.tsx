"use client"

import { useState } from "react"

interface EarningsFiltersProps {
  currentFilter: string
  onFilterChange: (filter: string, customStart?: string, customEnd?: string) => void
}

export default function EarningsFilters({ currentFilter, onFilterChange }: EarningsFiltersProps) {
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  const handleFilterChange = (filter: string) => {
    if (filter === "custom") {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      onFilterChange(filter)
    }
  }

  const handleCustomSubmit = () => {
    if (customStart && customEnd) {
      onFilterChange("custom", customStart, customEnd)
    }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getCurrentWeekRange = () => {
    const now = new Date()
    const currentDay = now.getDay()
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
    const start = new Date(now)
    start.setDate(now.getDate() - daysFromMonday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const getPreviousWeekRange = () => {
    const now = new Date()
    const currentDay = now.getDay()
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1
    const start = new Date(now)
    start.setDate(now.getDate() - daysFromMonday - 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="bg-white p-4 rounded border mb-6">
      <h3 className="font-semibold mb-3">Filtros de Período</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => handleFilterChange("today")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "today" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Hoje
        </button>
        
        <button
          onClick={() => handleFilterChange("yesterday")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "yesterday" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Ontem
        </button>
        
        <button
          onClick={() => handleFilterChange("last7days")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "last7days" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Últimos 7 dias
        </button>
        
        <button
          onClick={() => handleFilterChange("last30days")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "last30days" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Últimos 30 dias
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleFilterChange("currentWeek")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "currentWeek" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Semana Atual
          <div className="text-xs opacity-75">({getCurrentWeekRange()})</div>
        </button>
        
        <button
          onClick={() => handleFilterChange("previousWeek")}
          className={`px-3 py-2 text-sm rounded border ${
            currentFilter === "previousWeek" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Semana Anterior
          <div className="text-xs opacity-75">({getPreviousWeekRange()})</div>
        </button>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={() => handleFilterChange("custom")}
          className={`px-3 py-2 text-sm rounded border mb-3 ${
            currentFilter === "custom" 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Intervalo Personalizado
        </button>

        {showCustom && (
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Data Início</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Data Fim</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleCustomSubmit}
              disabled={!customStart || !customEnd}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded border border-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Aplicar
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
        <strong>Reset Automático:</strong> Os ganhos semanais reiniciam sempre às 00:00h de segunda-feira.
      </div>
    </div>
  )
}
