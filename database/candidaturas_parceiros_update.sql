-- Verificar se as tabelas já existem e criar apenas se necessário

-- Tabela para candidaturas de parceiros (apenas se não existir)
CREATE TABLE IF NOT EXISTS candidaturas_parceiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    instagram VARCHAR(255),
    tiktok VARCHAR(255),
    seguidores INTEGER NOT NULL,
    visualizacoes INTEGER NOT NULL,
    experiencia TEXT,
    motivacao TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'em_analise')),
    data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_analise TIMESTAMP,
    notas_analise TEXT,
    codigo_parceiro VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para histórico de status das candidaturas (apenas se não existir)
CREATE TABLE IF NOT EXISTS candidaturas_historico (
    id SERIAL PRIMARY KEY,
    candidatura_id INTEGER REFERENCES candidaturas_parceiros(id) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    motivo TEXT,
    usuario_responsavel VARCHAR(255),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance (apenas se não existirem)
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas_parceiros(status);
CREATE INDEX IF NOT EXISTS idx_candidaturas_data ON candidaturas_parceiros(data_candidatura);
CREATE INDEX IF NOT EXISTS idx_candidaturas_email ON candidaturas_parceiros(email);
CREATE INDEX IF NOT EXISTS idx_historico_candidatura ON candidaturas_historico(candidatura_id);

-- Função para atualizar updated_at (apenas se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at (apenas se não existir)
DROP TRIGGER IF EXISTS update_candidaturas_updated_at ON candidaturas_parceiros;
CREATE TRIGGER update_candidaturas_updated_at 
    BEFORE UPDATE ON candidaturas_parceiros 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para registrar mudanças de status (apenas se não existir)
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO candidaturas_historico (
            candidatura_id, 
            status_anterior, 
            status_novo, 
            data_alteracao
        ) VALUES (
            NEW.id, 
            OLD.status, 
            NEW.status, 
            CURRENT_TIMESTAMP
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para registrar mudanças de status (apenas se não existir)
DROP TRIGGER IF EXISTS candidaturas_status_history ON candidaturas_parceiros;
CREATE TRIGGER candidaturas_status_history 
    AFTER UPDATE ON candidaturas_parceiros 
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- View para estatísticas das candidaturas (apenas se não existir)
CREATE OR REPLACE VIEW candidaturas_stats AS
SELECT 
    status,
    COUNT(*) as total,
    AVG(seguidores) as media_seguidores,
    AVG(visualizacoes) as media_visualizacoes,
    MIN(data_candidatura) as primeira_candidatura,
    MAX(data_candidatura) as ultima_candidatura
FROM candidaturas_parceiros 
GROUP BY status;

-- View para candidaturas recentes (apenas se não existir)
CREATE OR REPLACE VIEW candidaturas_recentes AS
SELECT 
    id,
    nome,
    email,
    instagram,
    tiktok,
    seguidores,
    visualizacoes,
    status,
    data_candidatura
FROM candidaturas_parceiros 
WHERE data_candidatura >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY data_candidatura DESC;

-- Verificar se tudo foi criado corretamente
SELECT 
    'Tabelas criadas com sucesso!' as status,
    COUNT(*) as total_tabelas
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%candidatura%';
