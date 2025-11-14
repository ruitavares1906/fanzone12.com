"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import type { ReactNode } from "react"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any; success: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: any; success: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Função para obter a sessão atual
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // Obter sessão atual
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao obter sessão:", error)
          setSession(null)
          setUser(null)
        } else if (data.session) {
          console.log("Sessão encontrada")
          setSession(data.session)
          setUser(data.session.user)
        } else {
          console.log("Nenhuma sessão encontrada")
          setSession(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error)
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Inicializar autenticação
    initializeAuth()

    // Configurar listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Evento de autenticação:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(newSession)
        setUser(newSession?.user ?? null)
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setUser(null)
      }

      setIsLoading(false)
    })

    // Limpar subscription quando o componente for desmontado
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata: any) => {
    setIsLoading(true)
    console.log("Tentando registrar usuário:", email)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        console.error("Erro no registro:", error)
        return { error, success: false }
      }

      console.log("Registro bem-sucedido:", data)
      return { error: null, success: true }
    } catch (error: any) {
      console.error("Erro inesperado no registro:", error)
      return { error, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    console.log("Tentando fazer login:", email)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro no login:", error)
        return { error, success: false }
      }

      console.log("Login bem-sucedido:", data.user?.id)
      setSession(data.session)
      setUser(data.user)
      return { error: null, success: true }
    } catch (error: any) {
      console.error("Erro inesperado no login:", error)
      return { error, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    console.log("Fazendo logout")

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
      } else {
        setSession(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Erro inesperado ao fazer logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
