"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import type { Personalizacao } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Type, Hash, Sparkles, Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface PersonalizacaoFormProps {
  onChange: (personalizacao: Personalizacao) => void
  clube?: string
}

export function PersonalizacaoForm({ onChange, clube }: PersonalizacaoFormProps) {
  const [ativar, setAtivar] = useState(false)
  const [nome, setNome] = useState("")
  const [numero, setNumero] = useState<string>("")
  const [patches, setPatches] = useState<string[]>([])
  const [fonte, setFonte] = useState<"liga-betclic" | "clube" | "champions-liga-europa">("liga-betclic")

  const isPortugueseClub = ["benfica", "porto", "sporting", "braga", "vitoria-sc"].includes(clube || "")
  const isEnglishClub = ["arsenal", "chelsea", "liverpool", "manchester-city", "manchester-united", "tottenham", "celtic"].includes(clube || "")
  const isLiverpool = clube === "liverpool"
  const isLaLigaClub = ["barcelona", "real-madrid", "real-betis", "atletico-madrid"].includes(clube || "")
  const isLigue1Club = ["psg", "marselha", "lille", "lyon"].includes(clube || "")
  const isBundesligaClub = ["borussia-dortmund", "rb-leipzig", "bayern-munich"].includes(clube || "")
  const isSerieAClub = ["lazio", "ac-milan", "milan", "inter", "juventus", "napoli", "roma", "fiorentina"].includes(clube || "")
  const isNationalTeam = ["portugal", "alemanha", "italia", "espanha", "brasil", "argentina", "franca", "inglaterra", "holanda"].includes(clube || "")

  const handleChange = (field: keyof Personalizacao, value: any) => {
    let updatedPersonalizacao: Personalizacao = {
      ativar,
      nome: nome || undefined,
      numero: numero ? parseInt(numero) : undefined,
      patches: patches || [],
      fonte: fonte,
    }
    
    if (field === "ativar") {
      setAtivar(value)
      updatedPersonalizacao.ativar = value
      if (!value) {
        setNome("")
        setNumero("")
        setPatches([])
        updatedPersonalizacao = {
          ativar: false,
          nome: undefined,
          numero: undefined,
          patches: [],
        }
      }
    } else if (field === "nome") {
      setNome(value)
      updatedPersonalizacao.nome = value || undefined
    } else if (field === "numero") {
      // Permitir apenas números de 0-99
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0 && num <= 99) {
        setNumero(value)
        updatedPersonalizacao.numero = num
      } else if (value === "") {
        setNumero("")
        updatedPersonalizacao.numero = undefined
      }
    } else if (field === "patches") {
      setPatches(value)
      updatedPersonalizacao.patches = value
    } else if (field === "fonte") {
      setFonte(value)
      updatedPersonalizacao.fonte = value
    }
    
    onChange(updatedPersonalizacao)
  }

  const handlePatchChange = (patch: string) => {
    const newPatches = patches.includes(patch)
      ? patches.filter(p => p !== patch)
      : [...patches, patch]
    
    handleChange("patches", newPatches)
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-primary/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-primary/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        
        <CardContent className="p-6 sm:p-6 p-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg shadow-lg">
                <Shirt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Premium Personalization
                </h3>
                <p className="text-xs sm:text-sm text-black">Make your jersey unique and special</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-md border border-primary/20 transition-all duration-300 hover:shadow-lg hover:border-primary/40">
              <Switch
                id="personalizacao"
                checked={ativar}
                onCheckedChange={(checked) => handleChange("ativar", checked)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-purple-600"
              />
              <Label htmlFor="personalizacao" className="font-medium text-xs sm:text-sm text-primary/80 flex items-center gap-2">
                {ativar ? (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>Personalization Active</span>
                  </>
                ) : (
                  "Enable Personalization"
                )}
              </Label>
            </div>
          </div>

          {ativar && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in-0 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Type className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <Label htmlFor="nome" className="font-semibold text-sm sm:text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Name on Back
                    </Label>
                  </div>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="block w-full rounded-md border-0 py-3 px-4 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Name for the jersey"
                  />
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <Label htmlFor="numero" className="font-semibold text-sm sm:text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Number on Back
                    </Label>
                  </div>
                  <Input
                    id="numero"
                    type="text"
                    placeholder="Ex: 7"
                    value={numero}
                    onChange={(e) => handleChange("numero", e.target.value)}
                    maxLength={2}
                    className="py-3 px-4 font-medium text-gray-900 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <p className="text-[10px] sm:text-xs text-black mt-2 ml-1">Numbers from 0 to 99</p>
                </div>
              </div>

              {/* Opção de Fonte para Liga Portugal */}
              {isPortugueseClub && nome && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Type className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <Label className="font-semibold text-sm sm:text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Font Type
                    </Label>
                  </div>
                  <RadioGroup 
                    value={fonte} 
                    onValueChange={(value) => handleChange("fonte", value as "liga-betclic" | "clube" | "champions-liga-europa")}
                    className="flex flex-wrap gap-3"
                  >
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${fonte === "liga-betclic" ? "ring-1 ring-primary border-primary bg-primary/5" : "border-gray-200"}`}>
                      <RadioGroupItem value="liga-betclic" id="liga-betclic" />
                      <Label htmlFor="liga-betclic" className="text-xs font-medium cursor-pointer">
                        LIGA BETCLIC
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${fonte === "clube" ? "ring-1 ring-primary border-primary bg-primary/5" : "border-gray-200"}`}>
                      <RadioGroupItem value="clube" id="clube" />
                      <Label htmlFor="clube" className="text-xs font-medium cursor-pointer">
                        CLUBE
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${fonte === "champions-liga-europa" ? "ring-1 ring-primary border-primary bg-primary/5" : "border-gray-200"}`}>
                      <RadioGroupItem value="champions-liga-europa" id="champions-liga-europa" />
                      <Label htmlFor="champions-liga-europa" className="text-xs font-medium cursor-pointer">
                        CHAMPIONS / LIGA EUROPA
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {isNationalTeam && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    National Team Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-nations-2025"
                          checked={patches.includes("nations-2025")}
                          onCheckedChange={() => handlePatchChange("nations-2025")}
                        />
                        <Label htmlFor="patch-nations-2025" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PatchNationsLeague2025_700x.webp"
                              alt="Patch Liga das Nações 2025"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Liga das Nações 2025
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official 2025 Nations League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-nations-foundation"
                          checked={patches.includes("nations-foundation")}
                          onCheckedChange={() => handlePatchChange("nations-foundation")}
                        />
                        <Label htmlFor="patch-nations-foundation" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PatchNationsLeague2025_UEFAFoundation10AnosEdicaoComemorativa_700x.webp"
                              alt="Patch Liga das Nações 2025 + UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Liga das Nações 2025 + UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">10th anniversary commemorative edition</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+2€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isPortugueseClub && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-portugal"
                          checked={patches.includes("portugal")}
                          onCheckedChange={() => handlePatchChange("portugal")}
                        />
                        <Label htmlFor="patch-portugal" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/patch-portugal.webp"
                              alt="Patch de Campeão Português"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Portuguese Champion Patch
                            </p>
                            <p className="text-xs sm:text-sm text-black">Adds a special touch to your jersey</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-liga"
                          checked={patches.includes("liga")}
                          onCheckedChange={() => handlePatchChange("liga")}
                        />
                        <Label htmlFor="patch-liga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-CAMPEAONACIONALPORTUGAL_2_700x.webp"
                              alt="Patch de Campeão Liga Portuguesa"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Portuguese League Champion Patch
                            </p>
                            <p className="text-xs sm:text-sm text-black">Celebrate the championship victory</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-betclic"
                          checked={patches.includes("betclic")}
                          onCheckedChange={() => handlePatchChange("betclic")}
                        />
                        <Label htmlFor="patch-betclic" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHLIGA.jpg"
                              alt="Patch Liga Portugal Betclic"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Liga Portugal Betclic
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official league patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEnglishClub && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-premier-champion-gold"
                          checked={patches.includes("premier-champion-gold")}
                          onCheckedChange={() => handlePatchChange("premier-champion-gold")}
                        />
                        <Label htmlFor="patch-premier-champion-gold" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-CAMPEAOPREMIERLEAGUE-INGLATERRA_700x.webp"
                              alt="Patch Campeão Premier League Dourado"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Premier League Champion Patch
                            </p>
                            <p className="text-xs sm:text-sm text-black">Golden patch for English champions</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-premier-league-blue"
                          checked={patches.includes("premier-league-blue")}
                          onCheckedChange={() => handlePatchChange("premier-league-blue")}
                        />
                        <Label htmlFor="patch-premier-league-blue" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-PREMIERLEAGUE-INGLATERRA_700x.webp"
                              alt="Patch Premier League Azul"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Premier League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Premier League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-no-room-racism"
                          checked={patches.includes("no-room-racism")}
                          onCheckedChange={() => handlePatchChange("no-room-racism")}
                        />
                        <Label htmlFor="patch-no-room-racism" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-NOROOMFORRACISM-PREMIERLEAGUE_700x.webp"
                              alt="Patch No Room for Racism"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              No Room for Racism
                            </p>
                            <p className="text-xs sm:text-sm text-black">Anti-racism campaign</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    {/* Patch UEFA Foundation para Premier League */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation-premier"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation-premier" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    {/* Patches Diogo Jota - Apenas para Liverpool */}
                    {isLiverpool && (
                      <>
                        {/* Patch Diogo Jota Original */}
                        <div className="relative overflow-hidden group">
                          <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                            <Checkbox
                              id="patch-diogo-jota"
                              checked={patches.includes("diogo-jota")}
                              onCheckedChange={() => handlePatchChange("diogo-jota")}
                            />
                            <Label htmlFor="patch-diogo-jota" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                                <Image
                                  src="/images/dj.avif"
                                  alt="Patch Diogo Jota"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  Diogo Jota
                                </p>
                                <p className="text-xs sm:text-sm text-black">Exclusive patch for the Portuguese player</p>
                                <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                              </div>
                            </Label>
                          </div>
                        </div>

                        {/* Patch Diogo Jota Manga */}
                        <div className="relative overflow-hidden group">
                          <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                            <Checkbox
                              id="patch-diogo-jota-manga"
                              checked={patches.includes("diogo-jota-manga")}
                              onCheckedChange={() => handlePatchChange("diogo-jota-manga")}
                            />
                            <Label htmlFor="patch-diogo-jota-manga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                                <Image
                                  src="/images/il_1140xN.7041450932_ct2i.webp"
                                  alt="Patch Diogo Jota Manga"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  Diogo Jota Manga
                                </p>
                                <p className="text-xs sm:text-sm text-black">Sleeve patch for the Portuguese player</p>
                                <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {isLaLigaClub && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-la-liga"
                          checked={patches.includes("la-liga")}
                          onCheckedChange={() => handlePatchChange("la-liga")}
                        />
                        <Label htmlFor="patch-la-liga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-LALIGA-ESPANHA_700x.webp"
                              alt="Patch La Liga"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch La Liga
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official La Liga patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-la-liga-24-25"
                          checked={patches.includes("la-liga-24-25")}
                          onCheckedChange={() => handlePatchChange("la-liga-24-25")}
                        />
                        <Label htmlFor="patch-la-liga-24-25" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-LALIGA2425-ESPANHA_300x.webp"
                              alt="Patch La Liga 24/25"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch La Liga 24/25
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official 24/25 season patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    {/* Patches Champions League e UEFA Foundation para La Liga */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions-laliga"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions-laliga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation-laliga"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation-laliga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLigue1Club && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-ligue-1-black"
                          checked={patches.includes("ligue-1-black")}
                          onCheckedChange={() => handlePatchChange("ligue-1-black")}
                        />
                        <Label htmlFor="patch-ligue-1-black" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-LIGUE1-FRANCA_300x.webp"
                              alt="Patch Ligue 1 Preto"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Ligue 1 Black Patch
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Ligue 1 patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-ligue-1"
                          checked={patches.includes("ligue-1")}
                          onCheckedChange={() => handlePatchChange("ligue-1")}
                        />
                        <Label htmlFor="patch-ligue-1" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-LIGUE1-FRANCA1_300x.webp"
                              alt="Patch Ligue 1"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Ligue 1
                            </p>
                            <p className="text-xs sm:text-sm text-black">Patch oficial da Ligue 1</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-ligue-1-2025"
                          checked={patches.includes("ligue-1-2025")}
                          onCheckedChange={() => handlePatchChange("ligue-1-2025")}
                        />
                        <Label htmlFor="patch-ligue-1-2025" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH-BADGE-LIGUE-1-FRANCA-2025_300x.webp"
                              alt="Patch Ligue 1 2025"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Ligue 1 2025
                            </p>
                            <p className="text-xs sm:text-sm text-black">2025 season patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    {/* Patches Champions League e UEFA Foundation para Ligue 1 */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions-ligue1"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions-ligue1" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation-ligue1"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation-ligue1" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isBundesligaClub && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-bundesliga"
                          checked={patches.includes("bundesliga")}
                          onCheckedChange={() => handlePatchChange("bundesliga")}
                        />
                        <Label htmlFor="patch-bundesliga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-BUNDESLIGA-ALEMANHA_300x.webp"
                              alt="Patch Bundesliga"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Bundesliga
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Bundesliga patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    {/* Patches Champions League e UEFA Foundation para Bundesliga */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions-bundesliga"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions-bundesliga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation-bundesliga"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation-bundesliga" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSerieAClub && (
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-primary/20">
                  <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Available Patches
                  </Label>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Patch Serie A 2024-26 Enilive */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-serie-a-enilive"
                          checked={patches.includes("serie-a-enilive")}
                          onCheckedChange={() => handlePatchChange("serie-a-enilive")}
                        />
                        <Label htmlFor="patch-serie-a-enilive" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/93db02725ad1b20cb0afae8824062b0027fcaf180fcea452c9d48c07fe695aec.webp"
                              alt="Patch Serie A Enilive 2024-26"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              2024-26 Patch Serie A Enilive
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Serie A 2024-26 patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Patch Serie A 23/24 TIM */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-serie-a-tim"
                          checked={patches.includes("serie-a-tim")}
                          onCheckedChange={() => handlePatchChange("serie-a-tim")}
                        />
                        <Label htmlFor="patch-serie-a-tim" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCHBADGE-SERIEATIM_300x.webp"
                              alt="Patch Serie A TIM 23/24"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              23/24 Patch Serie A TIM
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Serie A 23/24 patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    {/* Patches Champions League e UEFA Foundation para Serie A */}
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-champions-seriea"
                          checked={patches.includes("champions")}
                          onCheckedChange={() => handlePatchChange("champions")}
                        />
                        <Label htmlFor="patch-champions-seriea" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/PATCH_BADGE_-_CHAMPIONS_LEAGUE_BOLA_700x.webp"
                              alt="Patch Champions League"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch Champions League
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official Champions League patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden group">
                      <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer group-hover:shadow-lg">
                        <Checkbox
                          id="patch-uefa-foundation-seriea"
                          checked={patches.includes("uefa-foundation")}
                          onCheckedChange={() => handlePatchChange("uefa-foundation")}
                        />
                        <Label htmlFor="patch-uefa-foundation-seriea" className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src="/images/2021-25-womens-champions-league-uefa-foundation-official-player-issue-size-football-badge-patch-6606-p.webp"
                              alt="Patch UEFA Foundation"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm sm:text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                              Patch UEFA Foundation
                            </p>
                            <p className="text-xs sm:text-sm text-black">Official UEFA Foundation patch</p>
                            <p className="text-black font-semibold mt-1 text-sm sm:text-base">+1€</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-primary/5 via-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border border-primary/20 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg mt-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Personalization Costs:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs sm:text-sm text-black">
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-yellow-500" />
                        Name and Number: +€3
                      </li>
                      {patches.length > 0 && (
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                          Selected Patches: +€{patches.length} ({patches.length} patch{patches.length > 1 ? 'es' : ''})
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
