import { useState } from 'react';
import type { Pericia } from '../types/pericia';
import { FileText, Plus, Search, Pencil, Printer, Trash2 } from 'lucide-react';
import PericiaForm from '../components/PericiaForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { usePerencias } from '../hooks/usePerencias';
import { generatePericiaPDF } from '../lib/pdfGenerator';
interface DashboardProps {
  userEmail: string;
}

const getPeritoName = (email: string): string => {
  if (email === 'tarcianaellen@outlook.com') return 'Tarciana Ellen';
  if (email === 'viemarcruz@hotmail.com') return 'Viemar Cruz';
  return '';
};

export default function Dashboard({ userEmail }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPericia, setEditingPericia] = useState<Pericia | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [periciaToDelete, setPericiaToDelete] = useState<Pericia | null>(null);
  const { pericias, isLoading, createPericia, updatePericia, deletePericia, isDeleting } = usePerencias();
  const peritoNome = getPeritoName(userEmail);

  const handleSubmitPericia = (data: any) => {
    const payload = editingPericia
      ? { ...data, id: editingPericia.id }
      : data;

    if (editingPericia) {
      updatePericia(payload);
    } else {
      createPericia(payload as any);
    }
    setShowForm(false);
    setEditingPericia(null);
  };

  const handleDeleteClick = (pericia: Pericia) => {
    setPericiaToDelete(pericia);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (periciaToDelete) {
      deletePericia(periciaToDelete.id);
      setShowDeleteModal(false);
      setPericiaToDelete(null);
    }
  };

  const stats = {
    total: pericias.length,
    andamento: pericias.filter(p => p.status === 'andamento').length,
    concluidas: pericias.filter(p => p.status === 'concluida').length,
    arquivadas: pericias.filter(p => p.status === 'arquivada').length,
  };

  const filteredPericias = pericias.filter(p =>
    (p.processo_numero || p.processo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.vara || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.parte_requerente || p.parte || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.parte_requerida || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Sistema de Perícias
        </h1>
        <p className="text-gray-600 mt-2">
          Gerenciamento de perícias de insalubridade e periculosidade
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por processo, vara ou parte..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingPericia(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nova Perícia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Em Andamento</p>
          <p className="text-2xl font-bold text-blue-600">{stats.andamento}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Concluídas</p>
          <p className="text-2xl font-bold text-green-600">{stats.concluidas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Arquivadas</p>
          <p className="text-2xl font-bold text-gray-600">{stats.arquivadas}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Carregando perícias...</p>
        </div>
      ) : filteredPericias.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma perícia encontrada' : 'Nenhuma perícia cadastrada'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece criando sua primeira perícia judicial'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => { setEditingPericia(null); setShowForm(true); }}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Criar Perícia
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Processo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vara</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Partes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPericias.map((pericia) => (
                <tr key={pericia.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{pericia.processo_numero || pericia.processo}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{pericia.vara}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {pericia.parte}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      pericia.status === 'andamento' ? 'bg-blue-100 text-blue-800' :
                      pericia.status === 'concluida' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pericia.status === 'andamento' ? 'Em Andamento' :
                       pericia.status === 'concluida' ? 'Concluída' :
                       'Arquivada'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => generatePericiaPDF(pericia, peritoNome)}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Imprimir PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPericia(pericia);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar Perícia"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pericia)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Excluir Perícia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <PericiaForm
          onClose={() => {
            setShowForm(false);
            setEditingPericia(null);
          }}
          onSubmit={handleSubmitPericia}
          initialData={editingPericia || undefined}
          defaultPeritoNome={peritoNome}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        periodeName={periciaToDelete?.processo_numero || periciaToDelete?.processo || 'sem número'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setPericiaToDelete(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
