'use client'
import { useEffect, useState } from 'react';
import { apiGetBoards, apiGetMe, apiDeleteBoard, apiCreateBoard } from '@/lib/api'; // Добавь apiCreateBoard в импорт
import BoardCard from '@/components/BoardCard';
import { User, Board } from '@/types';
import { Loader2, Plus, X } from 'lucide-react';

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояния для модального окна создания
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, boardsData] = await Promise.all([apiGetMe(), apiGetBoards()]);
        setUser(userData);
        setBoards(boardsData);
      } catch (err) {
        console.error("Ошибка загрузки данных", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены?')) {
      try {
        await apiDeleteBoard(id);
        setBoards(prev => prev.filter(b => b.id !== id));
      } catch (err) {
        alert("Не удалось удалить доску");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoard.title.trim()) return;

    setIsSubmitting(true);
    try {
      const createdBoard = await apiCreateBoard(newBoard);
      setBoards(prev => [createdBoard, ...prev]); // Добавляем новую доску в начало списка
      setIsModalOpen(false); // Закрываем модалку
      setNewBoard({ title: '', description: '' }); // Сбрасываем форму
    } catch (err) {
      alert("Ошибка при создании доски");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Загрузка данных...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Ваши проекты</h1>
            <p className="text-slate-500 font-medium">
              Добро пожаловать, <span className="text-indigo-600">{user?.name || 'Пользователь'}</span>
            </p>
          </div>

          {/* КНОПКА СОЗДАНИЯ: Видна только админу */}
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={20} />
              Создать доску
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards.length > 0 ? (
            boards.map(board => (
              <BoardCard 
                key={board.id} 
                board={board} 
                isAdmin={isAdmin} 
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
               <p className="text-slate-400">У вас пока нет созданных досок.</p>
               {isAdmin && (
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-indigo-600 font-bold hover:underline"
                 >
                   Создать первую доску прямо сейчас
                 </button>
               )}
            </div>
          )}
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Новая доска</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Название</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Например: Разработка бэкенда"
                    value={newBoard.title}
                    onChange={(e) => setNewBoard({...newBoard, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Описание (опционально)</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="Краткое описание проекта..."
                    value={newBoard.description}
                    onChange={(e) => setNewBoard({...newBoard, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}