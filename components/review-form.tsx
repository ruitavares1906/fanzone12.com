"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ratingError, setRatingError] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setRatingError(true)
      toast({
        title: "Classificação obrigatória",
        description: "Por favor, selecione uma classificação clicando nas estrelas.",
        variant: "destructive",
      })
      return
    }

    // Resetar erro da classificação se chegou aqui
    setRatingError(false)

    if (!termsAccepted) {
      toast({
        title: "Erro",
        description: "Por favor, aceite os termos e condições.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Validar productId
    if (!productId || productId.trim() === '') {
      console.error("Product ID inválido:", productId)
      toast({
        title: "Erro",
        description: "ID do produto inválido. Por favor, recarregue a página.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Primeiro, testar a conectividade com o Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from("avaliacoes")
        .select("id")
        .limit(1)

      if (connectionError) {
        console.error("Erro de conectividade:", connectionError)
        throw new Error(`Erro de conectividade: ${connectionError.message}`)
      }

      // Enviar avaliação para o Supabase
      const { data, error } = await supabase.from("avaliacoes").insert([
        {
          produto_id: productId,
          nome: name,
          email: email,
          titulo: title,
          conteudo: content,
          classificacao: rating,
          parent_id: null, // Avaliação principal
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pela sua avaliação! Ela já está publicada.",
      })

      // Limpar formulário
      setRating(0)
      setTitle("")
      setContent("")
      setName("")
      setEmail("")
      setTermsAccepted(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
      console.error("Product ID:", productId)
      console.error("Dados enviados:", {
        produto_id: productId,
        nome: name,
        email: email,
        titulo: title,
        conteudo: content,
        classificacao: rating,
      })
      
      // Verificar se o erro é específico do Supabase
      if (error && typeof error === 'object') {
        const supabaseError = error as any
        console.error("Detalhes do erro:", {
          message: supabaseError.message,
          details: supabaseError.details,
          hint: supabaseError.hint,
          code: supabaseError.code
        })
        
        toast({
          title: "Erro",
          description: `Erro específico: ${supabaseError.message || 'Erro desconhecido'}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao enviar a avaliação. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Escreva uma Avaliação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classificação <span className="text-red-500">*</span>
          </label>
          <div className={`flex gap-1 ${ratingError ? 'p-2 border border-red-300 rounded-md bg-red-50' : ''}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star)
                  setRatingError(false) // Resetar erro quando selecionar
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-gray-300 hover:text-yellow-400 focus:outline-none transition-colors"
              >
                <svg
                  className={`h-6 w-6 ${
                    (hoverRating ? star <= hoverRating : star <= rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {["", "Péssimo", "Fraco", "Médio", "Bom", "Excelente"][rating]}
              </span>
            )}
          </div>
          {ratingError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Selecione uma classificação clicando nas estrelas
            </p>
          )}
        </div>

        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resuma sua avaliação em uma frase"
            required
          />
        </div>

        <div>
          <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
            Avaliação
          </label>
          <Textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="O que você achou deste produto? Compartilhe sua experiência."
            required
          />
        </div>

        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <Input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label htmlFor="review-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email (não será publicado)"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="review-terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <label
            htmlFor="review-terms"
            className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Concordo com os termos e condições e política de privacidade
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A enviar..." : "Enviar Avaliação"}
        </Button>
      </form>
    </div>
  )
}
