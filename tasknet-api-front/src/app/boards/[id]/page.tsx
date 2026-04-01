'use client'
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { apiGetBoard, apiGetMe, apiCreateTask } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import { Plus, Loader2 } from 'lucide-react';

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState(''); 
  const [isCreating, setIsCreating] = useState(false);

  const loadData = useCallback(async () => {
    if (id) {
      try {
        const [b, u] = await Promise.all([apiGetBoard(id as string), apiGetMe()]);
        setBoard(b);
        setUser(u);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await apiCreateTask({
        title: newTaskTitle,
        description: newTaskDesc,
        status: 'TODO' as any,
        boardId: id as string,
      });
      setNewTaskTitle('');
      setNewTaskDesc(''); 
      await loadData(); 
    } catch (err) {
      alert("Ошибка при создании задачи");
    } finally {
      setIsCreating(false);
    }
  };

  if (!board) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    /* h-[calc(100vh-64px)] — вычитаем высоту Navbar (64px), чтобы страница не скроллилась целиком */
    <div className="h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        
        <h1 className="text-2xl font-bold mb-6 text-slate-800 shrink-0">
          {board.title}
        </h1>

        {/* Сетка колонок — flex-1 заставляет её занять всё оставшееся место */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
            <div 
              key={status} 
              className="bg-slate-200/60 flex flex-col p-4 rounded-xl border border-slate-300/50 min-h-0 max-h-full"
            >
              {/* Заголовок колонки */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="font-bold text-slate-600 px-2 uppercase text-xs tracking-wider">
                  {status.replace('_', ' ')}
                </h2>
                <span className="bg-slate-300 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {board.tasks?.filter((t: any) => t.status === status).length || 0}
                </span>
              </div>

              {/* Форма создания в TODO */}
              {status === 'TODO' && (
                <div className="shrink-0">
                  <form onSubmit={handleCreateTask} className="mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                    <input
                      type="text"
                      placeholder="Заголовок..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full mb-1 p-1 text-sm font-medium outline-none focus:text-indigo-600"
                      required
                    />
                    <textarea
                      placeholder="Описание..."
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      className="w-full p-1 text-xs text-slate-500 outline-none resize-none"
                      rows={2}
                    />
                    <button 
                      type="submit"
                      disabled={isCreating || !newTaskTitle.trim()}
                      className="w-full mt-2 bg-indigo-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center justify-center gap-1"
                    >
                      {isCreating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                      ДОБАВИТЬ
                    </button>
                  </form>
                </div>
              )}

              {/* СПИСОК ЗАДАЧ СО СКРОЛЛОМ */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
                {board.tasks
                  ?.filter((t: any) => t.status === status)
                  .map((task: any) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isAdmin={user?.role === 'ADMIN'} 
                      onRefresh={loadData} 
                    />
                  ))}
                
                {/* Пустой отступ снизу для красоты при скролле */}
                <div className="h-2 shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}