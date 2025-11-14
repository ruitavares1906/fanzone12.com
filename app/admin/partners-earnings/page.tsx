"use client"

import { useState, useEffect } from "react"
import EarningsFilters from "@/components/earnings-filters"

interface PartnerEarning {
  id: string
  name: string
  discount_code: string
  totalPaid: number
  commission: number
  ordersCount: number
  isPaid: boolean
  paidAt: string | null
  paymentReference: string | null
  dateRange: {
    start: string
    end: string
  }
}

interface EarningsData {
  filter: string
  dateRange: {
    start: string
    end: string
  }
  partners: PartnerEarning[]
  summary: {
    totalPartners: number
    totalCommission: number
    totalPaid: number
    totalOrders: number
    unpaidPreviousWeek?: number
  }
}

export default function PartnersEarningsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentFilter, setCurrentFilter] = useState("currentWeek")
  const [offset, setOffset] = useState(0)
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  const fetchEarnings = async (filter: string, customStart?: string, customEnd?: string) => {
    setLoading(true)
    try {
      let url = `/api/admin/partners-earnings?filter=${filter}&offset=${offset}`
      if (filter === "custom" && customStart && customEnd) {
        url += `&customStart=${customStart}&customEnd=${customEnd}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      // Debug temporário
      console.log('DEBUG - API Response:', data)
      
      if (data.error) {
        console.error("Erro da API:", data.error)
        setEarningsData(null)
      } else {
        setEarningsData(data)
      }
    } catch (error) {
      console.error("Erro ao buscar ganhos:", error)
      setEarningsData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEarnings(currentFilter, customStart, customEnd)
  }, [currentFilter, customStart, customEnd, offset])

  const handleFilterChange = (filter: string, customStart?: string, customEnd?: string) => {
    setCurrentFilter(filter)
    setOffset(0)
    if (filter === "custom" && customStart && customEnd) {
      setCustomStart(customStart)
      setCustomEnd(customEnd)
    } else {
      setCustomStart("")
      setCustomEnd("")
    }
  }

  const handlePrevPeriod = () => setOffset((v) => v + 1)
  const handleNextPeriod = () => setOffset((v) => Math.max(0, v - 1))

  const handleMarkAsPaid = async (partnerId: string, periodStart: string, periodEnd: string) => {
    setProcessingPayment(partnerId)
    try {
      const response = await fetch("/api/admin/partners-earnings/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerId,
          periodStart,
          periodEnd,
          paymentReference: paymentReference || null
        })
      })

      if (response.ok) {
        // Recarregar dados
        await fetchEarnings(currentFilter, customStart, customEnd)
        setPaymentReference("")
      } else {
        alert("Erro ao marcar como pago")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao marcar como pago")
    } finally {
      setProcessingPayment(null)
    }
  }

  const handleMarkAsUnpaid = async (partnerId: string, periodStart: string, periodEnd: string) => {
    setProcessingPayment(partnerId)
    try {
      const response = await fetch("/api/admin/partners-earnings/pay", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerId,
          periodStart,
          periodEnd
        })
      })

      if (response.ok) {
        // Recarregar dados
        await fetchEarnings(currentFilter, customStart, customEnd)
      } else {
        alert("Erro ao marcar como não pago")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao marcar como não pago")
    } finally {
      setProcessingPayment(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT")
  }

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case "today": return "Hoje"
      case "yesterday": return "Ontem"
      case "last7days": return "Últimos 7 dias"
      case "last30days": return "Últimos 30 dias"
      case "currentWeek": return "Semana Atual"
      case "previousWeek": return "Semana Anterior"
      case "custom": return "Intervalo Personalizado"
      default: return "Período Selecionado"
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">A carregar...</div>
      </div>
    )
  }

  if (!earningsData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center text-red-600">
          <p>Erro ao carregar dados dos parceiros.</p>
          <p className="text-sm text-gray-600 mt-2">Verifica o console para mais detalhes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Ganhos dos Parceiros</h1>
        <p className="text-gray-600">Painel administrativo para controlar pagamentos aos parceiros</p>
      </div>

      {/* Filtros de Período */}
      <EarningsFilters 
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Navegação por período */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={handlePrevPeriod} className="px-3 py-1 rounded border bg-white hover:bg-gray-50">⟵ Anterior</button>
        <button onClick={handleNextPeriod} disabled={offset===0} className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50">Seguinte ⟶</button>
        <span className="text-sm text-gray-600">Offset: {offset}</span>
      </div>

      {/* Resumo */}
      {earningsData && earningsData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-4 rounded border bg-white">
            <div className="text-sm text-gray-600">Total de Parceiros</div>
            <div className="text-2xl font-bold">{earningsData.summary.totalPartners || 0}</div>
          </div>
          <div className="p-4 rounded border bg-white">
            <div className="text-sm text-gray-600">Comissões a Pagar</div>
            <div className="text-2xl font-bold text-red-600">€{(earningsData.summary.totalCommission || 0).toFixed(2)}</div>
          </div>
          {typeof earningsData.summary.unpaidPreviousWeek === 'number' && earningsData.summary.unpaidPreviousWeek > 0 && (
            <div className="p-4 rounded border bg-yellow-50 border-yellow-200">
              <div className="text-sm text-yellow-800">Comissões em dívida (semana anterior)</div>
              <div className="text-2xl font-bold text-yellow-700">€{(earningsData.summary.unpaidPreviousWeek || 0).toFixed(2)}</div>
            </div>
          )}
          <div className="p-4 rounded border bg-white">
            <div className="text-sm text-gray-600">Total Vendido</div>
            <div className="text-2xl font-bold">€{(earningsData.summary.totalPaid || 0).toFixed(2)}</div>
          </div>
          <div className="p-4 rounded border bg-white">
            <div className="text-sm text-gray-600">Total Encomendas</div>
            <div className="text-2xl font-bold">{earningsData.summary.totalOrders || 0}</div>
          </div>
        </div>
      )}

      {/* Lista de Parceiros */}
      {earningsData && earningsData.partners && earningsData.partners.length > 0 ? (
        <div className="bg-white rounded border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Parceiros com Ganhos - {getFilterLabel(earningsData.filter)}
            </h2>
            {earningsData.dateRange.start && earningsData.dateRange.end && (
              <p className="text-sm text-gray-600">
                {formatDate(earningsData.dateRange.start)} - {formatDate(earningsData.dateRange.end)}
              </p>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parceiro</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Encomendas</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Vendido</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comissão (10%)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earningsData.partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{partner.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        Código: {partner.discount_code}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{partner.ordersCount}</td>
                    <td className="px-4 py-3 text-sm">€{partner.totalPaid.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-green-600">€{partner.commission.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        partner.isPaid 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {partner.isPaid ? "Pago" : "Não Pago"}
                      </span>
                      {partner.paidAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(partner.paidAt)}
                        </div>
                      )}
                      {partner.paymentReference && (
                        <div className="text-xs text-gray-500">
                          Ref: {partner.paymentReference}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!partner.isPaid ? (
                          <button
                            onClick={() => handleMarkAsPaid(
                              partner.id, 
                              earningsData.dateRange.start.split('T')[0], 
                              earningsData.dateRange.end.split('T')[0]
                            )}
                            disabled={processingPayment === partner.id}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {processingPayment === partner.id ? "Processando..." : "Marcar Pago"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsUnpaid(
                              partner.id, 
                              earningsData.dateRange.start.split('T')[0], 
                              earningsData.dateRange.end.split('T')[0]
                            )}
                            disabled={processingPayment === partner.id}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            {processingPayment === partner.id ? "Processando..." : "Marcar Não Pago"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded border p-8 text-center">
          <p className="text-gray-600">Nenhum parceiro com ganhos no período selecionado.</p>
        </div>
      )}

      {/* Modal para referência de pagamento */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Referência de Pagamento</h3>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Ex: MB WAY 123456789, Transferência ref. ABC123"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setProcessingPayment(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const partner = earningsData?.partners.find(p => p.id === processingPayment)
                  if (partner) {
                    handleMarkAsPaid(
                      partner.id, 
                      earningsData!.dateRange.start.split('T')[0], 
                      earningsData!.dateRange.end.split('T')[0]
                    )
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
