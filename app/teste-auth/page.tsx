"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function TesteAuthPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()
      console.log("Sessão:", data.session)
      console.log("Erro:", error)
      setSession(data.session)
      setLoading(false)
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleRedirect = () => {
    window.location.href = "/conta"
  }

  if (loading) {
    return <div className="p-8">Verificando autenticação...</div>
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Teste de Autenticação</h1>

      {session ? (
        <>
          <div className="p-4 bg-green-100 rounded-md">
            <p className="font-medium text-green-800">Autenticado como: {session.user.email}</p>
            <p className="text-sm text-green-700">ID do usuário: {session.user.id}</p>
            <p className="text-sm text-green-700">
              Sessão expira em: {new Date(session.expires_at * 1000).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRedirect}>Ir para Conta</Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </>
      ) : (
        <div className="p-4 bg-red-100 rounded-md">
          <p className="font-medium text-red-800">Não autenticado</p>
          <Button className="mt-2" onClick={() => (window.location.href = "/login")}>
            Ir para Login
          </Button>
        </div>
      )}
    </div>
  )
}
