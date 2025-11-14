"use client"

import { useState } from "react"
import { usePartnerAuth } from "./partner-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LogOut, Trophy, TrendingUp, Calendar, DollarSign, Loader2 } from "lucide-react"

export function PartnerDashboard() {
  const { partner, signOut, refreshPartnerData } = usePartnerAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState("")

  if (!partner) {
    return null
  }

  const { stats } = partner

  // Debug: verificar dados do parceiro
  console.log('PartnerDashboard - partner:', partner)
  console.log('PartnerDashboard - stats:', stats)
  console.log('PartnerDashboard - stats type:', typeof stats)

  // Verificar se stats existe - se não existir, tentar buscar novamente
  const isLoadingStats = !stats || !stats.monthly || !stats.weekly || !stats.total

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Olá, {partner.name}!</h1>
          <p className="text-muted-foreground">
            Código de desconto: <span className="font-mono font-semibold">{partner.discount_code}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              setIsRefreshing(true)
              setRefreshMessage("")
              try {
                await refreshPartnerData()
                setRefreshMessage("✅ Dados atualizados com sucesso!")
                setTimeout(() => setRefreshMessage(""), 3000)
              } catch (error) {
                setRefreshMessage("❌ Erro ao atualizar dados")
                setTimeout(() => setRefreshMessage(""), 3000)
              }
              setIsRefreshing(false)
            }}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trophy className="mr-2 h-4 w-4" />
            )}
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {refreshMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
          {refreshMessage}
        </div>
      )}

      {/* Informações do Parceiro */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Parceiro</CardTitle>
          <CardDescription>
            Dados da sua conta e links úteis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Dados da Conta</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="ml-2 font-medium">{partner.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 font-medium">{partner.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Código de Desconto:</span>
                  <span className="ml-2 font-mono font-semibold bg-muted px-2 py-1 rounded">{partner.discount_code}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Links Úteis</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Link do Parceiro:</span>
                  <div className="mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/parceiros/{encodeURIComponent(partner.name)}
                    </code>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Link com Código:</span>
                  <div className="mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/?discount={partner.discount_code}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Mensais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Estatísticas do Mês Atual
          </CardTitle>
          <CardDescription>
            Dados atualizados em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando estatísticas...</p>
              <p className="text-xs text-muted-foreground mt-2">
                Stats: {stats ? 'Existe' : 'Não existe'} | 
                Monthly: {stats?.monthly ? 'Existe' : 'Não existe'} | 
                Weekly: {stats?.weekly ? 'Existe' : 'Não existe'} | 
                Total: {stats?.total ? 'Existe' : 'Não existe'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  €{stats.monthly.total.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Faturado</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  €{stats.monthly.commission.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Comissão (10%)</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  #{stats.monthly.rank || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Posição no Ranking</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Semanais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas da Semana
          </CardTitle>
          <CardDescription>
            Reset automático às segundas-feiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando estatísticas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  €{stats.weekly.total.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Faturado</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  €{stats.weekly.commission.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Comissão (10%)</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estatísticas Gerais
          </CardTitle>
          <CardDescription>
            Desde o início da parceria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando estatísticas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  €{stats.total.total.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Faturado</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  €{stats.total.commission.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Comissão Total</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Como funciona:</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Ganhas 10% sobre encomendas pagas com o teu código</li>
              <li>Ranking mensal: reset automático no dia 1 de cada mês</li>
              <li>🏆 Vencedor: parceiro com mais vendas no mês ganha uma camisola grátis</li>
              <li>📊 Ganhos semanais: reset automático às segundas-feiras às 00:00h</li>
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-semibold">Pagamentos:</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Pagamento semanal das comissões</li>
              <li>Formas: MB WAY ou Transferência Bancária</li>
              <li>Baseado nas encomendas pagas dos últimos 7 dias</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

