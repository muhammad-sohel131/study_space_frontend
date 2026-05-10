'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Copy, CheckCircle2, Lock, Mail, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CredentialsPage() {
  const credentials = {
    email: 'admin@gmail.com',
    password: '123456',
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal Access</h1>
            <p className="text-slate-500 font-medium">Use these credentials to evaluate the administrative features.</p>
          </div>

          <Card className="p-8 border-slate-200 shadow-2xl shadow-indigo-100/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <div className="relative group">
                    <div className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between font-bold text-slate-700">
                      {credentials.email}
                      <button 
                        onClick={() => copyToClipboard(credentials.email, 'Email')}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Password
                  </label>
                  <div className="relative group">
                    <div className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between font-bold text-slate-700">
                      {credentials.password}
                      <button 
                        onClick={() => copyToClipboard(credentials.password, 'Password')}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  These credentials allow you to manage study centers, seats, and view all system bookings.
                </p>
              </div>

              <Button 
                onClick={() => window.open('/login', '_blank')}
                className="w-full h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 font-black uppercase tracking-widest text-[11px] group"
              >
                Go to Login Page
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            StudySpace Security Protocols
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
