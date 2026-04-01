'use client'
import { useState } from 'react';
import { apiRegister } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Пароль слишком короткий');
    
    try {
      await apiRegister(form);
      router.push('/login'); // После регистрации отправляем на логин
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6 text-emerald-500">
          <UserPlus size={40} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Имя" required className="w-full px-4 py-2 border rounded-lg outline-none"
            onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg outline-none"
            onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Пароль" required className="w-full px-4 py-2 border rounded-lg outline-none"
            onChange={e => setForm({...form, password: e.target.value})} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600">Создать аккаунт</button>
        </form>
      </div>
    </div>
  );
}