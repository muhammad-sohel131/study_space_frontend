import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '../ui/Button';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-blue-600">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">StudySpace</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/centers" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Centers
          </Link>
          <Link href="/books" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Books
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <UserIcon className="h-4 w-4" />
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
      </div>
    </nav>
  );
}
