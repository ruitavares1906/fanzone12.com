"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugSupabasePage() {
  const [status, setStatus] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSupabase() {
      try {
        setLoading(true)
        setError(null)

        // Verificar conexão com Supabase
        const { data: pingData, error: pingError } = await supabase.from("profiles").select("count").limit(1)

        // Verificar configuração de autenticação
        const { data: authData, error: authError } = await supabase.auth.getSession()

        // Verificar variáveis de ambiente
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setStatus({
          connection: pingError ? "Erro" : "OK",
          connectionError: pingError?.message || null,
          auth: authError ? "Erro" : "OK",
          authError: authError?.message || null,
          session: authData?.session ? "Ativa" : "Inativa",
          supabaseUrl: supabaseUrl ? "Configurado" : "Não configurado",
          supabaseAnonKey: supabaseAnonKey ? "Configurado" : "Não configurado",
          timestamp: new Date().toISOString(),
        })
      } catch (err: any) {
        setError(err.message || "Erro desconhecido ao verificar Supabase")
      } finally {
        setLoading(false)
      }
    }

    checkSupabase()
  }, [])

  const handleTestAuth = async () => {
    try {
      setLoading(true)

      // Tentar criar um usuário de teste
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = "password123"

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        setError(`Erro no teste de autenticação: ${error.message}`)
      } else {
        alert(`Usuário de teste criado com sucesso: ${testEmail}`)
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido no teste de autenticação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico do Supabase</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erro:</p>
          <p>{error}</p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
          <CardDescription>Verificação da conexão com o Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Verificando conexão...</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Conexão:</div>
                <div className={status.connection === "OK" ? "text-green-600" : "text-red-600"}>
                  {status.connection}
                </div>

                <div className="font-medium">Autenticação:</div>
                <div className={status.auth === "OK" ? "text-green-600" : "text-red-600"}>{status.auth}</div>

                <div className="font-medium">Sessão:</div>
                <div className={status.session === "Ativa" ? "text-green-600" : "text-yellow-600"}>
                  {status.session}
                </div>

                <div className="font-medium">URL do Supabase:</div>
                <div className={status.supabaseUrl === "Configurado" ? "text-green-600" : "text-red-600"}>
                  {status.supabaseUrl}
                </div>

                <div className="font-medium">Chave Anônima:</div>
                <div className={status.supabaseAnonKey === "Configurado" ? "text-green-600" : "text-red-600"}>
                  {status.supabaseAnonKey}
                </div>

                <div className="font-medium">Verificado em:</div>
                <div>{new Date(status.timestamp).toLocaleString()}</div>
              </div>

              {status.connectionError && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                  <p className="font-medium">Erro de conexão:</p>
                  <p className="text-sm">{status.connectionError}</p>
                </div>
              )}

              {status.authError && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                  <p className="font-medium">Erro de autenticação:</p>
                  <p className="text-sm">{status.authError}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Atualizar</Button>
            <Button variant="outline" onClick={handleTestAuth}>
              Testar Autenticação
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Próximos Passos:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Execute o script SQL <code>verificar-tabelas-auth.sql</code> no SQL Editor do Supabase
          </li>
          <li>
            Verifique se a tabela <code>profiles</code> foi criada corretamente
          </li>
          <li>
            Confirme que o trigger <code>on_auth_user_created</code> está ativo
          </li>
          <li>
            Verifique as políticas de segurança (RLS) para a tabela <code>profiles</code>
          </li>
        </ul>
      </div>
    </div>
  )
}
