"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AdminDirectSetup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Verificar o código de segurança (primeiros 8 caracteres do ADMIN_EMAIL invertidos)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""
      const expectedCode = adminEmail.slice(0, 8).split("").reverse().join("")

      if (securityCode !== expectedCode) {
        throw new Error("Código de segurança inválido. Verifique e tente novamente.")
      }

      // Criar a tabela admin_users se não existir
      const { error: createTableError } = await supabase.rpc("setup_admin_table")

      if (createTableError) {
        console.error("Erro ao criar tabela:", createTableError)
        throw new Error("Erro ao criar tabela de administradores. Tente novamente mais tarde.")
      }

      // Registrar o usuário no auth
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

      // Adicionar o usuário como administrador
      const { error: insertError } = await supabase.from("admin_users").insert([
        {
          email,
          name,
          user_id: authData.user?.id || null,
          is_super_admin: true,
        },
      ])

      if (insertError) {
        if (insertError.code === "23505") {
          // Código de erro para violação de chave única
          throw new Error("Este email já está registrado como administrador.")
        }
        throw new Error(`Erro ao adicionar administrador: ${insertError.message}`)
      }

      setSuccess(true)

      // Redirecionar para o login após 3 segundos
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    } catch (error: any) {
      console.error("Erro ao configurar administrador:", error)
      setError(error.message || "Erro ao configurar administrador. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image src="/images/logo.webp" alt="fanzone12.pt" width={180} height={60} className="mx-auto mb-4" />
          <CardTitle>Configuração Direta de Administrador</CardTitle>
          <CardDescription>Configure o primeiro administrador do sistema usando o código de segurança.</CardDescription>
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
                Administrador configurado com sucesso. Redirecionando para o login...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSetupAdmin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="securityCode">Código de Segurança</Label>
                <Input
                  id="securityCode"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Código de segurança"
                  required
                  disabled={success}
                />
                <p className="text-xs text-gray-500">
                  O código de segurança são os primeiros 8 caracteres do seu email de administrador invertidos.
                </p>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha segura"
                  required
                  disabled={success}
                />
                <p className="text-xs text-gray-500">
                  Use uma senha forte com pelo menos 8 caracteres, incluindo letras, números e símbolos.
                </p>
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
