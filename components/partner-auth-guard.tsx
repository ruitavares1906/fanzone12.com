"use client"

import { usePartnerAuth } from "./partner-auth-provider"
import { PartnerLoginForm } from "./partner-login-form"
import { PartnerDashboard } from "./partner-dashboard"
import { Loader2 } from "lucide-react"

interface PartnerAuthGuardProps {
  children?: React.ReactNode
}

export function PartnerAuthGuard({ children }: PartnerAuthGuardProps) {
  const { partner, loading } = usePartnerAuth()

  console.log('PartnerAuthGuard - loading:', loading)
  console.log('PartnerAuthGuard - partner:', partner)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>A carregar...</span>
        </div>
      </div>
    )
  }

  if (!partner) {
    console.log('PartnerAuthGuard - mostrando formulário de login')
    return <PartnerLoginForm />
  }

  console.log('PartnerAuthGuard - mostrando dashboard do parceiro')
  return (
    <div className="space-y-6">
      <PartnerDashboard />
      {children}
    </div>
  )
}

