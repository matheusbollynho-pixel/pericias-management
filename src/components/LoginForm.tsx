import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const USERS = [
  { name: 'Tarciana Ellen', email: 'ellentarcy@gmail.com', password: '140926' },
  { name: 'Viemar Cruz', email: 'viemarcruz@hotmail.com', password: 'cachaca' },
];

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        setError('Erro ao conectar com Supabase');
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(`Erro ao fazer login: ${signInError.message}`);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      setError('Erro ao fazer login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Portal de Perícias</h1>
          <p className="text-lg text-gray-600">Selecione um usuário para acessar</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 max-w-md mx-auto">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {USERS.map((user) => (
            <button
              key={user.email}
              onClick={() => handleLogin(user.email, user.password)}
              disabled={loading}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-left group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                  <LogIn className="text-blue-600" size={24} />
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Clique para</span>
                  <p className="text-xs text-gray-400">acessar</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{user.email}</p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center group-hover:text-blue-600 transition">
                  {loading ? 'Conectando...' : 'Entrar agora'}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Demo Info */}
        <div className="text-center text-sm text-gray-600 mt-12">
          <p>Dados de teste disponíveis para demonstração</p>
        </div>
      </div>
    </div>
  );
}
