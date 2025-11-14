"use client"

import Link from "next/link"
import { useState, useEffect, use } from "react"
import EarningsFilters from "@/components/earnings-filters"

async function fetchJSON(path: string) {
  try {
    const res = await fetch(path, { cache: 'no-store' })
    if (!res.ok) {
      console.error(`Erro na API: ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error("Erro ao fazer fetch:", error)
    return null
  }
}

export default function ParceiroPage({ params, searchParams }: { params: Promise<{ name: string }>, searchParams: Promise<{ page?: string, filter?: string, customStart?: string, customEnd?: string }> }) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)
  const name = decodeURIComponent(resolvedParams.name)
  const page = Number(resolvedSearchParams?.page || 1)
  const [currentFilter, setCurrentFilter] = useState(resolvedSearchParams?.filter || "currentWeek")
  const [customStart, setCustomStart] = useState(resolvedSearchParams?.customStart || "")
  const [customEnd, setCustomEnd] = useState(resolvedSearchParams?.customEnd || "")
  
  const [orders, setOrders] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [partnerName, setPartnerName] = useState(name)
  const [currentCommission, setCurrentCommission] = useState(0)
  const [previousWeekCommission, setPreviousWeekCommission] = useState<number | null>(null)
  // Removidos cartões mensal e total
  const [monthlyRanking, setMonthlyRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Construir URL da API com filtros
      let earningsUrl = `/api/partners/${encodeURIComponent(name)}/earnings?filter=${currentFilter}`
      if (currentFilter === "custom" && customStart && customEnd) {
        earningsUrl += `&customStart=${customStart}&customEnd=${customEnd}`
      }
      
      const [ordersData, earningsData, _earningsMonthly, _earningsTotal, monthly] = await Promise.all([
        fetchJSON(`/api/partners/${encodeURIComponent(name)}/orders?page=${page}&limit=20`),
        fetchJSON(earningsUrl),
        fetchJSON(`/api/partners/${encodeURIComponent(name)}/earnings?filter=monthly`),
        fetchJSON(`/api/partners/${encodeURIComponent(name)}/earnings?filter=total`),
        fetchJSON(`/api/partners/ranking?period=monthly`),
      ])

      setOrders(Array.isArray(ordersData?.orders) ? ordersData.orders : [])
      setPagination(ordersData?.pagination || { page: 1, totalPages: 1 })
      setPartnerName(ordersData?.partner?.name || name)
      setCurrentCommission(earningsData?.commission || 0)
      setPreviousWeekCommission(earningsData?.previousWeekCommission || null)
      // Mensal/Total não usados aqui
      setMonthlyRanking(Array.isArray(monthly?.ranking) ? monthly.ranking : [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [name, page, currentFilter, customStart, customEnd])

  const handleFilterChange = (newFilter: string, customStart?: string, customEnd?: string) => {
    setCurrentFilter(newFilter)
    if (newFilter === "custom" && customStart && customEnd) {
      setCustomStart(customStart)
      setCustomEnd(customEnd)
    } else {
      setCustomStart("")
      setCustomEnd("")
    }
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center">A carregar...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parceiro: {partnerName}</h1>
        <Link href="/parceiros" className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-50">Ir para o Ranking</Link>
      </div>



      {/* Filtros de Período */}
      <EarningsFilters 
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Cards de Ganhos */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="p-4 rounded border bg-white">
          <div className="text-sm text-gray-600">Ganhos ({getFilterLabel(currentFilter)})</div>
          <div className="text-2xl font-bold">€{Number(currentCommission).toFixed(2)}</div>
          {previousWeekCommission !== null && (
            <div className="text-sm mt-1">
              <span className="text-gray-500">vs semana anterior: </span>
              <span className={previousWeekCommission < currentCommission ? "text-green-600" : "text-red-600"}>
                €{Number(previousWeekCommission).toFixed(2)}
              </span>
              {previousWeekCommission !== currentCommission && (
                <span className={`ml-1 ${previousWeekCommission < currentCommission ? "text-green-600" : "text-red-600"}`}>
                  ({previousWeekCommission < currentCommission ? "+" : ""}{((currentCommission - previousWeekCommission) / previousWeekCommission * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">Os ganhos são calculados apenas sobre encomendas marcadas como pagas pelo administrador.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded border bg-white">
          <div className="p-4 border-b font-semibold">Encomendas com o teu código</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">N.º</th>
                  <th className="px-4 py-2 text-left">Cliente</th>
                  <th className="px-4 py-2 text-left">Itens</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-2">{o.order_number || o.id}</td>
                    <td className="px-4 py-2">{o.customer_name || '-'}</td>
                    <td className="px-4 py-2">{Array.isArray(o.items) ? o.items.length : '-'}</td>
                    <td className="px-4 py-2">€{Number(o.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">{o.payment_status === 'paid' ? 'Pago' : (o.status || '—')}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={5}>Sem encomendas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const p = idx + 1
              const href = `/parceiros/${encodeURIComponent(name)}?page=${p}`
              const isActive = p === pagination.page
              return (
                <Link key={p} href={href} className={`px-3 py-1 rounded border text-sm ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>
                  {p}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar: Ranking Mensal */}
        <div className="space-y-4">
          <div className="rounded border bg-white">
            <div className="p-3 border-b font-semibold">Ranking Mensal</div>
            <div className="divide-y">
              {monthlyRanking.slice(0, 10).map((row: any, idx: number) => (
                <Link key={row.discount_code} href={`/parceiros/${encodeURIComponent(row.partner)}`} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center text-sm">{idx+1}</span>
                    <span className="text-sm text-gray-800">{row.partner}</span>
                  </div>
                  <span className="text-sm font-medium">€{row.total.toFixed(2)}</span>
                </Link>
              ))}
              {monthlyRanking.length === 0 && <div className="p-3 text-sm text-gray-600">Sem dados</div>}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}


