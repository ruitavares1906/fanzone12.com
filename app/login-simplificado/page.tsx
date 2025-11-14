"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginSimplificadoPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo(null)

    try {
      // Criar FormData para enviar
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("redirectTo", "/conta")

      // Enviar para a API
      const response = await fetch("/api/auth/login-redirect", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login")
      }

      // Mostrar informações de depuração
      setDebugInfo(JSON.stringify(data, null, 2))

      // Mostrar toast de sucesso
      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para sua conta...",
      })

      // Redirecionar
      setTimeout(() => {
        window.location.href = data.redirectTo || "/conta"
      }, 1000)
    } catch (error) {
      console.error("Erro no login:", error)
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Login Simplificado</CardTitle>
              <CardDescription>
                Esta é uma versão simplificada da página de login para resolver problemas de redirecionamento.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {debugInfo && (
                  <div className="w-full mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    <p className="font-bold">Informações de depuração:</p>
                    <pre>{debugInfo}</pre>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
