'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  MapPin,
  Armchair,
  CalendarCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  if (!mounted || !user || user.role !== 'ADMIN') return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Centers', href: '/admin/centers', icon: MapPin },
    { name: 'Seats', href: '/admin/seats', icon: Armchair },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-black">S</span>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">Study<span className="text-indigo-400">Space</span></span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-indigo-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
