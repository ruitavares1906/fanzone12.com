"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function TesteSessaoPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        console.log("Dados da sessão:", data)
        setSession(data.session)
      } catch (err) {
        console.error("Erro ao verificar sessão:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      window.location.href = "/login-simples"
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
          <CardFooter className="justify-center">
            <p>Verificando sessão...</p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Status da Sessão</CardTitle>
          <CardDescription>Informações sobre sua sessão atual</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 bg-red-100 rounded-md text-red-800">
              <p className="font-medium">Erro ao verificar sessão</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : session ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-md">
                <p className="font-medium text-green-800">Autenticado como: {session.user.email}</p>
                <p className="text-sm text-green-700">ID do usuário: {session.user.id}</p>
                <p className="text-sm text-green-700">
                  Sessão expira em: {new Date(session.expires_at * 1000).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-md">
                <p className="font-medium">Detalhes do usuário:</p>
                <pre className="text-xs mt-2 overflow-auto p-2 bg-gray-200 rounded">
                  {JSON.stringify(session.user, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-100 rounded-md">
              <p className="font-medium text-yellow-800">Não autenticado</p>
              <p className="text-sm text-yellow-700">Você não está logado atualmente.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {session ? (
            <Button variant="destructive" onClick={handleLogout}>
              Sair
            </Button>
          ) : (
            <Button onClick={() => (window.location.href = "/login-simples")}>Ir para Login</Button>
          )}
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar para Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
