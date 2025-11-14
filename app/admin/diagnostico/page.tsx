"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, User, Shield, Database } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDiagnostico() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [adminStatus, setAdminStatus] = useState<{
    isAdmin: boolean
    tableExists: boolean
    error?: string
    message?: string
  }>({
    isAdmin: false,
    tableExists: false,
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true)

        // Verificar sessão do usuário
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          setAdminStatus({
            isAdmin: false,
            tableExists: false,
            error: "Usuário não está autenticado",
          })
          return
        }

        setUser(sessionData.session.user)

        // Verificar se a tabela admin_users existe
        const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

        if (tableError && tableError.code === "PGRST116") {
          // Tabela não existe
          setAdminStatus({
            isAdmin: false,
            tableExists: false,
            message: "A tabela admin_users não existe. É necessário criar a tabela.",
          })
          return
        }

        // Verificar se o usuário é um administrador
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", sessionData.session.user.email)
          .single()

        if (adminError) {
          if (adminError.code === "PGRST104") {
            // Nenhum registro encontrado
            setAdminStatus({
              isAdmin: false,
              tableExists: true,
              message: "Seu usuário não está registrado como administrador.",
            })
          } else {
            // Outro erro
            setAdminStatus({
              isAdmin: false,
              tableExists: true,
              error: `Erro ao verificar status de administrador: ${adminError.message}`,
            })
          }
        } else {
          // Usuário é administrador
          setAdminStatus({
            isAdmin: true,
            tableExists: true,
            message: "Seu usuário está registrado como administrador.",
          })
        }
      } catch (error: any) {
        setAdminStatus({
          isAdmin: false,
          tableExists: false,
          error: `Erro inesperado: ${error.message}`,
        })
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [supabase])

  const handleAddAsAdmin = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Verificar se a tabela existe
      const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

      // Se a tabela não existir, criar a tabela
      if (tableError && tableError.code === "PGRST116") {
        // Criar a tabela via RPC (função SQL)
        const { error: createError } = await supabase.rpc("create_admin_table")

        if (createError) {
          throw new Error(`Erro ao criar tabela: ${createError.message}`)
        }
      }

      // Adicionar o usuário como administrador
      const { error: insertError } = await supabase.from("admin_users").insert([
        {
          email: user.email,
          name: user.user_metadata?.name || "Administrador",
          user_id: user.id,
          is_super_admin: true,
        },
      ])

      if (insertError) {
        throw new Error(`Erro ao adicionar administrador: ${insertError.message}`)
      }

      // Atualizar o status
      setAdminStatus({
        isAdmin: true,
        tableExists: true,
        message: "Você foi adicionado como administrador com sucesso!",
      })
    } catch (error: any) {
      setAdminStatus({
        ...adminStatus,
        error: error.message,
      })
    } finally {
      setLoading(false)
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
          <CardTitle>Diagnóstico de Administrador</CardTitle>
          <CardDescription>Verifique e resolva problemas de acesso ao painel de administração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do usuário */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Status do Usuário</h3>
            </div>
            {user ? (
              <div className="text-sm space-y-1 pl-8">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {user.id}
                </p>
                <p>
                  <span className="font-medium">Status:</span> Autenticado
                </p>
              </div>
            ) : (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não autenticado</AlertTitle>
                <AlertDescription>
                  Você precisa estar autenticado para acessar o painel de administração.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status da tabela */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Status da Tabela</h3>
            </div>
            {adminStatus.tableExists ? (
              <Alert className="bg-green-50 border-green-200 mt-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Tabela encontrada</AlertTitle>
                <AlertDescription className="text-green-700">
                  A tabela admin_users existe no banco de dados.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Tabela não encontrada</AlertTitle>
                <AlertDescription>A tabela admin_users não existe. Clique no botão abaixo para criar.</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status de administrador */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Status de Administrador</h3>
            </div>
            {adminStatus.isAdmin ? (
              <Alert className="bg-green-50 border-green-200 mt-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Acesso de administrador</AlertTitle>
                <AlertDescription className="text-green-700">
                  Seu usuário está registrado como administrador.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sem acesso de administrador</AlertTitle>
                <AlertDescription>
                  Seu usuário não está registrado como administrador. Clique no botão abaixo para adicionar.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Mensagens de erro ou sucesso */}
          {adminStatus.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{adminStatus.error}</AlertDescription>
            </Alert>
          )}

          {adminStatus.message && !adminStatus.error && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Informação</AlertTitle>
              <AlertDescription className="text-blue-700">{adminStatus.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!adminStatus.isAdmin && user && (
            <Button onClick={handleAddAsAdmin} className="w-full" disabled={loading}>
              {loading ? "Processando..." : "Adicionar-me como Administrador"}
            </Button>
          )}

          <Button variant="outline" onClick={() => router.push("/admin/setup-direct")} className="w-full">
            Ir para Configuração de Administrador
          </Button>

          {adminStatus.isAdmin && (
            <Button onClick={() => router.push("/admin")} className="w-full">
              Ir para o Painel de Administração
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
