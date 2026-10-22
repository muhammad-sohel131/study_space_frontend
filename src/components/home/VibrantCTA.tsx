'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, MapPin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function VibrantCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-950 relative overflow-hidden text-white">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-200 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Join The Top 1% Focused Learners in Bangladesh
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white"
        >
          Ready to Transform Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-violet-200 via-white to-cyan-200 bg-clip-text text-transparent">
            Study Experience & Productivity?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-xl text-violet-100/90 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Reserve your ergonomic desk, connect to gigabit fiber with zero load-shedding, and achieve your academic dreams in a distraction-free sanctuary.
        </motion.p>

        {/* Dual CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/centers" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 !bg-white hover:!bg-slate-100 !text-violet-950 font-extrabold rounded-2xl text-base shadow-2xl shadow-violet-900/50 hover:scale-105 transition-all duration-300"
            >
              <span className="text-violet-950 font-extrabold">Book Seat or Overnight Stay</span>
              <ArrowRight className="ml-2 w-5 h-5 text-violet-700 stroke-[2.5]" />
            </Button>
          </Link>
          <Link href="/library" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/25 rounded-2xl text-base backdrop-blur-md transition-all duration-300"
            >
              <span>Explore Academic Library</span>
            </Button>
          </Link>
        </motion.div>

        {/* Social Proof Avatar Stack */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-violet-200">
          <div className="flex -space-x-3">
            {['/images/avatar-nusrat.jpg', '/images/avatar-tanvir.jpg', '/images/avatar-emily.jpg'].map((src, i) => (
              <div key={i} className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500 shadow-md">
                <Image src={src} alt="Student avatar" fill sizes="40px" className="object-cover" />
              </div>
            ))}
          </div>
          <span className="font-medium">
            Join ambitious <strong className="text-white font-bold">BCS, Medical & University learners</strong> across Bangladesh
          </span>
        </div>

        {/* 4 Micro Trust Badges */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-violet-200/80">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Digital Confirmation</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SSLCommerz Secured (bKash/Nagad)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Seats from ৳35/hr • Stays from ৳680</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>5 Academic Hubs Across Dhaka & CTG</span>
          </div>
        </div>

      </div>
    </section>
  );
}
