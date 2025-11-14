"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Database, UserPlus, Key } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSetupRapido() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [setupDbLoading, setSetupDbLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dbSetupSuccess, setDbSetupSuccess] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const setupDatabase = async () => {
    try {
      setSetupDbLoading(true)
      setError(null)

      // Executar o script SQL para configurar o banco de dados
      const { error } = await supabase.rpc("setup_admin_database")

      if (error) {
        throw new Error(`Erro ao configurar banco de dados: ${error.message}`)
      }

      setDbSetupSuccess(true)
      toast({
        title: "Sucesso!",
        description: "Banco de dados configurado com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao configurar banco de dados:", error)
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setSetupDbLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // 1. Criar o usuário no Auth
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

      // 2. Adicionar o usuário como administrador
      const { data, error: adminError } = await supabase.rpc("add_admin_user", {
        admin_email: email,
        admin_name: name,
      })

      if (adminError) {
        throw new Error(`Erro ao adicionar administrador: ${adminError.message}`)
      }

      setSuccess(
        "Administrador criado com sucesso! Verifique seu email para confirmar a conta e faça login na página de administração.",
      )
      toast({
        title: "Sucesso!",
        description: "Administrador criado com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao criar administrador:", error)
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Configuração Rápida de Administrador</h1>
      <p className="text-muted-foreground">
        Use esta página para configurar rapidamente o banco de dados e criar um administrador.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Configurar Banco de Dados
            </CardTitle>
            <CardDescription>
              Configure as tabelas necessárias para o funcionamento da área administrativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbSetupSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Banco de dados configurado!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Todas as tabelas e políticas de segurança foram criadas com sucesso.
                </AlertDescription>
              </Alert>
            ) : (
              <p>
                Este processo irá criar todas as tabelas necessárias para o funcionamento da área administrativa,
                incluindo tabelas para administradores, pedidos, rastreamento e clientes.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={setupDatabase}
              disabled={setupDbLoading || dbSetupSuccess}
              className="w-full"
              variant={dbSetupSuccess ? "outline" : "default"}
            >
              {setupDbLoading
                ? "Configurando..."
                : dbSetupSuccess
                  ? "Configurado com Sucesso"
                  : "Configurar Banco de Dados"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Criar Administrador
            </CardTitle>
            <CardDescription>Crie um usuário administrador para acessar a área administrativa.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
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
                {loading ? "Criando..." : "Criar Administrador"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Configure o banco de dados clicando no botão "Configurar Banco de Dados"</li>
            <li>Crie um administrador preenchendo o formulário e clicando em "Criar Administrador"</li>
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
    </div>
  )
}
