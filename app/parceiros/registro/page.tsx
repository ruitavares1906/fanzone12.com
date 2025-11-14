import { PartnerAuthProvider } from "@/components/partner-auth-provider"
import { PartnerRegisterForm } from "@/components/partner-register-form"
import Link from "next/link"

export default function ParceirosRegistroPage() {
  return (
    <PartnerAuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Registo de Parceiro</h1>
            <p className="mt-2 text-sm text-gray-600">
              Já tens conta?{" "}
              <Link href="/parceiros" className="font-medium text-primary hover:underline">
                Faz login aqui
              </Link>
            </p>
          </div>
          
          <PartnerRegisterForm />
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </PartnerAuthProvider>
  )
}

