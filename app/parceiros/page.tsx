import { PartnerAuthGuard } from "@/components/partner-auth-guard"
import { PartnerRankingPublic } from "@/components/partner-ranking-public"

async function fetchJSON(path: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}${path}`, { cache: 'no-store' })
  try { return await res.json() } catch { return null }
}

export default async function ParceirosPublicPage() {
  const monthly = await fetchJSON(`/api/partners/ranking-public`)
  const previousMonth = await fetchJSON(`/api/partners/ranking?period=previous_month`)
  const total = await fetchJSON(`/api/partners/ranking?period=total`)
  const monthlyRanking = Array.isArray(monthly?.ranking) ? monthly.ranking : []
  const previousMonthRanking = Array.isArray(previousMonth?.ranking) ? previousMonth.ranking : []
  const totalRanking = Array.isArray(total?.ranking) ? total.ranking : []
  
  // Verificar se há dados reais do mês anterior
  const hasPreviousMonthData = previousMonth?.hasData === true && 
    previousMonthRanking.length > 0 && 
    previousMonthRanking[0] && 
    previousMonthRanking[0].total > 0
  


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Parceiros</h1>
          <p className="text-sm text-muted-foreground">Ranking mensal com reset no dia 1. O 1.º lugar ganha uma camisola grátis.</p>
          {monthly?.periodLabel && (
            <p className="text-xs text-primary mt-1">📅 {monthly.periodLabel}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal: Dashboard do parceiro ou login */}
          <div className="lg:col-span-2 space-y-6">
            <PartnerAuthGuard />
          </div>

          {/* Sidebar: Ranking público (top 3) */}
          <div className="space-y-6">
            <PartnerRankingPublic />
            
            {/* Último Vencedor do Mês Anterior - Só mostra se houver dados */}
            {hasPreviousMonthData && (
              <div className="rounded border border-border bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="p-3 border-b border-border font-semibold text-amber-800">🏆 Vencedor do Mês Anterior</div>
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-center leading-8 font-bold">1</div>
                    <div className="flex flex-col">
                      <div className="text-primary font-medium">
                        {previousMonthRanking[0].partner}
                      </div>
                      <span className="text-xs text-muted-foreground">Código: {previousMonthRanking[0].discount_code}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <div className="font-semibold text-amber-800">€{previousMonthRanking[0].total.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Vendas do mês anterior</div>
                  </div>
                  {previousMonth?.periodLabel && (
                    <div className="text-xs text-muted-foreground mt-1">📅 {previousMonth.periodLabel}</div>
                  )}
                </div>
              </div>
            )}

            {/* Informações sobre o programa */}
            <div className="rounded border border-border bg-card p-4 text-card-foreground">
              <h2 className="font-semibold mb-2 text-foreground">Como funciona</h2>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Ganhos: 10% sobre encomendas pagas com o teu código.</li>
                <li>Ranking mensal: reset automático no dia 1 de cada mês.</li>
                <li>🏆 Vencedor: parceiro com mais vendas no mês ganha uma camisola grátis.</li>
                <li>📊 Ganhos semanais: reset automático às segundas-feiras às 00:00h.</li>
              </ul>
            </div>

            {/* Secção de Pagamentos */}
            <div className="rounded border border-border bg-card p-4 text-card-foreground">
              <h2 className="font-semibold mb-2 text-foreground">Pagamentos aos parceiros</h2>
              <p className="text-sm text-muted-foreground mb-2">
                O pagamento das comissões é efetuado <span className="font-medium">semanalmente</span> com base nas
                encomendas marcadas como pagas durante os últimos 7 dias.
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Formas de pagamento: <span className="font-medium">MB WAY</span> ou <span className="font-medium">Transferência Bancária</span>.</li>
                <li>É necessário fornecer o <span className="font-medium">número MB WAY</span> ou <span className="font-medium">IBAN</span> para processamento.</li>
                <li>Valores correspondem a <span className="font-medium">10%</span> das encomendas pagas com o teus código.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}


