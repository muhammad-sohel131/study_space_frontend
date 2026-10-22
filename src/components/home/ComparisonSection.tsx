'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Home, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function ComparisonSection() {
  const comparisons = [
    {
      factor: 'Focus & Noise Level',
      homeAndCafe: 'Mess roommate chatter, family visitors, TV noise, and loud Dhaka street honking',
      studySpace: 'Acoustically soundproofed silent zones with guaranteed pin-drop silence',
    },
    {
      factor: 'Power & Internet Reliability',
      homeAndCafe: 'Sudden Dhaka load-shedding, weak IPS fans, and lagging Wi-Fi video lectures',
      studySpace: '100% automated generator backup + 1 Gbps BDIX optical fiber internet',
    },
    {
      factor: 'Physical Ergonomics',
      homeAndCafe: 'Stiff wooden dining chairs or bed slouching leading to chronic back and neck strain',
      studySpace: 'Medical-grade ergonomic mesh chairs and adjustable warm eye-care task lights',
    },
    {
      factor: 'Study Mood & Accountability',
      homeAndCafe: 'Isolation, procrastination, endless social media scrolling, and lost momentum',
      studySpace: 'Surrounded by dedicated BCS, Medical, BUET, and corporate peers in peak flow',
    },
    {
      factor: 'Cost & Amenities Value',
      homeAndCafe: 'Awkward guilt of buying ৳250-300 cafe coffees just to hold a noisy table for 2 hours',
      studySpace: 'Affordable seats from ৳35/hr with unlimited free hot cha, coffee & quiet prayer room',
    },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.12),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            The Productivity Benchmark
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Why Students Switch From Home & Cafes <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              To StudySpace Sanctuaries
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            See how our purpose-engineered learning centers solve Dhaka’s real study hurdles and double your daily output.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Home / Crowded Café */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-950/60 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-200">Home, Mess or Commercial Café</h3>
                    <p className="text-xs text-slate-500">Unpredictable distractions & lost focus</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  Suboptimal
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 my-4">
                {comparisons.map((item, idx) => (
                  <div key={idx} className="py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {item.factor}
                    </span>
                    <div className="flex items-start gap-2.5 text-sm text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{item.homeAndCafe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-center text-xs text-rose-400 font-medium">
              Average lost productivity: ~3.5 hours every day
            </div>
          </motion.div>

          {/* Card 2: StudySpace (The Winner) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-b from-violet-950/60 via-slate-900/90 to-indigo-950/60 rounded-3xl p-6 sm:p-8 border-2 border-violet-500/50 shadow-2xl shadow-violet-950/50 flex flex-col justify-between"
          >
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-white" />
              100% Focus Guarantee
            </div>

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-violet-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-300 flex items-center justify-center border border-violet-400/30">
                    <Sparkles className="w-6 h-6 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">StudySpace Hubs</h3>
                    <p className="text-xs text-violet-300">Purpose-engineered deep work sanctuary</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  Ideal Environment
                </span>
              </div>

              <div className="divide-y divide-violet-800/30 my-4">
                {comparisons.map((item, idx) => (
                  <div key={idx} className="py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block mb-1">
                      {item.factor}
                    </span>
                    <div className="flex items-start gap-2.5 text-sm text-slate-100 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-500/40">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{item.studySpace}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-violet-800/40">
              <Link href="/centers">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-violet-600/30">
                  <span>Experience The Difference — Book Desk from ৳35/hr</span>
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
