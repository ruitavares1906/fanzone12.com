"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [redirecting, setRedirecting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Estado para formulário de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Estado para formulário de registro
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo(null)

    try {
      // Login direto com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) {
        console.error("Erro no login:", error)
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data.session) {
        console.log("Login bem-sucedido, redirecionando...")
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso.",
        })

        setRedirecting(true)

        // Verificar se a sessão foi realmente armazenada
        const checkSession = await supabase.auth.getSession()
        setDebugInfo(`Sessão após login: ${checkSession.data.session ? "Existe" : "Não existe"}`)

        // Forçar atualização do router
        router.refresh()

        // Redirecionamento direto após um breve atraso
        setTimeout(() => {
          window.location.href = "/conta"
        }, 1500)
      }
    } catch (error) {
      console.error("Erro inesperado no login:", error)
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
      setDebugInfo(`Erro: ${error.message}`)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validar senha
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Registro direto com Supabase
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            full_name: `${registerData.firstName} ${registerData.lastName}`,
          },
        },
      })

      if (error) {
        console.error("Erro no registro:", error)
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log("Registro bem-sucedido:", data)
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar sua conta.",
      })

      // Mudar para a aba de login após registro bem-sucedido
      setActiveTab("login")
      setLoginData({
        email: registerData.email,
        password: "",
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Erro inesperado no registro:", error)
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Verificar se já existe uma sessão ativa
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log("Sessão existente encontrada, redirecionando...")
        router.push("/conta")
      }
    }

    checkExistingSession()
  }, [router])

  // Se estiver redirecionando, mostrar tela de carregamento
  if (redirecting) {
    return (
      <div className="container mx-auto py-12 flex flex-col justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Redirecionando para sua conta...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Se não for redirecionado automaticamente,{" "}
          <a href="/conta" className="text-primary underline">
            clique aqui
          </a>
          .
        </p>
        {debugInfo && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Informações de depuração:</p>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Entrar na sua conta</CardTitle>
                  <CardDescription>Entre com seu email e senha para acessar sua conta.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Senha</Label>
                      </div>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => {
                        window.location.href = "/corrigir-autenticacao"
                      }}
                    >
                      Problemas para entrar? Clique aqui
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Criar uma nova conta</CardTitle>
                  <CardDescription>Preencha os campos abaixo para criar sua conta.</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">Nome</Label>
                        <Input
                          id="register-firstName"
                          name="firstName"
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Sobrenome</Label>
                        <Input
                          id="register-lastName"
                          name="lastName"
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="register-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
