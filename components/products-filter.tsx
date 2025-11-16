"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

export function ProductsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clubeSearch, setClubeSearch] = useState("")

  const categorias = [
    { id: "clubes", label: "Clubs" },
    { id: "selecoes", label: "National Teams" },
    { id: "crianca", label: "Kids Equipment" },
    { id: "body", label: "Baby Body" },
    { id: "retro", label: "Retro" },
  ]

  const clubes = [
    { id: "al-nassr", label: "Al-Nassr" },
    { id: "al-hilal", label: "Al-Hilal" },
    { id: "alverca", label: "Alverca" },
    { id: "ajax", label: "Ajax" },
    { id: "arsenal", label: "Arsenal" },
    { id: "aston-villa", label: "Aston Villa" },
    { id: "athletic-bilbao", label: "Athletic Bilbao" },
    { id: "atletico-madrid", label: "Atlético Madrid" },
    { id: "bahia", label: "Bahia" },
    { id: "barcelona", label: "Barcelona" },
    { id: "bayern-munich", label: "Bayern Munich" },
    { id: "benfica", label: "Benfica" },
    { id: "birmingham-city", label: "Birmingham City" },
    { id: "borussia-dortmund", label: "Borussia Dortmund" },
    { id: "brighton", label: "Brighton & Hove Albion" },
    { id: "burnley", label: "Burnley" },
    { id: "celtic", label: "Celtic" },
    { id: "chelsea", label: "Chelsea" },
    { id: "cardiff-city-fc", label: "Cardiff City FC" },
    { id: "chivas", label: "Chivas" },
    { id: "como", label: "Como" },
    { id: "crystal-palace", label: "Crystal Palace" },
    { id: "everton", label: "Everton" },
    { id: "famalicao", label: "Famalicão" },
    { id: "fiorentina", label: "Fiorentina" },
    { id: "flamengo", label: "Flamengo" },
    { id: "fulham", label: "Fulham" },
    { id: "inter", label: "Inter de Milão" },
    { id: "inter-miami", label: "Inter Miami" },
    { id: "ipswich-town", label: "Ipswich Town" },
    { id: "juventus", label: "Juventus" },
    { id: "lazio", label: "Lazio" },
    { id: "leeds-united", label: "Leeds United" },
    { id: "leicester", label: "Leicester City" },
    { id: "lille", label: "Lille" },
    { id: "liverpool", label: "Liverpool" },
    { id: "lyon", label: "Lyon" },
    { id: "manchester-city", label: "Manchester City" },
    { id: "manchester-united", label: "Manchester United" },
    { id: "marselha", label: "Marselha" },
    { id: "milan", label: "Milan" },
    { id: "napoli", label: "Napoli" },
    { id: "newcastle-united", label: "Newcastle United" },
    { id: "norwich-city", label: "Norwich City" },
    { id: "osasuna", label: "Osasuna" },
    { id: "palmeiras", label: "Palmeiras" },
    { id: "plymouth-argyle", label: "Plymouth Argyle" },
    { id: "porto", label: "Porto" },
    { id: "portugal", label: "Portugal" },
    { id: "psg", label: "PSG" },
    { id: "real-betis", label: "Real Betis" },
    { id: "real-madrid", label: "Real Madrid" },
    { id: "river-plate", label: "River Plate" },
    { id: "roma", label: "Roma" },
    { id: "sc-braga", label: "SC Braga" },
    { id: "sao-paulo", label: "São Paulo" },
    { id: "sevilla", label: "Sevilla" },
    { id: "sheffield-united", label: "Sheffield United" },
    { id: "sporting", label: "Sporting" },
    { id: "sunderland", label: "Sunderland" },
    { id: "tottenham", label: "Tottenham" },
    { id: "victoria", label: "Victoria" },
    { id: "vitoria-sc", label: "Vitória SC" },
    { id: "west-ham", label: "West Ham United" },
    { id: "wolves", label: "Wolves" },
    { id: "zaragoza", label: "Zaragoza" },
  ]

  const ligas = [
    { id: "liga-portuguesa", label: "Portuguese League" },
    { id: "premier-league", label: "Premier League" },
    { id: "la-liga", label: "La Liga" },
    { id: "ligue-1", label: "Ligue 1" },
    { id: "serie-a", label: "Serie A" },
    { id: "bundesliga", label: "Bundesliga" },
    { id: "brasileirao", label: "Brasileirão" },
    { id: "saudi-league", label: "Saudi Pro League" },
    { id: "mls", label: "MLS" },
    { id: "eredivisie", label: "Eredivisie" },
    { id: "scottish-premiership", label: "Scottish Premiership" },
    { id: "selecoes-nacionais", label: "National Teams" },
    { id: "outras-ligas", label: "Other Leagues" }
  ]

  const handleFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (params.get(type) === value) {
      params.delete(type)
    } else {
      params.set(type, value)
    }

    router.push(`/catalogo?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push("/catalogo")
  }

  // Filtrar clubes baseado na pesquisa
  const clubesFiltrados = clubes.filter(clube => clube.label.toLowerCase().includes(clubeSearch.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categorias", "versao", "clubes", "ligas"]}>
        <AccordionItem value="categorias">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`categoria-${categoria.id}`}
                    checked={searchParams.get("categoria") === categoria.id}
                    onCheckedChange={() => handleFilter("categoria", categoria.id)}
                  />
                  <Label htmlFor={`categoria-${categoria.id}`} className="cursor-pointer">
                    {categoria.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="versao">
          <AccordionTrigger>Versão</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="versao-adepto"
                  checked={searchParams.get("versao") === "adepto"}
                  onCheckedChange={() => handleFilter("versao", "adepto")}
                />
                <Label htmlFor="versao-adepto" className="cursor-pointer">
                  Camisola de Adepto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="versao-jogador"
                  checked={searchParams.get("versao") === "jogador"}
                  onCheckedChange={() => handleFilter("versao", "jogador")}
                />
                <Label htmlFor="versao-jogador" className="cursor-pointer">
                  Camisola de Jogador
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Clubs</h4>
          
          {/* Barra de pesquisa para clubes */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search club..."
              value={clubeSearch}
              onChange={(e) => setClubeSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Lista de clubes filtrados */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {clubesFiltrados.length > 0 ? (
              clubesFiltrados.map((clube) => (
                <div key={clube.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`clube-${clube.id}`}
                    checked={searchParams.get("clube") === clube.id}
                    onCheckedChange={() => handleFilter("clube", clube.id)}
                  />
                  <Label htmlFor={`clube-${clube.id}`} className="cursor-pointer">
                    {clube.label}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                No club found
              </p>
            )}
          </div>
        </div>

        <AccordionItem value="ligas">
          <AccordionTrigger>Leagues</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ligas.map((liga) => (
                <div key={liga.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`liga-${liga.id}`}
                    checked={searchParams.get("liga") === liga.id}
                    onCheckedChange={() => handleFilter("liga", liga.id)}
                  />
                  <Label htmlFor={`liga-${liga.id}`} className="cursor-pointer">
                    {liga.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
