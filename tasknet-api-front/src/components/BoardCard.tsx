import Link from 'next/link';
import { ChevronRight, Trash2 } from 'lucide-react';

interface BoardCardProps {
  board: any;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
}

export default function BoardCard({ board, isAdmin, onDelete }: BoardCardProps) {
  return (
    <div className="group bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all relative overflow-hidden">
      <Link href={`/boards/${board.id}`}>
        <h3 className="font-bold text-lg text-slate-800 mb-2 pr-8">{board.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2">{board.description || 'Нет описания'}</p>
        <div className="mt-4 flex items-center text-indigo-600 text-sm font-bold">
          Открыть доску <ChevronRight size={16} />
        </div>
      </Link>
      
      {isAdmin && (
        <button 
          onClick={() => onDelete?.(board.id)}
          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}