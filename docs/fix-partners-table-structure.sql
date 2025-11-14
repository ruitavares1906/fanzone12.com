-- =====================================================
-- CORREÇÃO DA ESTRUTURA DA TABELA PARTNERS
-- =====================================================
-- Execute este script no Supabase SQL Editor para corrigir a estrutura da tabela

-- 1. Verificar se a tabela partners existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'partners') THEN
        -- Criar tabela partners se não existir
        CREATE TABLE partners (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT UNIQUE NOT NULL,
            discount_code TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índices
        CREATE INDEX IF NOT EXISTS idx_partners_discount_code ON partners(discount_code);
        
        RAISE NOTICE 'Tabela partners criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela partners já existe';
    END IF;
END $$;

-- 2. Adicionar colunas necessárias para autenticação
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);

-- 4. Habilitar RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas existentes para evitar duplicação
DROP POLICY IF EXISTS "Parceiros podem ver apenas seus próprios dados" ON partners;
DROP POLICY IF EXISTS "Parceiros podem atualizar apenas seus próprios dados" ON partners;
DROP POLICY IF EXISTS "Admins podem ver todos os parceiros" ON partners;
DROP POLICY IF EXISTS "Parceiros podem inserir seus próprios dados" ON partners;

-- 6. Criar políticas de segurança
-- Política para parceiros verem apenas seus próprios dados
CREATE POLICY "Parceiros podem ver apenas seus próprios dados"
  ON partners FOR SELECT
  USING (auth.uid() = user_id);

-- Política para parceiros atualizarem apenas seus próprios dados
CREATE POLICY "Parceiros podem atualizar apenas seus próprios dados"
  ON partners FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para parceiros inserirem seus próprios dados
CREATE POLICY "Parceiros podem inserir seus próprios dados"
  ON partners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para admins verem todos os parceiros
CREATE POLICY "Admins podem ver todos os parceiros"
  ON partners FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 7. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_partners_updated_at ON partners;
CREATE TRIGGER trigger_update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_partners_updated_at();

-- 9. Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'partners' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Verificar se há dados
SELECT COUNT(*) as total_partners FROM partners;

-- Mensagem de sucesso
SELECT 'Estrutura da tabela partners corrigida com sucesso!' as status;
