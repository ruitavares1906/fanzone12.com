"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function AuthDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setSessionInfo({ error: error.message })
        } else {
          setSessionInfo({
            session: data.session
              ? {
                  user: data.session.user
                    ? {
                        id: data.session.user.id,
                        email: data.session.user.email,
                        user_metadata: data.session.user.user_metadata,
                      }
                    : null,
                  expires_at: data.session.expires_at,
                  // Omitir tokens sensíveis
                }
              : null,
          })
        }
      } catch (e: any) {
        setSessionInfo({ error: e.message })
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleTestRedirect = async () => {
    setIsLoading(true)
    try {
      // Testar redirecionamento direto
      window.location.href = "/conta"
    } catch (e: any) {
      setTestResult({ error: e.message })
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (e: any) {
      setTestResult({ error: e.message })
      setIsLoading(false)
    }
  }

  const handleClearStorage = () => {
    try {
      // Limpar localStorage
      localStorage.clear()
      // Limpar cookies relacionados ao Supabase
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      setTestResult({ success: "Armazenamento local e cookies limpos com sucesso" })

      // Recarregar a página após 1 segundo
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (e: any) {
      setTestResult({ error: e.message })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Autenticação</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status da Sessão</CardTitle>
            <CardDescription>Informações sobre a sessão atual</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Carregando informações da sessão...</p>
            ) : (
              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {sessionInfo?.session ? (
              <Button onClick={handleLogout} variant="outline" disabled={isLoading}>
                Fazer Logout
              </Button>
            ) : (
              <Button onClick={() => (window.location.href = "/login-alt")} variant="outline">
                Ir para Login Alternativo
              </Button>
            )}
            <Button onClick={handleClearStorage} variant="destructive">
              Limpar Armazenamento
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testes de Redirecionamento</CardTitle>
            <CardDescription>Testar redirecionamento para a página de conta</CardDescription>
          </CardHeader>
          <CardContent>
            {testResult && (
              <div
                className={`p-3 rounded-md ${testResult.error ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}
              >
                {testResult.error || testResult.success}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleTestRedirect} disabled={isLoading}>
              Testar Redirecionamento Direto
            </Button>
            <Button onClick={() => (window.location.href = "/login?redirectTo=%2Fconta")} variant="outline">
              Voltar para Login Normal
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Navegador</CardTitle>
            <CardDescription>Detalhes sobre o ambiente do navegador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>User Agent:</strong> {navigator.userAgent}
              </div>
              <div>
                <strong>Cookies Habilitados:</strong> {navigator.cookieEnabled ? "Sim" : "Não"}
              </div>
              <div>
                <strong>LocalStorage Disponível:</strong> {typeof localStorage !== "undefined" ? "Sim" : "Não"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
