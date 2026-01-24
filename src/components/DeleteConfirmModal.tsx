import { useState } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  periodeName: string;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const USERS = [
  { name: 'Tarciana Ellen', email: 'tarcianaellen@outlook.com', password: 'tarciana' },
  { name: 'Viemar Cruz', email: 'viemarcruz@hotmail.com', password: 'viemarvjc' },
];

export default function DeleteConfirmModal({
  isOpen,
  periodeName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');

    // Verificar se a senha pertence a algum usuário
    const user = localStorage.getItem('currentUser');
    if (!user) {
      setError('Usuário não identificado');
      return;
    }

    try {
      const { email } = JSON.parse(user);
      const currentUser = USERS.find(u => u.email === email);

      if (!currentUser) {
        setError('Usuário inválido');
        return;
      }

      if (currentUser.password !== password) {
        setError('Senha incorreta');
        return;
      }

      onConfirm(password);
      setPassword('');
    } catch (e) {
      setError('Erro ao validar senha');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header com ícone de aviso */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h2>
              <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
            </div>
          </div>

          {/* Mensagem */}
          <p className="text-gray-700 mb-6">
            Tem certeza que deseja excluir a perícia{' '}
            <strong className="text-gray-900">{periodeName || 'sem número'}</strong>?
          </p>

          {/* Campo de senha */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Digite sua senha para confirmar
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="Sua senha"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !password}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
