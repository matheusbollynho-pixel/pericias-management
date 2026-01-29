import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { safeStorage } from '../lib/safeStorage';
import type { Pericia } from '../types/pericia';
import { useState, useEffect, useMemo } from 'react';

export function usePerencias() {
  const queryClient = useQueryClient();
  const [pericias, setPericias] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  const storageKey = useMemo(() => `pericias_${userEmail}`, [userEmail]);
  const backupKey = useMemo(() => `pericias_backup_${userEmail}`, [userEmail]);

  // Obter email do usuário logado do localStorage (login local)
  useEffect(() => {
    const user = safeStorage.getItem('currentUser');
    if (user) {
      try {
        const { email } = JSON.parse(user);
        setUserEmail(email);
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage:', e);
      }
    }
  }, []);

  // Carregar perícias do Supabase (com fallback para localStorage)
  useEffect(() => {
    const loadPericias = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Tentando carregar perícias...', { userEmail, hasSupabase: !!supabase });
        
        if (supabase && userEmail) {
          // TEMPORÁRIO: Buscar todas as perícias para debug
          console.log('🔍 Buscando TODAS as perícias (sem filtro de owner)...');
          const { data: dataAll, error: errorAll } = await supabase
            .from('pericias')
            .select('*')
            .order('created_at', { ascending: false });
          
          console.log('📊 Total de perícias no banco:', dataAll?.length);
          if (dataAll && dataAll.length > 0) {
            console.log('📋 Owners das perícias:', dataAll.map(p => p.owner));
          }
          
          if (!errorAll && dataAll) {
            // Filtrar apenas pelo email logado
            const filtered = dataAll.filter((p: any) => p.owner === userEmail);
            console.log('✅ Perícias filtradas para o usuário:', filtered.length);
            setPericias(filtered as Pericia[]);
            safeStorage.setItem(backupKey, JSON.stringify(filtered));
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback para localStorage
        console.log('🔄 Tentando carregar do localStorage...');
        const saved = safeStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('📦 Carregado do localStorage:', parsed.length);
          setPericias(parsed);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar perícias:', error);
        // Tenta recuperar do backup
        const backup = safeStorage.getItem(backupKey);
        if (backup) {
          setPericias(JSON.parse(backup));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      loadPericias();
    }
  }, [storageKey, backupKey, userEmail]);

  const savePericias = (newPericias: Pericia[]) => {
    setPericias(newPericias);
    safeStorage.setItem(storageKey, JSON.stringify(newPericias));
    safeStorage.setItem(backupKey, JSON.stringify(newPericias));
  };

  const createPericia = useMutation({
    mutationFn: async (pericia: Omit<Pericia, 'id' | 'created_at' | 'updated_at'>) => {
      // Payload com todos os campos da perícia
      const dbPayload: any = {
        // Informações do Processo
        processo_numero: pericia.processo_numero,
        vara: pericia.vara,
        comarca: pericia.comarca,
        
        // Resumo do Caso
        resumo_caso: pericia.resumo_caso,
        objetivo_determinar_insalubridade: pericia.objetivo_determinar_insalubridade || false,
        objetivo_determinar_periculosidade: pericia.objetivo_determinar_periculosidade || false,
        objetivo_avaliar_exposicao: pericia.objetivo_avaliar_exposicao || false,
        objetivo_outros: pericia.objetivo_outros,
        
        // Partes
        parte_requerente: pericia.parte_requerente,
        parte_requerida: pericia.parte_requerida,
        requerente_cargo: pericia.requerente_cargo,
        requerente_setor: pericia.requerente_setor,
        requerente_endereco: pericia.requerente_endereco,
        requerente_telefone: pericia.requerente_telefone,
        requerente_email: pericia.requerente_email,
        requerida_cargo: pericia.requerida_cargo,
        requerida_setor: pericia.requerida_setor,
        requerida_endereco: pericia.requerida_endereco,
        requerida_telefone: pericia.requerida_telefone,
        requerida_email: pericia.requerida_email,
        
        // Perito
        perito_nome: pericia.perito_nome,
        perito_especialidade: pericia.perito_especialidade,
        perito_profissao_formacao: pericia.perito_profissao_formacao,
        perito_experiencia: pericia.perito_experiencia,
        data_nomeacao: pericia.data_nomeacao || null,
        data_pericia: pericia.data_pericia || null,
        
        // Metodologia
        metodo_inspecao_local: pericia.metodo_inspecao_local || false,
        metodo_medicoes_ambientais: pericia.metodo_medicoes_ambientais || false,
        metodo_analise_documentos: pericia.metodo_analise_documentos || false,
        metodo_entrevistas: pericia.metodo_entrevistas || false,
        metodo_outros: pericia.metodo_outros,
        procedimentos_avaliacao: pericia.procedimentos_avaliacao,
        
        // Ambiente
        objetivo: pericia.objetivo,
        local_inspecionado: pericia.local_inspecionado,
        setor: pericia.setor,
        atividade_realizada: pericia.atividade_realizada,
        agentes_quimicos: pericia.agentes_quimicos,
        agentes_fisicos: pericia.agentes_fisicos,
        agentes_biologicos: pericia.agentes_biologicos,
        condicoes_perigosas: pericia.condicoes_perigosas,
        
        // Informações Adicionais do Processo
        data_admissao: pericia.data_admissao || null,
        data_demissao: pericia.data_demissao || null,
        horario_pericia: pericia.horario_pericia,
        local_pericia: pericia.local_pericia,
        funcao_reclamante: pericia.funcao_reclamante,
        
        // Descrição de Ambientes e Atividades
        descricao_ambientes: pericia.descricao_ambientes,
        descricao_atividades: pericia.descricao_atividades,
        
        // Riscos Ergonômicos
        riscos_ergonomicos: pericia.riscos_ergonomicos,
        
        // Checklist de Documentação
        documentacao: pericia.documentacao,
        
        // EPIs
        epis: pericia.epis || [],
        
        // Conclusões
        existe_insalubridade: pericia.existe_insalubridade || false,
        grau_insalubridade: pericia.grau_insalubridade,
        existe_periculosidade: pericia.existe_periculosidade || false,
        risco_periculosidade: pericia.risco_periculosidade,
        parecer_perito: pericia.parecer_perito,
        
        // Observações
        observacoes_finais: pericia.observacoes_finais,
        
        // Metadata
        participantes: pericia.participantes || [],
        status: pericia.status || 'andamento',
        owner: userEmail, // CRITICAL: Campo necessário para RLS
      };

      if (supabase) {
        try {
          // Insere sem fazer select (evita erro com colunas não-existent)
          const { error } = await supabase
            .from('pericias')
            .insert([dbPayload]);
          
          if (!error) {
            // Faz um select imediatamente após para retornar os dados salvos
            const { data: savedData } = await supabase
              .from('pericias')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (savedData) {
              return savedData as Pericia;
            }
          }
          if (error) {
            console.error('Erro Supabase insert:', error.message);
            console.error('Erro completo:', error);
          }
        } catch (error) {
          console.error('Erro ao salvar no Supabase:', error);
        }
      }

      // Fallback: salva localmente atribuindo id
      const newLocal: Pericia = {
        ...pericia,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
      return newLocal;
    },
    onSuccess: (newPericia) => {
      const updated = [newPericia, ...pericias];
      savePericias(updated);
      queryClient.invalidateQueries({ queryKey: ['pericias'] });
    },
    onError: (error) => {
      console.error('Erro ao criar perícia:', error);
    },
  });

  const updatePericia = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Pericia> & { id: string }) => {
      // Preparar payload com todos os campos que o banco suporta
      const updatedDb: any = {
        // Informações do Processo
        processo_numero: data.processo_numero,
        vara: data.vara,
        comarca: data.comarca,
        
        // Resumo do Caso
        resumo_caso: data.resumo_caso,
        objetivo_determinar_insalubridade: data.objetivo_determinar_insalubridade || false,
        objetivo_determinar_periculosidade: data.objetivo_determinar_periculosidade || false,
        objetivo_avaliar_exposicao: data.objetivo_avaliar_exposicao || false,
        objetivo_outros: data.objetivo_outros,
        
        // Partes
        parte_requerente: data.parte_requerente,
        parte_requerida: data.parte_requerida,
        requerente_cargo: data.requerente_cargo,
        requerente_setor: data.requerente_setor,
        requerente_endereco: data.requerente_endereco,
        requerente_telefone: data.requerente_telefone,
        requerente_email: data.requerente_email,
        requerida_cargo: data.requerida_cargo,
        requerida_setor: data.requerida_setor,
        requerida_endereco: data.requerida_endereco,
        requerida_telefone: data.requerida_telefone,
        requerida_email: data.requerida_email,
        
        // Perito
        perito_nome: data.perito_nome,
        perito_especialidade: data.perito_especialidade,
        perito_profissao_formacao: data.perito_profissao_formacao,
        perito_experiencia: data.perito_experiencia,
        data_nomeacao: data.data_nomeacao || null,
        data_pericia: data.data_pericia || null,
        
        // Metodologia
        metodo_inspecao_local: data.metodo_inspecao_local || false,
        metodo_medicoes_ambientais: data.metodo_medicoes_ambientais || false,
        metodo_analise_documentos: data.metodo_analise_documentos || false,
        metodo_entrevistas: data.metodo_entrevistas || false,
        metodo_outros: data.metodo_outros,
        procedimentos_avaliacao: data.procedimentos_avaliacao,
        
        // Ambiente
        objetivo: data.objetivo,
        local_inspecionado: data.local_inspecionado,
        setor: data.setor,
        atividade_realizada: data.atividade_realizada,
        agentes_quimicos: data.agentes_quimicos,
        agentes_fisicos: data.agentes_fisicos,
        agentes_biologicos: data.agentes_biologicos,
        condicoes_perigosas: data.condicoes_perigosas,
        
        // Informações Adicionais do Processo
        data_admissao: data.data_admissao || null,
        data_demissao: data.data_demissao || null,
        horario_pericia: data.horario_pericia,
        local_pericia: data.local_pericia,
        funcao_reclamante: data.funcao_reclamante,
        
        // Descrição de Ambientes e Atividades
        descricao_ambientes: data.descricao_ambientes,
        descricao_atividades: data.descricao_atividades,
        
        // Riscos Ergonômicos
        riscos_ergonomicos: data.riscos_ergonomicos,
        
        // Checklist de Documentação
        documentacao: data.documentacao,
        
        // EPIs
        epis: data.epis || [],
        
        // Conclusões
        existe_insalubridade: data.existe_insalubridade || false,
        grau_insalubridade: data.grau_insalubridade,
        existe_periculosidade: data.existe_periculosidade || false,
        risco_periculosidade: data.risco_periculosidade,
        parecer_perito: data.parecer_perito,
        
        // Observações
        observacoes_finais: data.observacoes_finais,
        
        // Metadata
        participantes: data.participantes || [],
        status: data.status ?? 'andamento',
      };

      if (supabase) {
        try {
          const { error } = await supabase
            .from('pericias')
            .update(updatedDb)
            .eq('id', id);
          
          if (!error) {
            // Faz um select para retornar dados atualizados
            const { data: result } = await supabase
              .from('pericias')
              .select('*')
              .eq('id', id)
              .single();
            
            if (result) {
              return result as Pericia;
            }
          }
          if (error) {
            console.error('Erro Supabase update:', error.message);
            console.error('Erro completo:', error);
          }
        } catch (error) {
          console.error('Erro ao atualizar no Supabase:', error);
        }
      }

      // Fallback: atualiza localmente
      const prev = pericias.find(p => p.id === id) || ({} as Pericia);
      const merged: Pericia = {
        ...prev,
        ...data,
        id,
        updated_at: new Date().toISOString(),
      } as any;
      return merged;
    },
    onSuccess: (updated) => {
      const newPericias = pericias.map(p => p.id === updated.id ? updated : p);
      savePericias(newPericias);
      queryClient.invalidateQueries({ queryKey: ['pericias'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar perícia:', error);
    },
  });

  const deletePericia = useMutation({
    mutationFn: async (id: string) => {
      if (supabase) {
        try {
          const { error } = await supabase
            .from('pericias')
            .delete()
            .eq('id', id);
          
          if (!error) {
            return id;
          }
        } catch (error) {
          console.error('Erro ao deletar do Supabase:', error);
        }
      }

      return id;
    },
    onSuccess: (id) => {
      const newPericias = pericias.filter(p => p.id !== id);
      savePericias(newPericias);
      queryClient.invalidateQueries({ queryKey: ['pericias'] });
    },
    onError: (error) => {
      console.error('Erro ao deletar perícia:', error);
    },
  });

  return {
    pericias,
    isLoading,
    createPericia: createPericia.mutate,
    isCreating: createPericia.isPending,
    updatePericia: updatePericia.mutate,
    isUpdating: updatePericia.isPending,
    deletePericia: deletePericia.mutate,
    isDeleting: deletePericia.isPending,
  };
}
