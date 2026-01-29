// Storage seguro compatível com Safari (evita erro "The operation is insecure")
// Usa localStorage quando disponível, senão usa storage em memória
const inMemoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    // Tentar localStorage primeiro
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('⚠️ localStorage não disponível, usando memória:', e);
    }
    
    // Fallback para memória
    return inMemoryStorage[key] || null;
  },
  
  setItem: (key: string, value: string): void => {
    // Sempre salvar em memória
    inMemoryStorage[key] = value;
    
    // Tentar localStorage também
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível salvar no localStorage, usando apenas memória:', e);
    }
  },
  
  removeItem: (key: string): void => {
    // Remover da memória
    delete inMemoryStorage[key];
    
    // Tentar remover do localStorage também
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível remover do localStorage:', e);
    }
  }
};
