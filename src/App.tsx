import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    // Verificar se existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail('');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setUserEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portal de Perícias</h1>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
      <Dashboard userEmail={userEmail} />
    </div>
  );
}

export default App;
