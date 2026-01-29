import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug envs no browser
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');

// Se as variáveis não existirem, evitamos lançar erro na importação para não derrubar a UI inteira.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas (.env).');
}

// Storage compatível com Safari (evita erro "The operation is insecure")
const createSafariCompatibleStorage = () => {
  const inMemoryStorage: Record<string, string> = {};
  
  // Usar sempre in-memory storage para evitar problemas de segurança em Safari
  const storage = {
    getItem: (key: string) => inMemoryStorage[key] || null,
    setItem: (key: string, value: string) => {
      inMemoryStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete inMemoryStorage[key];
    },
    clear: () => {
      Object.keys(inMemoryStorage).forEach(key => {
        delete inMemoryStorage[key];
      });
    },
    key: (index: number) => {
      const keys = Object.keys(inMemoryStorage);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(inMemoryStorage).length;
    }
  };
  
  return storage;
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: createSafariCompatibleStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;
