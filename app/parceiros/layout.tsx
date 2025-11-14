import { PartnerAuthProvider } from "@/components/partner-auth-provider"

export default function ParceirosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PartnerAuthProvider>
      {children}
    </PartnerAuthProvider>
  )
}

