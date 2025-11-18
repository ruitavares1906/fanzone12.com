"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DiagnosticoBasico() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{
    supabaseConnection: boolean
    authConnection: boolean
    session: any
    error?: string
  }>({
    supabaseConnection: false,
    authConnection: false,
    session: null,
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkConnections = async () => {
      try {
        setLoading(true)

        // Teste 1: Verificar conexão básica com Supabase
        let supabaseConnection = false
        try {
          // Tentar uma consulta simples
          const { data, error } = await supabase.from("products").select("count").limit(1).single()
          supabaseConnection = !error
        } catch (e) {
          console.error("Erro na conexão com Supabase:", e)
        }

        // Teste 2: Verificar conexão com autenticação
        let authConnection = false
        let sessionData = null
        try {
          const { data, error } = await supabase.auth.getSession()
          authConnection = !error
          sessionData = data.session
        } catch (e) {
          console.error("Erro na conexão com Auth:", e)
        }

        setStatus({
          supabaseConnection,
          authConnection,
          session: sessionData,
        })
      } catch (error: any) {
        setStatus({
          supabaseConnection: false,
          authConnection: false,
          session: null,
          error: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    checkConnections()
  }, [supabase])

  const handleTestLogin = async () => {
    try {
      setLoading(true)

      // Tentar login com email/senha de teste
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "teste@exemplo.com",
        password: "senha123",
      })

      if (error) {
        alert(`Erro no login: ${error.message}`)
      } else {
        alert("Login de teste bem-sucedido!")
        window.location.reload()
      }
    } catch (error: any) {
      alert(`Erro inesperado: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      alert("Logout realizado com sucesso!")
      window.location.reload()
    } catch (error: any) {
      alert(`Erro no logout: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClearCookies = () => {
    try {
      // Limpar todos os cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      alert("Cookies limpos com sucesso! A página será recarregada.")
      window.location.reload()
    } catch (error: any) {
      alert(`Erro ao limpar cookies: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico Básico</CardTitle>
          <CardDescription>Verificação de conexões e autenticação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da conexão com Supabase */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Conexão com Supabase</h3>
            {status.supabaseConnection ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Conexão estabelecida</AlertTitle>
                <AlertDescription className="text-green-700">
                  A conexão com o Supabase está funcionando.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha na conexão</AlertTitle>
                <AlertDescription>
                  Não foi possível conectar ao Supabase. Verifique as variáveis de ambiente.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status da conexão com Auth */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Conexão com Autenticação</h3>
            {status.authConnection ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Autenticação funcionando</AlertTitle>
                <AlertDescription className="text-green-700">
                  A conexão com o serviço de autenticação está funcionando.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha na autenticação</AlertTitle>
                <AlertDescription>Não foi possível conectar ao serviço de autenticação.</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status da sessão */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Status da Sessão</h3>
            {status.session ? (
              <div>
                <Alert className="bg-green-50 border-green-200 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Usuário autenticado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Você está logado como: {status.session.user.email}
                  </AlertDescription>
                </Alert>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(status.session, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não autenticado</AlertTitle>
                <AlertDescription>Nenhuma sessão ativa encontrada. Você não está logado.</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Mensagens de erro */}
          {status.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={handleTestLogin} disabled={loading}>
              Testar Login
            </Button>
            <Button onClick={handleLogout} disabled={loading || !status.session}>
              Fazer Logout
            </Button>
          </div>
          <Button variant="destructive" onClick={handleClearCookies} className="w-full">
            Limpar Cookies
          </Button>
          <div className="text-xs text-gray-500 mt-2">
            <p>Variáveis de ambiente:</p>
            <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Definida" : "Não definida"}</p>
            <p>
              NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Definida" : "Não definida"}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
