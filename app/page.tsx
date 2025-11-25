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
import DisablePinchZoomWrapper from "@/components/disable-pinch-zoom-wrapper"
import { 
  BEST_SELLERS_IDS as bestSellersIds
} from "@/lib/constants"

export default async function Home() {
  const produtosDestaque = await getDestaques()
  
  // Buscar produtos best sellers
  const bestSellers = (await Promise.all(bestSellersIds.map(id => getProdutoById(id)))).filter(Boolean) as Product[]
  
  // Adicionar adidas-originals-gazelle-indoor-hq8716 na 4ª posição
  const gazelleProduct = await getProdutoById("adidas-originals-gazelle-indoor-hq8716id")
  if (gazelleProduct) {
    bestSellers.splice(3, 0, gazelleProduct)
  }
  
  // Adicionar adidas-if6562-hl051301028 na 5ª posição
  const adidasProduct = await getProdutoById("adidas-if6562-hl051301028")
  if (adidasProduct) {
    bestSellers.splice(4, 0, adidasProduct)
  }
  
  // Buscar produtos versão jogador (limitar a 12)
  const versaoJogador = await getProdutos({ versao: "jogador" })
  const versaoJogadorLimitada = versaoJogador.slice(0, 12)

  // Dados para Top Ligas
  const topLigas = [
    { id: "liga-portuguesa", name: "Liga Portuguesa", image: "/images/liga-portugal-2025-26-a07d17-1-1-square.webp", link: "/catalogo?liga=liga-portuguesa", objectPosition: "object-[center_30%]" },
    { id: "premier-league", name: "Premier League", image: "/images/premier-league-2025-26-81f589.webp", link: "/catalogo?liga=premier-league", objectPosition: "object-top" },
    { id: "la-liga", name: "La Liga", image: "/images/534364999_18523853707014415_2061336633682321964_n.webp", link: "/catalogo?liga=la-liga", objectPosition: "object-[center_45%]" },
    { id: "ligue-1", name: "Ligue 1", image: "/images/496967650_18407572888103417_4204304631253123566_n.jpg", link: "/catalogo?liga=ligue-1", objectPosition: "object-[center_10%]" },
    { id: "kits-crianca", name: "Kits Criança", image: "/images/MIC25_MAD_FCE_DS-6.webp", link: "/catalogo?categoria=crianca", objectPosition: "object-[center_20%]" },
    { id: "retro", name: "Retro", image: "/images/NINTCHDBPICT000004408735.webp", link: "/catalogo?categoria=retro", objectPosition: "object-top" },
  ];

  // Dados para Novidades
  const novidades = [
    {
      id: "portugal-principal-2026",
      name: "Camisola Seleção Portugal Principal 2026",
      image: "/images/2025092114284096_20_281_29.webp",
      price: 17.99,
      badge: "Novo",
      href: "/produto/portugal-principal-2026"
    },
    {
      id: "portugal-pantera-negra",
      name: "Camisola Portugal Edição Especial Pantera Negra",
      image: "/images/2025092114282251_20_281_29.webp",
      price: 17.99,
      badge: "Novo",
      href: "/produto/portugal-pantera-negra"
    },
   {
     id: "fcporto-special-edition-25-26-iv",
     name: "FC Porto Special Edition IV 25/26",
     image: "/images/IMG-1004.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/fcporto-special-edition-25-26-iv"
   },
   {
     id: "benfica-special-edition-25-26-10",
     name: "Benfica Special Edition 25/26",
     image: "/images/896AFF59-187D-486A-92EC-4522003C558F.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/benfica-special-edition-25-26-10"
   },
   {
     id: "barcelona-2526-special-edition-bright-pink-jersey",
     name: "Camisola Barcelona Special Edition Bright Pink 2025/26",
     image: "/images/barcelona-2025-bright-pink-special-shirt-6815904.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/barcelona-2526-special-edition-bright-pink-jersey"
   },
   {
     id: "benfica-edicao-especial-25-26",
     name: "Camisola Benfica guarda-redes rosa 2025/26",
     image: "/images/0371ad58.jpg",
     price: 17.99,
     badge: "Novo",
     href: "/produto/benfica-edicao-especial-25-26"
   },
   {
     id: "sporting-stromp-25-26",
     name: "Camisola Sporting C.P. Stromp 25/26",
     image: "/images/2025102310182442.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/sporting-stromp-25-26"
   },
   {
     id: "sporting-edicao-especial-25-26",
     name: "Camisola Sporting CP Edição Especial 2025/26",
     image: "/images/a3d81a71.jpg",
     price: 17.99,
     badge: "Novo",
     href: "/produto/sporting-special-25-26"
   },
   {
     id: "sporting-outubro-rosa-2025",
     name: "Camisola Sporting C.P. Outubro Rosa 2025",
     image: "/images/2025110416210851.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/sporting-outubro-rosa-2025"
   },
   {
     id: "sporting-special-25-26",
     name: "Camisola Sporting CP Special Edition 2025/26",
     image: "/images/16a8dee8.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/sporting-special-25-26"
   },
   {
     id: "t-shirt-treino-plantel-fc-porto-2526",
     name: "Camisola FC Porto Edição Especial 2025/26",
     image: "/images/82e839c6.jpg",
     price: 23.99,
     badge: "Novo",
     href: "/produto/t-shirt-treino-plantel-fc-porto-2526"
   },
   {
     id: "vitoria-sc-principal-25-26",
     name: "Camisola Vitoria SC Principal 2025/26",
     image: "/images/01_25_26 Guimarães Home S-XXL _ Yupoo.jpg",
     price: 17.99,
     badge: "Novo",
     href: "/produto/vitoria-sc-principal-25-26"
   },
   {
     id: "vitoria-sc-alternativa-25-26",
     name: "Camisola Vitoria SC Alternativa 2025/26",
     image: "/images/b82c2c0a.jpg",
     price: 17.99,
     badge: "Novo",
     href: "/produto/vitoria-sc-alternativa-25-26"
   },
   {
     id: "flamengo-third-25-26",
     name: "Camisola Flamengo 3º Equipamento 2025/26",
     image: "/images/82c0ccdf.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/flamengo-third-25-26"
   },
   {
     id: "roma-third-away-25-26",
     name: "Camisola Roma 3º Equipamento Away 2025/26",
     image: "/images/01_25_26 Roma third away S-4XL _ Yupoo.webp",
     price: 17.99,
     badge: "Novo",
     href: "/produto/roma-third-away-25-26"
   }
 ];

  return (
    <div className="animate-fade-in">
      <DisablePinchZoomWrapper />
      {/* Promoção Banner */}
        <section className="bg-card text-card-foreground py-3 relative overflow-hidden border-b border-border">
         {/* Fundo animado no desktop, estático no mobile */}
         <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 animate-pulse motion-reduce:animate-none hidden md:block"></div>
         <div className="absolute inset-0 md:hidden bg-gradient-to-r from-purple-600/15 via-transparent to-purple-600/15"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
               <span>🎁</span>
              <span className="text-blue-700">PROMOÇÃO ESPECIAL:</span>
              <span className="text-foreground">Leva 4 Camisolas e Paga Apenas 3!</span>
               <span>🎁</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Desconto automático aplicado no carrinho • Válido em toda a loja
            </div>
          </div>
        </div>
      </section>

      {/* Top Ligas Section - Unificada */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4 inline-block">
              Top Ligas
            </Badge>
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Explore as Melhores Ligas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra os produtos das principais ligas e competições do mundo
            </p>
          </div>

          {/* Grid Única Responsiva */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {topLigas.map((card, index) => (
              <ClientAnimationWrapper
                key={card.id}
                delay={index * 0.1}
                className="animate-scale-in"
              >
                <Link
                  href={card.link}
                  className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group block h-full"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className={`object-cover ${card.objectPosition} transition-all duration-500 group-hover:scale-105`}
                      sizes="(max-width: 768px) 45vw, 33vw"
                      quality={80}
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 md:p-6 text-center">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors">
                      {card.name}
                    </h3>
                    <Button
                      size="default"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 md:px-6 md:py-2 text-xs md:text-sm rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all w-full md:w-auto"
                    >
                      VER MAIS
                    </Button>
                  </div>
                </Link>
              </ClientAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Círculos de Ligas Adicionais Section */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { name: "Serie A", logo: "SerieA_logo.webp", link: "/catalogo?liga=serie-a" },
              { name: "Bundesliga", logo: "Bundesliga_logo_(2017).webp", link: "/catalogo?liga=bundesliga" },
              { name: "Seleções", logo: "Portugal_FPF.webp", link: "/catalogo?liga=selecoes-nacionais" },
              { name: "Outras Ligas", logo: "ligasoutras.png", link: "/catalogo?liga=outras-ligas" },
            ].map((liga) => (
              <Link
                key={liga.name}
                href={liga.link}
                className="group flex flex-col items-center"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-transparent bg-gradient-to-r from-purple-500 to-orange-500 p-1 rounded-full hover:scale-110 transition-transform duration-300">
                  <div className="relative w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <Image
                      src={`/images/${liga.logo}`}
                      alt={liga.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 96px, 128px"
                      quality={80}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm md:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {liga.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias em Quadrado Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Categorias
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra as nossas principais categorias de produtos
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { name: "Camisolas", image: "/images/1751647533_9cc7b4a154af3f78533665e36b695936.webp", link: "/catalogo" },
              { name: "Sneakers", image: "/images/www-001017731202531-08.avif", link: "/sneakers" },
              { name: "Capas de Telemóvel", image: "/images/personalized-soccer-01-caseitup-6617908.webp", link: "/catalogo/capas" },
              { name: "Bolas", image: "/images/Bola_Pro_da_Fase_da_Liga_da_UCL_25-26_Branco_JD0188_HM1.avif", link: "/catalogo?categoria=bolas" },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.link}
                className="group flex flex-col items-center"
              >
                <div className="w-40 h-40 md:w-56 md:h-56 border-4 border-transparent bg-gradient-to-r from-purple-500 to-orange-500 p-1.5 rounded-2xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative w-full h-full rounded-xl bg-white overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 160px, 224px"
                      quality={80}
                    />
                  </div>
                </div>
                <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas Novidades Section - Unificado */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Novidades
            </Badge>
            <h2 className="text-responsive-lg text-foreground mb-4">
              Últimas Novidades
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As camisolas mais recentes que acabaram de chegar à nossa coleção
            </p>
          </div>

          {/* Carousel Único Responsivo */}
          <div>
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                 {novidades.map((product, index) => (
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
                              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 30vw, 25vw"
                              quality={80}
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
                Ver Todas as Novidades
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mais Vendidas Section - Unificado */}
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
              Descubra as camisolas mais populares escolhidas pelos nossos clientes
            </p>
          </div>

          {/* Carousel Único Responsivo */}
          <div>
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {/* Best Sellers Mapeado Automaticamente com Dados Reais */}
                {bestSellers.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[28%] lg:basis-[22%]">
                    <ClientAnimationWrapper
                      delay={index * 0.1}
                      className="animate-scale-in"
                    >
                      <div className="modern-card rounded-2xl shadow-modern hover:shadow-modern-hover overflow-hidden group bg-white">
                        <Link href={`/produto/${product.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden">
                            <Image 
                              src={product.imagem}
                              alt={product.nome}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              loading="lazy"
                              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 30vw, 25vw"
                              quality={80}
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                                {product.edicao_especial ? "Mais Vendida" : "Popular"}
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
                                {product.preco}€
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

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg px-8 py-3 rounded-full"
            >
              <Link href="/catalogo" className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Ver Todas as Mais Vendidas
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
              Encontre as camisolas dos maiores clubes europeus com qualidade premium e designs autênticos
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
                Ver todos os clubes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Versão Jogador Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              ⚽ Versão Jogador
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Camisolas de qualidade profissional, idênticas às usadas pelos jogadores em campo
            </p>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {versaoJogadorLimitada.map((product) => (
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
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg">
                            ⚽ Jogador
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.nome}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              €{product.preco.toFixed(2)}
                            </span>
                            {product.precoAntigo && (
                              <span className="text-sm text-gray-500 line-through">
                                €{product.precoAntigo.toFixed(2)}
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

          {/* Ver Mais Button */}
          <div className="flex justify-center mt-8">
            <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-xl">
              <Link href="/catalogo?versao=jogador" className="flex items-center gap-2">
                Ver mais camisolas de jogador
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sneakers Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Coleção Sneakers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descobre as últimas novidades em sneakers das melhores marcas para completar o teu estilo.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {/* Categoria Nike */}
            <Link href="/sneakers/nike" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
                <div className="relative w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
                  <Image
                    src="/images/1000541110.webp"
                    alt="Sneakers Nike"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  
                  {/* Overlay com gradiente na parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white text-orange-600 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                      NIKE
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">Nike</h3>
                    <p className="text-orange-100 text-sm sm:text-base mb-2 drop-shadow-md">Just Do It - Inovação americana</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs sm:text-sm text-orange-100">Just Do It</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Categoria Adidas */}
            <Link href="/sneakers/adidas" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
                <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600">
                  <Image
                    src="/images/tenis-adidas-campus-00s-feminino-core-black-preto-7.webp"
                    alt="Sneakers Adidas"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  
                  {/* Overlay com gradiente na parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white text-green-600 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                      ADIDAS
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">Adidas</h3>
                    <p className="text-green-100 text-sm sm:text-base mb-2 drop-shadow-md">Sneakers clássicos alemães</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs sm:text-sm text-green-100">Impossible is Nothing</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Categoria New Balance */}
            <Link href="/sneakers/new-balance" className="group">
              <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
                <div className="relative w-full h-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                  <Image
                    src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                    alt="Sneakers New Balance"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  
                  {/* Overlay com gradiente na parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white text-gray-800 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                      NEW BALANCE
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">New Balance</h3>
                    <p className="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-md">Conforto e qualidade americana</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-200">Fearlessly Independent</span>
                    </div>
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
                    <div className="relative aspect-[0.85] bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/images/1000541110.webp"
                        alt="Sneakers Nike"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      
                      {/* Overlay com gradiente na parte inferior */}
                      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-white text-orange-600 text-xs px-2.5 py-1 font-bold rounded-full shadow-lg">
                          NIKE
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">Nike</h3>
                        <p className="text-orange-100 text-xs mb-1 drop-shadow-md">Just Do It - Inovação americana</p>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-orange-100">Just Do It</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
                <CarouselItem className="basis-full">
                  <Link href="/sneakers/adidas" className="group block">
                    <div className="relative aspect-[0.85] bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/images/tenis-adidas-campus-00s-feminino-core-black-preto-7.webp"
                        alt="Sneakers Adidas"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      
                      {/* Overlay com gradiente na parte inferior */}
                      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-white text-green-600 text-xs px-2.5 py-1 font-bold rounded-full shadow-lg">
                          ADIDAS
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">Adidas</h3>
                        <p className="text-green-100 text-xs mb-1 drop-shadow-md">Sneakers clássicos alemães</p>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-green-100">Impossible is Nothing</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
                <CarouselItem className="basis-full">
                  <Link href="/sneakers/new-balance" className="group block">
                    <div className="relative aspect-[0.85] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                        alt="Sneakers New Balance"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="100vw"
                        quality={85}
                      />
                      
                      {/* Overlay com gradiente na parte inferior */}
                      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-white text-gray-800 text-xs px-2.5 py-1 font-bold rounded-full shadow-lg">
                          NEW BALANCE
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">New Balance</h3>
                        <p className="text-gray-200 text-xs mb-1 drop-shadow-md">Conforto e qualidade americana</p>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-xs text-gray-200">Fearlessly Independent</span>
                        </div>
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
                Ver todos os sneakers
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
              Os sneakers mais vendidos e amados pelos nossos clientes
            </p>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {bestSellers.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
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

      {/* Parceiros Section */}
      <ParceirosSection />

      {/* Modern Vantagens Section */}
      <section className="py-8 modern-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-responsive-lg text-gray-800 mb-4">
              Por que escolher a fanzone12.pt?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência de compra com produtos de qualidade e serviço excepcional
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
                  Entrega Rápida
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Portes de apenas 4€ e grátis para 3 ou mais camisolas. Entrega rápida em toda a Europa.
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
                  Pagamento Seguro
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Múltiplas opções de pagamento seguro com proteção total dos seus dados.
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
                  Qualidade Garantida
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Produtos oficiais com garantia de autenticidade e qualidade premium.
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
                        Entrega Rápida
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Portes de apenas 4€ e grátis para 3 ou mais camisolas. Entrega rápida em toda a Europa.
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
                Não encontrou a camisola que procura?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Temos um catálogo completo com mais de <span className="font-bold text-blue-600">5000 camisolas</span> que não estão aqui publicadas!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Como proceder:</h3>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs sm:text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Veja o catálogo completo na Drive</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Temos milhares de modelos adicionais. Consulte aqui:</p>
                    <div className="mt-2">
                      <a 
                        href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                        Abrir catálogo na Drive
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Se não encontrar, fale connosco</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Envie-nos uma mensagem com clube, temporada e modelo pretendido.</p>
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
                Enviar mensagem
              </a>
              <a 
                href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-all duration-300"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                Ver catálogo completo
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
