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
  
  // Buscar produtos best sellers (sneakers)
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
  
  // All-Time Best Sellers - Camisolas de grandes clubes europeus
  const allTimeBestSellersIds = [
    "real-madrid-25-26-home",
    "barcelona-principal-2526",
    "manchester-united-terceira-2526",
    "camisola-liverpool-principal-2025-26",
    "man-city-25-26-home",
    "arsenal-home-2526",
    "chelsea-home-2526",
    "psg-25-26-jogador-home",
    "bayern-25-26-home",
    "milan-25-26-home",
    "barcelona-travis-scott-2526",
    "real-madrid-special-edition-4-2526"
  ] as const
  const allTimeBestSellers = (await Promise.all(allTimeBestSellersIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Equipment for Young Fans - Kits de criança das equipas mais populares da Europa
  const youngFansKitsIds = [
    "kit-crianca-barcelona-principal-kids-2526",
    "kit-crianca-real-madrid-25-26",
    "kit-crianca-manchester-united-principal-2526",
    "kit-crianca-liverpool-i-2425",
    "kit-crianca-manchester-city-principal-2526",
    "kit-crianca-psg-principal-2526"
  ] as const
  
  // Fan Favorites - Favoritas dos Fans
  const fanFavoritesIds = [
    "arsenal-25-26-terceiro",
    "real-madrid-special-edition-rosa-2526",
    "psg-25-26-third-away",
    "camisola-juventus-principal-2526",
    "camisola-man-city-alternativa-2526",
    "liverpool-25-26-alternativa",
    "napoli-25-26-away",
    "barcelona-2526-special-edition-bright-pink-jersey",
    "chelsea-away-2526",
    "ac-milan-25-26-terceiro",
    "roma-third-away-25-26",
    "bayern-munich-alternativa-25-26",
    "camisola-inter-principal-2526",
    "manchester-united-terceira-2526",
    "tottenham-away-2526"
  ] as const
  const fanFavorites = (await Promise.all(fanFavoritesIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // National Teams - Seleções nacionais (2025/26 e 2026) - Special editions first
  const nationalTeamsIds = [
    "portugal-pantera-negra",
    "portugal-pantera-negra-versao-jogador",
    "portugal-principal-2026",
    "portugal-25-26-home",
    "portugal-alternativa-2025"
  ] as const
  const nationalTeams = (await Promise.all(nationalTeamsIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Barcelona Kits (2025/26) - Ordem específica
  const barcelonaKitsIds = [
    "barcelona-2526-special-edition-bright-pink-jersey",
    "barcelona-special-vi-2526",
    "barcelona-25-26-special-edition-iv",
    "barcelona-special-vii-2526",
    "barcelona-special-viii-2526",
    "barcelona-preta-special-edition-2526",
    "barcelona-cf-special-edition-2526",
    "barcelona-25-26-special-edition-v",
    "barcelona-25-26-special-edition-vii",
    "barcelona-travis-scott-2526",
    "barcelona-travis-scott-preta-2526",
    "barcelona-special-edition-2526",
    "barcelona-special-edition-2-2526",
    "barcelona-special-edition-3-2526",
    "barcelona-25-26-jogador-special-edition",
    "barcelona-25-26-jogador-special-edition-ii",
    "barcelona-25-26-jogador-special-edition-iii",
    "barcelona-25-26-jogador-125th-anniversary",
    "barcelona-25-26-jogador-rosa",
    "barcelona-25-26-joint-edition",
    "barcelona-principal-2526",
    "barcelona-25-26-home",
    "barcelona-25-26-third-away"
  ] as const
  const barcelonaKits = (await Promise.all(barcelonaKitsIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Real Madrid Kits (2025/26) - Ordem específica
  const realMadridKitsIds = [
    "real-madrid-special-edition-rosa-2526",
    "real-madrid-special-edition-3-2526",
    "real-madrid-special-edition-4-2526",
    "realmadrid-2526-jogador-rosa",
    "real-madrid-cf-special-edition-2526",
    "real-madrid-25-26-home",
    "real-madrid-25-26-away",
    "real-madrid-terceira-fora-2526",
    "camisola-real-madrid-gr-2526",
    "real-madrid-special-edition-2526",
    "real-madrid-special-edition-2-2526",
    "real-madrid-special-edition-5-2526",
    "real-madrid-special-edition-6-2526",
    "real-madrid-special-edition-2-player-2526",
    "real-madrid-special-edition-player-2526",
    "real-madrid-25-26-jogador-special-edition-vii",
    "realmadrid-special-2526"
  ] as const
  const realMadridKits = (await Promise.all(realMadridKitsIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  const youngFansKits = (await Promise.all(youngFansKitsIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
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

      {/* Top Leagues Section - 1st Section */}
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
              { name: "Premier League", logo: "Premier-League-Logo-PNG-Iconic-English-Football-Emblem-Transparent.webp", href: "/catalogo?liga=premier-league" },
              { name: "La Liga", logo: "LaLiga-Logo-PNG-Official-Symbol-for-Football-League-Transparent.webp", href: "/catalogo?liga=la-liga" },
              { name: "Serie A", logo: "SerieA_logo.webp", href: "/catalogo?liga=serie-a" },
              { name: "Bundesliga", logo: "Bundesliga_logo_(2017).webp", href: "/catalogo?liga=bundesliga" },
              { name: "Ligue 1", logo: "Ligue1_Uber_Eats_logo.webp", href: "/catalogo?liga=ligue-1" },
              { name: "Other Leagues", logo: "images.webp", href: "/catalogo?liga=outras-ligas" },
              { name: "National Teams", logo: "Portugal_FPF.webp", href: "/catalogo?liga=selecoes-nacionais" },
              { name: "Portuguese League", logo: "Liga_Portugal_Betclic_2023.webp", href: "/catalogo?liga=liga-portuguesa" },
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
              { name: "Premier League", logo: "Premier-League-Logo-PNG-Iconic-English-Football-Emblem-Transparent.webp", href: "/catalogo?liga=premier-league" },
              { name: "La Liga", logo: "LaLiga-Logo-PNG-Official-Symbol-for-Football-League-Transparent.webp", href: "/catalogo?liga=la-liga" },
              { name: "Serie A", logo: "SerieA_logo.webp", href: "/catalogo?liga=serie-a" },
              { name: "Bundesliga", logo: "Bundesliga_logo_(2017).webp", href: "/catalogo?liga=bundesliga" },
              { name: "Ligue 1", logo: "Ligue1_Uber_Eats_logo.webp", href: "/catalogo?liga=ligue-1" },
              { name: "Other Leagues", logo: "images.webp", href: "/catalogo?liga=outras-ligas" },
              { name: "National Teams", logo: "Portugal_FPF.webp", href: "/catalogo?liga=selecoes-nacionais" },
              { name: "Portuguese League", logo: "Liga_Portugal_Betclic_2023.webp", href: "/catalogo?liga=liga-portuguesa" },
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

      {/* All-Time Best Sellers Section - 2nd Section */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 mr-2" />
              All-Time Best Sellers
            </Badge>
            <h2 className="text-responsive-lg text-foreground mb-4">
              All-Time Best Sellers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular jerseys from the biggest European clubs, chosen by our customers
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {allTimeBestSellers.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[28%] lg:basis-[22%]">
                    <ClientAnimationWrapper
                      delay={index * 0.1}
                      className="animate-scale-in"
                    >
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                        <Link href={`/produto/${product.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={product.imagem}
                              alt={product.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
                              quality={85}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                Best Seller
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.nome}
                            </h3>
                            <div className="flex items-center justify-start">
                              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                {product.preco.toFixed(2)}€
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
                {allTimeBestSellers.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                              Best Seller
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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

      {/* Modern Top Clubs Section - 3rd Section */}
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
                  { name: "Sporting CP", logo: "pngwing.com (1).webp", href: "/catalogo?clube=sporting" },
                  { name: "Benfica", logo: "pngwing.com.webp", href: "/catalogo?clube=benfica" },
                  { name: "Porto", logo: "pngwing.com (2).webp", href: "/catalogo?clube=porto" },
                  { name: "Braga", logo: "braga-logo.png", href: "/catalogo?clube=sc-braga" },
                  { name: "Vitória SC", logo: "Vitoria-Sport-Clube-logo.png", href: "/catalogo?clube=vitoria-sc" },
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

      {/* Fan Favorites Section - 4th Section */}
      <section className="py-8 bg-gradient-to-br from-purple-50 to-pink-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 mr-2" />
              Fan Favorites
            </Badge>
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Fan Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The most loved jerseys chosen by our fans from the biggest European clubs
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {fanFavorites.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/4 lg:basis-1/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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
            <Carousel className="w-full">
              <CarouselContent>
                {fanFavorites.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo" className="flex items-center gap-2">
                View All Fan Favorites
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* National Teams Section - 5th Section */}
      <section className="py-8 bg-gradient-to-br from-white to-red-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              National Teams
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support your national team with official jerseys from the biggest tournaments
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {nationalTeams.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/4 lg:basis-1/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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
            <Carousel className="w-full">
              <CarouselContent>
                {nationalTeams.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo?liga=selecoes-nacionais" className="flex items-center gap-2">
                View All National Teams
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All Barcelona Kits Section - 6th Section */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-red-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              All Barcelona Kits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the complete collection of FC Barcelona jerseys and kits
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {barcelonaKits.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/4 lg:basis-1/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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
            <Carousel className="w-full">
              <CarouselContent>
                {barcelonaKits.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo?clube=barcelona" className="flex items-center gap-2">
                View All Barcelona Kits
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All Real Madrid Kits Section - 7th Section */}
      <section className="py-8 bg-gradient-to-br from-white to-purple-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              All Real Madrid Kits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the complete collection of Real Madrid jerseys and kits
            </p>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {realMadridKits.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/4 lg:basis-1/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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
            <Carousel className="w-full">
              <CarouselContent>
                {realMadridKits.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/5">
                    <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group">
                      <Link href={`/produto/${product.id}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image 
                            src={product.imagem}
                            alt={product.nome}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                            sizes="80vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
                          <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {product.nome}
                          </h3>
                          <div className="flex items-center justify-start">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              {product.preco.toFixed(2)}€
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

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo?clube=real-madrid" className="flex items-center gap-2">
                View All Real Madrid Kits
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Equipment for Young Fans Section - 7th Section */}
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
            {youngFansKits.map((kit, index) => (
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
                          Kids
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
                          {kit.preco.toFixed(2)}€
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
                {youngFansKits.map((kit) => (
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
                              Kids
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
                              {kit.preco.toFixed(2)}€
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

      {/* Sneakers Section - 8th Section */}
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
