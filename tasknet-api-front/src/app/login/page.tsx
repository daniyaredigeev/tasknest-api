'use client'
import { useState } from 'react';
import { apiLogin } from '@/lib/api'; // Используем готовую функцию
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiLogin(form); // Просто передаем объект с данными
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6 text-indigo-600">
          <LogIn size={40} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Вход в TaskNest</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Пароль" required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={e => setForm({...form, password: e.target.value})}
          />
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all">
            Войти
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Нет аккаунта? <Link href="/register" className="text-indigo-600 font-bold">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}