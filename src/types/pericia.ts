export type InsalubridadeGrau = 'minimo' | 'medio' | 'maximo';
export type PericiaStatus = 'andamento' | 'concluida' | 'arquivada';
export type TipoDocumento = 'foto' | 'laudo' | 'relatorio' | 'outro';

export interface Participante {
  nome: string;
  cargo: string;
  tipo: string; // livre para não restringir o preenchimento
  observacoes?: string;
  falas?: string;
}

export interface Pericia {
  id: string;
  processo_numero: string;
  vara: string;
  comarca: string;
  
  // Informações do Caso
  resumo_caso?: string;
  objetivo_determinar_insalubridade?: boolean;
  objetivo_determinar_periculosidade?: boolean;
  objetivo_avaliar_exposicao?: boolean;
  objetivo_outros?: string;
  
  // Partes - Requerente
  parte_requerente: string;
  requerente_cargo?: string;
  requerente_setor?: string;
  requerente_endereco?: string;
  requerente_telefone?: string;
  requerente_email?: string;
  
  // Partes - Requerida
  parte_requerida: string;
  requerida_cargo?: string;
  requerida_setor?: string;
  requerida_endereco?: string;
  requerida_telefone?: string;
  requerida_email?: string;
  
  // Perito
  perito_nome: string;
  perito_especialidade: string;
  perito_profissao_formacao?: string;
  perito_experiencia?: string;
  data_nomeacao: string;
  data_pericia: string;
  
  // Metodologia
  metodo_inspecao_local?: boolean;
  metodo_medicoes_ambientais?: boolean;
  metodo_analise_documentos?: boolean;
  metodo_entrevistas?: boolean;
  metodo_outros?: string;
  procedimentos_avaliacao?: string;
  
  // Ambiente
  objetivo: string;
  local_inspecionado: string;
  setor: string;
  atividade_realizada: string;
  agentes_quimicos?: string;
  agentes_fisicos?: string;
  agentes_biologicos?: string;
  condicoes_perigosas?: string;
  
  // Conclusões
  existe_insalubridade: boolean;
  grau_insalubridade?: InsalubridadeGrau;
  existe_periculosidade: boolean;
  risco_periculosidade?: string;
  parecer_perito?: string;
  
  // Observações
  observacoes_finais?: string;
  
  // Metadata
  participantes: Participante[];
  status: PericiaStatus;
  owner?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentoPericia {
  id: string;
  pericia_id: string;
  tipo: TipoDocumento;
  nome_arquivo: string;
  url_storage: string;
  created_at?: string;
}
