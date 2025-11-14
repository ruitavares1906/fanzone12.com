-- Tabela para candidaturas de parceiros
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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas_parceiros(status);
CREATE INDEX IF NOT EXISTS idx_candidaturas_data ON candidaturas_parceiros(data_candidatura);
CREATE INDEX IF NOT EXISTS idx_candidaturas_email ON candidaturas_parceiros(email);

-- Tabela para histórico de status das candidaturas
CREATE TABLE IF NOT EXISTS candidaturas_historico (
    id SERIAL PRIMARY KEY,
    candidatura_id INTEGER REFERENCES candidaturas_parceiros(id) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    motivo TEXT,
    usuario_responsavel VARCHAR(255),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para histórico
CREATE INDEX IF NOT EXISTS idx_historico_candidatura ON candidaturas_historico(candidatura_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidaturas_updated_at 
    BEFORE UPDATE ON candidaturas_parceiros 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar mudanças de status no histórico
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

CREATE TRIGGER candidaturas_status_history 
    AFTER UPDATE ON candidaturas_parceiros 
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- Inserir dados de exemplo (opcional)
INSERT INTO candidaturas_parceiros (
    nome, email, telefone, instagram, tiktok, 
    seguidores, visualizacoes, experiencia, motivacao, status
) VALUES (
    'João Silva', 
    'joao@exemplo.com', 
    '+351 123 456 789', 
    '@joaosilva', 
    '@joaosilva_tiktok', 
    15000, 
    50000, 
    'Tenho experiência com marketing digital há 3 anos', 
    'Quero ser parceiro porque acredito no potencial da Fanzone12', 
    'pendente'
) ON CONFLICT DO NOTHING;

-- View para estatísticas das candidaturas
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

-- View para candidaturas recentes
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

-- Comentários nas tabelas
COMMENT ON TABLE candidaturas_parceiros IS 'Tabela para armazenar candidaturas de parceiros';
COMMENT ON COLUMN candidaturas_parceiros.status IS 'Status da candidatura: pendente, aprovada, rejeitada, em_analise';
COMMENT ON COLUMN candidaturas_parceiros.codigo_parceiro IS 'Código único gerado quando aprovado';
COMMENT ON TABLE candidaturas_historico IS 'Histórico de mudanças de status das candidaturas';
