'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { REGISTER_MUTATION } from '@/graphql/mutations';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookOpen, Sparkles, CheckCircle2, Bed, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerMutation = useMutation({
        mutationFn: async () => {
            const variables = { registerInput: { name, email, password } };
            return graphqlClient.request<{ register: { accessToken: string; user: any } }>(REGISTER_MUTATION, variables);
        },
        onSuccess: (data) => {
            setAuth(data.register.accessToken, data.register.user);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.errors?.[0]?.message || 'Failed to register');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate();
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
            {/* Left Column: Visual Showcase with Generated Study Hub & Stay Pods Image */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden bg-slate-950">
                {/* Background Image */}
                <Image
                    src="/images/auth-register-bg.jpg"
                    alt="Students studying at StudySpace center with overnight pods in background"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover object-center scale-105"
                />

                {/* Dark Gradient Overlays for Readability & Cinematic Mood */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70 z-10" />
                <div className="absolute inset-0 bg-violet-950/25 mix-blend-multiply z-10" />

                {/* Top Header inside Left Hero */}
                <div className="relative z-20 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-600/90 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white drop-shadow">StudySpace</span>
                    </Link>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-violet-200">
                        <Bed className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Seats & Overnight Stay</span>
                    </div>
                </div>

                {/* Bottom Narrative Content */}
                <div className="relative z-20 max-w-lg space-y-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Premium Learning Community
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Start Your Journey To <br />
                            <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                                Peak Productivity Today
                            </span>
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Join ambitious BCS, Medical, BUET, and University students studying across 5 premier academic hubs in Dhaka & Chattogram.
                        </p>
                    </div>

                    {/* Real Platform Perks List */}
                    <div className="space-y-3 pt-2">
                        {[
                            'Interactive floor plan seat selection from ৳35/hour',
                            'Overnight Study & Stay pods with live empty bed tracking',
                            'Affordable textbook borrowing from ৳15/day & PDF previews',
                            '100% automated generator backup & 1 Gbps BDIX fiber Wi-Fi',
                        ].map((perk, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <span>{perk}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trust Banner */}
                    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-white">5 Premier Centers</div>
                            <div className="text-[11px] text-slate-400">Dhanmondi • Nilkhet • Uttara • Mirpur • CTG</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-emerald-400">bKash & Nagad</div>
                            <div className="text-[11px] text-slate-400">Zero Security Deposit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Clean Registration Form */}
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
                            Create a new account
                        </h1>
                        <p className="text-sm text-slate-600">
                            Already registered?{' '}
                            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 underline underline-offset-2">
                                Sign in to your account
                            </Link>
                        </p>
                    </div>

                    {/* Registration Card Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                placeholder="e.g. Tanvir Hossain"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                label="Email address"
                                type="email"
                                required
                                placeholder="e.g. tanvir@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                label="Password"
                                type="password"
                                required
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 group"
                                isLoading={registerMutation.isPending}
                            >
                                <span>Create Account</span>
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </div>

                    {/* Security & Instant Activation Notice */}
                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                            Instant account activation. By registering, you agree to StudySpace quiet room community guidelines.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
