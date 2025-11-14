import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL é necessário")
}

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY é necessário para operações de administrador")
}

// Cliente Supabase com service role key para webhooks e operações de servidor
// Esta chave bypassa RLS (Row Level Security) e deve ser usada apenas no servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log("=== CONFIGURAÇÃO SUPABASE ADMIN ===")
console.log("URL configurada:", !!supabaseUrl)
console.log("Service Role Key configurada:", !!supabaseServiceKey)
console.log("Service Role Key length:", supabaseServiceKey?.length || 0) 