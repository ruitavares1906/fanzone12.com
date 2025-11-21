import { ProductCard } from "@/components/product-card"
import { getProdutos } from "@/lib/products"
import { Suspense } from "react"
import { ProductsFilter } from "@/components/products-filter"
import { MobileFilters } from "@/components/mobile-filters"
import { ProductsSort } from "@/components/products-sort"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { X, Search, Filter, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ClientAnimationWrapper } from "@/components/client-animation-wrapper"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Image from "next/image"
import { MobileFiltersTrigger } from "@/components/mobile-filters-trigger"
import { ContactMessage } from "@/components/contact-message"
import { ParceirosSectionCompact } from "@/components/parceiros-section"

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined
  const clube = typeof params.clube === "string" ? params.clube : undefined
  const cor = typeof params.cor === "string" ? params.cor : undefined
  const liga = typeof params.liga === "string" ? params.liga : undefined
  const ordenar = typeof params.ordenar === "string" ? params.ordenar : "recentes"
  const pesquisa = typeof params.pesquisa === "string" ? params.pesquisa : undefined
  const versao = typeof params.versao === "string" ? params.versao : undefined

  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 33 // 34 no mobile (17 linhas × 2), 33 no desktop (34º oculto com lg:hidden)

  const todosProdutos = await getProdutos({ categoria, clube, cor, liga, ordenar, pesquisa, versao })
  const total = todosProdutos.length
  const inicio = (pagina - 1) * porPagina
  // Buscar 34 produtos para mobile, mas usar 33 para paginação
  const produtosSlice = todosProdutos.slice(inicio, inicio + porPagina + 1)
  const produtos = produtosSlice.slice(0, porPagina) // Primeiros 33 para paginação
  const produtoExtra = produtosSlice[porPagina] // 34º produto para mobile

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-6 sm:py-12 animate-fade-in">
        {/* Promoção Banner */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-2xl p-4 sm:p-6 shadow-modern relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 md:animate-pulse motion-reduce:animate-none"></div>
            <div className="text-center relative">
              <div className="flex items-center justify-center gap-2 text-sm sm:text-lg font-bold mb-2">
                <span className="md:animate-bounce motion-reduce:animate-none">🎁</span>
                <span className="text-yellow-300">ACTIVE PROMOTION:</span>
                <span>Buy 4 Jerseys and Pay for Only 3!</span>
                <span className="md:animate-bounce motion-reduce:animate-none">🎁</span>
              </div>
              <div className="text-xs sm:text-sm text-purple-200">
                Automatic discount applied at checkout • Valid storewide • Choose your favorites!
              </div>
            </div>
          </div>
        </div>

        {/* Modern Header */}
        <div className="mb-6 sm:mb-12">
          <div className="glass-effect rounded-2xl p-4 sm:p-8 shadow-modern">
            <div className="flex items-center mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">
                {pesquisa ? `Results for "${pesquisa}"` : "Product Catalog"}
              </h1>
            </div>
            {/* Nota superior para catálogo completo na Drive */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-blue-800 text-sm sm:text-base font-medium">
                Can't find the jersey you're looking for? View our full catalog on Drive.
              </p>
              <Button asChild size="sm" variant="outline" className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50">
                <Link href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  View full catalog
                </Link>
              </Button>
            </div>
            
            {pesquisa && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-600 font-medium">
                    {total} product{total !== 1 ? 's' : ''} found
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="modern-button border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full">
                  <Link href="/catalogo" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Clear search
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>



        {/* Mobile Top Clubs Carousel */}
        <div className="mb-6 sm:mb-8 lg:hidden">
          <div className="glass-effect rounded-2xl p-4 shadow-modern">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">Top Clubs</h3>
              <p className="text-sm text-gray-600 text-center">Quickly browse the most popular clubs</p>
            </div>
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
                  { name: "Vitória SC", logo: "Vitoria-Sport-Clube-logo.png", href: "/catalogo?clube=vitoria-sc" }
                ].map((club, index) => (
                  <CarouselItem key={`club-${club.name}-${index}`} className="basis-1/3">
                    <Link
                      href={club.href}
                      className="modern-card group p-3 text-center rounded-xl shadow-modern hover:shadow-modern-hover transition-all duration-300 block"
                    >
                      <div className="relative w-12 h-12 mx-auto mb-2">
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
                      <p className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                        {club.name}
                      </p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="h-8 w-8" />
              <CarouselNext className="h-8 w-8" />
            </Carousel>
            
            {/* Ver Todos Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-center">
                <MobileFiltersTrigger />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Mobile Filters for trigger */}
        <div className="hidden">
          <MobileFilters />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Modern Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 shadow-modern sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              </div>
              <ProductsFilter />
            </div>
          </div>

          {/* Modern Products Section */}
          <div className="lg:col-span-3">
            {/* Modern Sort Bar */}
            <div className="glass-effect rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-modern">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-600 font-medium">
                    {total} products found
                  </p>
                </div>
                <ProductsSort />
              </div>
            </div>

            <Suspense fallback={<ProductsSkeleton />}>
              {produtos.length > 0 ? (
                <div className="space-y-8">
                  <div className="product-grid">
                    {produtos.map((produto, index) => (
                      <ClientAnimationWrapper
                        key={`product-${produto.id || index}-${index}`}
                        delay={index * 0.05}
                        className="animate-scale-in w-full"
                      >
                        <ProductCard product={produto} />
                      </ClientAnimationWrapper>
                    ))}
                    {/* 34º produto apenas no mobile */}
                    {produtoExtra && (
                      <ClientAnimationWrapper
                        key={`product-${produtoExtra.id || produtos.length}-${produtos.length}`}
                        delay={produtos.length * 0.05}
                        className="animate-scale-in w-full lg:hidden"
                      >
                        <ProductCard product={produtoExtra} />
                      </ClientAnimationWrapper>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass-effect rounded-2xl p-8 sm:p-12 text-center shadow-modern">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                      {pesquisa 
                        ? `No products found for "${pesquisa}"`
                        : "No products found with the selected filters."
                      }
                    </h3>
                    {pesquisa && (
                      <div className="space-y-4">
                        <p className="text-gray-600 font-medium">Suggestions:</p>
                        <ul className="text-sm text-gray-600 space-y-2 bg-blue-50 rounded-lg p-4">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Check spelling
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Use more general terms
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Try searching by club, league or season
                          </li>
                        </ul>
                        <Button asChild className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-3">
                          <Link href="/catalogo" className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            View all products
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Suspense>

            {/* Modern Pagination */}
            {produtos.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <div className="glass-effect rounded-2xl p-4 sm:p-6 shadow-modern">
                  <Pagination
                    total={total}
                    page={pagina}
                    perPage={porPagina}
                    basePath="/catalogo"
                    searchParams={new URLSearchParams(params as any)}
                  />
                </div>
              </div>
            )}

            {/* Contact Message */}
            <div className="space-y-4">
              <ContactMessage />
              {/* Nota inferior para catálogo completo na Drive */}
              <div className="glass-effect rounded-2xl p-4 sm:p-6 text-center">
                <p className="text-gray-700 mb-3">Can't find the jersey in this category?</p>
                <Button asChild variant="outline" className="modern-button border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full px-6 py-3">
                  <Link href="https://drive.google.com/drive/folders/1Q8PIDdtkDY-bUAvET_mqpRyvz0t7AMHH?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                    <Search className="w-5 h-5" />
                    View full catalog on Drive
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Parceiros Compacta */}
      <ParceirosSectionCompact />
    </div>
  )
}

