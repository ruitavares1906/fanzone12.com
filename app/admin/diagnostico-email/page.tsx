"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, AlertCircle, Mail, Send, Webhook } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DiagnosticResult {
  test: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: string
}

export default function DiagnosticoEmailPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [testEmail, setTestEmail] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    const tests: DiagnosticResult[] = [
      { test: "Variável SENDGRID_API_KEY", status: "pending", message: "Verificando..." },
      { test: "Configuração do SendGrid", status: "pending", message: "Verificando..." },
      { test: "Email de teste", status: "pending", message: "Enviando..." },
      { test: "Configuração do Webhook", status: "pending", message: "Verificando..." },
      { test: "Service Role Key do Supabase", status: "pending", message: "Verificando..." },
    ]

    setResults([...tests])

    try {
      // Teste 1: Verificar API Key do SendGrid
      const apiKeyResponse = await fetch("/api/admin/check-email-config")
      const apiKeyResult = await apiKeyResponse.json()

      tests[0] = {
        test: "Variável SENDGRID_API_KEY",
        status: apiKeyResult.hasApiKey ? "success" : "error",
        message: apiKeyResult.hasApiKey ? "API Key configurada" : "API Key não encontrada",
        details: apiKeyResult.message
      }

      setResults([...tests])

      // Teste 2: Configuração SendGrid
      if (apiKeyResult.hasApiKey) {
        tests[1] = {
          test: "Configuração do SendGrid",
          status: "success",
          message: "Configuração básica OK"
        }
      } else {
        tests[1] = {
          test: "Configuração do SendGrid",
          status: "error",
          message: "Falha na configuração",
          details: "API Key necessária para continuar"
        }
      }

      setResults([...tests])

      // Teste 3: Email de teste
      if (apiKeyResult.hasApiKey) {
        try {
          const testResponse = await fetch("/api/test-email")
          const testResult = await testResponse.json()

          tests[2] = {
            test: "Email de teste",
            status: testResult.success ? "success" : "error",
            message: testResult.success ? "Email enviado com sucesso" : "Falha no envio",
            details: testResult.message || testResult.error?.message
          }
        } catch (error: any) {
          tests[2] = {
            test: "Email de teste",
            status: "error",
            message: "Erro ao enviar email de teste",
            details: error.message
          }
        }
      } else {
        tests[2] = {
          test: "Email de teste",
          status: "warning",
          message: "Pulado - API Key não configurada"
        }
      }

      setResults([...tests])

      // Teste 4: Configuração do Webhook
      try {
        const webhookResponse = await fetch("/api/admin/check-webhook-config")
        const webhookResult = await webhookResponse.json()

        tests[3] = {
          test: "Configuração do Webhook",
          status: webhookResult.allConfigured ? "success" : "error",
          message: webhookResult.allConfigured 
            ? "Todas as variáveis configuradas" 
            : `Faltam variáveis: ${webhookResult.missingVars?.join(", ")}`,
          details: webhookResult.recommendations?.join(" | ")
        }
      } catch (error: any) {
        tests[3] = {
          test: "Configuração do Webhook",
          status: "error",
          message: "Erro ao verificar configuração",
          details: error.message
        }
      }

      setResults([...tests])

      // Teste 5: Service Role Key
      try {
        const webhookResponse = await fetch("/api/admin/check-webhook-config")
        const webhookResult = await webhookResponse.json()

        const serviceRoleOk = webhookResult.serviceRoleStatus?.exists && 
                             webhookResult.serviceRoleStatus?.startsWithEyJ

        tests[4] = {
          test: "Service Role Key do Supabase",
          status: serviceRoleOk ? "success" : "error",
          message: serviceRoleOk 
            ? "Service Role Key configurada" 
            : "Service Role Key não encontrada ou inválida",
          details: `Existe: ${webhookResult.serviceRoleStatus?.exists}, Formato válido: ${webhookResult.serviceRoleStatus?.startsWithEyJ}`
        }
      } catch (error: any) {
        tests[4] = {
          test: "Service Role Key do Supabase",
          status: "error",
          message: "Erro ao verificar Service Role Key",
          details: error.message
        }
      }

      setResults([...tests])
    } catch (error: any) {
      console.error("Erro no diagnóstico:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao executar diagnósticos"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, digite um email para teste"
      })
      return
    }

    setIsSendingTest(true)
    try {
      const response = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: testEmail })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Email de teste enviado para ${testEmail}`
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error || "Falha ao enviar email"
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar email de teste"
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const sendTestOrderEmail = async () => {
    if (!testEmail) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, digite um email para teste"
      })
      return
    }

    setIsSendingTest(true)
    try {
      const response = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: testEmail,
          testOrderEmail: true 
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message || `Email de teste de encomenda enviado para ${testEmail}`
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error || "Falha ao enviar email"
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar email de teste de encomenda"
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "pending":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
    }
  }

  const getStatusClass = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "pending":
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Diagnóstico do Sistema de Emails</h1>

        <div className="grid gap-8">
          {/* Diagnósticos Automáticos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Diagnósticos Automáticos
              </CardTitle>
              <CardDescription>
                Verifique a configuração do sistema de emails e webhooks automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runDiagnostics} 
                disabled={isRunning}
                className="w-full sm:w-auto"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executando diagnósticos...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Executar Diagnósticos
                  </>
                )}
              </Button>

              {results.length > 0 && (
                <div className="space-y-3 mt-6">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getStatusClass(result.status)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <h3 className="font-medium">{result.test}</h3>
                          <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                          {result.details && (
                            <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
                              {result.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teste de Email Manual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Teste de Email Manual
              </CardTitle>
              <CardDescription>
                Envie um email de teste para verificar se o sistema está funcionando
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email de destino</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={sendTestEmail} 
                disabled={isSendingTest || !testEmail}
                className="w-full sm:w-auto"
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Email de Teste
                  </>
                )}
              </Button>

              <Button 
                onClick={sendTestOrderEmail} 
                disabled={isSendingTest || !testEmail}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Testar Email de Encomenda com Morada
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informações e Soluções */}
          <Card>
            <CardHeader>
              <CardTitle>Problemas Comuns e Soluções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Key do SendGrid</AlertTitle>
                <AlertDescription>
                  Certifique-se de que a variável de ambiente <code>SENDGRID_API_KEY</code> está configurada com uma chave válida do SendGrid.
                </AlertDescription>
              </Alert>

              <Alert>
                <Webhook className="h-4 w-4" />
                <AlertTitle>Service Role Key do Supabase</AlertTitle>
                <AlertDescription>
                  A variável <code>SUPABASE_SERVICE_ROLE_KEY</code> é necessária para o webhook do Stripe funcionar. Esta chave bypassa as políticas RLS e permite inserir dados nas tabelas.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verificação de Domínio</AlertTitle>
                <AlertDescription>
                  O email <code>geral@fanzone12.pt</code> deve estar verificado na sua conta do SendGrid.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configurações de Produção</AlertTitle>
                <AlertDescription>
                  Em produção, certifique-se de que todas as variáveis de ambiente estão configuradas na plataforma de hosting (Vercel, etc.).
                </AlertDescription>
              </Alert>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertTitle>Email da Loja com Morada</AlertTitle>
                <AlertDescription>
                  Quando uma encomenda é feita, são enviados 2 emails: um para o cliente com confirmação e outro para <code>geral@fanzone12.pt</code> com todos os detalhes incluindo a morada de envio e telefone do cliente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Configuração SendGrid</CardTitle>
                <CardDescription>
                  Teste se a configuração do SendGrid está funcionando corretamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={async () => {
                    setLoading(true)
                    try {
                      const response = await fetch('/api/test-sendgrid-config')
                      const result = await response.json()
                      
                      if (result.success) {
                        toast({
                          title: "✅ Configuração OK",
                          description: "SendGrid está configurado corretamente e o email foi enviado com sucesso.",
                        })
                      } else {
                        toast({
                          title: "❌ Erro na Configuração",
                          description: result.error || "Erro desconhecido na configuração do SendGrid",
                          variant: "destructive"
                        })
                      }
                    } catch (error) {
                      toast({
                        title: "❌ Erro no Teste",
                        description: "Erro ao testar a configuração do SendGrid",
                        variant: "destructive"
                      })
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? "Testando..." : "Testar Configuração SendGrid"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 