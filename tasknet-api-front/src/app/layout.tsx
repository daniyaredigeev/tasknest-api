// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'TaskNest — Менеджер задач',
  description: 'Управляйте своими проектами и задачами эффективно',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {/* Навбар будет виден на всех страницах */}
        <Navbar />
        
        {/* Добавляем минимальную высоту, чтобы футер (если будет) не прыгал */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}