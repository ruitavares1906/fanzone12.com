"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Users, 
  Mail, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Key,
  Shield
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Partner {
  id: string
  name: string
  email: string
  discount_code: string
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

interface PartnersResponse {
  partners: Partner[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function PartnersPage() {
  const { toast } = useToast()
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPartners, setTotalPartners] = useState(0)
  
  // Estados para o modal de criação/edição
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estados para gestão de senhas
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discount_code: "",
    password: "",
    is_active: true
  })

  useEffect(() => {
    fetchPartners()
  }, [currentPage, statusFilter, searchTerm])

  const fetchPartners = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
        search: searchTerm
      })

      const response = await fetch(`/api/admin/partners?${params}`)
      const data: PartnersResponse = await response.json()

      if (response.ok) {
        setPartners(data.partners)
        setTotalPages(data.pagination.pages)
        setTotalPartners(data.pagination.total)
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.error || "Erro ao carregar parceiros"
        })
      }
    } catch (error) {
      console.error("Erro ao buscar parceiros:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar parceiros"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePartner = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Parceiro ${data.partner.name} criado com sucesso`
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchPartners()
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.error || "Erro ao criar parceiro"
        })
      }
    } catch (error) {
      console.error("Erro ao criar parceiro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar parceiro"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditPartner = async () => {
    if (!editingPartner) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/partners/${editingPartner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Parceiro ${data.partner.name} atualizado com sucesso`
        })
        setIsEditModalOpen(false)
        setEditingPartner(null)
        resetForm()
        fetchPartners()
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.error || "Erro ao atualizar parceiro"
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar parceiro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar parceiro"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePartner = async (partner: Partner) => {
    if (!confirm(`Tem certeza que deseja deletar o parceiro ${partner.name}? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message || "Parceiro deletado com sucesso"
        })
        fetchPartners()
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.error || "Erro ao deletar parceiro"
        })
      }
    } catch (error) {
      console.error("Erro ao deletar parceiro:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao deletar parceiro"
      })
    }
  }

  // Funções para gestão de senhas
  const handleOpenPasswordModal = async (partner: Partner) => {
    setSelectedPartner(partner)
    setIsPasswordModalOpen(true)
    setIsLoadingAuth(true)
    setAuthInfo(null)
    setNewPassword("")

    try {
      const response = await fetch(`/api/admin/partners/${partner.id}/auth-info`)
      const data = await response.json()

      if (data.success) {
        setAuthInfo(data.authInfo)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar informações de autenticação",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar informações de autenticação:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar informações de autenticação",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const handleChangePassword = async () => {
    if (!selectedPartner || !newPassword || newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "Nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/partners/${selectedPartner.id}/auth-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Senha alterada",
          description: "Senha alterada com sucesso",
        })
        setIsPasswordModalOpen(false)
        setNewPassword("")
        setSelectedPartner(null)
        setAuthInfo(null)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao alterar senha",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error)
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      discount_code: "",
      password: "",
      is_active: true
    })
  }

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      email: partner.email,
      discount_code: partner.discount_code,
      password: "",
      is_active: partner.is_active
    })
    setIsEditModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredPartners = partners.filter(partner => {
    if (statusFilter === "all") return true
    if (statusFilter === "active") return partner.is_active
    if (statusFilter === "inactive") return !partner.is_active
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Gestão de Parceiros</h2>
          <p className="text-sm text-muted-foreground">
            Gerir parceiros, criar contas e controlar acesso
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Parceiro</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova conta de parceiro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do parceiro"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount_code">Código de Desconto</Label>
                <Input
                  id="discount_code"
                  value={formData.discount_code}
                  onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
                  placeholder="CODIGO10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Senha temporária"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePartner} disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Parceiro"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parceiros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {partners.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {partners.filter(p => !p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Login Recente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners.filter(p => p.last_login && new Date(p.last_login) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou código..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Parceiros */}
      <Card>
        <CardHeader>
          <CardTitle>Parceiros</CardTitle>
          <CardDescription>
            Lista de todos os parceiros registados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum parceiro encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{partner.name}</h3>
                      <Badge variant={partner.is_active ? "default" : "secondary"}>
                        {partner.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {partner.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {partner.discount_code}
                        </span>
                        {partner.last_login && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Último login: {formatDate(partner.last_login)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(partner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPasswordModal(partner)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Gerir senha"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePartner(partner)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({totalPartners} parceiros)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Parceiro</DialogTitle>
            <DialogDescription>
              Atualize os dados do parceiro {editingPartner?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do parceiro"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-discount_code">Código de Desconto</Label>
              <Input
                id="edit-discount_code"
                value={formData.discount_code}
                onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
                placeholder="CODIGO10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-is_active">Parceiro ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPartner} disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar Parceiro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Gestão de Senhas */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gestão de Senha
            </DialogTitle>
            <DialogDescription>
              Gerir a senha do parceiro {selectedPartner?.name}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingAuth ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : authInfo ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Informações de Autenticação</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> {authInfo.email}</p>
                  <p><strong>Email confirmado:</strong> {authInfo.emailConfirmed ? "Sim" : "Não"}</p>
                  <p><strong>Último login:</strong> {authInfo.lastSignIn ? new Date(authInfo.lastSignIn).toLocaleString() : "Nunca"}</p>
                  <p><strong>Criado em:</strong> {new Date(authInfo.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha (mín. 6 caracteres)"
                />
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Erro ao carregar informações</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              Cancelar
            </Button>
            {authInfo && (
              <Button 
                onClick={handleChangePassword}
                disabled={!newPassword || newPassword.length < 6}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Alterar Senha
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
