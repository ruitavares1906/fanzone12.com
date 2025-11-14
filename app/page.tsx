import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getDestaques, getProdutos, getProdutoById } from "@/lib/products"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { ArrowRight, Truck, CreditCard, Star, Sparkles, Baby, Clock, Search, MessageCircle } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { ClientAnimationWrapper } from "@/components/client-animation-wrapper"
import { DesktopClubsExpander } from "@/components/desktop-clubs-expander"
import { StaticProductSection, StaticProductCarousel } from "@/components/static-product-section"
import { StaticInfoSections } from "@/components/static-info-sections"
import ParceirosSection from "@/components/parceiros-section"
import DisablePinchZoom from "@/components/disable-pinch-zoom"
 

export default async function Home() {
  const produtosDestaque = await getDestaques()
  
  // Buscar produtos por liga e filtrar apenas camisolas principais (sem kits de criança)
  // Lista fixa para Liga Betclic conforme pedido
  const ligaBetclicIds = [
    "sporting-alternativa-preta-2526-1",
    "benfica-2025-26-home-long-sleeve",
    "camisola-aquecimento-slbenfica-2025-2026",
    "sporting-away-2526",
    "porto-2025-26-special-edition",
    "porto-2025-26-third",
    "retro-sporting-00-01",
    "retro-porto-90-93",
    "benfica-retro-98-99-casa"
  ] as const
  const ligaPortuguesa = (await Promise.all(ligaBetclicIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Buscar produtos best sellers
  const bestSellersIds = [
    "nike-air-force-1-low-triple-white", 
    "new-balance-9060-crystal-pink",
    "air-force-1-low-fontanka-branco-puro", 
    "af1-low-mini-swoosh-branco-cinza",
    "air-force-1-shadow-branco-puro",
    "air-force-1-low-panda-preto-branco",
    "nk-dunk-low-team-red",
    "air-force-1-07-mid-branco-e-cinzento"
  ] as const
  const bestSellers = (await Promise.all(bestSellersIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Lista fixa para Premier League conforme pedido
  const premierLeagueIds = [
    "arsenal-home-2526",
    "manchester-united-terceira-2526",
    "camisola-man-city-alternativa-2526",
    "camisola-arsenal-alternativa-2526",
    "camisola-liverpool-principal-2025-26",
    "man-city-25-26-home",
    "man-city-25-26-away",
    "liverpool-25-26-especial-jordan",
    "liverpool-25-26-alternativa",
    "arsenal-25-26-terceiro",
    "chelsea-home-2526"
  ] as const
  const premierLeague = (await Promise.all(premierLeagueIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Lista fixa para La Liga conforme pedido
  const laLigaIds = [
    "real-madrid-25-26-home",
    "barcelona-principal-2526",
    "real-madrid-special-edition-4-2526",
    "realmadrid-special-2526",
    "barcelona-special-vi-2526",
    "real-betis-special-edition-2526",
    "atletico-madrid-25-26-home",
    "real-madrid-terceira-fora-2526"
  ] as const
  const laLiga = (await Promise.all(laLigaIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Filtrar apenas camisolas principais (excluir kits de criança)
  const filtrarCamisolasPrincipais = (produtos: any[]) => {
    return produtos.filter(produto => 
      !produto.nome.toLowerCase().includes('criança') && 
      !produto.nome.toLowerCase().includes('child') &&
      !produto.nome.toLowerCase().includes('kit') &&
      produto.categoria !== "crianca"
    )
  }
  
  // Não precisamos filtrar as listas fixas pois já são os produtos específicos
  const ligaPortuguesaFiltrada = ligaPortuguesa
  const premierLeagueFiltrada = premierLeague
  const laLigaFiltrada = laLiga


  return (
    <div className="animate-fade-in">
      <DisablePinchZoom />
      {/* Promoção Banner */}
        <section className="bg-card text-card-foreground py-3 relative overflow-hidden border-b border-border">
         {/* Fundo animado no desktop, estático no mobile */}
         <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 animate-pulse motion-reduce:animate-none hidden md:block"></div>
         <div className="absolute inset-0 md:hidden bg-gradient-to-r from-purple-600/15 via-transparent to-purple-600/15"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
               <span>🎁</span>
              <span className="text-blue-700">SPECIAL PROMOTION:</span>
              <span className="text-foreground">Buy 4 Jerseys and Pay for Only 3!</span>
               <span>🎁</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Automatic discount applied at checkout • Valid storewide
            </div>
          </div>
        </div>
      </section>

      {/* Modern Hero Section - Desktop Only */}
       <section className="relative min-h-screen hidden md:flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
           src="/images/1751647533_9cc7b4a154af3f78533665e36b695936.webp"
            alt="Much more than a store"
            className="object-cover scale-105 md:scale-105"
            priority
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
            quality={75}
            loading="eager"
            decoding="sync"
            suppressHydrationWarning
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        {/* Background Overlay */}
         <div className="absolute inset-0 bg-black/60 md:backdrop-blur-sm" />
         {/* Glows estáticos no mobile (equivalente visual sem animação) */}
         <div className="absolute inset-0 md:hidden pointer-events-none bg-[radial-gradient(160px_160px_at_10%_20%,rgba(255,255,255,0.10),transparent),radial-gradient(220px_220px_at_90%_80%,rgba(59,130,246,0.18),transparent),radial-gradient(200px_200px_at_25%_60%,rgba(250,204,21,0.12),transparent)]"></div>
        
        {/* Floating Elements */}
         <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse motion-reduce:animate-none hidden md:block" />
         <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse motion-reduce:animate-none delay-1000 hidden md:block" />
         <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg animate-pulse motion-reduce:animate-none delay-500 hidden md:block" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="glass-effect rounded-3xl p-12 lg:p-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-700 mr-2" />
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                Fanzone12.com 
              </span>
            </div>
            
            <h1 className="text-responsive-xl text-foreground mb-6 leading-tight">
            Much more than 
              <span className="text-blue-700 font-bold block sm:inline"> a store </span>
            </h1>
            
            <p className="text-responsive-md text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Every jersey tells your story. Unique customization, guaranteed quality and fast delivery across Europe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="modern-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg px-8 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-xl"
              >
                <Link href="/catalogo" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  View Catalog
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Complete Catalog - Desktop Only */}
      <section className="py-8 bg-card border-t border-b border-border hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-foreground mb-3 text-sm sm:text-base">Can't find the jersey you're looking for?</p>
            <Button 
              asChild 
              size="lg" 
                className="modern-button bg-blue-700 text-white hover:bg-blue-800 border-0 shadow-lg px-6 py-5 rounded-full"
            >
              <Link href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                View full catalog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Pre-venda Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 animate-slide-up">
            <h2 className="text-responsive-lg text-foreground mb-4">
              Exclusive Launches
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the latest additions to our collection with unique designs and premium quality
            </p>
          </div>

          <div className="space-y-8">
            {/* Camisolas do Sporting em cima */}
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {/* Camisola 3º Equipamento Sporting 25/26 */}
              <Link href="/produto/sporting-third-25-26" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/535951790_1318704906288192_8737859712710652925_n.jpg"
                    alt="Sporting CP 3rd Kit 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      New
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-green-300 transition-colors">
                      Sporting CP 3rd Kit 25/26
                    </h3>
                    <p className="text-green-200 text-sm mb-1.5">Sporting CP</p>
                    <span className="text-xl font-black text-white">17.99€</span>
                  </div>
                </div>
              </Link>

              {/* Camisola Away Sporting 25/26 */}
              <Link href="/produto/sporting-away-2526" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/546365886_1334743178017698_7136686953264947284_n.jpg"
                    alt="Sporting CP Away Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      New
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-green-300 transition-colors">
                      Sporting CP Away Jersey 25/26
                    </h3>
                    <p className="text-green-200 text-sm mb-1.5">Sporting CP</p>
                    <span className="text-xl font-black text-white">17.99€</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Grid - Showing 2 items */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {/* Camisola Third Sporting 25/26 (mobile) */}
              <Link href="/produto/sporting-third-25-26" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                   src="/images/535951790_1318704906288192_8737859712710652925_n.webp"
                    alt="Sporting CP Third Kit 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      New
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-green-300 transition-colors line-clamp-1">
                      Sporting CP 3rd Kit 25/26
                    </h3>
                    <p className="text-green-200 text-xs mb-1">Sporting CP</p>
                    <span className="text-lg font-black text-white">17.99€</span>
                  </div>
                </div>
              </Link>

              {/* Camisola Away Sporting 25/26 (mobile) */}
              <Link href="/produto/sporting-away-2526" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                   src="/images/546365886_1334743178017698_7136686953264947284_n.webp"
                    alt="Sporting CP Away Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      New
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-green-300 transition-colors line-clamp-1">
                      Sporting CP Away Jersey 25/26
                    </h3>
                    <p className="text-green-200 text-xs mb-1">Sporting CP</p>
                    <span className="text-lg font-black text-white">17.99€</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Jogadores do Porto */}
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {/* Jogador Porto 1 */}
              <Link href="/produto/porto-25-26-away" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/5b338259fa495d16e8ca7713be1eec58d0201338.webp"
                    alt="FC Porto Away Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      New
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-blue-300 transition-colors">
                      FC Porto Jersey 25/26
                    </h3>
                    <p className="text-blue-200 text-sm mb-1.5">FC Porto - Away Kit</p>
                    <span className="text-xl font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>

              {/* Jogador Porto 2 */}
              <Link href="/produto/porto-2025-26-third" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/porto-25-26-.webp"
                    alt="FC Porto Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      New
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-blue-300 transition-colors">
                      FC Porto Jersey 25/26
                    </h3>
                    <p className="text-blue-200 text-sm mb-1.5">FC Porto - New Season</p>
                    <span className="text-xl font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Grid - Showing 2 items */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {/* Jogador Porto 1 */}
              <Link href="/produto/porto-25-26-away" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                   src="/images/5b338259fa495d16e8ca7713be1eec58d0201338.webp"
                    alt="FC Porto Away Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      New
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors line-clamp-1">
                      FC Porto Jersey 25/26
                    </h3>
                    <p className="text-blue-200 text-xs mb-1">FC Porto</p>
                    <span className="text-lg font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>

              {/* Jogador Porto 2 */}
              <Link href="/produto/porto-2025-26-third" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                   src="/images/porto-25-26-.webp"
                    alt="FC Porto Jersey 25/26"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      New
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors line-clamp-1">
                      FC Porto Jersey 25/26
                    </h3>
                    <p className="text-blue-200 text-xs mb-1">FC Porto</p>
                    <span className="text-lg font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Jogadores do Benfica */}
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {/* Jogador Benfica 1 */}
              <Link href="https://www.fanzone12.com/catalogo?categoria=selecoes&clube=portugal" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/572277611_18392022271132395_7836676579277369328_n.webp"
                    alt="Portugal National Team Jersey"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      Available
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-red-300 transition-colors">
                      Portugal National Team Jersey
                    </h3>
                    <p className="text-red-200 text-sm mb-1.5">National Team - Portugal</p>
                    <span className="text-xl font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>

              {/* Jogador Benfica 2 */}
              <Link href="/catalogo?categoria=retro&clube=benfica" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image 
                    src="/images/casaco_retro_slbenfica_adidas_originals_1.jpg"
                    alt="SL Benfica Retro Jacket"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      Available
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-red-300 transition-colors">
                      Benfica Retro Collection
                    </h3>
                    <p className="text-red-200 text-sm mb-1.5">SL Benfica - Retro Collection</p>
                    <span className="text-xl font-black text-white">
                      from 17.99€
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Grid - Showing 2 items */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {/* Jogador Benfica 1 */}
              <Link href="https://www.fanzone12.com/catalogo?categoria=selecoes&clube=portugal" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                    src="/images/572277611_18392022271132395_7836676579277369328_n.webp"
                    alt="Portugal National Team Jersey"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      Available
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-red-300 transition-colors line-clamp-1">
                      Portugal National Team Jersey
                    </h3>
                    <p className="text-red-200 text-xs mb-1">National Team</p>
                    <span className="text-lg font-black text-white">
                      17.99€
                    </span>
                  </div>
                </div>
              </Link>

              {/* Jogador Benfica 2 */}
              <Link href="/catalogo?categoria=retro&clube=benfica" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                    src="/images/casaco_retro_slbenfica_adidas_originals_1.jpg"
                    alt="SL Benfica Retro Jacket"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      Available
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-red-300 transition-colors line-clamp-1">
                      Benfica Retro Collection
                    </h3>
                    <p className="text-red-200 text-xs mb-1">SL Benfica</p>
                    <span className="text-lg font-black text-white">
                      from 17.99€
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Extra Cards: Sneakers */}
            <div className="md:hidden">
              {/* Sneakers Mobile */}
              <Link href="/sneakers" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                  <Image 
                    src="/images/www-001017731202531-08.avif"
                    alt="Sneakers"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg px-2 py-1 rounded-full mb-2 text-xs">
                      New
                    </Badge>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-orange-300 transition-colors line-clamp-1">
                      Sneakers
                    </h3>
                    <p className="text-orange-200 text-xs mb-1">Sneakers collection</p>
                    <span className="text-lg font-black text-white">
                      View collection
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Extra Desktop Cards: Sneakers */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {/* Sneakers */}
              <Link href="/sneakers" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-md">
                  <Image
                    src="/images/www-001017731202531-08.avif"
                    alt="Sneakers"
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="25vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg px-2.5 py-1.5 rounded-full mb-2.5">
                      New
                    </Badge>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-orange-300 transition-colors">
                      Sneakers
                    </h3>
                    <p className="text-orange-200 text-sm mb-1.5">Sneakers collection</p>
                    <span className="text-xl font-black text-white">View collection</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Últimas Novidades Section */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Latest
            </Badge>
            <h2 className="text-responsive-lg text-foreground mb-4">
              Latest Arrivals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most recent jerseys that just arrived in our collection
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                 {[
                   {
                     id: "portugal-principal-2026",
                     name: "Camisola Seleção Portugal Principal 2026",
                     image: "/images/2025092114284096_20_281_29.webp",
                     price: 17.99,
                     badge: "New",
                     href: "/produto/portugal-principal-2026"
                   },
                   {
                     id: "portugal-pantera-negra",
                     name: "Camisola Portugal Edição Especial Pantera Negra",
                     image: "/images/2025092114282251_20_281_29.webp",
                     price: 17.99,
                     badge: "New",
                     href: "/produto/portugal-pantera-negra"
                   },
                  {
                    id: "benfica-edicao-especial-25-26",
                    name: "Camisola Benfica guarda-redes rosa 2025/26",
                    image: "/images/0371ad58.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/benfica-edicao-especial-25-26"
                  },
                  {
                    id: "sporting-stromp-25-26",
                    name: "Camisola Sporting C.P. Stromp 25/26",
                    image: "/images/2025102310182442.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-stromp-25-26"
                  },
                  {
                    id: "sporting-edicao-especial-25-26",
                    name: "Camisola Sporting CP Edição Especial 2025/26",
                    image: "/images/a3d81a71.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-special-25-26"
                  },
                  {
                    id: "sporting-outubro-rosa-2025",
                    name: "Camisola Sporting C.P. Outubro Rosa 2025",
                    image: "/images/2025110416210851.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-outubro-rosa-2025"
                  },
                  {
                    id: "sporting-special-25-26",
                    name: "Camisola Sporting CP Special Edition 2025/26",
                    image: "/images/16a8dee8.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-special-25-26"
                  },
                  {
                    id: "t-shirt-treino-plantel-fc-porto-2526",
                    name: "Camisola FC Porto Edição Especial 2025/26",
                    image: "/images/82e839c6.jpg",
                    price: 23.99,
                    badge: "New",
                    href: "/produto/t-shirt-treino-plantel-fc-porto-2526"
                  },
                  {
                    id: "vitoria-sc-principal-25-26",
                    name: "Camisola Vitoria SC Principal 2025/26",
                    image: "/images/01_25_26 Guimarães Home S-XXL _ Yupoo.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/vitoria-sc-principal-25-26"
                  },
                  {
                    id: "vitoria-sc-alternativa-25-26",
                    name: "Camisola Vitoria SC Alternativa 2025/26",
                    image: "/images/b82c2c0a.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/vitoria-sc-alternativa-25-26"
                  },
                  {
                    id: "flamengo-third-25-26",
                    name: "Camisola Flamengo 3º Equipamento 2025/26",
                    image: "/images/82c0ccdf.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/flamengo-third-25-26"
                  },
                  {
                    id: "roma-third-away-25-26",
                    name: "Camisola Roma 3º Equipamento Away 2025/26",
                    image: "/images/01_25_26 Roma third away S-4XL _ Yupoo.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/roma-third-away-25-26"
                  }
                ].map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[28%] lg:basis-[22%]">
                    <ClientAnimationWrapper
                      delay={index * 0.1}
                      className="animate-scale-in"
                    >
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={product.href} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {product.badge}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {product.price}€
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </ClientAnimationWrapper>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                 {[
                   {
                     id: "portugal-principal-2026",
                     name: "Camisola Seleção Portugal Principal 2026",
                     image: "/images/2025092114284096_20_281_29.webp",
                     price: 17.99,
                     badge: "New",
                     href: "/produto/portugal-principal-2026"
                   },
                   {
                     id: "portugal-pantera-negra",
                     name: "Camisola Portugal Edição Especial Pantera Negra",
                     image: "/images/2025092114282251_20_281_29.webp",
                     price: 17.99,
                     badge: "New",
                     href: "/produto/portugal-pantera-negra"
                   },
                  {
                    id: "benfica-edicao-especial-25-26",
                    name: "Camisola Benfica guarda-redes rosa 2025/26",
                    image: "/images/0371ad58.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/benfica-edicao-especial-25-26"
                  },
                  {
                    id: "sporting-stromp-25-26",
                    name: "Camisola Sporting C.P. Stromp 25/26",
                    image: "/images/2025102310182442.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-stromp-25-26"
                  },
                  {
                    id: "sporting-edicao-especial-25-26",
                    name: "Camisola Sporting CP Edição Especial 2025/26",
                    image: "/images/a3d81a71.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-edicao-especial-25-26"
                  },
                  {
                    id: "sporting-outubro-rosa-2025",
                    name: "Camisola Sporting C.P. Outubro Rosa 2025",
                    image: "/images/2025110416210851.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-outubro-rosa-2025"
                  },
                  {
                    id: "sporting-special-25-26",
                    name: "Camisola Sporting CP Special Edition 2025/26",
                    image: "/images/16a8dee8.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/sporting-special-25-26"
                  },
                  {
                    id: "t-shirt-treino-plantel-fc-porto-2526",
                    name: "Camisola FC Porto Edição Especial 2025/26",
                    image: "/images/82e839c6.jpg",
                    price: 23.99,
                    badge: "New",
                    href: "/produto/t-shirt-treino-plantel-fc-porto-2526"
                  },
                  {
                    id: "vitoria-sc-principal-25-26",
                    name: "Camisola Vitoria SC Principal 2025/26",
                    image: "/images/01_25_26 Guimarães Home S-XXL _ Yupoo.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/vitoria-sc-principal-25-26"
                  },
                  {
                    id: "vitoria-sc-alternativa-25-26",
                    name: "Camisola Vitoria SC Alternativa 2025/26",
                    image: "/images/b82c2c0a.jpg",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/vitoria-sc-alternativa-25-26"
                  },
                  {
                    id: "flamengo-third-25-26",
                    name: "Camisola Flamengo 3º Equipamento 2025/26",
                    image: "/images/82c0ccdf.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/flamengo-third-25-26"
                  },
                  {
                    id: "roma-third-away-25-26",
                    name: "Camisola Roma 3º Equipamento Away 2025/26",
                    image: "/images/01_25_26 Roma third away S-4XL _ Yupoo.webp",
                    price: 17.99,
                    badge: "New",
                    href: "/produto/roma-third-away-25-26"
                  }
                ].map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[28%] lg:basis-[22%]">
                    <ClientAnimationWrapper
                      delay={index * 0.1}
                      className="animate-scale-in"
                    >
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={product.href} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {product.badge}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {product.price}€
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </ClientAnimationWrapper>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Ver Todas as Novidades Button */}
          <div className="text-center mt-12">
            <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg px-8 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                View All Latest Arrivals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mais Vendidas Section */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 mr-2" />
              Mais Vendidas
            </Badge>
            <h2 className="text-responsive-lg text-foreground mb-4">
              Best Sellers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular jerseys chosen by our customers
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {[
                  {
                    id: "camisola-sporting-202526-principal",
                    name: "Camisola Sporting 2025/26 Principal",
                    image: "/images/1a47109.webp",
                    price: 17.99,
                    badge: "Mais Vendida",
                    href: "/produto/camisola-sporting-202526-principal"
                  },
                  {
                    id: "benfica-25-26-away2",
                    name: "Camisola Alternativa Branca SL Benfica 2025/26",
                    image: "/images/550daed8.webp",
                    price: 17.99,
                    badge: "Top Choice",
                    href: "/produto/benfica-25-26-away2"
                  },
                  {
                    id: "porto-25-26-home",
                    name: "Camisola Principal do FC Porto 2025/26",
                    image: "/images/bb0d8c35.webp",
                    price: 17.99,
                    badge: "Favorita",
                    href: "/produto/porto-25-26-home"
                  },
                  {
                    id: "napoli-25-26-away",
                    name: "Camisola Napoli Away 2025/26",
                    image: "/images/e438406f.webp",
                    price: 17.99,
                    badge: "Napoli",
                    href: "/produto/napoli-25-26-away"
                  },
                  {
                    id: "portugal-25-26-home",
                    name: "Camisola Seleção Portugal Principal 2025/26",
                    image: "/images/CAMISOLA_PORTUGAL_PRINCIPAL_PUMA_25_26_700x.webp",
                    price: 17.99,
                    badge: "Nacional",
                    href: "/produto/portugal-25-26-home"
                  },  
                  {
                    id: "camisola-man-city-alternativa-2526",
                    name: "Camisola Manchester City Alternativa 2025/26",
                    image: "/images/camisola-man-city-alternativa-2526.png",
                    price: 17.99,
                    badge: "Citizens",
                    href: "/produto/camisola-man-city-alternativa-2526"
                  },
                  {
                    id: "real-madrid-25-26-home",
                    name: "Camisola Real Madrid Principal 25/26",
                    image: "/images/82a70c47.webp",
                    price: 17.99,
                    badge: "Popular",
                    href: "/produto/real-madrid-25-26-home"
                  },
                  {
                    id: "barcelona-travis-scott-2526",
                    name: "Camisola Barcelona x Travis Scott 2025/26",
                    image: "/images/f2e4712c.webp",
                    price: 17.99,
                    badge: "Exclusiva",
                    href: "/produto/barcelona-travis-scott-2526"
                  },
                  {
                    id: "chelsea-home-2526",
                    name: "Camisola Chelsea 2025/26 Principal",
                    image: "/images/770dd228.webp",
                    price: 17.99,
                    badge: "Blues",
                    href: "/produto/chelsea-home-2526"
                  },
                  {
                    id: "arsenal-home-2526",
                    name: "Camisola Arsenal 2025/26 Principal",
                    image: "/images/5f7d6722.webp",
                    price: 17.99,
                    badge: "Gunners",
                    href: "/produto/arsenal-home-2526"
                  },
                  {
                    id: "milan-25-26-home",
                    name: "Camisola AC Milan Principal 2025/26",
                    image: "/images/9f271963.webp",
                    price: 17.99,
                    badge: "Rossoneri",
                    href: "/produto/milan-25-26-home"
                  },
                  {
                    id: "psg-25-26-jogador-home",
                    name: "PSG Player Jersey 2025/26 Home",
                    image: "/images/CAMISOLAPARISI2526homem_VERSAOJOGADOR_1_700x.webp",
                    price: 17.99,
                    badge: "Player",
                    href: "/produto/psg-25-26-jogador-home"
                  },
                  {
                    id: "bayern-25-26-home",
                    name: "Camisola Bayern Munich Principal 2025/26",
                    image: "/images/96cb0c8d.webp",
                    price: 17.99,
                    badge: "Bayern",
                    href: "/produto/bayern-25-26-home"
                  },
                  {
                    id: "palmeiras-25-26-home",
                    name: "Camisola Palmeiras Principal 2025/26",
                    image: "/images/f179cf75.webp",
                    price: 17.99,
                    badge: "Verdão",
                    href: "/produto/palmeiras-25-26-home"
                  },
                  {
                    id: "barcelona-25-26-special-edition-iv",
                    name: "Camisola Barcelona Special Edition IV 2025/26",
                    image: "/images/961ff31b.webp",
                    price: 17.99,
                    badge: "Especial",
                    href: "/produto/barcelona-25-26-special-edition-iv"
                  },
                  {
                    id: "tottenham-2025-26-home",
                    name: "Camisola Principal Tottenham 2025/26",
                    image: "/images/tottenham-2025-26-home.webp",
                    price: 17.99,
                    badge: "Spurs",
                    href: "/produto/tottenham-2025-26-home"
                  }
                ].map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[28%] lg:basis-[22%]">
                    <ClientAnimationWrapper
                      delay={index * 0.1}
                      className="animate-scale-in"
                    >
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={product.href} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {product.badge}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {product.price}€
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </ClientAnimationWrapper>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  {
                    id: "camisola-sporting-202526-principal",
                    name: "Camisola Sporting 2025/26 Principal",
                    image: "/images/1a47109.webp",
                    price: 17.99,
                    badge: "Mais Vendida",
                    href: "/produto/camisola-sporting-202526-principal"
                  },
                  {
                    id: "benfica-25-26-away2",
                    name: "Camisola Alternativa Branca SL Benfica 2025/26",
                    image: "/images/550daed8.webp",
                    price: 17.99,
                    badge: "Top Choice",
                    href: "/produto/benfica-25-26-away2"
                  },
                  {
                    id: "porto-25-26-home",
                    name: "Camisola Principal do FC Porto 2025/26",
                    image: "/images/bb0d8c35.webp",
                    price: 17.99,
                    badge: "Favorita",
                    href: "/produto/porto-25-26-home"
                  },
                  {
                    id: "portugal-25-26-home",
                    name: "Camisola Seleção Portugal Principal 2025/26",
                    image: "/images/CAMISOLA_PORTUGAL_PRINCIPAL_PUMA_25_26_700x.webp",
                    price: 17.99,
                    badge: "Nacional",
                    href: "/produto/portugal-25-26-home"
                  },
                  {
                    id: "napoli-25-26-away",
                    name: "Camisola Napoli Away 2025/26",
                    image: "/images/e438406f.webp",
                    price: 17.99,
                    badge: "Napoli",
                    href: "/produto/napoli-25-26-away"
                  },
                  {
                    id: "camisola-man-city-alternativa-2526",
                    name: "Camisola Manchester City Alternativa 2025/26",
                    image: "/images/camisola-man-city-alternativa-2526.png",
                    price: 17.99,
                    badge: "Citizens",
                    href: "/produto/camisola-man-city-alternativa-2526"
                  },
                  {
                    id: "real-madrid-25-26-home",
                    name: "Camisola Real Madrid Principal 25/26",
                    image: "/images/82a70c47.webp",
                    price: 17.99,
                    badge: "Popular",
                    href: "/produto/real-madrid-25-26-home"
                  },
                  {
                    id: "barcelona-travis-scott-2526",
                    name: "Camisola Barcelona x Travis Scott 2025/26",
                    image: "/images/f2e4712c.webp",
                    price: 17.99,
                    badge: "Exclusiva",
                    href: "/produto/barcelona-travis-scott-2526"
                  },
                  {
                    id: "chelsea-home-2526",
                    name: "Camisola Chelsea 2025/26 Principal",
                    image: "/images/770dd228.webp",
                    price: 17.99,
                    badge: "Blues",
                    href: "/produto/chelsea-home-2526"
                  },
                  {
                    id: "arsenal-home-2526",
                    name: "Camisola Arsenal 2025/26 Principal",
                    image: "/images/5f7d6722.webp",
                    price: 17.99,
                    badge: "Gunners",
                    href: "/produto/arsenal-home-2526"
                  },
                  {
                    id: "milan-25-26-home",
                    name: "Camisola AC Milan Principal 2025/26",
                    image: "/images/9f271963.webp",
                    price: 17.99,
                    badge: "Rossoneri",
                    href: "/produto/milan-25-26-home"
                  },
                  {
                    id: "psg-25-26-jogador-home",
                    name: "PSG Player Jersey 2025/26 Home",
                    image: "/images/CAMISOLAPARISI2526homem_VERSAOJOGADOR_1_700x.webp",
                    price: 17.99,
                    badge: "Player",
                    href: "/produto/psg-25-26-jogador-home"
                  },
                  {
                    id: "bayern-25-26-home",
                    name: "Camisola Bayern Munich Principal 2025/26",
                    image: "/images/96cb0c8d.webp",
                    price: 17.99,
                    badge: "Bayern",
                    href: "/produto/bayern-25-26-home"
                  },
                  {
                    id: "palmeiras-25-26-home",
                    name: "Camisola Palmeiras Principal 2025/26",
                    image: "/images/f179cf75.webp",
                    price: 17.99,
                    badge: "Verdão",
                    href: "/produto/palmeiras-25-26-home"
                  },
                  {
                    id: "barcelona-25-26-special-edition-iv",
                    name: "Camisola Barcelona Special Edition IV 2025/26",
                    image: "/images/961ff31b.webp",
                    price: 17.99,
                    badge: "Especial",
                    href: "/produto/barcelona-25-26-special-edition-iv"
                  },
                  {
                    id: "tottenham-2025-26-home",
                    name: "Camisola Principal Tottenham 2025/26",
                    image: "/images/tottenham-2025-26-home.webp",
                    price: 17.99,
                    badge: "Spurs",
                    href: "/produto/tottenham-2025-26-home"
                  }
                ].map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={product.href} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                              {product.badge}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.price}€
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg px-8 py-3 rounded-full"
            >
              <Link href="/catalogo" className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                View All Best Sellers
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Top Clubs Section */}
      <section className="py-8 bg-gradient-to-br from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Top Clubs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find jerseys from the biggest European clubs with premium quality and authentic designs
            </p>
          </div>

          {/* Desktop Grid */}
          <DesktopClubsExpander />

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  { name: "Sporting CP", logo: "pngwing.com (1).webp", href: "/catalogo?clube=sporting" },
                  { name: "Benfica", logo: "pngwing.com.webp", href: "/catalogo?clube=benfica" },
                  { name: "Porto", logo: "pngwing.com (2).webp", href: "/catalogo?clube=porto" },
                  { name: "Braga", logo: "braga-logo.png", href: "/catalogo?clube=sc-braga" },
                  { name: "Vitória SC", logo: "Vitoria-Sport-Clube-logo.png", href: "/catalogo?clube=vitoria-sc" },
                  { name: "Barcelona", logo: "pngwing.com (3).webp", href: "/catalogo?clube=barcelona" },
                  { name: "Real Madrid", logo: "pngwing.com (9).webp", href: "/catalogo?clube=real-madrid" },
                  { name: "Manchester United", logo: "pngwing.com (8).webp", href: "/catalogo?clube=manchester-united" },
                  { name: "Arsenal", logo: "9874.png", href: "/catalogo?clube=arsenal" },
                  { name: "PSG", logo: "pngwing.com (5).webp", href: "/catalogo?clube=psg" },
                  { name: "Manchester City", logo: "pngwing.com (6).webp", href: "/catalogo?clube=manchester-city" },
                  { name: "Liverpool", logo: "87554.png", href: "/catalogo?clube=liverpool" }, 
                  { name: "Bayern Munich", logo: "Bayern-Munich-logo.png", href: "/catalogo?clube=bayern-munich" },
                  { name: "Inter Milan", logo: "Inter-Milan-logo.png", href: "/catalogo?clube=inter" },
                  { name: "Chelsea", logo: "Chelsea-logo.webp", href: "/catalogo?clube=chelsea" },
                  { name: "AC Milan", logo: "Milan-logo.png", href: "/catalogo?clube=milan" },
                  { name: "Tottenham", logo: "Tottenham-logo.png", href: "/catalogo?clube=tottenham" },
                ].map((club) => (
                  <CarouselItem key={club.name} className="basis-1/3">
                    <Link
                      href={club.href}
                      className="modern-card group p-4 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300 block"
                    >
                      <div className="relative w-12 h-12 mx-auto mb-3">
                        <Image
                          src={`/images/${club.logo}`}
                          alt={club.name}
                          fill
                          className="object-contain transition-transform group-hover:scale-110"
                          loading="lazy"
                          sizes="48px"
                          quality={85}
                        />
                      </div>
                      <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                        {club.name}
                      </p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Ver Mais Clubes Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo" className="flex items-center gap-2">
                View all clubs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Continue with the rest of the sections... */}
      {/* Top Ligas Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Top Leagues
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the main European leagues and find the perfect jersey from your favorite club
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[
              { name: "Portuguese League", logo: "Liga_Portugal_Betclic_2023.webp", href: "/catalogo?liga=liga-portuguesa" },
              { name: "Premier League", logo: "Premier-League-Logo-PNG-Iconic-English-Football-Emblem-Transparent.webp", href: "/catalogo?liga=premier-league" },
              { name: "La Liga", logo: "LaLiga-Logo-PNG-Official-Symbol-for-Football-League-Transparent.webp", href: "/catalogo?liga=la-liga" },
              { name: "Serie A", logo: "SerieA_logo.webp", href: "/catalogo?liga=serie-a" },
              { name: "Bundesliga", logo: "Bundesliga_logo_(2017).webp", href: "/catalogo?liga=bundesliga" },
              { name: "Ligue 1", logo: "Ligue1_Uber_Eats_logo.webp", href: "/catalogo?liga=ligue-1" },
              { name: "Other Leagues", logo: "images.webp", href: "/catalogo?liga=outras-ligas" },
              { name: "National Teams", logo: "Portugal_FPF.webp", href: "/catalogo?liga=selecoes-nacionais" },
            ].map((liga, index) => (
              <ClientAnimationWrapper
                key={liga.name}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <Link
                  href={liga.href}
                  className="modern-card group p-6 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300 block"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <Image
                      src={`/images/${liga.logo}`}
                      alt={liga.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                      loading="lazy"
                      sizes="80px"
                      quality={85}
                    />
                  </div>
                  <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {liga.name}
                  </p>
                </Link>
              </ClientAnimationWrapper>
            ))}
          </div>

          {/* Mobile Grid - 2 colunas */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {[
              { name: "Portuguese League", logo: "Liga_Portugal_Betclic_2023.webp", href: "/catalogo?liga=liga-portuguesa" },
              { name: "Premier League", logo: "Premier-League-Logo-PNG-Iconic-English-Football-Emblem-Transparent.webp", href: "/catalogo?liga=premier-league" },
              { name: "La Liga", logo: "LaLiga-Logo-PNG-Official-Symbol-for-Football-League-Transparent.webp", href: "/catalogo?liga=la-liga" },
              { name: "Serie A", logo: "SerieA_logo.webp", href: "/catalogo?liga=serie-a" },
              { name: "Bundesliga", logo: "Bundesliga_logo_(2017).webp", href: "/catalogo?liga=bundesliga" },
              { name: "Ligue 1", logo: "Ligue1_Uber_Eats_logo.webp", href: "/catalogo?liga=ligue-1" },
              { name: "Other Leagues", logo: "images.webp", href: "/catalogo?liga=outras-ligas" },
              { name: "National Teams", logo: "Portugal_FPF.webp", href: "/catalogo?liga=selecoes-nacionais" },
            ].map((liga, index) => (
              <ClientAnimationWrapper
                key={liga.name}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <Link
                  href={liga.href}
                  className="modern-card group p-4 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300 block"
                >
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <Image
                      src={`/images/${liga.logo}`}
                      alt={liga.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                      loading="lazy"
                      sizes="64px"
                      quality={85}
                    />
                  </div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                    {liga.name}
                  </p>
                </Link>
              </ClientAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Sneakers Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Sneakers Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest sneakers from the best brands to complete your style.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {/* Categoria Nike */}
            <Link href="/sneakers/nike" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
                <div className="relative h-96 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                  <Image
                    src="/images/1000541110.webp"
                    alt="Sneakers Nike"
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white text-orange-600 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                      NIKE
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">Nike</h3>
                    <p className="text-orange-100 text-base">Just Do It - American innovation</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm text-orange-100">Just Do It</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-6">
                    <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explore →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Categoria Adidas */}
            <Link href="/sneakers/adidas" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
                <div className="relative h-96 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-800/30" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                  <Image
                    src="/images/1362796-full_product.jpg"
                    alt="Sneakers Adidas"
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white text-green-600 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                      ADIDAS
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">Adidas</h3>
                    <p className="text-green-100 text-base">Classic German sneakers</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm text-green-100">Impossible is Nothing</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-6">
                    <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explore →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Categoria New Balance */}
            <Link href="/sneakers/new-balance" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
                <div className="relative h-96 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-900/30" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                  <Image
                    src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                    alt="Sneakers New Balance"
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white text-gray-800 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                      NEW BALANCE
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">New Balance</h3>
                    <p className="text-gray-200 text-base">American comfort and quality</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm text-gray-200">Fearlessly Independent</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-6">
                    <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explore →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem className="basis-full">
                  <Link href="/sneakers/nike" className="group block">
                    <div className="relative h-80 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30" />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                      <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                      <Image
                        src="/images/1000541110.webp"
                        alt="Sneakers Nike"
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-orange-600 text-xs px-3 py-1 font-bold rounded-full shadow-lg">
                          NIKE
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">Nike</h3>
                        <p className="text-orange-100 text-sm">Just Do It - Inovação americana</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-orange-100">Just Do It</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-4">
                        <span className="text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full">Explore →</span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
                <CarouselItem className="basis-full">
                  <Link href="/sneakers/adidas" className="group block">
                    <div className="relative h-80 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-800/30" />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                      <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                      <Image
                        src="/images/1362796-full_product.jpg"
                        alt="Sneakers Adidas"
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-green-600 text-xs px-3 py-1 font-bold rounded-full shadow-lg">
                          ADIDAS
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">Adidas</h3>
                        <p className="text-green-100 text-sm">Sneakers clássicos alemães</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-green-100">Impossible is Nothing</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-4">
                        <span className="text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full">Explore →</span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
                <CarouselItem className="basis-full">
                  <Link href="/sneakers/new-balance" className="group block">
                    <div className="relative h-80 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-900/30" />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                      <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                      <Image
                        src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                        alt="Sneakers New Balance"
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white text-gray-800 text-xs px-3 py-1 font-bold rounded-full shadow-lg">
                          NEW BALANCE
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">New Balance</h3>
                        <p className="text-gray-200 text-sm">Conforto e qualidade americana</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-gray-200">Fearlessly Independent</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-4">
                        <span className="text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full">Explore →</span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Ver Sneakers Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/sneakers" className="flex items-center gap-2">
                View all sneakers
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers Sneakers Carousel */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              🏆 Best Sellers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The best-selling and most loved sneakers by our customers
            </p>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {bestSellers.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group bg-white">
                    <Link href={`/produto/${product.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden">
                        <Image 
                          src={product.imagem}
                          alt={product.nome}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={85}
                        />
                        {product.edicao_especial && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold shadow-lg">
                              🏆 Mais Vendido
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.nome}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              €{product.preco}
                            </span>
                            {product.precoAntigo && (
                              <span className="text-sm text-gray-500 line-through">
                                €{product.precoAntigo}
                              </span>
                            )}
                          </div>
                          {product.precoAntigo && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              -{Math.round(((product.precoAntigo - product.preco) / product.precoAntigo) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Continue with existing sections but with modern styling... */}
      {/* I'll continue with the rest of the sections in the same modern style */}
      {/* ... existing code ... */}
      
      {/* Modern Camisolas por Liga Section */}
      <section className="py-8 bg-gradient-to-br from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Jerseys from Top Leagues
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the best jerseys from the main European leagues with premium quality
            </p>
          </div>

          {/* Liga Betclic Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src="/images/Liga_Portugal_Betclic_2023.webp"
                  alt="Liga Betclic"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Liga Betclic</h3>
            </div>
            
            {/* Desktop Carousel */}
            <div className="hidden md:block">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {ligaPortuguesaFiltrada.slice(0, 10).map((produto, index) => (
                    <CarouselItem key={produto.id} className="pl-2 md:pl-4 basis-1/4">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "Liga PT"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2">
                  {ligaPortuguesaFiltrada.slice(0, 10).map((produto) => (
                    <CarouselItem key={produto.id} className="pl-2 basis-1/2">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "Liga PT"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex justify-center mt-6">
              <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg px-6 py-3 rounded-full transition-all duration-300 hover:shadow-xl">
                <Link href="/catalogo?liga=liga-portuguesa" className="flex items-center gap-2">
                  View all jerseys
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Premier League Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src="/images/Premier-League-Logo-PNG-Iconic-English-Football-Emblem-Transparent.webp"
                  alt="Premier League"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Premier League</h3>
            </div>
            
            {/* Desktop Carousel */}
            <div className="hidden md:block">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {premierLeagueFiltrada.slice(0, 12).map((produto, index) => (
                    <CarouselItem key={produto.id} className="pl-2 md:pl-4 basis-1/4">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "Premier"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                              
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2">
                  {premierLeagueFiltrada.slice(0, 12).map((produto) => (
                    <CarouselItem key={produto.id} className="pl-2 basis-1/2">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "Premier"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                              
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex justify-center mt-6">
              <Button asChild className="modern-button bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0 shadow-lg px-6 py-3 text-sm rounded-full transition-all duration-300 hover:shadow-xl">
                <Link href="/catalogo?liga=premier-league" className="flex items-center gap-2">
                  View all jerseys
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* La Liga Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src="/images/LaLiga-Logo-PNG-Official-Symbol-for-Football-League-Transparent.webp"
                  alt="La Liga"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">La Liga</h3>
            </div>
            
            {/* Desktop Carousel */}
            <div className="hidden md:block">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {laLigaFiltrada.slice(0, 13).map((produto, index) => (
                    <CarouselItem key={produto.id} className="pl-2 md:pl-4 basis-1/4">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "La Liga"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                              
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-2">
                  {laLigaFiltrada.slice(0, 13).map((produto) => (
                    <CarouselItem key={produto.id} className="pl-2 basis-1/2">
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${produto.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={produto.imagem}
                              alt={produto.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {produto.clube || "La Liga"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-yellow-600 transition-colors line-clamp-2">
                              {produto.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {produto.preco.toFixed(2)}€
                              </span>
                              
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex justify-center mt-6">
              <Button asChild className="modern-button bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg px-6 py-3 text-sm rounded-full transition-all duration-300 hover:shadow-xl">
                <Link href="/catalogo?liga=la-liga" className="flex items-center gap-2">
                  View all jerseys
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>
      
      {/* Modern Kits de Criança Section */}
      <section className="py-8 bg-gradient-to-br from-white to-green-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-800 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Baby className="w-4 h-4 mr-2" />
              Kids Kits
            </Badge>
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Equipment for Young Fans
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete kits specially designed for children, with sizes and comfort adapted for the youngest
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              {
                id: "kit-crianca-sporting-principal-2025-26",
                nome: "Kit Criança Sporting Principal 2025/26",
                imagem: "/images/558da3a2.webp",
                cor: "green"
              },
              {
                id: "kit-crianca-benfica-principal-2526",
                nome: "Kit Criança Benfica Principal 2025/26",
                imagem: "/images/slbpricipal1.webp",
                cor: "red"
              },
              {
                id: "benfica-kit-crianca-alternativo-2526",
                nome: "Kit de Criança - Benfica alternativo 25/26",
                imagem: "/images/d98a265b.webp",
                cor: "red"
              },
              {
                id: "benfica-2025-26-third-kit-child",
                nome: "Kit Criança Benfica Third 2025/26",
                imagem: "/images/slbterceiro1.webp",
                cor: "gray"
              },
              {
                id: "porto-2025-26-home-kit-child",
                nome: "Kit Criança Porto Home 2025/26",
                imagem: "/images/fcpprin.webp",
                cor: "blue"
              },
              {
                id: "kit-crianca-fcporto-terceiro-2526",
                nome: "Kit Criança FC Porto Terceiro 2025/26",
                imagem: "/images/CamisolaFCPortoAlternativa2526Infantil_ConjuntoBegecomDetalhesAzuis_1_700x.webp",
                cor: "slate"
              }
            ].map((kit, index) => (
              <ClientAnimationWrapper
                key={kit.id}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                  <Link href={`/produto/${kit.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <Image 
                        src={kit.imagem}
                        alt={kit.nome}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                          Kits
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                      <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                        {kit.nome}
                      </h3>
                      <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                          17.99€
                        </span>
                        
                      </div>
                    </div>
                  </Link>
                </div>
              </ClientAnimationWrapper>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  {
                    id: "kit-crianca-sporting-principal-2025-26",
                    nome: "Kit Criança Sporting Principal 2025/26",
                    imagem: "/images/558da3a2.webp",
                    cor: "green"
                  },
                  {
                    id: "kit-crianca-benfica-principal-2526",
                    nome: "Kit Criança Benfica Principal 2025/26",
                    imagem: "/images/slbpricipal1.webp",
                    cor: "red"
                  },
                  {
                    id: "benfica-kit-crianca-alternativo-2526",
                    nome: "Kit de Criança - Benfica alternativo 25/26",
                    imagem: "/images/d98a265b.webp",
                    cor: "red"
                  },
                  {
                    id: "benfica-2025-26-third-kit-child",
                    nome: "Kit Criança Benfica Third 2025/26",
                    imagem: "/images/slbterceiro1.webp",
                    cor: "gray"
                  },
                  {
                    id: "porto-2025-26-home-kit-child",
                    nome: "Kit Criança Porto Home 2025/26",
                    imagem: "/images/fcpprin.webp",
                    cor: "blue"
                  },
                  {
                    id: "kit-crianca-fcporto-terceiro-2526",
                    nome: "Kit Criança FC Porto Terceiro 2025/26",
                    imagem: "/images/CamisolaFCPortoAlternativa2526Infantil_ConjuntoBegecomDetalhesAzuis_1_700x.webp",
                    cor: "slate"
                  }
                ].map((kit) => (
                  <CarouselItem key={kit.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${kit.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={kit.imagem}
                            alt={kit.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                              Kits
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                            {kit.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              17.99€
                            </span>
                            
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Ver Mais Kits Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="modern-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
              <Link href="/catalogo?categoria=crianca" className="flex items-center gap-3">
                <Baby className="h-5 w-5" />
                View All Kids Kits
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Body Bebé Section */}
      <section className="py-8 bg-gradient-to-br from-white to-pink-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-pink-600 to-rose-800 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Baby className="w-4 h-4 mr-2" />
              Baby Body
            </Badge>
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Body for the Little Ones
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comfortable and soft body suits specially designed for babies, with sizes from 0 to 6 months and 6 to 12 months
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                id: "body-sporting-cp-2526-bebe",
                nome: "Body Sporting CP 2025/26",
                imagem: "/images/BodyCamisolaSportingCP2526Bebe_EquipamentoPrincipalVerdeeBranco_1_700x.jpg",
                cor: "green"
              },
              {
                id: "body-benfica-2526",
                nome: "Body Benfica 2025/26",
                imagem: "/images/BodyCamisolaBenfica2526Bebe_EquipamentoPrincipalVermelho_1_700x.jpg",
                cor: "red"
              },
              {
                id: "body-porto-2526",
                nome: "Body Porto 2025/26",
                imagem: "/images/BodyCamisolaFCPorto2526Bebe_EquipamentoPrincipalAzuleBranco_1_700x.jpg",
                cor: "blue"
              },
              {
                id: "portugal-2526-bebe-equipamento-principal-vermelho",
                nome: "Body Portugal Principal 2025/26 Bebé",
                imagem: "/images/BodyCamisolaPortugal2526Bebe_EquipamentoPrincipalVermelho_1_600x.jpg",
                cor: "red"
              }
            ].map((body, index) => (
              <ClientAnimationWrapper
                key={body.id}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                  <Link href={`/produto/${body.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <Image 
                        src={body.imagem}
                        alt={body.nome}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                          Body
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                      <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {body.nome}
                      </h3>
                      <div className="flex items-center justify-start">
                        <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                          17.99€
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </ClientAnimationWrapper>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  {
                    id: "body-sporting-cp-2526-bebe",
                    nome: "Body Sporting CP 2025/26",
                    imagem: "/images/BodyCamisolaSportingCP2526Bebe_EquipamentoPrincipalVerdeeBranco_1_700x.jpg",
                    cor: "green"
                  },
                  {
                    id: "body-benfica-2526",
                    nome: "Body Benfica 2025/26",
                    imagem: "/images/BodyCamisolaBenfica2526Bebe_EquipamentoPrincipalVermelho_1_700x.jpg",
                    cor: "red"
                  },
                  {
                    id: "body-porto-2526",
                    nome: "Body Porto 2025/26",
                    imagem: "/images/BodyCamisolaFCPorto2526Bebe_EquipamentoPrincipalAzuleBranco_1_700x.jpg",
                    cor: "blue"
                  },
                  {
                    id: "portugal-2526-bebe-equipamento-principal-vermelho",
                    nome: "Body Portugal Principal 2025/26 Bebé",
                    imagem: "/images/BodyCamisolaPortugal2526Bebe_EquipamentoPrincipalVermelho_1_600x.jpg",
                    cor: "red"
                  }
                ].map((body) => (
                  <CarouselItem key={body.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${body.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={body.imagem}
                            alt={body.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                              Body
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                            {body.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                              17.99€
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Ver Mais Body Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="modern-button bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
              <Link href="/catalogo?categoria=body" className="flex items-center gap-3">
                <Baby className="h-5 w-5" />
                View All Baby Body
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Camisolas Retro Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-800 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Camisolas Retro
            </Badge>
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Nostalgia e História do Futebol
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reviva os momentos históricos do futebol com camisolas retro dos maiores clubes e épocas douradas
            </p>
          </div>

          {/* Desktop Grid - Primeira Fila */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                id: "sporting-retro-99-00",
                nome: "Camisola Sporting Retro 99/00",
                imagem: "/images/6e0a2945.webp",
                preco: "19.99€",
                cor: "green"
              },
              {
                id: "retro-porto-90-93",
                nome: "Camisola Retro Porto 90/93 Principal",
                imagem: "/images/retroporto9093.webp",
                preco: "19.99€",
                cor: "blue"
              },
              {
                id: "retro-benfica-04-05",
                nome: "Camisola Retro Benfica 04/05 Principal",
                imagem: "/images/SLBENFICARetro0405.webp",
                preco: "19.99€",
                cor: "red"
              },
              {
                id: "kit-crianca-benfica-originals-25-26",
                nome: "Kit Criança Benfica x Adidas Originals 2025/26",
                imagem: "/images/01_25_26 Benfica Retro Special Edition  Size_ 16-28 _ Yupoo.jpg",
                preco: "23.99€",
                cor: "red"
              }
            ].map((produto, index) => (
              <ClientAnimationWrapper
                key={produto.id}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                  <Link href={`/produto/${produto.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <Image 
                        src={produto.imagem}
                        alt={produto.nome}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={85}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                          Retro
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                      <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-amber-600 transition-colors">
                        {produto.nome}
                      </h3>
                      <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                          {produto.preco}
                        </span>
                        
                      </div>
                    </div>
                  </Link>
                </div>
              </ClientAnimationWrapper>
            ))}
          </div>

          {/* Desktop Grid - Segunda Fila */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                id: "calcas-retro-slbenfica-adidas-originals",
                nome: "Calças Retro SL Benfica x Adidas Originals",
                imagem: "/images/calcas_retro_slbenfica_adidas_originals_5.webp",
                preco: "23.99€",
                cor: "red"
              },
              {
                id: "fato-treino-slbenfica-adidas-originals",
                nome: "Fato de Treino SL Benfica x adidas Originals",
                imagem: "/images/FatodeTreinoSLBenficaxadidasOriginalsICON2526_VermelhoUnissexo_1_500x.webp",
                preco: "45.99€",
                cor: "red"
              }
            ].map((produto, index) => (
              <ClientAnimationWrapper
                key={produto.id}
                delay={(index + 3) * 0.1}
                className="animate-scale-in"
              >
                <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                  <Link href={`/produto/${produto.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <Image 
                        src={produto.imagem}
                        alt={produto.nome}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={85}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                          Retro
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                      <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                        {produto.nome}
                      </h3>
                      <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                          {produto.preco}
                        </span>
                        
                      </div>
                    </div>
                  </Link>
                </div>
              </ClientAnimationWrapper>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  {
                    id: "sporting-retro-99-00",
                    nome: "Camisola Sporting Retro 99/00",
                    imagem: "/images/6e0a2945.webp",
                    preco: "19.99€",
                    cor: "green"
                  },
                  {
                    id: "retro-porto-90-93",
                    nome: "Camisola Retro Porto 90/93 Principal",
                    imagem: "/images/retroporto9093.webp",
                    preco: "19.99€",
                    cor: "blue"
                  },
                  {
                    id: "retro-benfica-04-05",
                    nome: "Camisola Retro Benfica 04/05 Principal",
                    imagem: "/images/SLBENFICARetro0405.webp",
                    preco: "19.99€",
                    cor: "red"
                  },
                  {
                    id: "kit-crianca-benfica-originals-25-26",
                    nome: "Kit Criança Benfica x Adidas Originals 2025/26",
                    imagem: "/images/01_25_26 Benfica Retro Special Edition  Size_ 16-28 _ Yupoo.jpg",
                    preco: "23.99€",
                    cor: "red"
                  },
                  {
                    id: "calcas-retro-slbenfica-adidas-originals",
                    nome: "Calças Retro SL Benfica x Adidas Originals",
                    imagem: "/images/calcas_retro_slbenfica_adidas_originals_5.webp",
                    preco: "23.99€",
                    cor: "red"
                  },
                  {
                    id: "fato-treino-slbenfica-adidas-originals",
                    nome: "Fato de Treino SL Benfica x adidas Originals",
                    imagem: "/images/FatodeTreinoSLBenficaxadidasOriginalsICON2526_VermelhoUnissexo_1_500x.webp",
                    preco: "45.99€",
                    cor: "red"
                  }
                ].map((produto) => (
                  <CarouselItem key={produto.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${produto.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={produto.imagem}
                            alt={produto.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                              Retro
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className={`font-bold text-lg mb-3 text-gray-800 transition-colors`}>
                            {produto.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className={`text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent`}>
                              {produto.preco}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Ver Mais Retro Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="modern-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
              <Link href="/catalogo?categoria=retro" className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                View All Retro Jerseys
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Parceiros Section */}
      <ParceirosSection />

      {/* Modern Vantagens Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Why choose fanzone12.com?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer the best shopping experience with quality products and exceptional service
            </p>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            <ClientAnimationWrapper
              delay={0}
              className="animate-scale-in"
            >
              <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  Fast Delivery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Shipping from just €4 and free for 3 or more jerseys. Fast delivery across Europe.
                </p>
              </div>
            </ClientAnimationWrapper>

            <ClientAnimationWrapper
              delay={0.1}
              className="animate-scale-in"
            >
              <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
                  Secure Payment
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Multiple secure payment options with complete protection of your data.
                </p>
              </div>
            </ClientAnimationWrapper>

            <ClientAnimationWrapper
              delay={0.2}
              className="animate-scale-in"
            >
              <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-yellow-600 transition-colors">
                  Guaranteed Quality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Official products with authenticity guarantee and premium quality.
                </p>
              </div>
            </ClientAnimationWrapper>
          </div>

          {/* Mobile Carousel - Hidden on desktop */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                <CarouselItem className="pl-2">
                  <ClientAnimationWrapper
                    delay={0}
                    className="animate-scale-in"
                  >
                    <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                        <Truck className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                        Fast Delivery
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Shipping from just €4 and free for 3 or more jerseys. Fast delivery across Europe.
                      </p>
                    </div>
                  </ClientAnimationWrapper>
                </CarouselItem>

                <CarouselItem className="pl-2">
                  <ClientAnimationWrapper
                    delay={0.1}
                    className="animate-scale-in"
                  >
                    <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
                        Pagamento Seguro
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Múltiplas opções de pagamento seguro com proteção total dos seus dados.
                      </p>
                    </div>
                  </ClientAnimationWrapper>
                </CarouselItem>

                <CarouselItem className="pl-2">
                  <ClientAnimationWrapper
                    delay={0.2}
                    className="animate-scale-in"
                  >
                    <div className="modern-card group p-8 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-yellow-600 transition-colors">
                        Qualidade Garantida
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Produtos oficiais com garantia de autenticidade e qualidade premium.
                      </p>
                    </div>
                  </ClientAnimationWrapper>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Catálogo Completo Info Section - Estático */}
      <section id="complete-catalog-section" className="py-4 sm:py-8 bg-gradient-to-br from-gray-50 to-blue-50/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 shadow-modern">
            <div className="mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Can't find the jersey you're looking for?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                We have a complete catalog with over <span className="font-bold text-blue-600">5000 jerseys</span> that are not published here!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">How to proceed:</h3>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs sm:text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">View the full catalog on Drive</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">We have thousands of additional models. Check here:</p>
                    <div className="mt-2">
                      <a 
                        href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                        Open catalog on Drive
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">If you can't find it, contact us</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Send us a message with club, season and desired model.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a 
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Send message
              </a>
              <a 
                href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-all duration-300"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                View full catalog
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seções de Informações Estáticas */}
      <StaticInfoSections />
    </div>
  )
}
