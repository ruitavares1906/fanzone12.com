"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function DebugLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        setSessionInfo({
          session: data.session
            ? {
                ...data.session,
                access_token: data.session.access_token ? "***" : null,
                refresh_token: data.session.refresh_token ? "***" : null,
              }
            : null,
          error: error ? error.message : null,
        })
      } catch (e: any) {
        setSessionInfo({ error: e.message })
      }
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setStatus({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setStatus({ error: error.message })
      } else {
        setStatus({
          success: true,
          user: data.user
            ? {
                id: data.user.id,
                email: data.user.email,
                metadata: data.user.user_metadata,
              }
            : null,
        })

        // Atualizar informações da sessão
        const { data: sessionData } = await supabase.auth.getSession()
        setSessionInfo({
          session: sessionData.session
            ? {
                ...sessionData.session,
                access_token: sessionData.session.access_token ? "***" : null,
                refresh_token: sessionData.session.refresh_token ? "***" : null,
              }
            : null,
          error: null,
        })
      }
    } catch (e: any) {
      setStatus({ error: e.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setStatus({ success: true, message: "Logout realizado com sucesso" })

      // Atualizar informações da sessão
      const { data } = await supabase.auth.getSession()
      setSessionInfo({
        session: data.session,
        error: null,
      })
    } catch (e: any) {
      setStatus({ error: e.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirect = () => {
    window.location.href = "/conta"
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Login</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status da Sessão</CardTitle>
            <CardDescription>Informações sobre a sessão atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
              <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
            </div>
          </CardContent>
          <CardFooter>
            {sessionInfo?.session ? (
              <Button onClick={handleLogout} variant="outline" disabled={isLoading}>
                Fazer Logout
              </Button>
            ) : (
              <p className="text-yellow-600">Nenhuma sessão ativa</p>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste de Login</CardTitle>
            <CardDescription>Teste o login diretamente com o Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {status.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">{status.error}</div>
            )}

            {status.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                Login bem-sucedido!
                {status.user && (
                  <div className="mt-2">
                    <p>
                      <strong>ID:</strong> {status.user.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {status.user.email}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Processando..." : "Testar Login"}
            </Button>

            {status.success && (
              <Button onClick={handleRedirect} variant="outline">
                Ir para Página de Conta
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variáveis de Ambiente</CardTitle>
            <CardDescription>Verificação das variáveis de ambiente do Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span>{process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ Não configurado"}</span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Não configurado"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
