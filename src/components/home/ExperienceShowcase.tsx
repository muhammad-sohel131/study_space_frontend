'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wifi, Coffee, Zap, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ExperienceShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Column with Panoramic Image & Floating Glass Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative"
          >
            {/* Background Glow Ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-teal-500/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

            {/* Main Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/study-amenities-banner.jpg"
                  alt="Students studying in StudySpace modern lounge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-black/20" />
              </div>

              {/* Floating Pill Top Left: BDIX WiFi */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-violet-300">Dual Fiber & BDIX</div>
                  <div className="text-sm font-bold">1 Gbps Dedicated Speed</div>
                </div>
              </motion.div>

              {/* Floating Pill Bottom Right: Load-shedding free backup */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-emerald-300">100% Auto Generator</div>
                  <div className="text-sm font-bold">Zero Load-Shedding Downtime</div>
                </div>
              </motion.div>

              {/* Center Ambiance Tag */}
              <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md text-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>Unlimited Deshi Rong Cha, Green Tea & Coffee</span>
              </div>
            </div>
          </motion.div>

          {/* Right Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              The Deep Work Sanctuary
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Engineered For <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Peak Academic & Career Focus
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              Say goodbye to Dhaka’s traffic fatigue, mess gossip, unexpected load-shedding, and unstable Wi-Fi. Experience an oasis of uninterrupted productivity.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                {
                  title: 'Acoustically Treated Silent Zones',
                  desc: 'Sound-dampening walls keep ambient noise below 30 dB for deep BCS, Medical & GRE focus.',
                  color: 'bg-violet-100 text-violet-700',
                },
                {
                  title: 'Medical-Grade Ergonomic Seating',
                  desc: 'Maintain healthy posture through 8-10 hour study marathons without muscle stiffness.',
                  color: 'bg-blue-100 text-blue-700',
                },
                {
                  title: 'Dedicated Quiet Prayer & Ablution (Wudu) Space',
                  desc: 'Separate, clean, and peaceful prayer facilities for male and female learners.',
                  color: 'bg-emerald-100 text-emerald-700',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className={`mt-0.5 w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/centers">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-violet-500/25">
                  Check Center Availability Near You
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
