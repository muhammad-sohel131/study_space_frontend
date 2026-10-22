'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, BookOpen, ShieldCheck, TrendingUp, Sparkles, ArrowRight, Zap, Check } from 'lucide-react';

const offerings = [
  {
    icon: CalendarCheck,
    title: 'Interactive Seat Map Booking',
    description: 'Select your exact preferred desk from an interactive 2D/3D floor plan. Book by the hour or grab discounted monthly student passes.',
    gradient: 'from-violet-500 to-purple-500',
    borderHover: 'hover:border-violet-500/60',
    tag: 'From ৳35 / hr',
    features: ['Live real-time floor availability', 'Hourly & monthly flexible passes', 'Select window seats or silent zone desks'],
    href: '/centers',
    ctaText: 'Explore Live Seat Maps',
  },
  {
    icon: BookOpen,
    title: 'Nilkhet-Curated Resource Library',
    description: 'Borrow medical, engineering, BCS, and academic textbooks for your session, or purchase hard copies at student discounts.',
    gradient: 'from-blue-500 to-cyan-500',
    borderHover: 'hover:border-blue-500/60',
    tag: '10,000+ Volumes',
    features: ['BCS MP3, Professors & Arifur Rahman guides', 'Medical Anatomy, Guyton & Davidson textbooks', 'Discounted student book purchases'],
    href: '/library',
    ctaText: 'Browse Book Bank',
  },
  {
    icon: ShieldCheck,
    title: 'Instant bKash & Nagad Payments',
    description: 'Frictionless checkout powered by SSLCommerz. Pay in seconds using bKash, Nagad, Rocket, or local debit/credit cards.',
    gradient: 'from-emerald-500 to-teal-500',
    borderHover: 'hover:border-emerald-500/60',
    tag: 'bKash • Nagad • Cards',
    features: ['Instant QR digital access code on booking', 'Zero hidden security deposits or fees', 'Direct confirmation SMS and email pass'],
    href: '/centers',
    ctaText: 'View Pricing & Plans',
  },
  {
    icon: TrendingUp,
    title: 'Study Analytics & Goal Streaks',
    description: 'Monitor your deep work hours, consistency streaks, and productivity milestones with your personal student dashboard.',
    gradient: 'from-amber-500 to-orange-500',
    borderHover: 'hover:border-amber-500/60',
    tag: 'Gamified Growth',
    features: ['Track daily & weekly hours logged', 'Earn study badges & discount perks', 'Export session reports for accountability'],
    href: '/dashboard',
    ctaText: 'View Dashboard Demo',
  },
];

export function CoreOfferingsDark() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Ambient gradient mesh */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            Smart Platform Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Everything You Need To <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Excel Academically & Professionally
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            StudySpace is not just a desk; it is an intelligent learning ecosystem designed to streamline your reservations, study materials, and productivity tracking across Bangladesh.
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative bg-slate-900/85 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 ${item.borderHover} transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between`}
              >
                {/* Subtle card hover glow */}
                <div className={`absolute -right-20 -top-20 w-52 h-52 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-300">
                  <span>{item.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
