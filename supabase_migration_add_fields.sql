-- Migração para adicionar novos campos à tabela pericias

-- Adicionar campos de Informações Adicionais do Processo
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS data_admissao DATE;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS data_demissao DATE;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS horario_pericia TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS local_pericia TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS funcao_reclamante TEXT;

-- Adicionar campos de Descrição de Ambientes e Atividades
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS descricao_ambientes TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS descricao_atividades TEXT;

-- Adicionar campo de Riscos Ergonômicos
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS riscos_ergonomicos TEXT;

-- Adicionar campo de Checklist de Documentação (JSONB para armazenar objeto)
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS documentacao JSONB DEFAULT '{
  "pca": false,
  "ppr": false,
  "laudo_insalubridade": false,
  "laudo_periculosidade": false,
  "pgr": false,
  "pcmso": false,
  "ltcat": false,
  "ordens_servico": false,
  "ppp": false,
  "avaliacoes_dosimetria": false,
  "fispqs": false,
  "ficha_entrega_epis": false
}'::jsonb;

-- Adicionar campo de EPIs (array de objetos JSONB)
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS epis JSONB DEFAULT '[]'::jsonb;

-- Adicionar campos adicionais que podem estar faltando
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS resumo_caso TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS objetivo_determinar_insalubridade BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS objetivo_determinar_periculosidade BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS objetivo_avaliar_exposicao BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS objetivo_outros TEXT;

ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerente_cargo TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerente_setor TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerente_endereco TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerente_telefone TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerente_email TEXT;

ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerida_cargo TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerida_setor TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerida_endereco TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerida_telefone TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS requerida_email TEXT;

ALTER TABLE pericias ADD COLUMN IF NOT EXISTS perito_profissao_formacao TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS perito_experiencia TEXT;

ALTER TABLE pericias ADD COLUMN IF NOT EXISTS metodo_inspecao_local BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS metodo_medicoes_ambientais BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS metodo_analise_documentos BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS metodo_entrevistas BOOLEAN DEFAULT false;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS metodo_outros TEXT;
ALTER TABLE pericias ADD COLUMN IF NOT EXISTS procedimentos_avaliacao TEXT;

ALTER TABLE pericias ADD COLUMN IF NOT EXISTS observacoes_finais TEXT;

-- Comentários nas novas colunas
COMMENT ON COLUMN pericias.data_admissao IS 'Data de admissão do trabalhador';
COMMENT ON COLUMN pericias.data_demissao IS 'Data de demissão do trabalhador';
COMMENT ON COLUMN pericias.horario_pericia IS 'Horário da realização da perícia';
COMMENT ON COLUMN pericias.local_pericia IS 'Local onde será realizada a perícia';
COMMENT ON COLUMN pericias.funcao_reclamante IS 'Função/cargo exercido pelo reclamante';
COMMENT ON COLUMN pericias.descricao_ambientes IS 'Descrição detalhada dos ambientes de trabalho';
COMMENT ON COLUMN pericias.descricao_atividades IS 'Descrição das atividades laborais realizadas';
COMMENT ON COLUMN pericias.riscos_ergonomicos IS 'Detalhamento dos riscos ergonômicos identificados';
COMMENT ON COLUMN pericias.documentacao IS 'Checklist de documentação verificada (formato JSONB)';
COMMENT ON COLUMN pericias.epis IS 'Lista de EPIs com tipo, CA e validade (formato JSONB)';
