"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertCircle, Database, UserPlus, Key, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function AdminFix() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [diagnosisLoading, setDiagnosisLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("diagnosis")
  const supabase = createClientComponentClient()

  // Função para diagnosticar problemas
  const runDiagnosis = async () => {
    try {
      setDiagnosisLoading(true)
      setError(null)
      setDiagnosisResult(null)

      const diagnosis: any = {
        timestamp: new Date().toISOString(),
        tables: {},
        session: null,
        adminUser: null,
      }

      // 1. Verificar sessão atual
      const { data: sessionData } = await supabase.auth.getSession()
      diagnosis.session = sessionData.session
        ? {
            user: {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email,
              role: sessionData.session.user.role,
            },
            expires_at: sessionData.session.expires_at,
          }
        : null

      // 2. Verificar tabelas
      // Verificar admin_users
      try {
        const { data: adminUsersData, error: adminUsersError } = await supabase
          .from("admin_users")
          .select("count")
          .single()

        diagnosis.tables.admin_users = {
          exists: !adminUsersError || adminUsersError.code !== "PGRST116",
          count: adminUsersData?.count || 0,
          error: adminUsersError ? adminUsersError.message : null,
        }
      } catch (error: any) {
        diagnosis.tables.admin_users = {
          exists: false,
          error: error.message,
        }
      }

      // Verificar orders
      try {
        const { data: ordersData, error: ordersError } = await supabase.from("orders").select("count").single()

        diagnosis.tables.orders = {
          exists: !ordersError || ordersError.code !== "PGRST116",
          count: ordersData?.count || 0,
          error: ordersError ? ordersError.message : null,
        }
      } catch (error: any) {
        diagnosis.tables.orders = {
          exists: false,
          error: error.message,
        }
      }

      // 3. Se houver sessão, verificar se o usuário é admin
      if (diagnosis.session && diagnosis.session.user.email) {
        try {
          const { data: adminUser, error: adminUserError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", diagnosis.session.user.email)
            .single()

          diagnosis.adminUser = adminUser || null
          diagnosis.adminUserError = adminUserError ? adminUserError.message : null
        } catch (error: any) {
          diagnosis.adminUserError = error.message
        }
      }

      setDiagnosisResult(diagnosis)
    } catch (error: any) {
      console.error("Erro ao executar diagnóstico:", error)
      setError(`Erro ao executar diagnóstico: ${error.message}`)
    } finally {
      setDiagnosisLoading(false)
    }
  }

  // Função para criar tabelas de admin
  const setupAdminTables = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Executar SQL para criar tabelas
      const { error } = await supabase.rpc("setup_admin_tables_direct")

      if (error) {
        throw new Error(`Erro ao configurar tabelas: ${error.message}`)
      }

      setSuccess("Tabelas de administração criadas com sucesso!")
      runDiagnosis() // Atualizar diagnóstico
    } catch (error: any) {
      console.error("Erro ao configurar tabelas:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Função para criar admin diretamente
  const createAdminDirect = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            is_admin: true,
          },
        },
      })

      if (authError) {
        throw new Error(`Erro ao criar conta: ${authError.message}`)
      }

      // 2. Inserir diretamente na tabela admin_users
      const { error: insertError } = await supabase.from("admin_users").insert([
        {
          email,
          name,
          user_id: authData.user?.id,
          is_super_admin: true,
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        throw new Error(`Erro ao adicionar administrador: ${insertError.message}`)
      }

      setSuccess("Administrador criado com sucesso! Verifique seu email para confirmar a conta.")
      runDiagnosis() // Atualizar diagnóstico
    } catch (error: any) {
      console.error("Erro ao criar administrador:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Executar diagnóstico ao carregar a página
  useEffect(() => {
    runDiagnosis()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center mb-8">
        <Image src="/images/logo.webp" alt="fanzone12.pt" width={200} height={70} className="mb-4" />
        <h1 className="text-3xl font-bold">Ferramenta de Correção de Administrador</h1>
        <p className="text-muted-foreground mt-2">
          Esta ferramenta ajuda a diagnosticar e corrigir problemas com a conta de administrador
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
          <TabsTrigger value="fix">Correção</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Diagnóstico do Sistema
              </CardTitle>
              <CardDescription>Verifica o estado atual das tabelas e da autenticação de administrador</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={runDiagnosis} disabled={diagnosisLoading}>
                    {diagnosisLoading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Executando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" /> Atualizar Diagnóstico
                      </>
                    )}
                  </Button>
                </div>

                {diagnosisResult && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Sessão Atual</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {diagnosisResult.session ? (
                          <div>
                            <p>
                              <strong>Email:</strong> {diagnosisResult.session.user.email}
                            </p>
                            <p>
                              <strong>ID:</strong> {diagnosisResult.session.user.id}
                            </p>
                            <p>
                              <strong>Expira em:</strong>{" "}
                              {new Date(diagnosisResult.session.expires_at * 1000).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-amber-600">Nenhuma sessão ativa encontrada. Você não está autenticado.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Status de Administrador</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {diagnosisResult.adminUser ? (
                          <div className="text-green-600">
                            <p className="flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Usuário é administrador
                            </p>
                            <p>
                              <strong>Nome:</strong> {diagnosisResult.adminUser.name}
                            </p>
                            <p>
                              <strong>Super Admin:</strong> {diagnosisResult.adminUser.is_super_admin ? "Sim" : "Não"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-red-600 flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            {diagnosisResult.session
                              ? "Usuário autenticado não é administrador"
                              : "Não há sessão ativa para verificar status de administrador"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Tabelas do Banco de Dados</h3>
                      <div className="bg-gray-50 p-4 rounded-md space-y-4">
                        <div>
                          <p className="font-medium">Tabela admin_users:</p>
                          {diagnosisResult.tables.admin_users?.exists ? (
                            <p className="text-green-600 flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Existe ({diagnosisResult.tables.admin_users.count} registros)
                            </p>
                          ) : (
                            <p className="text-red-600 flex items-center">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Não existe ou não é acessível
                              {diagnosisResult.tables.admin_users?.error && (
                                <span className="block text-xs mt-1">
                                  Erro: {diagnosisResult.tables.admin_users.error}
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="font-medium">Tabela orders:</p>
                          {diagnosisResult.tables.orders?.exists ? (
                            <p className="text-green-600 flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Existe ({diagnosisResult.tables.orders.count} registros)
                            </p>
                          ) : (
                            <p className="text-red-600 flex items-center">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Não existe ou não é acessível
                              {diagnosisResult.tables.orders?.error && (
                                <span className="block text-xs mt-1">Erro: {diagnosisResult.tables.orders.error}</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Recomendações</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2">
                          {!diagnosisResult.tables.admin_users?.exists && (
                            <li>
                              <span className="text-red-600">Crítico:</span> A tabela admin_users não existe.
                              <Button
                                variant="link"
                                className="p-0 h-auto text-primary"
                                onClick={() => setActiveTab("fix")}
                              >
                                Clique aqui para criar as tabelas
                              </Button>
                            </li>
                          )}

                          {diagnosisResult.tables.admin_users?.exists &&
                            diagnosisResult.tables.admin_users?.count === 0 && (
                              <li>
                                <span className="text-amber-600">Importante:</span> A tabela admin_users existe mas está
                                vazia.
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-primary"
                                  onClick={() => setActiveTab("fix")}
                                >
                                  Clique aqui para criar um administrador
                                </Button>
                              </li>
                            )}

                          {!diagnosisResult.session && (
                            <li>
                              <span className="text-amber-600">Importante:</span> Você não está autenticado. Faça login
                              antes de tentar acessar a área de administração.
                            </li>
                          )}

                          {diagnosisResult.session && !diagnosisResult.adminUser && (
                            <li>
                              <span className="text-amber-600">Importante:</span> Você está autenticado como{" "}
                              {diagnosisResult.session.user.email}, mas esta conta não é um administrador.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fix">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Configurar Tabelas
                </CardTitle>
                <CardDescription>
                  Cria as tabelas necessárias para o funcionamento da área administrativa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Este processo irá criar todas as tabelas necessárias para o funcionamento da área administrativa,
                  incluindo tabelas para administradores, pedidos, rastreamento e clientes.
                </p>

                {error && error.includes("tabelas") && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && success.includes("tabelas") && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={setupAdminTables} disabled={loading} className="w-full">
                  {loading && success?.includes("tabelas") ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Configurando...
                    </span>
                  ) : (
                    "Configurar Tabelas de Administração"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar Administrador
                </CardTitle>
                <CardDescription>Cria um usuário administrador para acessar a área administrativa</CardDescription>
              </CardHeader>
              <CardContent>
                {error && !error.includes("tabelas") && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && !success.includes("tabelas") && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={createAdminDirect} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome do Administrador"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@exemplo.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha segura"
                        required
                        minLength={6}
                      />
                      <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 6 caracteres.</p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && !success?.includes("tabelas") ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Criando...
                      </span>
                    ) : (
                      "Criar Administrador"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Primeiro, configure as tabelas clicando no botão "Configurar Tabelas de Administração"</li>
                <li>Em seguida, crie um administrador preenchendo o formulário e clicando em "Criar Administrador"</li>
                <li>Verifique seu email para confirmar a conta (se necessário)</li>
                <li>
                  Acesse a{" "}
                  <a href="/admin/login" className="text-primary underline">
                    página de login
                  </a>{" "}
                  para entrar na área administrativa
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
