import Link from 'next/link';
import { ArrowRight, CheckSquare, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="max-w-4xl text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-200">
            <CheckSquare size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Управляйте задачами с <span className="text-indigo-600">TaskNest</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Простой и мощный инструмент для организации ваших проектов. 
          Создавайте доски, распределяйте задачи и следите за прогрессом в реальном времени.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/register" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 text-lg"
          >
            Начать бесплатно <ArrowRight size={22} />
          </Link>
          <Link 
            href="/login" 
            className="bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all text-lg shadow-sm"
          >
            Войти в аккаунт
          </Link>
        </div>

        {/* Мини-фичи */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <Zap className="text-amber-500 mb-3" size={24} />
            <h3 className="font-bold text-slate-800 mb-1">Быстрая работа</h3>
            <p className="text-sm text-slate-500">Мгновенное создание задач и смена статусов.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <ShieldCheck className="text-emerald-500 mb-3" size={24} />
            <h3 className="font-bold text-slate-800 mb-1">Безопасность</h3>
            <p className="text-sm text-slate-500">Ваши данные защищены и доступны только вам.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <CheckSquare className="text-indigo-500 mb-3" size={24} />
            <h3 className="font-bold text-slate-800 mb-1">Удобство</h3>
            <p className="text-sm text-slate-500">Интуитивно понятный интерфейс в стиле Kanban.</p>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-slate-400 text-sm">
        © 2026 TaskNest. Daniyar Yedigeyev.
      </footer>
    </div>
  );
}