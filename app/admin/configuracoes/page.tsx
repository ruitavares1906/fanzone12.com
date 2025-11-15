"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Save, RefreshCw, CreditCard, Truck, Mail, ShoppingBag, Settings } from "lucide-react"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Configurações</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="geral">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="loja">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            <CreditCard className="h-4 w-4 mr-2" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="envios">
            <Truck className="h-4 w-4 mr-2" />
            Envios
          </TabsTrigger>
          <TabsTrigger value="emails">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Configurações básicas da sua loja online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Nome da Loja</Label>
                  <Input id="store-name" defaultValue="fanzone12.pt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-url">URL da Loja</Label>
                  <Input id="store-url" defaultValue="fanzone12.pt" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Descrição da Loja</Label>
                <Textarea
                  id="store-description"
                  defaultValue="A sua loja online de camisolas desportivas oficiais. Encontre camisolas de clubes e seleções nacionais."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email de Administração</Label>
                  <Input id="admin-email" defaultValue="sales@fanzone12.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email de Suporte</Label>
                  <Input id="support-email" defaultValue="sales@fanzone12.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+351 912 345 678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select defaultValue="eur">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dólar Americano ($)</SelectItem>
                      <SelectItem value="gbp">Libra Esterlina (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Links para as suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" defaultValue="https://www.facebook.com/profile.php?id=61582728350804" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">fanzone12.pt__</Label>
                  <Input id="instagram" defaultValue="https://instagram.com/fanzone12.pt__" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input id="tiktok" defaultValue="https://www.tiktok.com/@fanzone12.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" defaultValue="https://wa.me/351934244455" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" defaultValue="https://twitter.com/camisolasdesp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input id="youtube" defaultValue="" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loja" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>Configurações gerais da sua loja online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tax-enabled">Mostrar preços com impostos</Label>
                  <p className="text-sm text-muted-foreground">Exibir preços com impostos incluídos</p>
                </div>
                <Switch id="tax-enabled" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stock-management">Gestão de estoque</Label>
                  <p className="text-sm text-muted-foreground">Ativar gestão de estoque para produtos</p>
                </div>
                <Switch id="stock-management" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviews">Avaliações de produtos</Label>
                  <p className="text-sm text-muted-foreground">Permitir que clientes avaliem produtos</p>
                </div>
                <Switch id="reviews" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="products-per-page">Produtos por página</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="products-per-page">
                    <SelectValue placeholder="Selecione a quantidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 produtos</SelectItem>
                    <SelectItem value="12">12 produtos</SelectItem>
                    <SelectItem value="16">16 produtos</SelectItem>
                    <SelectItem value="24">24 produtos</SelectItem>
                    <SelectItem value="30">30 produtos</SelectItem>
                    <SelectItem value="36">36 produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalização</CardTitle>
              <CardDescription>Configurações de personalização da loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input id="primary-color" defaultValue="#10b981" type="color" className="w-16 h-10" />
                  <Input defaultValue="#10b981" className="flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>Configure os métodos de pagamento disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <img src="/images/payment-stripe.webp" alt="Stripe" className="h-8 w-auto" />
                  <div>
                    <h4 className="font-medium">Stripe</h4>
                    <p className="text-sm text-muted-foreground">Aceite cartões de crédito/débito</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <img src="/images/payment-paypal.webp" alt="PayPal" className="h-8 w-auto" />
                  <div>
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-muted-foreground">Pagamentos via PayPal</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <img src="/images/payment-multibanco.webp" alt="Multibanco" className="h-8 w-auto" />
                  <div>
                    <h4 className="font-medium">Multibanco</h4>
                    <p className="text-sm text-muted-foreground">Referências Multibanco</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <img src="/images/payment-mbway.webp" alt="MB WAY" className="h-8 w-auto" />
                  <div>
                    <h4 className="font-medium">MB WAY</h4>
                    <p className="text-sm text-muted-foreground">Pagamentos via MB WAY</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img src="/images/payment-transfer.webp" alt="Transferência Bancária" className="h-8 w-auto" />
                  <div>
                    <h4 className="font-medium">Transferência Bancária</h4>
                    <p className="text-sm text-muted-foreground">Pagamentos por transferência</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="envios" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Envio</CardTitle>
              <CardDescription>Configure os métodos de envio disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">CTT</h4>
                  <p className="text-sm text-muted-foreground">Envio standard via CTT</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="4.99" className="w-20" />
                  <span>€</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">CTT Expresso</h4>
                  <p className="text-sm text-muted-foreground">Envio expresso via CTT</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="7.99" className="w-20" />
                  <span>€</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">DHL</h4>
                  <p className="text-sm text-muted-foreground">Envio internacional via DHL</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="12.99" className="w-20" />
                  <span>€</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Levantamento na Loja</h4>
                  <p className="text-sm text-muted-foreground">Cliente levanta na loja física</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input defaultValue="0.00" className="w-20" />
                  <span>€</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Envio</CardTitle>
              <CardDescription>Configurações gerais para envios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="free-shipping">Envio gratuito</Label>
                  <p className="text-sm text-muted-foreground">Ativar envio gratuito para pedidos acima de um valor</p>
                </div>
                <Switch id="free-shipping" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-shipping-threshold">Valor mínimo para envio gratuito</Label>
                <div className="flex items-center gap-2">
                  <Input id="free-shipping-threshold" defaultValue="50.00" />
                  <span>€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>Configure os emails enviados pela loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-provider">Provedor de Email</Label>
                <Select defaultValue="sendgrid">
                  <SelectTrigger id="email-provider">
                    <SelectValue placeholder="Selecione o provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailchimp">Mailchimp</SelectItem>
                    <SelectItem value="smtp">SMTP Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-name">Nome do Remetente</Label>
                <Input id="sender-name" defaultValue="fanzone12.pt" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-email">Email do Remetente</Label>
                <Input id="sender-email" defaultValue="sales@fanzone12.com" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modelos de Email</CardTitle>
              <CardDescription>Configure os modelos de email enviados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Confirmação de Pedido</h4>
                  <p className="text-sm text-muted-foreground">Enviado quando um pedido é realizado</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Confirmação de Pagamento</h4>
                  <p className="text-sm text-muted-foreground">Enviado quando um pagamento é confirmado</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Envio de Pedido</h4>
                  <p className="text-sm text-muted-foreground">Enviado quando um pedido é enviado</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Boas-vindas</h4>
                  <p className="text-sm text-muted-foreground">Enviado quando um cliente se registra</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
