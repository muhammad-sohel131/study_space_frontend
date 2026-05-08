import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
 children: React.ReactNode;
 noNav?: boolean;
}

export function Layout({ children, noNav = false }: LayoutProps) {
 return (
 <div className="min-h-screen bg-slate-50">
 {!noNav && <Navbar />}
 <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
 {children}
 </main>
 </div>
 );
}
