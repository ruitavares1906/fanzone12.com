import { Suspense } from "react"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { ProductsSkeleton } from "@/components/products-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Sneakers Adidas | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de sneakers Adidas. Designs únicos e qualidade alemã.",
}

async function SneakersAdidasContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pagina = typeof params.pagina === "string" ? parseInt(params.pagina) : 1
  const porPagina = 30

  // IDs dos produtos que devem aparecer sempre nos primeiros lugares (ordem fixa)
  const produtosPrioritariosIds = [
    "adidas-campus-id6139",
    "adidas-campus-h03472",
    "adidas-if3741-04hhll121027",
    "ad-samba-xlg-cq2640",
    "adidas-originals-gazelle-indoor-hq8716id",
    "adidas-campus-hl11121",
    "adidas-campus-00s-hq8707",
    "kith-adidas-gazelle-ie257202",
    "adidas-campus-00s-h03471",
    "adidas-if8914-02hhll1210166",
    "adidas-L2812011231",
    "adidas-gazelle-bold-w-HQ6912ID-2",
    "adidas-if6562-hl051301028",
    "adidas-samba-xlg-low-ie1379-3",
    "adidas-campus-00s-hp6395",
    "adidas-samba-xlg-low-ie1379-2"
  ]

  // Filtrar produtos que são sneakers da marca Adidas
  const allProducts = await getProdutos({ categoria: "sneakers" })
  const todosAdidasSneakers = allProducts.filter(
    (product) => 
      product.subcategoria === "sneakers" && 
      product.marca?.toLowerCase().includes("adidas")
  )
  
  // Separar produtos prioritários, samba e restantes
  const produtosPrioritarios: typeof todosAdidasSneakers = []
  const produtosSamba: typeof todosAdidasSneakers = []
  const produtosRestantes: typeof todosAdidasSneakers = []
  const produtosPrioritariosMap = new Map<string, typeof todosAdidasSneakers[0]>()

  // Primeiro, criar um mapa dos produtos prioritários e separar os demais
  todosAdidasSneakers.forEach(product => {
    if (produtosPrioritariosIds.includes(product.id)) {
      produtosPrioritariosMap.set(product.id, product)
    } else {
      // Verificar se é um produto samba (pelo nome, categoria ou ID)
      const nomeLower = product.nome?.toLowerCase() || ""
      const categoriaLower = product.categoria?.toLowerCase() || ""
      const subcategoriaLower = product.subcategoria?.toLowerCase() || ""
      const idLower = product.id.toLowerCase()
      
      if (nomeLower.includes("samba") || 
          categoriaLower.includes("samba") || 
          subcategoriaLower.includes("samba") ||
          idLower.includes("samba")) {
        produtosSamba.push(product)
      } else {
        produtosRestantes.push(product)
      }
    }
  })

  // Ordenar produtos prioritários na ordem especificada
  produtosPrioritariosIds.forEach(id => {
    const produto = produtosPrioritariosMap.get(id)
    if (produto) {
      produtosPrioritarios.push(produto)
    }
  })

  // Ordenar produtos samba por ID para manter ordem fixa
  produtosSamba.sort((a, b) => a.id.localeCompare(b.id))

  // Ordenar produtos restantes por ID para manter ordem fixa (não aleatória)
  produtosRestantes.sort((a, b) => a.id.localeCompare(b.id))

  // Combinar: primeiro os prioritários, depois os samba, depois os restantes
  const produtosExibicao = [...produtosPrioritarios, ...produtosSamba, ...produtosRestantes]
  
  const total = produtosExibicao.length
  const inicio = (pagina - 1) * porPagina
  const adidasSneakers = produtosExibicao.slice(inicio, inicio + porPagina)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/sneakers" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Sneakers
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sneakers Adidas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Qualidade alemã com designs exclusivos
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* Campus */}
          <Link href="/catalogo/campus" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/campus.jpeg" 
                  alt="Campus" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Campus
              </h3>
            </div>
          </Link>

          {/* Originals Samba */}
          <Link href="/catalogo/samba" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/samba.webp" 
                  alt="Originals Samba" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Originals Samba
              </h3>
            </div>
          </Link>

          {/* Spezial */}
          <Link href="/catalogo/speziale" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/Spezial.jpg" 
                  alt="Spezial" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Spezial
              </h3>
            </div>
          </Link>

          {/* Originals Gazelle */}
          <Link href="/catalogo/gazelle" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/gazelle.webp" 
                  alt="Originals Gazelle" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Originals Gazelle
              </h3>
            </div>
          </Link>

          {/* Superstar */}
          <Link href="/catalogo/superstar" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/Superstar.avif" 
                  alt="Superstar" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Superstar
              </h3>
            </div>
          </Link>

          {/* Forum */}
          <Link href="/catalogo/forum" className="group">
            <div className="flex flex-col items-center text-center gap-2 transition-all duration-200 hover:scale-105">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image 
                  src="/images/forum.avif" 
                  alt="Forum" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Forum
              </h3>
            </div>
          </Link>
        </div>

        {/* Produtos */}
        {adidasSneakers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Products
                </h2>
                <p className="text-gray-600 mt-1">
                  {total} product{total !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  Sizes 36-45
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {adidasSneakers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {total > porPagina && (
              <div className="mt-12">
                <Pagination
                  total={total}
                  page={pagina}
                  perPage={porPagina}
                  basePath="/sneakers/adidas"
                  searchParams={new URLSearchParams(params as any)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👟</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mais Sneakers Adidas Em Breve
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos a trabalhar para trazer mais modelos exclusivos da Adidas. 
              Mantém-te atento às novidades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sneakers">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Todos os Sneakers
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Contactar-nos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SneakersAdidasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <SneakersAdidasContent searchParams={searchParams} />
    </Suspense>
  )
} 