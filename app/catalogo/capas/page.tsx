import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import Image from "next/image"
import { Smartphone } from "lucide-react"

export const metadata = {
  title: "Capas de Telemóvel | fanzone12.pt",
  description: "Descobre a nossa coleção de capas de telemóvel para iPhone e Samsung Galaxy. Personalização gratuita disponível!",
}

async function CapasContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 32
  const marca = typeof params.marca === "string" ? params.marca : undefined
  const tipo = typeof params.tipo === "string" ? params.tipo : undefined

  // Filtrar produtos de capas
  const allProducts = await getProdutos({ categoria: "capas" })
  let capasProducts = allProducts.filter(
    (product) => 
      product.categoria === "capas" && 
      product.subcategoria === "capas-telemovel"
  )

  // Aplicar filtro de marca se especificado (Apple ou Samsung)
  if (marca) {
    capasProducts = capasProducts.filter(
      (product) => product.marcaTelemovel?.toLowerCase() === marca.toLowerCase()
    )
  }

  // Aplicar filtro de tipo (clubes, marcas ou temáticas)
  if (tipo === "clubes") {
    const clubes = ["benfica", "porto", "sporting", "barcelona", "real madrid", "fc porto"]
    capasProducts = capasProducts.filter((product) =>
      clubes.some((clube) => product.nome.toLowerCase().includes(clube))
    )
  } else if (tipo === "marcas") {
    capasProducts = capasProducts.filter((product) => product.marcas === true)
  } else if (tipo === "tematicas") {
    capasProducts = capasProducts.filter((product) => product.tematicas === true)
  }
  
  const total = capasProducts.length
  const inicio = (pagina - 1) * porPagina
  const produtos = capasProducts.slice(inicio, inicio + porPagina)

  // Contar produtos por tipo
  const totalClubes = allProducts.filter((p) => {
    if (p.categoria !== "capas" || p.subcategoria !== "capas-telemovel") return false
    const clubes = ["benfica", "porto", "sporting", "barcelona", "real madrid", "fc porto"]
    return clubes.some((clube) => p.nome.toLowerCase().includes(clube))
  }).length

  const totalMarcas = allProducts.filter((p) => {
    if (p.categoria !== "capas" || p.subcategoria !== "capas-telemovel") return false
    return p.marcas === true
  }).length

  const totalTematicas = allProducts.filter((p) => {
    if (p.categoria !== "capas" || p.subcategoria !== "capas-telemovel") return false
    return p.tematicas === true
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Capas de Telemóvel
          </h1>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/catalogo/capas" className="block">
            <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all ${
              !tipo ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-blue-600 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                  <Smartphone className="w-12 h-12 mb-2" />
                  <h3 className="font-bold text-lg">Todas</h3>
                  <p className="text-sm opacity-90">{allProducts.filter((p) => p.categoria === "capas" && p.subcategoria === "capas-telemovel").length} capas</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/catalogo/capas?tipo=clubes" className="block">
            <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all ${
              tipo === "clubes" ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/portuguese-soccer-clubs-caseitup-2540619.webp"
                  alt="Clubes"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">Clubes</h3>
                  <p className="text-sm">{totalClubes} capas</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/catalogo/capas?tipo=marcas" className="block">
            <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all ${
              tipo === "marcas" ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/nik-caseitup-6049716.webp"
                  alt="Marcas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">Marcas</h3>
                  <p className="text-sm">{totalMarcas} capas</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/catalogo/capas?tipo=tematicas" className="block">
            <div className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all ${
              tipo === "tematicas" ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/stitch-caseitup-7964073.webp"
                  alt="Temáticas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">Temáticas</h3>
                  <p className="text-sm">{totalTematicas} capas</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {produtos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {produtos.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {total > porPagina && (
              <div className="mt-12">
                <Pagination
                  total={total}
                  page={pagina}
                  perPage={porPagina}
                  basePath="/catalogo/capas"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Capas Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer capas de telemóvel. Mantém-te atento!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CapasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <CapasContent searchParams={searchParams} />
    </Suspense>
  )
}

