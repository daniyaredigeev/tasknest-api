'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, clearAccessToken } from '@/lib/auth';
import { apiLogout } from '@/lib/api';
import { LayoutDashboard, CheckSquare, LogOut, UserPlus, LogIn } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  // Проверяем статус авторизации при каждой смене пути
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [pathname]);

  async function handleLogout() {
    try {
      await apiLogout(); // запрос к NestJS на очистку кук
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
    clearAccessToken(); // локальная очистка
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* w-full — растягивает на всю ширину
          px-8 — делает отступы от краев экрана
          justify-between — прижимает лого влево, а меню вправо 
      */}
      <div className="w-full px-8 py-3 flex justify-between items-center h-16">
        
        {/* ЛЕВАЯ ЧАСТЬ: Логотип прижат к левому краю */}
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="text-xl font-bold text-indigo-600 flex items-center gap-2 group"
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg transition-transform group-hover:scale-105">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="tracking-tight text-slate-900">TaskNest</span>
        </Link>

        {/* ПРАВАЯ ЧАСТЬ: Меню прижато к правому краю */}
        <div className="flex items-center gap-6">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <LayoutDashboard size={18} />
                Доски
              </Link>
              
              <div className="h-4 w-px bg-slate-200 mx-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm font-semibold transition-colors group"
              >
                <LogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium flex items-center gap-1.5"
              >
                <LogIn size={18} />
                Войти
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-200 flex items-center gap-1.5"
              >
                <UserPlus size={18} />
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}