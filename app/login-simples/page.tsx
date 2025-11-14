"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginSimples() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Criar FormData para enviar
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      // Enviar para a API
      const response = await fetch("/api/auth/login-direct", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login")
      }

      if (data.success) {
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para sua conta...",
        })

        // Redirecionamento direto
        window.location.href = "/conta"
      }
    } catch (error) {
      console.error("Erro no login:", error)
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Entrar na sua conta</CardTitle>
              <CardDescription>Entre com seu email e senha para acessar sua conta.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
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
              </CardFooter>
            </form>
          </Card>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <a href="/registro" className="text-primary underline">
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
