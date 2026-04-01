'use client'
import { Task } from '@/types';
import { Calendar, AlignLeft, Trash2, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { apiUpdateTask, apiDeleteTask } from '@/lib/api';
import { useState } from 'react';

interface TaskCardProps {
  task: any;
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function TaskCard({ task, isAdmin, onRefresh }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = {
    TODO: 'bg-slate-100 text-slate-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-emerald-100 text-emerald-700'
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await apiUpdateTask(task.id, { status: newStatus as any });
      onRefresh();
    } catch (err) {
      alert("Не удалось обновить статус");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить эту задачу?')) return;
    try {
      await apiDeleteTask(task.id);
      onRefresh();
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  const formattedDate = task.createdAt 
    ? new Date(task.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short' })
    : '---';

  return (
    <div className={`bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:border-indigo-300 transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColors[task.status as keyof typeof statusColors]}`}>
          {task.status}
        </span>
        
        {/* Кнопка удаления только для админа */}
        {isAdmin && (
          <button onClick={handleDelete} className="text-slate-300 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <h4 className="font-semibold text-slate-800 mb-2 leading-tight">{task.title}</h4>

      {task.description && (
        <div className="flex items-start gap-1 text-slate-500 text-xs mb-3">
          <AlignLeft size={14} className="shrink-0 mt-0.5" />
          <p className="line-clamp-2 italic">{task.description}</p>
        </div>
      )}

      {/* ЛОГИКА ДЛЯ АДМИНА: 
          Обычный юзер это не видит. 
          Админ видит только технический ID создателя.
      */}
      {isAdmin && task.userId && (
        <div className="flex items-center gap-1.5 mb-3 bg-amber-50 py-1 px-2 rounded border border-amber-100">
          <UserCheck size={12} className="text-amber-600" />
          <span className="text-[9px] font-mono text-amber-700 truncate max-w-[150px]">
            Owner ID: {task.userId}
          </span>
        </div>
      )}

      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        <div className="flex gap-2">
          {task.status === 'TODO' && (
            <button 
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              В работу <ArrowRight size={12} />
            </button>
          )}
          {task.status === 'IN_PROGRESS' && (
            <button 
              onClick={() => handleStatusChange('DONE')}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
            >
              Завершить <CheckCircle2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}