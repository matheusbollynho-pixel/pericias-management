-- Criar tabela de perícias
CREATE TABLE IF NOT EXISTS pericias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_numero TEXT NOT NULL,
  vara TEXT NOT NULL,
  comarca TEXT,
  parte_requerente TEXT,
  parte_requerida TEXT,
  perito_nome TEXT,
  perito_especialidade TEXT,
  data_nomeacao DATE,
  data_pericia DATE,
  objetivo TEXT,
  local_inspecionado TEXT,
  setor TEXT,
  atividade_realizada TEXT,
  agentes_quimicos TEXT,
  agentes_fisicos TEXT,
  agentes_biologicos TEXT,
  condicoes_perigosas TEXT,
  existe_insalubridade BOOLEAN DEFAULT false,
  grau_insalubridade TEXT CHECK (grau_insalubridade IN ('minimo', 'medio', 'maximo')),
  existe_periculosidade BOOLEAN DEFAULT false,
  risco_periculosidade TEXT,
  parecer_perito TEXT,
  participantes JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'andamento' CHECK (status IN ('andamento', 'concluida', 'arquivada')),
  owner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de documentos da perícia
CREATE TABLE IF NOT EXISTS documentos_pericia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pericia_id UUID NOT NULL REFERENCES pericias(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('foto', 'laudo', 'relatorio', 'outro')),
  nome_arquivo TEXT NOT NULL,
  url_storage TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pericias_processo ON pericias(processo_numero);
CREATE INDEX IF NOT EXISTS idx_pericias_status ON pericias(status);
CREATE INDEX IF NOT EXISTS idx_pericias_created ON pericias(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documentos_pericia ON documentos_pericia(pericia_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pericias_updated_at
  BEFORE UPDATE ON pericias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE pericias ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_pericia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir tudo por enquanto - ajustar com autenticação depois)
CREATE POLICY "Permitir tudo em pericias" ON pericias FOR ALL USING (true);
CREATE POLICY "Permitir tudo em documentos" ON documentos_pericia FOR ALL USING (true);

-- Comentários nas tabelas
COMMENT ON TABLE pericias IS 'Tabela principal de perícias judiciais de insalubridade e periculosidade';
COMMENT ON TABLE documentos_pericia IS 'Documentos anexados às perícias (fotos, laudos, relatórios)';
