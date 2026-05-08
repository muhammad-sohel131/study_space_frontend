'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '../ui/Button';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
 const { user, logout } = useAuthStore();
 const router = useRouter();
 const pathname = usePathname();
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 const isActive = (path: string) => pathname === path;

 const handleLogout = () => {
 logout();
 router.push('/login');
 };

 return (
 <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur-md shadow-sm">
 <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
 <Link href="/" className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
 <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-100">
 <BookOpen className="h-5 w-5 text-violet-600" />
 </div>
 <span className="text-lg font-bold tracking-tight hidden sm:inline">StudySpace</span>
 </Link>
 
 <div className="hidden sm:flex items-center gap-8">
 <Link 
   href="/centers" 
   className={`text-sm font-medium transition-colors ${
     isActive('/centers') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Centers
 </Link>
 <Link 
   href="/books" 
   className={`text-sm font-medium transition-colors ${
     isActive('/books') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Books
 </Link>
 
 {user ? (
 <div className="flex items-center gap-6">
 <Link 
   href="/dashboard" 
   className={`text-sm font-medium transition-colors ${
     isActive('/dashboard') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Dashboard
 </Link>
 <div className="h-6 w-px bg-slate-200"></div>
 <div className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 font-semibold text-xs">
 {user.name?.[0]?.toUpperCase()}
 </div>
 <span className="text-sm font-medium text-slate-700">{user.name}</span>
 <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-slate-500 hover:text-red-600">
 <LogOut className="h-4 w-4 mr-1" />
 Logout
 </Button>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-3">
 <Link href="/login">
 <Button variant="ghost" size="sm">Log in</Button>
 </Link>
 <Link href="/register">
 <Button size="sm">Sign up</Button>
 </Link>
 </div>
 )}
 </div>

 {/* Mobile Menu Button */}
 <button
 onClick={() => setIsMenuOpen(!isMenuOpen)}
 className="sm:hidden p-2 text-slate-600 hover:text-slate-900"
 >
 {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
 </button>
 </div>

 {/* Mobile Menu */}
 {isMenuOpen && (
 <div className="sm:hidden border-t border-slate-200 bg-white p-4 space-y-3">
 <Link 
   href="/centers" 
   className={`block text-sm font-medium py-2 transition-colors ${
     isActive('/centers') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Centers
 </Link>
 <Link 
   href="/books" 
   className={`block text-sm font-medium py-2 transition-colors ${
     isActive('/books') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Books
 </Link>
 {user ? (
 <>
 <Link 
   href="/dashboard" 
   className={`block text-sm font-medium py-2 transition-colors ${
     isActive('/dashboard') ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'
   }`}
 >
   Dashboard
 </Link>
 <div className="pt-2 border-t border-slate-200">
 <div className="flex items-center gap-2 py-2 mb-2">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-semibold text-xs">
 {user.name?.[0]?.toUpperCase()}
 </div>
 <span className="text-sm font-medium text-slate-700">{user.name}</span>
 </div>
 <Button variant="danger" size="sm" onClick={handleLogout} className="w-full justify-center">
 <LogOut className="h-4 w-4 mr-1" />
 Logout
 </Button>
 </div>
 </>
 ) : (
 <div className="flex gap-2 pt-2 border-t border-slate-200">
 <Link href="/login" className="flex-1">
 <Button variant="secondary" size="sm" className="w-full">Log in</Button>
 </Link>
 <Link href="/register" className="flex-1">
 <Button size="sm" className="w-full">Sign up</Button>
 </Link>
 </div>
 )}
 </div>
 )}
 </nav>
 );
}
