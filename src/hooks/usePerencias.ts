import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Pericia } from '../types/pericia';
import { useState, useEffect, useMemo } from 'react';

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '_');

export function usePerencias(currentUser?: string) {
  const queryClient = useQueryClient();
  const [pericias, setPericias] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = useMemo(() => currentUser ? `pericias_${slugify(currentUser)}` : 'pericias', [currentUser]);
  const backupKey = useMemo(() => currentUser ? `pericias_backup_${slugify(currentUser)}` : 'pericias_backup', [currentUser]);

  // Carregar perícias do localStorage ao iniciar
  useEffect(() => {
    const loadPericias = async () => {
      try {
        setIsLoading(true);
        
        if (supabase && currentUser) {
          // Tentar carregar do Supabase
          const { data, error } = await supabase
            .from('pericias')
            .select('*')
            .eq('owner', currentUser)
            .order('created_at', { ascending: false });
          
          if (!error && data) {
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

    loadPericias();
  }, [storageKey, backupKey, currentUser]);

  const savePericias = (newPericias: Pericia[]) => {
    setPericias(newPericias);
    localStorage.setItem(storageKey, JSON.stringify(newPericias));
    localStorage.setItem(backupKey, JSON.stringify(newPericias));
  };

  const createPericia = useMutation({
    mutationFn: async (pericia: Omit<Pericia, 'id' | 'created_at' | 'updated_at'>) => {
      const newPericia: Pericia = {
        ...pericia,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        owner: currentUser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

        if (supabase && currentUser) {
        try {
          const { data, error } = await supabase
            .from('pericias')
            .insert([newPericia])
            .select()
            .single();
          
          if (!error && data) {
            return data;
          }
        } catch (error) {
          console.error('Erro ao salvar no Supabase:', error);
        }
      }

      // Fallback para localStorage
      return newPericia;
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
      const updated: Pericia = {
        ...(pericias.find(p => p.id === id) || {}),
        ...data,
        id,
        updated_at: new Date().toISOString(),
      } as Pericia;

      if (supabase) {
        try {
          const { data: result, error } = await supabase
            .from('pericias')
            .update(updated)
            .eq('id', id)
            .select()
            .single();
          
          if (!error && result) {
            return result;
          }
        } catch (error) {
          console.error('Erro ao atualizar no Supabase:', error);
        }
      }

      return updated;
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
