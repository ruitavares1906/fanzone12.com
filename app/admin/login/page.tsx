"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle, LogIn } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminTableExists, setAdminTableExists] = useState(true)
  const [checkingTable, setCheckingTable] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Verificar se há erro nos parâmetros de URL
    const errorParam = searchParams.get("error")
    if (errorParam === "unauthorized") {
      setError("Acesso não autorizado. Conta de administrador não encontrada.")
    } else if (errorParam === "server") {
      setError("Erro no servidor. Tente novamente mais tarde.")
    }

    // Verificar se a tabela admin_users existe
    const checkAdminTable = async () => {
      try {
        setCheckingTable(true)

        // Verificar se a tabela admin_users existe
        const { error } = await supabase.from("admin_users").select("count").limit(1).single()

        // Se a tabela não existir, mostrar mensagem
        if (error && error.code === "PGRST116") {
          console.log("Tabela admin_users não existe")
          setAdminTableExists(false)
        } else {
          setAdminTableExists(true)
        }
      } catch (error) {
        console.error("Erro ao verificar tabela:", error)
      } finally {
        setCheckingTable(false)
      }
    }

    checkAdminTable()
  }, [searchParams, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Fazer login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verificar se o usuário tem papel de administrador
      const { data: userData, error: userError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single()

      if (userError || !userData) {
        await supabase.auth.signOut()
        throw new Error("Acesso não autorizado. Conta de administrador não encontrada.")
      }

      // Atualizar último login
      await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("email", email)

      // Redirecionar para o painel de administração
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      console.error("Erro de login:", error)
      setError(error.message || "Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingTable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-4"></div>
        <p>Verificando configuração...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image src="/images/logo.webp" alt="fanzone12.pt" width={180} height={60} className="mx-auto" />
          </div>
          <CardTitle className="text-2xl">Painel de Administração</CardTitle>
          <CardDescription>Faça login para acessar o painel de administração</CardDescription>
        </CardHeader>
        <CardContent>
          {!adminTableExists && (
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Configuração necessária</AlertTitle>
              <AlertDescription className="text-yellow-700">
                A configuração inicial do administrador é necessária.{" "}
                <Link href="/admin/setup-rapido" className="font-medium underline">
                  Clique aqui para configurar
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {!adminTableExists && (
            <Link href="/admin/setup-rapido" className="text-sm text-primary hover:underline">
              Configurar administrador
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
