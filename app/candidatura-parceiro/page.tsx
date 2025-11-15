"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, CheckCircle, AlertCircle, Send } from "lucide-react"
import Link from "next/link"

export default function CandidaturaParceiroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    instagram: "",
    tiktok: "",
    seguidores: "",
    visualizacoes: "",
    experiencia: "",
    motivacao: ""
  })


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.telefone.trim()) newErrors.telefone = "Phone is required"
    if (!formData.instagram.trim() && !formData.tiktok.trim()) {
      newErrors.instagram = "You must fill at least one social network"
    }
    if (!formData.seguidores.trim()) newErrors.seguidores = "Number of followers is required"
    else if (parseInt(formData.seguidores) < 5000) {
      newErrors.seguidores = "Minimum of 5,000 followers"
    }
    if (!formData.visualizacoes.trim()) newErrors.visualizacoes = "Views are required"
    if (!formData.motivacao.trim()) newErrors.motivacao = "Motivation is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/candidatura-parceiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
      } else {
        throw new Error(result.message || 'Error submitting application')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for your application! We will review your profile and contact 
              you within 24 hours.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                <Link href="/info-parceiros">
                  Back to Information
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4 mr-2" />
            Partner Application
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Apply Now
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fill out the form below and join our partner network. 
            We will review your application within 24 hours.
          </p>
        </div>

        {/* Formulário */}
        <Card className="modern-card shadow-modern">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Application Form</CardTitle>
            <CardDescription className="text-center">
              Fill in all required fields so we can process your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className={errors.nome ? "border-red-500" : ""}
                      placeholder="Your full name"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium">
                    Phone/WhatsApp *
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    className={errors.telefone ? "border-red-500" : ""}
                    placeholder="+351 123 456 789"
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.telefone}
                    </p>
                  )}
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Social Media
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-sm font-medium">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className={errors.instagram ? "border-red-500" : ""}
                      placeholder="@yourusername"
                    />
                    {errors.instagram && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.instagram}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tiktok" className="text-sm font-medium">
                      TikTok
                    </Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) => handleInputChange("tiktok", e.target.value)}
                      placeholder="@yourusername"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seguidores" className="text-sm font-medium">
                      Number of Followers *
                    </Label>
                    <Input
                      id="seguidores"
                      type="number"
                      value={formData.seguidores}
                      onChange={(e) => handleInputChange("seguidores", e.target.value)}
                      className={errors.seguidores ? "border-red-500" : ""}
                      placeholder="5000"
                    />
                    {errors.seguidores && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.seguidores}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="visualizacoes" className="text-sm font-medium">
                      Average Views per Video/Reels *
                    </Label>
                    <Input
                      id="visualizacoes"
                      type="number"
                      value={formData.visualizacoes}
                      onChange={(e) => handleInputChange("visualizacoes", e.target.value)}
                      className={errors.visualizacoes ? "border-red-500" : ""}
                      placeholder="e.g.: 10000"
                    />
                    {errors.visualizacoes && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.visualizacoes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Experiência e Motivação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  About You
                </h3>
                
                <div>
                  <Label htmlFor="experiencia" className="text-sm font-medium">
                    Digital Marketing Experience
                  </Label>
                  <Textarea
                    id="experiencia"
                    value={formData.experiencia}
                    onChange={(e) => handleInputChange("experiencia", e.target.value)}
                    placeholder="Tell us about your experience with digital marketing, affiliations, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="motivacao" className="text-sm font-medium">
                    Why do you want to be a Fanzone12 partner? *
                  </Label>
                  <Textarea
                    id="motivacao"
                    value={formData.motivacao}
                    onChange={(e) => handleInputChange("motivacao", e.target.value)}
                    className={errors.motivacao ? "border-red-500" : ""}
                    placeholder="Explain your motivation for joining our partner program..."
                    rows={4}
                  />
                  {errors.motivacao && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.motivacao}
                    </p>
                  )}
                </div>
              </div>


              {/* Botão de Submissão */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-12 text-center">
          <Card className="modern-card shadow-modern bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                What happens next?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="text-gray-600">
                    We review your application within 24 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <p className="text-gray-600">
                    We contact you via WhatsApp
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <p className="text-gray-600">
                    You receive your unique code and start earning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
