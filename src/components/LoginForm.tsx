import { useState } from 'react';
import { AlertCircle, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const USERS = [
  { name: 'Tarciana Ellen', email: 'tarcianaellen@outlook.com', password: 'tarciana' },
  { name: 'Viemar Cruz', email: 'viemarcruz@hotmail.com', password: 'viemarvjc' },
];

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const handleLogin = (email: string, password: string) => {
    setError('');
    setLoading(true);

    // Simular delay de processamento
    setTimeout(() => {
      const user = USERS.find(u => u.email === email);
      
      if (!user) {
        setError('Usuário não encontrado');
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Senha incorreta');
        setLoading(false);
        return;
      }

      // Salvar usuário no localStorage
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: user.name }));
      
      onLoginSuccess();
      setLoading(false);
    }, 500);
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
              onClick={() => {
                setSelectedEmail(user.email);
                setInputPassword('');
                setError('');
              }}
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
                  {loading ? 'Conectando...' : selectedEmail === user.email ? 'Digite a senha abaixo' : 'Clique para selecionar'}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Password prompt */}
        {selectedEmail && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(selectedEmail, inputPassword);
            }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Usuário selecionado</p>
                <p className="text-base font-semibold text-gray-900">{selectedEmail}</p>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  setSelectedEmail('');
                  setInputPassword('');
                  setError('');
                }}
              >
                Trocar usuário
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite a senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {/* Demo Info */}
        <div className="text-center text-sm text-gray-600 mt-12">
          <p>Dados de teste disponíveis para demonstração</p>
        </div>
      </div>
    </div>
  );
}
