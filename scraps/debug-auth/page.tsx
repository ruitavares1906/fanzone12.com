"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export default function DebugAuthPage() {
  const { user, session, isLoading } = useAuth()
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Não definido",
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setError(error.message)
        } else {
          setAuthStatus(data)
        }
      } catch (e: any) {
        setError(e.message)
      }
    }

    checkAuth()
  }, [])

  const handleTestAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        setError(error.message)
      } else {
        alert(`Usuário autenticado: ${data.user ? "Sim" : "Não"}`)
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de Autenticação</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Supabase</CardTitle>
            <CardDescription>Informações sobre a configuração do Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>URL:</strong> {supabaseConfig.url}
              </p>
              <p>
                <strong>Chave Anônima:</strong> {supabaseConfig.hasAnonKey ? "Configurada" : "Não configurada"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado da Autenticação</CardTitle>
            <CardDescription>Informações sobre o estado atual da autenticação</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Usuário autenticado:</strong> {user ? "Sim" : "Não"}
                </p>
                {user && (
                  <>
                    <p>
                      <strong>ID do usuário:</strong> {user.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Nome:</strong> {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </p>
                  </>
                )}
                <p>
                  <strong>Sessão ativa:</strong> {session ? "Sim" : "Não"}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <Button onClick={handleTestAuth} className="mt-4">
              Testar Autenticação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>Ações para testar a autenticação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <a href="/login">Ir para página de login</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/conta">Ir para página de conta</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
