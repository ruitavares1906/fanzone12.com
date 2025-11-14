"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AdminSetup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Verificar se já existe um administrador
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setCheckingAdmin(true)

        // Verificar se a tabela admin_users existe
        const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

        // Se a tabela não existir, criar a tabela
        if (tableError && tableError.code === "PGRST116") {
          console.log("Tabela admin_users não existe, criando...")

          // Criar a tabela admin_users
          const { error: createError } = await supabase.rpc("create_admin_table")

          if (createError) {
            console.error("Erro ao criar tabela:", createError)
            setError("Erro ao criar tabela de administradores. Entre em contato com o suporte.")
            setCheckingAdmin(false)
            return
          }

          setAdminExists(false)
          setCheckingAdmin(false)
          return
        }

        // Verificar se já existe algum administrador
        const { data, error } = await supabase.from("admin_users").select("count").single()

        if (error) {
          console.error("Erro ao verificar administradores:", error)
          setError("Erro ao verificar administradores. Tente novamente.")
        } else {
          const count = data?.count || 0
          setAdminExists(count > 0)
        }
      } catch (error) {
        console.error("Erro inesperado:", error)
        setError("Ocorreu um erro inesperado. Tente novamente.")
      } finally {
        setCheckingAdmin(false)
      }
    }

    checkAdmin()
  }, [supabase])

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Verificar se o usuário está autenticado
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        throw new Error("Você precisa estar autenticado para configurar um administrador.")
      }

      // Verificar se o email fornecido corresponde ao email autenticado
      if (email !== sessionData.session.user.email) {
        throw new Error("O email fornecido deve corresponder ao email da sua conta autenticada.")
      }

      // Verificar se a tabela admin_users existe
      const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

      // Se a tabela não existir, criar a tabela
      if (tableError && tableError.code === "PGRST116") {
        console.log("Tabela admin_users não existe, criando...")

        // Criar a tabela admin_users
        const { error: createError } = await supabase.rpc("create_admin_table")

        if (createError) {
          throw new Error("Erro ao criar tabela de administradores. Entre em contato com o suporte.")
        }
      }

      // Adicionar o usuário como administrador
      const { error } = await supabase
        .from("admin_users")
        .insert([{ email, name, user_id: sessionData.session.user.id }])

      if (error) {
        if (error.code === "23505") {
          // Código de erro para violação de chave única
          throw new Error("Este email já está registrado como administrador.")
        }
        throw new Error(`Erro ao adicionar administrador: ${error.message}`)
      }

      setSuccess(true)

      // Redirecionar para o painel de administração após 2 segundos
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao configurar administrador:", error)
      setError(error.message || "Erro ao configurar administrador. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mr-2"></div>
        <span>Verificando configuração...</span>
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuração de Administrador</CardTitle>
            <CardDescription>Já existe pelo menos um administrador configurado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Administrador já configurado</AlertTitle>
              <AlertDescription>
                O sistema já possui pelo menos um administrador configurado. Se você precisa de acesso administrativo,
                entre em contato com um administrador existente.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/login")} className="w-full">
              Ir para Login de Administrador
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image src="/images/logo.webp" alt="fanzone12.pt" width={180} height={60} className="mx-auto mb-4" />
          <CardTitle>Configuração Inicial de Administrador</CardTitle>
          <CardDescription>
            Configure o primeiro administrador do sistema. Você precisa estar autenticado com o email que deseja usar
            como administrador.
          </CardDescription>
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
              <AlertDescription className="text-green-700">
                Administrador configurado com sucesso. Redirecionando para o painel...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSetupAdmin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={success}
                />
                <p className="text-xs text-gray-500">Este deve ser o mesmo email com o qual você está autenticado.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Administrador</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  required
                  disabled={success}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading || success}>
              {loading ? "Configurando..." : "Configurar Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
