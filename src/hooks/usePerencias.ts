import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Pericia } from '../types/pericia';
import { useState, useEffect, useMemo } from 'react';

export function usePerencias() {
  const queryClient = useQueryClient();
  const [pericias, setPericias] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  const storageKey = useMemo(() => `pericias_${userEmail}`, [userEmail]);
  const backupKey = useMemo(() => `pericias_backup_${userEmail}`, [userEmail]);

  // Obter email do usuário logado
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Carregar perícias do Supabase (com fallback para localStorage)
  useEffect(() => {
    const loadPericias = async () => {
      try {
        setIsLoading(true);
        
        if (supabase && userEmail) {
          // Primeiro tenta com filtro por owner (se existir no schema).
          let data: any[] | null = null;
          try {
            const { data: dataOwner, error: errorOwner } = await supabase
              .from('pericias')
              .select('*')
              .eq('owner', userEmail)
              .order('created_at', { ascending: false });
            if (!errorOwner) {
              data = dataOwner as any[];
            }
          } catch (e: any) {
            console.error('Erro ao filtrar por owner:', e?.message);
          }

          // Se coluna owner não existir, busca sem filtro
          if (!data) {
            const { data: dataAll, error: errorAll } = await supabase
              .from('pericias')
              .select('*')
              .order('created_at', { ascending: false });
            if (!errorAll && dataAll) {
              data = dataAll as any[];
            }
          }

          if (data) {
            setPericias(data as Pericia[]);
            localStorage.setItem(backupKey, JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback para localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setPericias(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erro ao carregar perícias:', error);
        // Tenta recuperar do backup
        const backup = localStorage.getItem(backupKey);
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
    localStorage.setItem(storageKey, JSON.stringify(newPericias));
    localStorage.setItem(backupKey, JSON.stringify(newPericias));
  };

  const createPericia = useMutation({
    mutationFn: async (pericia: Omit<Pericia, 'id' | 'created_at' | 'updated_at'>) => {
      // Payload com APENAS os campos que realmente existem na tabela
      const dbPayload: any = {
        processo: pericia.processo_numero,
        vara: pericia.vara,
        parte: `${pericia.parte_requerente} vs ${pericia.parte_requerida}`,
        data_pericia: pericia.data_pericia,
        observacoes: pericia.observacoes_finais || '',
        status: pericia.status || 'andamento',
        owner: userEmail || null,
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
              .select('id, created_at, updated_at, owner')
              .eq('owner', userEmail)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (savedData) {
              return { ...pericia, ...savedData } as Pericia;
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
      const updatedDb: any = {
        processo: data.processo_numero,
        vara: data.vara,
        parte: `${data.parte_requerente || ''} vs ${data.parte_requerida || ''}`,
        data_pericia: data.data_pericia,
        observacoes: data.observacoes_finais || '',
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
              .select('id, created_at, updated_at, owner')
              .eq('id', id)
              .single();
            
            if (result) {
              return { ...data, ...result, id } as Pericia;
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
