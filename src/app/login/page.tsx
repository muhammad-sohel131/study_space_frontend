'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Sparkles, CheckCircle2, Zap, Wifi, Bed, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
        mutationFn: async () => {
            const variables = { loginInput: { email, password } };
            return graphqlClient.request<{ login: { accessToken: string; user: any } }>(LOGIN_MUTATION, variables);
        },
        onSuccess: (data) => {
            setAuth(data.login.accessToken, data.login.user);
            toast.success('Logged in successfully!');
            if (data.login.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.errors?.[0]?.message || 'Failed to login');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate();
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
            {/* Left Column: Visual Showcase with Generated Study Sanctuary Image */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden bg-slate-950">
                {/* Background Image */}
                <Image
                    src="/images/auth-login-bg.jpg"
                    alt="Students studying inside StudySpace quiet pod"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover object-center scale-105"
                />

                {/* Dark Gradient Overlays for Readability & Cinematic Mood */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70 z-10" />
                <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply z-10" />

                {/* Top Header inside Left Hero */}
                <div className="relative z-20 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-600/90 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white drop-shadow">StudySpace</span>
                    </Link>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-violet-200">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Silent Focus Sanctuary</span>
                    </div>
                </div>

                {/* Bottom Narrative Content */}
                <div className="relative z-20 max-w-lg space-y-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Across 5 Academic Hubs
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Welcome Back To Your <br />
                            <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                                Distraction-Free Flow State
                            </span>
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Sign in to access your reserved quiet desks, overnight stay pods, and Nilkhet-curated academic textbook borrowing history.
                        </p>
                    </div>

                    {/* Quick Highlights Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <Zap className="w-4 h-4 text-amber-400 mb-1" />
                            <div className="text-xs font-bold text-white">100% Power</div>
                            <div className="text-[10px] text-slate-300">Auto Generator</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <Wifi className="w-4 h-4 text-cyan-400 mb-1" />
                            <div className="text-xs font-bold text-white">1 Gbps Fiber</div>
                            <div className="text-[10px] text-slate-300">BDIX High-Speed</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <Bed className="w-4 h-4 text-emerald-400 mb-1" />
                            <div className="text-xs font-bold text-white">Study & Stay</div>
                            <div className="text-[10px] text-slate-300">Overnight Pods</div>
                        </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/40 text-violet-300 flex items-center justify-center font-bold text-xs shrink-0">
                            NJ
                        </div>
                        <div className="text-xs">
                            <p className="text-slate-200 italic leading-snug">
                                &ldquo;8-10 hours of uninterrupted pin-drop silence every day helped me ace my FCPS Part-1 preparation.&rdquo;
                            </p>
                            <span className="text-[11px] font-semibold text-violet-300 mt-1 block">
                                — Dr. Nusrat Jahan, Dhanmondi Focus Hub
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Clean Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-violet-600 font-bold text-xl">
                            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span>StudySpace</span>
                        </Link>
                    </div>

                    <div className="text-left space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-sm text-slate-600">
                            Don&apos;t have an account yet?{' '}
                            <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-700 underline underline-offset-2">
                                Create a new account
                            </Link>
                        </p>
                    </div>

                    {/* Login Card Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Input
                                label="Email address"
                                type="email"
                                required
                                placeholder="e.g. sakib@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 group"
                                isLoading={loginMutation.isPending}
                            >
                                <span>Sign In</span>
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </div>

                    {/* Admin Access & Credentials Hint */}
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Need demo credentials?</span> Explore test logins for students and admins on our{' '}
                            <Link href="/credentials" target="_blank" className="font-bold underline text-amber-900 hover:text-amber-700">
                                Admin Access Credentials page
                            </Link>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
