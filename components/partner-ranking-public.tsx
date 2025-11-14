"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface RankingItem {
  rank: number
  partner_name: string
  total_faturado: number
  discount_code: string
}

interface RankingData {
  success: boolean
  period: string
  periodLabel: string
  ranking: RankingItem[]
  hasData: boolean
}

export function PartnerRankingPublic() {
  const [rankingData, setRankingData] = useState<RankingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/partners/ranking-public')
        const data = await response.json()
        setRankingData(data)
      } catch (error) {
        console.error('Erro ao buscar ranking:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking Mensal</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            A carregar dados...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rankingData || !rankingData.hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking Mensal</CardTitle>
          <CardDescription>
            {rankingData?.periodLabel || "Mês Atual"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Sem dados ainda este mês.
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-amber-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold">#{rank}</span>
    }
  }

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default" as const
      case 2:
        return "secondary" as const
      case 3:
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top 3 Parceiros
        </CardTitle>
        <CardDescription>
          {rankingData.periodLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankingData.ranking.map((item) => (
            <div
              key={item.discount_code}
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.rank === 1 
                  ? 'bg-amber-50 border border-amber-200' 
                  : item.rank === 2
                  ? 'bg-gray-50 border border-gray-200'
                  : item.rank === 3
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(item.rank)}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {item.partner_name || 'Parceiro Desconhecido'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Código: {item.discount_code || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  €{(item.total_faturado || 0).toFixed(2)}
                </div>
                <Badge variant={getRankBadgeVariant(item.rank || 0)} className="text-xs">
                  {(item.rank || 0) === 1 ? '🥇 1º' : (item.rank || 0) === 2 ? '🥈 2º' : '🥉 3º'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {rankingData.ranking.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            Sem dados ainda este mês.
          </div>
        )}
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            🏆 O 1º lugar ganha uma camisola grátis!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

