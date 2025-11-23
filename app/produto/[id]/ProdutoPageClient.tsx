"use client"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Truck, RotateCcw, Check, Minus, Plus, ChevronLeft, ShoppingCart } from "lucide-react"
import { PersonalizacaoForm } from "@/components/personalizacao-form"
import { PhoneCaseSelector } from "@/components/phone-case-selector"
import { PhoneCasePersonalization } from "@/components/phone-case-personalization"
import type { PersonalizacaoCapa } from "@/components/phone-case-personalization"
import { ReviewForm } from "@/components/review-form"
import { useState, useEffect } from "react"
import type { Product, Personalizacao } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { formatRelativeDate } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useRouter } from "next/navigation"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { ParceirosSectionCompact } from "@/components/parceiros-section"

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

interface ProdutoPageClientProps {
  produto: Product
  params: { id: string }
}

interface Avaliacao {
  id: string
  produto_id: string
  nome: string
  titulo: string
  conteudo: string
  classificacao: number
  data_criacao: string
  parent_id?: string | null
  is_admin_reply?: boolean
  respostas?: Avaliacao[]
}

// Componente simples para formulário de resposta
function SimpleReplyForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (nome: string, email: string, conteudo: string) => void
  onCancel: () => void 
}) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !email.trim() || !conteudo.trim()) return
    
    setIsSubmitting(true)
    await onSubmit(nome, email, conteudo)
    setIsSubmitting(false)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
      <h4 className="font-medium mb-3">Reply</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
        </div>
        <textarea
          placeholder="Write your reply..."
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          rows={3}
          required
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  )
}

// Componente com exportação nomeada
export const ProdutoPageClient = ({ produto, params }: ProdutoPageClientProps) => {
  const [produtosRelacionados, setProdutosRelacionados] = useState<Product[]>([])
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>(produto.imagem)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined)
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [isLoadingAvaliacoes, setIsLoadingAvaliacoes] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [sizeError, setSizeError] = useState(false)
  const [quantidade, setQuantidade] = useState(1)
  const [activeTab, setActiveTab] = useState(produto.subcategoria === "sneakers" || produto.categoria === "capas" ? "descricao" : "tabela-medidas")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [selectedPhoneModel, setSelectedPhoneModel] = useState("") // Modelo de telemóvel selecionado
  const [capaPersonalizacao, setCapaPersonalizacao] = useState<{ativar: boolean, nome?: string, numero?: string, cor?: string, padrao?: string}>({ ativar: false })
  const [modeloError, setModeloError] = useState(false) // Erro de modelo não selecionado
  const [corError, setCorError] = useState(false) // Erro de cor não selecionada
  const { addToCart } = useCart()
  const avaliacoesPerPage = 5
  const router = useRouter()

  // Email de admin (pode ser configurado)
  const ADMIN_EMAIL = "sales@fanzone12.com"

  useEffect(() => {
    async function loadProdutosRelacionados() {
      if (produto) {
        try {
          const response = await fetch(
            `/api/produtos-relacionados?id=${encodeURIComponent(produto.id)}&categoria=${encodeURIComponent(produto.categoria)}`
          )
          if (response.ok) {
            const related = await response.json()
            setProdutosRelacionados(related)
          }
        } catch (error) {
          console.error("Error loading related products:", error)
        }
      }
    }

    loadProdutosRelacionados()
  }, [produto])

  useEffect(() => {
    // Desativar scroll restoration do navegador
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    // Scroll para o topo da página (depois do render)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)
    // Atualizar a imagem selecionada quando o produto mudar
    setSelectedImage(produto.imagem)
    setSelectedSlide(0)

    // Resetar estado das avaliações quando o produto mudar
    setAvaliacoes([])
    setIsLoadingAvaliacoes(true)
    setCurrentPage(1)

    // Carregar avaliações do produto atual
    fetchAvaliacoes(produto.id)
  }, [produto.id, produto.imagem])

  // Sincronizar slide selecionado com imagem atual
  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      const idx = carouselApi.selectedScrollSnap()
      setSelectedSlide(idx)
      setSelectedImage(allImages[idx] || produto.imagem)
    }
    onSelect()
    carouselApi.on("select", onSelect)
    carouselApi.on("reInit", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
      carouselApi.off("reInit", onSelect)
    }
  }, [carouselApi])

  // Função para buscar avaliações do Supabase
  const fetchAvaliacoes = async (produtoId: string) => {
    setIsLoadingAvaliacoes(true)
    try {
      // Verificar se as colunas de resposta existem na tabela
      const { data: tableInfo } = await supabase
        .from("avaliacoes")
        .select("*")
        .limit(1)

      const hasReplyColumns = tableInfo && tableInfo.length > 0 && 
        'parent_id' in tableInfo[0] && 'is_admin_reply' in tableInfo[0]

      if (hasReplyColumns) {
        // Nova estrutura com respostas
        // Primeiro, contar avaliações principais
        const { count, error: countError } = await supabase
          .from("avaliacoes")
          .select("id", { count: "exact" })
          .eq("produto_id", produtoId)
          .is("parent_id", null)

        if (countError) throw countError

        const total = count || 0
        setTotalAvaliacoes(total)
        setTotalPages(Math.ceil(total / avaliacoesPerPage))

        // Buscar avaliações principais
        const { data: mainReviews, error: mainError } = await supabase
          .from("avaliacoes")
          .select("*")
          .eq("produto_id", produtoId)
          .is("parent_id", null)
          .order("data_criacao", { ascending: false })
          .range((currentPage - 1) * avaliacoesPerPage, currentPage * avaliacoesPerPage - 1)

        if (mainError) throw mainError

        // Buscar respostas para cada avaliação principal
        const avaliacoesComRespostas = await Promise.all(
          (mainReviews || []).map(async (review) => {
            const { data: replies } = await supabase
              .from("avaliacoes")
              .select("*")
              .eq("parent_id", review.id)
              .order("data_criacao", { ascending: true })

            return {
              ...review,
              respostas: replies || []
            }
          })
        )

        setAvaliacoes(avaliacoesComRespostas)
      } else {
        // Estrutura antiga sem respostas
        const { count, error: countError } = await supabase
          .from("avaliacoes")
          .select("id", { count: "exact" })
          .eq("produto_id", produtoId)

        if (countError) throw countError

        const total = count || 0
        setTotalAvaliacoes(total)
        setTotalPages(Math.ceil(total / avaliacoesPerPage))

        const { data, error } = await supabase
          .from("avaliacoes")
          .select("*")
          .eq("produto_id", produtoId)
          .order("data_criacao", { ascending: false })
          .range((currentPage - 1) * avaliacoesPerPage, currentPage * avaliacoesPerPage - 1)

        if (error) throw error

        setAvaliacoes((data || []).map(review => ({ ...review, respostas: [] })))
      }
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error)
    } finally {
      setIsLoadingAvaliacoes(false)
    }
  }

  // Função para lidar com a mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAvaliacoes(produto.id)
  }

  // Função para lidar com o envio bem-sucedido de uma avaliação
  const handleReviewSuccess = () => {
    setReviewSubmitted(true)
    // Recarregar avaliações para mostrar a nova avaliação
    fetchAvaliacoes(produto.id)
    // Resetar o estado após 3 segundos
    setTimeout(() => {
      setReviewSubmitted(false)
    }, 3000)
  }

  // Função para enviar resposta
  const handleReplySubmit = async (parentId: string, nome: string, email: string, conteudo: string) => {
    try {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
      
      const { error } = await supabase
        .from("avaliacoes")
        .insert({
          produto_id: produto.id,
          nome,
          email,
          titulo: "", // Respostas não precisam de título
          conteudo,
          classificacao: 5, // Valor padrão para respostas
          parent_id: parentId,
          is_admin_reply: isAdmin
        })

      if (error) throw error

      // Recarregar avaliações
      fetchAvaliacoes(produto.id)
      setReplyingTo(null)
    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
      alert("Error sending reply. Please try again.")
    }
  }

  // Função para expandir/recolher respostas
  const toggleReplies = (reviewId: string) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReplies(newExpanded)
  }

  // Função para ir para avaliações - Otimizada para evitar reflow forçado
  const handleGoToAvaliacoes = () => {
    setActiveTab("avaliacoes")
    // Usar requestAnimationFrame para evitar reflow forçado
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById("avaliacoes")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    })
  }

  if (!produto) {
    notFound()
  }

  // Preparar todas as imagens do produto (principal + adicionais)
  const allImages = [produto.imagem, ...(produto.imagensAdicionais || [])]

  // Calcular estatísticas de avaliações
  const calcularEstatisticasAvaliacoes = () => {
    const estatisticas = {
      total: totalAvaliacoes,
      media: 0,
      distribuicao: [0, 0, 0, 0, 0], // Índice 0 = 1 estrela, índice 4 = 5 estrelas
    }

    if (estatisticas.total > 0) {
      // Calcular distribuição
      avaliacoes.forEach((avaliacao) => {
        estatisticas.distribuicao[avaliacao.classificacao - 1]++
      })

      // Calcular média
      const soma = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.classificacao, 0)
      estatisticas.media = soma / avaliacoes.length // Mantemos a média baseada nas avaliações carregadas
    }

    return estatisticas
  }

  const estatisticas = calcularEstatisticasAvaliacoes()

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    
    addToCart({
      ...produto,
      quantidade: quantidade,
      tamanhoSelecionado: selectedSize,
      tamanho: selectedSize
    })

    // Meta Pixel AddToCart Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: produto.preco,
        currency: 'EUR',
        content_name: produto.nome,
        content_ids: [produto.id],
        contents: [{
          id: produto.id,
          name: produto.nome,
          quantity: quantidade,
          price: produto.preco
        }]
      });
    }

    setSizeError(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Imagens do Produto */}
        <div>
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="absolute -top-10 left-0 z-20 bg-black text-white hover:bg-gray-800 rounded-full p-2 shadow-md"
              aria-label="Voltar"
              type="button"
              style={{ position: 'absolute' }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="relative mb-4">
            <Carousel className="w-full" opts={{ align: "start", loop: true }} setApi={setCarouselApi}>
              <CarouselContent>
                {allImages.map((img, i) => (
                  <CarouselItem key={`img-${i}`} className="basis-full">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${produto.nome} - Vista ${i + 1}`}
                        fill
                        className={`object-contain bg-white ${
                          produto.marca?.toLowerCase().includes("adidas") && produto.subcategoria === "sneakers"
                            ? "scale-125"
                            : ""
                        }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={85}
                        priority={i === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`relative aspect-square overflow-hidden rounded-lg border cursor-pointer ${
                  selectedSlide === i ? "border-primary border-2" : "hover:border-primary"
                }`}
                onClick={() => carouselApi?.scrollTo(i)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${produto.nome} - Miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  quality={85}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div>
          <div>
            <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{produto.nome}</h1>
              
              {/* Avaliações */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${star <= Math.floor(estatisticas.media) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <a 
                    onClick={handleGoToAvaliacoes}
                    className="text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    {estatisticas.total > 0 
                      ? `${estatisticas.media.toFixed(1)} (${estatisticas.total} reviews)` 
                      : "No reviews"}
                  </a>
                </div>
              </div>

              {/* Preços */}
              <div className="rounded-xl p-4 border border-border bg-card">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {produto.precoAntigo && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Previous Price</p>
                        <span className="text-lg font-bold text-muted-foreground line-through bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/30">
                          {produto.precoAntigo}€
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-3">Current Price</p>
                      <span className="text-4xl font-extrabold text-primary bg-background px-4 py-2 rounded-lg shadow-sm border border-primary/30">
                        {produto.preco}€
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {produto.preVenda ? (
                      <Badge className="bg-purple-500 text-white px-3 py-1 text-sm">Pre-order</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white px-3 py-1 text-sm">✓ In Stock</Badge>
                    )}
                  </div>
                </div>
                
                {produto.aviso && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 font-medium">⚠️ {produto.aviso}</p>
                  </div>
                )}
                
                {produto.subcategoria === "capas-telemovel" && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium italic">
                      *Imagens ilustrativas. A capa enviada será 100% perfeita, com símbolos e tudo igual ao original.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            {/* Removendo a descrição do produto */}
            {/* Card de Tamanhos - NÃO mostrar para capas */}
            {produto.categoria !== "capas" && (
            <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Select Size
                </h3>
                {produto.subcategoria !== "sneakers" && (
                  <a href="#tabela-medidas" className="text-sm text-primary hover:text-primary/80 hover:underline font-medium bg-accent px-3 py-1 rounded-lg transition-colors">
                    📏 View size chart
                  </a>
                )}
              </div>
              
              <div className="space-y-4">
                {produto.subcategoria === "sneakers" ? (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
                    <h4 className="text-sm font-semibold text-red-800 mb-4 flex items-center gap-2">
                      👟 SNEAKER SIZES
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {["36", "36.5", "37.5", "38", "38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "45"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`rounded-xl border-2 font-semibold transition-all duration-200 px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm min-w-[40px] sm:min-w-[45px] ${
                            selectedSize === size
                              ? "border-red-500 bg-red-500 text-white shadow-lg transform scale-105"
                              : "border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                          }`}
                          onClick={() => {
                            setSelectedSize(size)
                            setSizeError(false)
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : produto.categoria === "body" ? (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-100">
                    <h4 className="text-sm font-semibold text-pink-800 mb-4 flex items-center gap-2">
                      👶 BABY SIZES
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {["0 a 6 meses", "6 a 12 meses"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`rounded-xl border-2 font-semibold transition-all duration-200 px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm min-w-[80px] sm:min-w-[90px] ${
                            selectedSize === size
                              ? "border-pink-500 bg-pink-500 text-white shadow-lg transform scale-105"
                              : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 hover:shadow-md"
                          }`}
                          onClick={() => {
                            setSelectedSize(size)
                            setSizeError(false)
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : produto.categoria !== "crianca" ? (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        👥 ADULT SIZES
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`rounded-xl border-2 font-semibold transition-all duration-200 px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm min-w-[40px] sm:min-w-[45px] ${
                              selectedSize === size
                                ? "border-blue-500 bg-blue-500 text-white shadow-lg transform scale-105"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                            }`}
                            onClick={() => {
                              setSelectedSize(size)
                              setSizeError(false)
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <h4 className="text-sm font-semibold text-green-800 mb-4 flex items-center gap-2">
                        👶 KIDS SIZES
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">shorts included, if applicable</span>
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {["02-03", "03-04", "04-05", "05-06", "06-07", "08-09", "10-11", "12-13"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`rounded-xl border-2 font-semibold transition-all duration-200 px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm min-w-[50px] sm:min-w-[65px] ${
                              selectedSize === `${size} years`
                                ? "border-green-500 bg-green-500 text-white shadow-lg transform scale-105"
                                : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 hover:shadow-md"
                            }`}
                            onClick={() => {
                              setSelectedSize(`${size} years`)
                              setSizeError(false)
                            }}
                          >
                            {size} years
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <h4 className="text-sm font-semibold text-green-800 mb-4 flex items-center gap-2">
                      👶 KIDS SIZES
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {["02-03", "03-04", "04-05", "05-06", "06-07", "08-09", "10-11", "12-13"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`rounded-xl border-2 font-semibold transition-all duration-200 px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm min-w-[50px] sm:min-w-[65px] ${
                            selectedSize === `${size} years`
                              ? "border-green-500 bg-green-500 text-white shadow-lg transform scale-105"
                              : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 hover:shadow-md"
                          }`}
                          onClick={() => {
                            setSelectedSize(`${size} years`)
                            setSizeError(false)
                          }}
                        >
                          {size} years
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {sizeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium text-sm">⚠️ Please select a size</p>
                </div>
              )}
            </div>
            )}

            {/* Componentes para Capas de Telemóvel */}
            {produto.categoria === "capas" && (
              <>
                <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                    Configuração da Capa
                  </h3>
                  <div className="space-y-4 phone-case-selector">
                    <PhoneCaseSelector 
                  product={produto}
                  onSelectionChange={(marca, modelo) => {
                    // Só atualiza se ambos estiverem preenchidos
                    if (marca && modelo) {
                      setSelectedPhoneModel(`${marca} ${modelo}`)
                      setModeloError(false) // Limpa o erro quando seleciona
                    } else {
                      setSelectedPhoneModel("")
                    }
                  }}
                />
                    {(produto.personalizacaoNomeNumero || produto.cores || produto.padrao) && (
                      <PhoneCasePersonalization 
                        enabled={true}
                        cores={produto.cores}
                        padrao={produto.padrao}
                        onChange={(personalizacao) => {
                          setCapaPersonalizacao(personalizacao)
                          // Limpar erro de cor quando selecionar uma cor
                          if (personalizacao.cor) {
                            setCorError(false)
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Botão Adicionar ao Carrinho para Capas */}
                <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      {/* Erro de modelo não selecionado */}
                      {modeloError && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-shake">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <p className="text-red-700 font-semibold">
                              Please select the phone brand and model
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Erro de cor não selecionada */}
                      {corError && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-shake">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <p className="text-red-700 font-semibold">
                              Please select a color for your phone case
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-red-600 tracking-tight">
                            {(produto.preco * quantidade).toFixed(2)} €
                          </p>
                          {quantidade > 1 && (
                            <span className="text-sm text-gray-500">
                              (€{produto.preco.toFixed(2)} each)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                            className="p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-2 font-semibold min-w-[60px] text-center border-x-2 border-gray-300">
                            {quantidade}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantidade(quantidade + 1)}
                            className="p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (!selectedPhoneModel || selectedPhoneModel.trim() === "") {
                              setModeloError(true)
                              // Scroll suave para o seletor - Otimizado para evitar reflow forçado
                              requestAnimationFrame(() => {
                                document.querySelector('.phone-case-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              })
                              return
                            }
                            
                            setModeloError(false)
                            
                            // Validar se precisa de cor e se foi selecionada
                            if (produto.cores && produto.cores.length > 0 && !capaPersonalizacao.cor) {
                              setCorError(true)
                              requestAnimationFrame(() => {
                                document.querySelector('.phone-case-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              })
                              return
                            }
                            
                            // Validar se precisa de padrão e se foi selecionado
                            if (produto.padrao && produto.padrao.length > 0 && !capaPersonalizacao.padrao) {
                              setCorError(true)
                              requestAnimationFrame(() => {
                                document.querySelector('.phone-case-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              })
                              return
                            }
                            
                            setCorError(false)
                            
                            // Para capas, cada item é único - adicionar timestamp para evitar merge
                            const uniqueId = `${produto.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                            
                            // Criar objeto de personalização compatível com o sistema
                            // Para capas: numero pode ser texto livre, mas o tipo espera number
                            // Tentamos converter para number, se falhar, deixamos como número 0 ou undefined
                            const numeroValue = capaPersonalizacao.numero && capaPersonalizacao.numero.trim() !== '' 
                              ? capaPersonalizacao.numero.trim() 
                              : undefined
                            
                            const numeroFinal = numeroValue ? (
                              !isNaN(parseInt(numeroValue, 10)) ? parseInt(numeroValue, 10) : 0
                            ) : undefined
                            
                            const personalizacaoParaCarrinho = capaPersonalizacao.ativar ? {
                              ativar: true,
                              nome: capaPersonalizacao.nome && capaPersonalizacao.nome.trim() !== '' ? capaPersonalizacao.nome : undefined,
                              numero: numeroFinal,
                              cor: capaPersonalizacao.cor || undefined,
                              padrao: capaPersonalizacao.padrao || undefined
                            } : { ativar: false }
                            
                            // Adicionar cada produto individualmente (quantidade de cada vez)
                            for (let i = 0; i < quantidade; i++) {
                              const itemUnicoId = `${produto.id}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`
                              addToCart({
                                ...produto,
                                id: itemUnicoId, // ID único para cada item no carrinho
                                quantidade: 1, // Sempre 1 por item
                                tamanho: selectedPhoneModel,
                                tamanhoSelecionado: selectedPhoneModel,
                                personalizacao: personalizacaoParaCarrinho
                              })
                            }
                            
                            setShowModal(true)
                          }}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <ProductPersonalizacao 
              produto={produto} 
              selectedSize={selectedSize} 
              onSizeError={() => setSizeError(true)}
              sizeError={sizeError}
            />

            {/* Modal de confirmação ao adicionar ao carrinho */}
            <AddToCartModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              product={produto}
              selectedSize={produto.categoria === "capas" ? selectedPhoneModel : selectedSize}
              quantidade={quantidade}
            />

            {/* Informações de Envio - NÃO mostrar para capas */}
            {produto.categoria !== "capas" && (
            <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v8a1 1 0 01-1 1H9a1 1 0 01-1-1v-8H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Shipping and Return Information
              </h3>
              
              {/* Seção de Envio */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="mb-3">
                      <p className="text-sm text-purple-600 font-medium">✨ Free shipping on 3 products or €68+</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
                      <div className="bg-green-100 p-1 rounded-full">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-700">Free Shipping</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="text-sm text-blue-700">Delivery: 7 to 12 business days</span>
                    </div>
                  </div>
                </div>

                {/* Seção de Garantias */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <RotateCcw className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Free Returns</h4>
                        <p className="text-sm text-green-700">Up to 30 days after receipt</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Purchase Guarantee</h4>
                        <p className="text-sm text-amber-700">Satisfied or money back</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge de Destaque */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900">🏆 Best Seller</h4>
                      <p className="text-sm text-purple-700">Among the collection products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de Informação */}
      <div className="mb-16" id="avaliacoes">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`w-full grid gap-1 h-auto p-1 bg-muted ${produto.categoria === "capas" ? "grid-cols-1" : produto.subcategoria === "sneakers" ? "grid-cols-1" : "grid-cols-2"}`}>
            {produto.subcategoria !== "sneakers" && produto.categoria !== "capas" && (
              <TabsTrigger value="tabela-medidas" className="text-xs sm:text-sm px-2 py-2 h-auto whitespace-normal text-center">Size Chart</TabsTrigger>
            )}
            <TabsTrigger value="avaliacoes" className="text-xs sm:text-sm px-2 py-2 h-auto whitespace-normal text-center">Reviews</TabsTrigger>
          </TabsList>
          {produto.subcategoria !== "sneakers" && (
            <TabsContent value="tabela-medidas" className="pt-4" id="tabela-medidas">
              <h3 className="text-xl font-semibold">Size Chart</h3>
              
              {/* Mobile: Carrossel */}
              <div className="md:hidden mt-4">
                <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                  <CarouselContent>
                    {/* Tabela Infantil primeiro */}
                    <CarouselItem className="basis-full">
                      <div className="flex flex-col items-center">
                        <Image
                          src="/images/tabelainfantil22.png"
                          alt="Kids size chart"
                          width={520}
                          height={360}
                          className="rounded-lg border shadow-sm max-w-sm h-auto object-contain"
                          sizes="(max-width: 768px) 98vw, 400px"
                          onError={() => console.error("Erro ao carregar tabelainfantil22.png")}
                        />
                        <p className="text-center text-xs text-muted-foreground mt-2">Kids size chart</p>
                      </div>
                    </CarouselItem>
                    {/* Tabela Adepto depois */}
                    <CarouselItem className="basis-full">
                      <div className="flex flex-col items-center">
                        <Image
                          src="/images/tabelaadepto.png"
                          alt="Size chart - fan version"
                          width={520}
                          height={360}
                          className="rounded-lg border shadow-sm max-w-sm h-auto object-contain"
                          sizes="(max-width: 768px) 98vw, 400px"
                          onError={() => console.error("Erro ao carregar tabelaadepto.png")}
                        />
                        <p className="text-center text-xs text-muted-foreground mt-2">Size chart - fan version</p>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              {/* Desktop: Grid de 2 colunas */}
              <div className="hidden md:grid grid-cols-2 gap-6 mt-4">
                {/* Tabela Infantil primeiro */}
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/tabelainfantil22.png"
                    alt="Kids size chart"
                    width={520}
                    height={360}
                    className="rounded-lg border shadow-sm w-96 h-auto object-contain"
                    sizes="(max-width: 768px) 98vw, 520px"
                    onError={() => console.error("Erro ao carregar tabelainfantil22.png")}
                  />
                  <p className="text-center text-xs text-muted-foreground mt-2">Kids size chart</p>
                </div>
                {/* Tabela Adepto depois */}
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/tabelaadepto.png"
                    alt="Size chart - fan version"
                    width={520}
                    height={360}
                    className="rounded-lg border shadow-sm w-96 h-auto object-contain"
                    sizes="(max-width: 768px) 98vw, 520px"
                    onError={() => console.error("Erro ao carregar tabelaadepto.png")}
                  />
                  <p className="text-center text-xs text-muted-foreground mt-2">Size chart - fan version</p>
                </div>
              </div>
            </TabsContent>
          )}
          <TabsContent value="avaliacoes" className="pt-4">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-5xl font-bold">{estatisticas.media.toFixed(1)}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < estatisticas.media ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{estatisticas.total} reviews</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    // Calcular percentagem real baseada nas avaliações
                    const count = estatisticas.distribuicao[rating - 1]
                    const percentagem = estatisticas.total > 0 ? Math.round((count / estatisticas.total) * 100) : 0

                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 w-3">{rating}</span>
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-400 rounded-full" style={{ width: `${percentagem}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{percentagem}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Formulário de Avaliação */}
              {!reviewSubmitted ? (
                <ReviewForm productId={produto.id} onSuccess={handleReviewSuccess} />
              ) : (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Thank you for your review!</h3>
                  <p className="text-green-700">Your review has been published successfully.</p>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Customer Comments</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>Most recent</option>
                      <option>Best rating</option>
                      <option>Worst rating</option>
                    </select>
                  </div>
                </div>

                {isLoadingAvaliacoes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : avaliacoes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">There are no reviews for this product yet.</p>
                    <p className="text-gray-500 mt-2">Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {avaliacoes.map((avaliacao) => (
                      <div key={avaliacao.id} className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {avaliacao.is_admin_reply ? (
                              <div className="h-8 w-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">
                                <Image
                                  src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png"
                                  alt="Loja"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  loading="lazy"
                                  sizes="20px"
                                  quality={85}
                                  onError={(e) => {
                                    // Fallback para iniciais se a imagem não carregar
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                                <span className="text-sm font-medium hidden">
                                  {avaliacao.nome
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                                </span>
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {avaliacao.nome
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                                </span>
                              </div>
                            )}
                            <span className="font-medium">{avaliacao.nome}</span>
                            {avaliacao.is_admin_reply && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Store
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{formatRelativeDate(avaliacao.data_criacao)}</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, j) => (
                            <svg
                              key={j}
                              className={`h-4 w-4 ${j < avaliacao.classificacao ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        {avaliacao.titulo && <h4 className="font-medium mb-2">{avaliacao.titulo}</h4>}
                        <p className="text-gray-600 mb-3">{avaliacao.conteudo}</p>
                        
                        {/* Botões de ação */}
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => setReplyingTo(replyingTo === avaliacao.id ? null : avaliacao.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Reply
                          </button>
                          
                          {avaliacao.respostas && avaliacao.respostas.length > 0 && (
                            <button
                              onClick={() => toggleReplies(avaliacao.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {expandedReplies.has(avaliacao.id) 
                                ? `Hide ${avaliacao.respostas.length} ${avaliacao.respostas.length > 1 ? 'replies' : 'reply'}`
                                : `View ${avaliacao.respostas.length} ${avaliacao.respostas.length > 1 ? 'replies' : 'reply'}`
                              }
                            </button>
                          )}
                        </div>

                        {/* Formulário de resposta */}
                        {replyingTo === avaliacao.id && (
                          <SimpleReplyForm
                            onSubmit={(nome, email, conteudo) => handleReplySubmit(avaliacao.id, nome, email, conteudo)}
                            onCancel={() => setReplyingTo(null)}
                          />
                        )}

                        {/* Respostas */}
                        {avaliacao.respostas && avaliacao.respostas.length > 0 && expandedReplies.has(avaliacao.id) && (
                          <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-100 pl-4">
                            {avaliacao.respostas.map((resposta) => (
                              <div key={resposta.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {resposta.is_admin_reply ? (
                                      <div className="h-6 w-6 rounded-full bg-white border flex items-center justify-center">
                                        <Image
                                          src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png"
                                          alt="Loja"
                                          width={16}
                                          height={16}
                                          className="object-contain"
                                          loading="lazy"
                                          sizes="20px"
                                          quality={85}
                                          onError={(e) => {
                                            // Fallback para iniciais se a imagem não carregar
                                            e.currentTarget.style.display = 'none'
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                          }}
                                        />
                                        <span className="text-xs font-medium hidden">
                                          {resposta.nome
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .substring(0, 2)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                          {resposta.nome
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .substring(0, 2)}
                                        </span>
                                      </div>
                                    )}
                                    <span className="font-medium text-sm">{resposta.nome}</span>
                                    {resposta.is_admin_reply && (
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                        Loja
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">{formatRelativeDate(resposta.data_criacao)}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{resposta.conteudo}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 border-t border-b border-gray-300 ${
                            currentPage === i + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Produtos Relacionados */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Related Products</h2>
        <div className="product-grid">
          {produtosRelacionados.map((produto) => (
            <ProductCard key={produto.id} product={produto} />
          ))}
        </div>
      </div>

      {/* Seção de Parceiros Compacta */}
      <ParceirosSectionCompact />
    </div>
  )
}

function ProductPersonalizacao({ 
  produto, 
  selectedSize,
  onSizeError,
  sizeError,
}: { 
  produto: Product, 
  selectedSize: string,
  onSizeError: () => void,
  sizeError: boolean,
}) {
  const [personalizacao, setPersonalizacao] = useState<Personalizacao>({ ativar: false })
  const [quantidade, setQuantidade] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showKlarnaModal, setShowKlarnaModal] = useState(false)
  const { addToCart } = useCart()

  // Calcular preço com personalização e patch
  const precoFinal = produto.preco
  
  // Calcular custo adicional da personalização
  let custoPersonalizacao = 0;
  if (personalizacao.ativar) {
    // Se tem nome ou número, adiciona 3€
    if (personalizacao.nome || personalizacao.numero) {
      custoPersonalizacao += 3;
    }
    // Adiciona 1€ por cada patch
    if (personalizacao.patches && personalizacao.patches.length > 0) {
      custoPersonalizacao += personalizacao.patches.length * 1;
    }
  }
  
  const precoTotal = (precoFinal * quantidade) + custoPersonalizacao;

  const handleAddToCart = async () => {
    // Não requer tamanho para capas
    if (!selectedSize && produto.categoria !== "capas") {
      onSizeError()
      return
    }

    setIsLoading(true)
    
    try {
      addToCart({
        ...produto,
        preco: precoFinal,
        quantidade: quantidade,
        tamanhoSelecionado: selectedSize,
        tamanho: selectedSize,
        personalizacao,
      })

      // Meta Pixel AddToCart Event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
          value: precoTotal,
          currency: 'EUR',
          content_name: produto.nome,
          content_ids: [produto.id],
          contents: [{
            id: produto.id,
            name: produto.nome,
            quantity: quantidade,
            price: precoTotal
          }]
        });
      }

      // Esperar a animação do check
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
      setShowModal(true)
    } catch (error) {
      setIsLoading(false)
    }
  }
  
  // Não renderizar este componente para capas
  if (produto.categoria === "capas") {
    return null
  }
  
  return (
    <div className="mb-6">
      {/* Só mostrar personalização se não for sneakers */}
      {produto.subcategoria !== "sneakers" && (
        <PersonalizacaoForm onChange={setPersonalizacao} clube={produto.clube} />
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-red-600 tracking-tight">
                {precoTotal.toFixed(2)} €
              </p>
              {quantidade > 1 && (
                <span className="text-sm text-gray-500">
                  (€{precoFinal.toFixed(2)} each)
                </span>
              )}
            </div>
            {personalizacao.ativar && custoPersonalizacao > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Personalization: 
                {(personalizacao.nome || personalizacao.numero) && " +€3 (name/number)"}
                {personalizacao.patches && personalizacao.patches.length > 0 && ` +€${personalizacao.patches.length} (${personalizacao.patches.length} patches)`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center font-semibold text-lg">{quantidade}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantidade(quantidade + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-base py-2 px-6 h-12 font-semibold rounded-md relative"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Add to Cart</span>
                  <Check className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-0 duration-300" />
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
          {sizeError && <p className="text-red-500 text-sm mt-2">Please select a size.</p>}
          
          {/* Klarna Payment Section */}
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
            <div className="flex items-center justify-center gap-3">
              <Image 
                src="/images/payment-klarna.webp" 
                alt="Klarna" 
                width={60} 
                height={30}
                className="h-6 w-auto object-contain"
              />
              <span className="text-sm font-medium text-gray-700">
                Pay in 3 interest-free installments of <span className="font-bold text-pink-600">€{(precoTotal / 3).toFixed(2)}</span>
              </span>
              <button
                onClick={() => setShowKlarnaModal(true)}
                className="text-sm text-pink-600 hover:text-pink-700 underline font-medium"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação do ProductPersonalizacao */}
      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={produto}
        selectedSize={selectedSize}
        quantidade={quantidade}
      />

      {/* Klarna Information Modal */}
      {showKlarnaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Image 
                  src="/images/payment-klarna.webp" 
                  alt="Klarna" 
                  width={60} 
                  height={30}
                  className="h-8 w-auto object-contain"
                />
                <button
                  onClick={() => setShowKlarnaModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 text-center">
                BUY NOW. PAY AT YOUR OWN PACE WITH KLARNA
              </h2>
            </div>

                        {/* Content */}
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 border border-pink-200 mb-3">
                  <p className="text-lg font-bold text-pink-600 mb-1">
                    €{(precoTotal / 3).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Every 30 days</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-pink-100 rounded-lg p-2">
                    <p className="text-xs font-bold text-pink-600">€{(precoTotal / 3).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Today</p>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-2">
                    <p className="text-xs font-bold text-purple-600">€{(precoTotal / 3).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">30 days</p>
                  </div>
                  <div className="bg-pink-100 rounded-lg p-2">
                    <p className="text-xs font-bold text-pink-600">€{(precoTotal / 3).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">60 days</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-xs text-gray-600 mb-3">
                  <span>APR: <span className="font-bold">0%</span></span>
                  <span>Interest: <span className="font-bold text-green-600">Free</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-gray-900 mb-2 text-center">How does it work?</h3>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <p className="text-xs text-gray-700">Choose Klarna at checkout</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <p className="text-xs text-gray-700">Select the payment plan</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <p className="text-xs text-gray-700">Complete and pay in 3x interest-free</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setShowKlarnaModal(false)}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Também exportamos como padrão para compatibilidade
export default ProdutoPageClient
