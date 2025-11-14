"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

interface Partner {
  id: string
  name: string
  discount_code: string
  email: string
  stats?: {
    monthly: {
      total: number
      commission: number
      rank: number
    }
    weekly: {
      total: number
      commission: number
    }
    total: {
      total: number
      commission: number
    }
  }
}

interface PartnerAuthContextType {
  partner: Partner | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshPartnerData: () => Promise<void>
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined)

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<Partner | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para buscar dados do parceiro
  const fetchPartnerData = async (user: User) => {
    try {
      console.log('Buscando dados do parceiro para user:', user.id)
      
      let session = null
      let accessToken = null
      
      // Tentar obter sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session = currentSession
      accessToken = currentSession?.access_token
      
      console.log('Session disponível:', !!session)
      console.log('Access token disponível:', !!accessToken)
      
      // Se não há access token, tentar renovar a sessão
      if (!accessToken) {
        console.log('Tentando renovar sessão...')
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
        if (refreshedSession?.access_token) {
          session = refreshedSession
          accessToken = refreshedSession.access_token
          console.log('Sessão renovada com sucesso')
        }
      }
      
      if (!accessToken) {
        console.log('Sem access token, não é possível buscar dados do parceiro')
        // Não definir partner como null para evitar logout
        return
      }
      
      const response = await fetch('/api/partners/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      console.log('Resposta da API /api/partners/me:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Dados recebidos:', data)
        console.log('Partner object:', data.partner)
        console.log('Stats object:', data.partner?.stats)
        
        if (data.success && data.partner) {
          console.log('Parceiro encontrado:', data.partner.name)
          console.log('Stats disponíveis:', !!data.partner.stats)
          console.log('Stats object:', data.partner.stats)
          console.log('Stats monthly:', data.partner.stats?.monthly)
          console.log('Definindo parceiro no estado...')
          setPartner(data.partner)
          console.log('Parceiro definido no estado')
        } else {
          console.log('Parceiro não encontrado ou dados inválidos')
          setPartner(null)
        }
      } else {
        const errorData = await response.json()
        console.error('Erro na API:', errorData)
        setPartner(null)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do parceiro:', error)
      setPartner(null)
    } finally {
      console.log('Finalizando busca de dados do parceiro')
    }
  }

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando login para:', email)
      const response = await fetch('/api/partners/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Resposta do login:', data)

      if (response.ok && data.success) {
        console.log('Login bem-sucedido, definindo dados...')
        console.log('Partner data:', data.partner)
        console.log('Partner stats:', data.partner.stats)
        setPartner(data.partner)
        setUser(data.user)
        console.log('Dados definidos no estado')
        return { success: true }
      } else {
        console.log('Erro no login:', data.error)
        return { success: false, error: data.error || 'Erro no login' }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      await fetch('/api/partners/auth', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setPartner(null)
      setUser(null)
      await supabase.auth.signOut()
    }
  }

  // Função para atualizar dados do parceiro
  const refreshPartnerData = async () => {
    if (user) {
      console.log('Atualizando dados do parceiro...')
      try {
        // Tentar obter sessão atual
        let session = null
        let accessToken = null
        
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        session = currentSession
        accessToken = currentSession?.access_token
        
        // Se não há access token, tentar renovar
        if (!accessToken) {
          console.log('Tentando renovar sessão para atualização...')
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
          if (refreshedSession?.access_token) {
            session = refreshedSession
            accessToken = refreshedSession.access_token
            console.log('Sessão renovada para atualização')
          }
        }
        
        if (accessToken) {
          console.log('Sessão ativa, buscando dados atualizados...')
          
          const response = await fetch('/api/partners/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            console.log('Dados atualizados recebidos:', data)
            
            if (data.success && data.partner) {
              console.log('Atualizando parceiro com novos dados...')
              setPartner(data.partner)
              console.log('Parceiro atualizado com sucesso')
            }
          } else {
            console.log('Erro ao buscar dados atualizados, mantendo dados atuais')
          }
        } else {
          console.log('Sessão não disponível, mantendo dados atuais')
        }
      } catch (error) {
        console.error('Erro ao atualizar dados:', error)
        // Não fazer logout em caso de erro, apenas mostrar mensagem
        console.log('Erro na atualização, mantendo dados atuais')
      }
    } else {
      console.log('Nenhum usuário disponível para atualizar dados')
    }
  }

  // Verificar sessão existente
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Verificando sessão inicial...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Sessão inicial:', !!session)
        console.log('User ID na sessão:', session?.user?.id)
        
        if (session?.user) {
          console.log('Usuário encontrado na sessão inicial:', session.user.id)
          setUser(session.user)
          // Buscar dados do parceiro apenas se a sessão estiver válida
          if (session.access_token) {
            console.log('Access token disponível, buscando dados do parceiro...')
            await fetchPartnerData(session.user)
          } else {
            console.log('Access token não disponível, tentando renovar sessão...')
            // Tentar renovar a sessão
            const { data: { session: newSession } } = await supabase.auth.refreshSession()
            if (newSession?.user) {
              console.log('Sessão renovada com sucesso')
              setUser(newSession.user)
              await fetchPartnerData(newSession.user)
            } else {
              console.log('Não foi possível renovar a sessão')
            }
          }
        } else {
          console.log('Nenhuma sessão encontrada')
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        console.log('Finalizando verificação de sessão, definindo loading como false')
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuário fez login, atualizando estado...')
          setUser(session.user)
          await fetchPartnerData(session.user)
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuário fez logout, limpando estado...')
          setUser(null)
          setPartner(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token renovado, mantendo sessão...')
          setUser(session.user)
          // Não buscar dados novamente se já temos parceiro
          if (!partner) {
            await fetchPartnerData(session.user)
          }
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('Sessão inicial detectada, mantendo login...')
          setUser(session.user)
          if (!partner) {
            await fetchPartnerData(session.user)
          }
        }
        console.log('Definindo loading como false após auth state change')
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    partner,
    user,
    loading,
    signIn,
    signOut,
    refreshPartnerData,
  }

  console.log('PartnerAuthProvider render - partner:', !!partner, 'user:', !!user, 'loading:', loading)
  
  // Verificar se há sessão ativa periodicamente (apenas em desenvolvimento)
  useEffect(() => {
    if (user && !partner) {
      console.log('Usuário logado mas sem dados do parceiro, tentando buscar...')
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchPartnerData(session.user)
        }
      }
      checkSession()
    }
  }, [user, partner])

  return (
    <PartnerAuthContext.Provider value={value}>
      {children}
    </PartnerAuthContext.Provider>
  )
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext)
  if (context === undefined) {
    throw new Error('usePartnerAuth deve ser usado dentro de um PartnerAuthProvider')
  }
  return context
}

