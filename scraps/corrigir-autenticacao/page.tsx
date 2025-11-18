"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function CorrigirAutenticacao() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    details?: any
  }>({})

  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult({})

    try {
      // Tentar login direto com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult({
          success: false,
          message: `Erro no login: ${error.message}`,
          details: error,
        })
      } else {
        setResult({
          success: true,
          message: "Login realizado com sucesso!",
          details: data,
        })

        // Recarregar a página após 2 segundos
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult({})

    try {
      // Tentar criar uma nova conta
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Usuário Teste",
            first_name: "Usuário",
            last_name: "Teste",
          },
        },
      })

      if (error) {
        setResult({
          success: false,
          message: `Erro no registro: ${error.message}`,
          details: error,
        })
      } else {
        setResult({
          success: true,
          message: data.session
            ? "Conta criada e login realizado com sucesso!"
            : "Conta criada! Verifique seu email para confirmar.",
          details: data,
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    setResult({})

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        setResult({
          success: false,
          message: `Erro no logout: ${error.message}`,
          details: error,
        })
      } else {
        setResult({
          success: true,
          message: "Logout realizado com sucesso!",
        })

        // Recarregar a página após 2 segundos
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    setLoading(true)
    setResult({})

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setResult({
          success: false,
          message: `Erro ao verificar sessão: ${error.message}`,
          details: error,
        })
      } else {
        setResult({
          success: true,
          message: data.session ? "Sessão ativa encontrada" : "Nenhuma sessão ativa",
          details: data,
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error.message}`,
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  const clearCookies = () => {
    try {
      // Limpar todos os cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      setResult({
        success: true,
        message: "Cookies limpos com sucesso!",
      })

      // Recarregar a página após 2 segundos
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro ao limpar cookies: ${error.message}`,
        details: error,
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Corrigir Problemas de Autenticação</CardTitle>
          <CardDescription>Use esta página para diagnosticar e corrigir problemas de login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Processando..." : "Login Direto"}
              </Button>
              <Button type="button" onClick={handleSignUp} disabled={loading}>
                {loading ? "Processando..." : "Criar Conta"}
              </Button>
            </div>
          </form>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleLogout} disabled={loading}>
                {loading ? "Processando..." : "Fazer Logout"}
              </Button>
              <Button onClick={checkSession} disabled={loading}>
                {loading ? "Processando..." : "Verificar Sessão"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button variant="destructive" onClick={clearCookies} className="w-full" disabled={loading}>
              {loading ? "Processando..." : "Limpar Todos os Cookies"}
            </Button>
          </div>

          {/* Resultado das operações */}
          {result.message && (
            <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
                {result.success ? "Sucesso" : "Erro"}
              </AlertTitle>
              <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Detalhes do resultado */}
          {result.details && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(result.details, null, 2)}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-gray-500 w-full">
            <p>Esta página usa conexão direta com o Supabase, ignorando middlewares e APIs personalizadas.</p>
            <p className="mt-1">
              Se o login funcionar aqui mas não no site, o problema está nos middlewares ou nas APIs.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
