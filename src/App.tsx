import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import { safeStorage } from './lib/safeStorage';
import './App.css';

// Safari iPad compatibility - v2

interface CurrentUser {
  email: string;
  name: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe usuário logado no localStorage
    const savedUser = safeStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const savedUser = safeStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error('Erro ao fazer login:', e);
      }
    }
  };

  const handleLogout = () => {
    safeStorage.removeItem('currentUser');
    setCurrentUser(null);
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

  if (!currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portal de Perícias</h1>
            <p className="text-sm text-gray-500">{currentUser.name} ({currentUser.email})</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
      <Dashboard userEmail={currentUser.email} />
    </div>
  );
}

export default App;
