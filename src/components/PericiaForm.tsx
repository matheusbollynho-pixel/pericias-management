import { useState } from 'react';
import type { Pericia, Participante, InsalubridadeGrau } from '../types/pericia';
import { X, Plus, Trash2 } from 'lucide-react';

interface PericiaFormProps {
  onClose: () => void;
  onSubmit: (pericia: any) => void;
  initialData?: Pericia;
  defaultPeritoNome?: string;
}

export default function PericiaForm({ onClose, onSubmit, initialData, defaultPeritoNome }: PericiaFormProps) {
  const [participantes, setParticipantes] = useState<Participante[]>(initialData?.participantes || []);
  const [formData, setFormData] = useState({
    processo_numero: initialData?.processo_numero || '',
    vara: initialData?.vara || '',
    comarca: initialData?.comarca || '',
    
    // Informações do Caso
    resumo_caso: initialData?.resumo_caso || '',
    objetivo_determinar_insalubridade: initialData?.objetivo_determinar_insalubridade ?? true,
    objetivo_determinar_periculosidade: initialData?.objetivo_determinar_periculosidade ?? false,
    objetivo_avaliar_exposicao: initialData?.objetivo_avaliar_exposicao ?? false,
    objetivo_outros: initialData?.objetivo_outros || '',
    
    // Partes - Requerente
    parte_requerente: initialData?.parte_requerente || '',
    requerente_cargo: initialData?.requerente_cargo || '',
    requerente_setor: initialData?.requerente_setor || '',
    requerente_endereco: initialData?.requerente_endereco || '',
    requerente_telefone: initialData?.requerente_telefone || '',
    requerente_email: initialData?.requerente_email || '',
    
    // Partes - Requerida
    parte_requerida: initialData?.parte_requerida || '',
    requerida_cargo: initialData?.requerida_cargo || '',
    requerida_setor: initialData?.requerida_setor || '',
    requerida_endereco: initialData?.requerida_endereco || '',
    requerida_telefone: initialData?.requerida_telefone || '',
    requerida_email: initialData?.requerida_email || '',
    
    // Perito
    perito_nome: initialData?.perito_nome || defaultPeritoNome || '',
    perito_especialidade: initialData?.perito_especialidade || 'Médico do Trabalho',
    perito_profissao_formacao: initialData?.perito_profissao_formacao || '',
    perito_experiencia: initialData?.perito_experiencia || '',
    data_nomeacao: initialData?.data_nomeacao || '',
    data_pericia: initialData?.data_pericia || '',
    
    // Metodologia
    metodo_inspecao_local: initialData?.metodo_inspecao_local ?? true,
    metodo_medicoes_ambientais: initialData?.metodo_medicoes_ambientais ?? false,
    metodo_analise_documentos: initialData?.metodo_analise_documentos ?? false,
    metodo_entrevistas: initialData?.metodo_entrevistas ?? false,
    metodo_outros: initialData?.metodo_outros || '',
    procedimentos_avaliacao: initialData?.procedimentos_avaliacao || '',
    
    // Ambiente
    objetivo: initialData?.objetivo || 'insalubridade',
    local_inspecionado: initialData?.local_inspecionado || '',
    setor: initialData?.setor || '',
    atividade_realizada: initialData?.atividade_realizada || '',
    agentes_quimicos: initialData?.agentes_quimicos || '',
    agentes_fisicos: initialData?.agentes_fisicos || '',
    agentes_biologicos: initialData?.agentes_biologicos || '',
    condicoes_perigosas: initialData?.condicoes_perigosas || '',
    
    // Conclusões
    existe_insalubridade: initialData?.existe_insalubridade || false,
    grau_insalubridade: initialData?.grau_insalubridade || ('medio' as InsalubridadeGrau),
    existe_periculosidade: initialData?.existe_periculosidade || false,
    risco_periculosidade: initialData?.risco_periculosidade || '',
    parecer_perito: initialData?.parecer_perito || '',
    
    // Observações
    observacoes_finais: initialData?.observacoes_finais || '',
    
    // Metadata
    status: initialData?.status || ('andamento' as const),
  });

  const handleAddParticipante = () => {
    setParticipantes([...participantes, {
      nome: '',
      cargo: '',
      tipo: '',
      observacoes: '',
      falas: '',
    }]);
  };

  const handleRemoveParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index));
  };

  const handleParticipanteChange = (index: number, field: keyof Participante, value: string) => {
    const newParticipantes = [...participantes];
    newParticipantes[index] = { ...newParticipantes[index], [field]: value };
    setParticipantes(newParticipantes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      participantes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Editar Perícia' : 'Nova Perícia Judicial'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Seção I: Informações do Processo e Caso */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              I. Informações do Processo e do Caso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                  <option value="arquivada">Arquivada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processo nº *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.processo_numero}
                  onChange={(e) => setFormData({ ...formData, processo_numero: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vara *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.vara}
                  onChange={(e) => setFormData({ ...formData, vara: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comarca *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.comarca}
                  onChange={(e) => setFormData({ ...formData, comarca: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo do Caso
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Breve resumo do caso..."
                value={formData.resumo_caso}
                onChange={(e) => setFormData({ ...formData, resumo_caso: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo da Perícia
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.objetivo_determinar_insalubridade}
                    onChange={(e) => setFormData({ ...formData, objetivo_determinar_insalubridade: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Determinar a existência de insalubridade</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.objetivo_determinar_periculosidade}
                    onChange={(e) => setFormData({ ...formData, objetivo_determinar_periculosidade: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Determinar a existência de periculosidade</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.objetivo_avaliar_exposicao}
                    onChange={(e) => setFormData({ ...formData, objetivo_avaliar_exposicao: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Apreciar os níveis de exposição a agentes insalubres ou perigosos</span>
                </label>
                <input
                  type="text"
                  placeholder="Outros objetivos (especificar)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.objetivo_outros}
                  onChange={(e) => setFormData({ ...formData, objetivo_outros: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Seção II: Partes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              II. Identificação das Partes
            </h3>
            
            {/* Parte Requerente */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-900">Parte Requerente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.parte_requerente}
                    onChange={(e) => setFormData({ ...formData, parte_requerente: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo/Função
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerente_cargo}
                    onChange={(e) => setFormData({ ...formData, requerente_cargo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Setor/Departamento
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerente_setor}
                    onChange={(e) => setFormData({ ...formData, requerente_setor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerente_telefone}
                    onChange={(e) => setFormData({ ...formData, requerente_telefone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            {/* Parte Requerida */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-900">Parte Requerida</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.parte_requerida}
                    onChange={(e) => setFormData({ ...formData, parte_requerida: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo/Função
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerida_cargo}
                    onChange={(e) => setFormData({ ...formData, requerida_cargo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Setor/Departamento
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerida_setor}
                    onChange={(e) => setFormData({ ...formData, requerida_setor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.requerida_telefone}
                    onChange={(e) => setFormData({ ...formData, requerida_telefone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção III: Perito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              III. Informações do Perito
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Perito *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.perito_nome}
                  onChange={(e) => setFormData({ ...formData, perito_nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.perito_especialidade}
                  onChange={(e) => setFormData({ ...formData, perito_especialidade: e.target.value })}
                >
                  <option>Médico do Trabalho</option>
                  <option>Engenheiro de Segurança do Trabalho</option>
                  <option>Especialista em Perícias Técnicas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Nomeação *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.data_nomeacao}
                  onChange={(e) => setFormData({ ...formData, data_nomeacao: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissão e Formação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Engenheiro Civil, CRM 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.perito_profissao_formacao}
                  onChange={(e) => setFormData({ ...formData, perito_profissao_formacao: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiência e Especialização
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve descrição da experiência relevante..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.perito_experiencia}
                  onChange={(e) => setFormData({ ...formData, perito_experiencia: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Seção IV: Metodologia e Procedimentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              IV. Metodologia e Procedimentos
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Métodos Utilizados para a Perícia
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.metodo_inspecao_local}
                    onChange={(e) => setFormData({ ...formData, metodo_inspecao_local: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Inspeção do local de trabalho</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.metodo_medicoes_ambientais}
                    onChange={(e) => setFormData({ ...formData, metodo_medicoes_ambientais: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Medições e avaliações ambientais (temperatura, ruído, radiação, etc.)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.metodo_analise_documentos}
                    onChange={(e) => setFormData({ ...formData, metodo_analise_documentos: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Análise de documentos (laudos, relatórios anteriores)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.metodo_entrevistas}
                    onChange={(e) => setFormData({ ...formData, metodo_entrevistas: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Entrevistas com trabalhadores</span>
                </label>
                <input
                  type="text"
                  placeholder="Outros métodos (especificar)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.metodo_outros}
                  onChange={(e) => setFormData({ ...formData, metodo_outros: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procedimentos de Avaliação
              </label>
              <textarea
                rows={4}
                placeholder="Descreva os procedimentos detalhados utilizados na avaliação..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.procedimentos_avaliacao}
                onChange={(e) => setFormData({ ...formData, procedimentos_avaliacao: e.target.value })}
              />
            </div>
          </div>

          {/* Seção V: Local e Atividade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              V. Ambiente de Trabalho Inspecionado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Perícia *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.data_pericia}
                  onChange={(e) => setFormData({ ...formData, data_pericia: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Setor/Departamento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Inspecionado *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.local_inspecionado}
                onChange={(e) => setFormData({ ...formData, local_inspecionado: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atividade Realizada *
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.atividade_realizada}
                onChange={(e) => setFormData({ ...formData, atividade_realizada: e.target.value })}
              />
            </div>
          </div>

          {/* Seção VI: Agentes e Riscos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              VI. Agentes Insalubres e Perigosos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agentes Químicos
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Benzeno, Chumbo..."
                  value={formData.agentes_quimicos}
                  onChange={(e) => setFormData({ ...formData, agentes_quimicos: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agentes Físicos
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Ruído, Calor, Radiação..."
                  value={formData.agentes_fisicos}
                  onChange={(e) => setFormData({ ...formData, agentes_fisicos: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agentes Biológicos
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Bactérias, Vírus..."
                  value={formData.agentes_biologicos}
                  onChange={(e) => setFormData({ ...formData, agentes_biologicos: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condições Perigosas
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Risco de explosão, choque elétrico..."
                  value={formData.condicoes_perigosas}
                  onChange={(e) => setFormData({ ...formData, condicoes_perigosas: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Seção VII: Conclusões */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              VII. Conclusões da Perícia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.existe_insalubridade}
                    onChange={(e) => setFormData({ ...formData, existe_insalubridade: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Existe Insalubridade</span>
                </label>
                {formData.existe_insalubridade && (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.grau_insalubridade}
                    onChange={(e) => setFormData({ ...formData, grau_insalubridade: e.target.value as InsalubridadeGrau })}
                  >
                    <option value="minimo">Grau Mínimo</option>
                    <option value="medio">Grau Médio</option>
                    <option value="maximo">Grau Máximo</option>
                  </select>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.existe_periculosidade}
                    onChange={(e) => setFormData({ ...formData, existe_periculosidade: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Existe Periculosidade</span>
                </label>
                {formData.existe_periculosidade && (
                  <input
                    type="text"
                    placeholder="Especificar o risco"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.risco_periculosidade}
                    onChange={(e) => setFormData({ ...formData, risco_periculosidade: e.target.value })}
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parecer do Perito
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o parecer técnico sobre os riscos encontrados..."
                value={formData.parecer_perito}
                onChange={(e) => setFormData({ ...formData, parecer_perito: e.target.value })}
              />
            </div>
          </div>

          {/* Seção VIII: Participantes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                VIII. Participantes da Perícia
              </h3>
              <button
                type="button"
                onClick={handleAddParticipante}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            {participantes.map((participante, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Participante #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipante(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={participante.nome}
                    onChange={(e) => handleParticipanteChange(index, 'nome', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Cargo/Função"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={participante.cargo}
                    onChange={(e) => handleParticipanteChange(index, 'cargo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Tipo/Categoria"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={participante.tipo}
                    onChange={(e) => handleParticipanteChange(index, 'tipo', e.target.value)}
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Falas e observações do participante..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={participante.falas}
                  onChange={(e) => handleParticipanteChange(index, 'falas', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Seção IX: Observações Finais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              IX. Observações Finais
            </h3>
            <div>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais, comentários ou informações complementares..."
                value={formData.observacoes_finais}
                onChange={(e) => setFormData({ ...formData, observacoes_finais: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar Perícia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
