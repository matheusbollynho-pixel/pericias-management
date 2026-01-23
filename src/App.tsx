import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

const USERS = ['Tarciana Ellen', 'Viemar Cruz'];

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleSelectUser = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', user);
  };

  const handleSwitchUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-6">
          <div>
            <p className="text-sm text-gray-500">Selecione o profissional</p>
            <h1 className="text-2xl font-bold text-gray-900">Portal de Perícias</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USERS.map((user) => (
              <button
                key={user}
                onClick={() => handleSelectUser(user)}
                className="w-full border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {user.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Acessar perícias</p>
                    <p className="text-base font-semibold text-gray-900">{user}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard currentUser={currentUser} onSwitchUser={handleSwitchUser} />;
}

export default App;
