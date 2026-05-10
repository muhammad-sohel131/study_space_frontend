'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="text-[12rem] font-black text-slate-200 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Ghost className="h-24 w-24 text-indigo-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lost in Space?</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            The page you're looking for has vanished into the digital void. Don't worry, even the best students get lost sometimes!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-2xl border-2 border-slate-200 font-black uppercase tracking-widest text-[11px] group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-14 px-8 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 font-black uppercase tracking-widest text-[11px] group">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="pt-12">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            StudySpace Error Protocol 404
          </p>
        </div>
      </div>
    </div>
  );
}
