"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Search, Calendar, ArrowUpDown, UserPlus, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function ClientesPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortField, setSortField] = useState<"created_at" | "last_order" | "total_spent">("created_at")

  useEffect(() => {
    fetchCustomers()
  }, [sortOrder, sortField])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)

      // Em um sistema real, você teria uma tabela de clientes
      // Aqui estamos simulando dados para demonstração
      const mockCustomers = [
        {
          id: "1",
          first_name: "João",
          last_name: "Silva",
          email: "joao.silva@exemplo.com",
          phone: "+351 912 345 678",
          created_at: "2023-10-15T14:30:00Z",
          last_order: "2023-11-20T10:15:00Z",
          total_spent: 245.9,
          total_orders: 3,
          status: "active",
        },
        {
          id: "2",
          first_name: "Maria",
          last_name: "Santos",
          email: "maria.santos@exemplo.com",
          phone: "+351 923 456 789",
          created_at: "2023-09-05T09:45:00Z",
          last_order: "2023-11-25T16:20:00Z",
          total_spent: 389.5,
          total_orders: 5,
          status: "active",
        },
        {
          id: "3",
          first_name: "António",
          last_name: "Ferreira",
          email: "antonio.ferreira@exemplo.com",
          phone: "+351 934 567 890",
          created_at: "2023-11-10T11:20:00Z",
          last_order: "2023-11-10T11:20:00Z",
          total_spent: 79.99,
          total_orders: 1,
          status: "active",
        },
        {
          id: "4",
          first_name: "Ana",
          last_name: "Oliveira",
          email: "ana.oliveira@exemplo.com",
          phone: "+351 945 678 901",
          created_at: "2023-08-20T15:10:00Z",
          last_order: "2023-11-15T14:30:00Z",
          total_spent: 532.75,
          total_orders: 7,
          status: "active",
        },
        {
          id: "5",
          first_name: "Pedro",
          last_name: "Costa",
          email: "pedro.costa@exemplo.com",
          phone: "+351 956 789 012",
          created_at: "2023-10-25T13:40:00Z",
          last_order: "2023-11-05T09:15:00Z",
          total_spent: 159.8,
          total_orders: 2,
          status: "inactive",
        },
      ]

      // Ordenar os clientes
      const sortedCustomers = [...mockCustomers].sort((a, b) => {
        if (sortField === "created_at") {
          return sortOrder === "asc"
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        } else if (sortField === "last_order") {
          return sortOrder === "asc"
            ? new Date(a.last_order).getTime() - new Date(b.last_order).getTime()
            : new Date(b.last_order).getTime() - new Date(a.last_order).getTime()
        } else if (sortField === "total_spent") {
          return sortOrder === "asc" ? a.total_spent - b.total_spent : b.total_spent - a.total_spent
        }
        return 0
      })

      setCustomers(sortedCustomers)
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error.message)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestão de Clientes</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortField("created_at")
              setSortOrder(sortOrder === "desc" ? "asc" : "desc")
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Data Registo {sortOrder === "desc" ? "↓" : "↑"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortField("total_spent")
              setSortOrder(sortOrder === "desc" ? "asc" : "desc")
            }}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Total Gasto {sortOrder === "desc" ? "↓" : "↑"}
          </Button>
          <Button variant="default" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou telefone..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="new">Novos (últimos 30 dias)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <CustomersTable customers={filteredCustomers} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <CustomersTable customers={filteredCustomers.filter((c) => c.status === "active")} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="inactive" className="mt-0">
          <CustomersTable customers={filteredCustomers.filter((c) => c.status === "inactive")} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface CustomersTableProps {
  customers: any[]
  isLoading: boolean
}

function CustomersTable({ customers, isLoading }: CustomersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contacto</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data Registo</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Último Pedido</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total Gasto</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pedidos</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">{new Date(customer.created_at).toLocaleDateString("pt-PT")}</td>
                  <td className="p-4 whitespace-nowrap">{new Date(customer.last_order).toLocaleDateString("pt-PT")}</td>
                  <td className="p-4 font-medium">€{customer.total_spent.toFixed(2)}</td>
                  <td className="p-4 text-center">{customer.total_orders}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/clientes/${customer.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
