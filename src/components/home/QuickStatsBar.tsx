'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Wifi, BookOpen, Star, Flame, Zap, Bed } from 'lucide-react';

const stats = [
  {
    icon: MapPin,
    value: '10',
    label: 'Premier Academic Hubs',
    sublabel: 'Dhaka, Chattogram, Sylhet, Rajshahi & Campus Zones',
    gradient: 'from-violet-500 to-indigo-500',
    iconBg: 'bg-violet-500/10 text-violet-600',
    borderColor: 'hover:border-violet-300',
    href: '/centers',
  },
  {
    icon: Wifi,
    value: '1 Gbps',
    label: 'BDIX Dedicated Fiber',
    sublabel: '100% Generator Backup (Zero load-shedding)',
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/10 text-blue-600',
    borderColor: 'hover:border-blue-300',
    href: '/centers',
  },
  {
    icon: Bed,
    value: 'Study & Stay',
    label: 'Overnight Residency',
    sublabel: 'Pods, suites & bunks with live bed availability',
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    borderColor: 'hover:border-emerald-300',
    href: '/centers',
  },
  {
    icon: BookOpen,
    value: 'Dual Access',
    label: 'Academic Book Bank',
    sublabel: 'Affordable textbook rentals & instant PDF previews',
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/10 text-amber-600',
    borderColor: 'hover:border-amber-300',
    href: '/library',
  },
];

export function QuickStatsBar() {
  return (
    <section className="relative -mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Live Activity Banner with Bangladesh Perspective */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl border border-indigo-500/20 mb-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm sm:text-base font-medium text-slate-200">
            <strong className="text-emerald-400 font-semibold">280+ students</strong> currently studying live across 10 hubs nationwide
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/centers" className="flex items-center gap-1.5 text-xs sm:text-sm text-indigo-200 bg-indigo-500/20 hover:bg-indigo-500/30 px-3 py-1 rounded-full border border-indigo-400/30 transition-colors cursor-pointer">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Seats from <strong className="text-emerald-400 font-bold">৳35/hr</strong></span>
          </Link>
          <Link href="/centers" className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1 rounded-full border border-emerald-400/30 transition-colors cursor-pointer">
            <Bed className="w-3.5 h-3.5 text-emerald-400" />
            <span>Study & Stay from <strong className="text-white font-bold">৳680/night</strong></span>
          </Link>
          <Link href="/centers" className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-300/90 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/20 transition-colors cursor-pointer">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Occupancy: <strong className="text-white">68% Available</strong></span>
          </Link>
        </div>
      </motion.div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="cursor-pointer block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' } }}
                className={`group relative h-full bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 ${stat.borderColor} transition-all duration-300 ease-out`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Bangladesh
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-sans">
                  <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 leading-snug">
                  {stat.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {stat.sublabel}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
