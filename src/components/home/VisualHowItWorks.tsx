'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const steps = [
  {
    step: '01',
    title: 'Choose Your Academic Hub',
    description: 'Explore 5 verified study centers in Dhanmondi, Nilkhet (DU Campus), Uttara, Mirpur, and Chattogram equipped with 100% power backup.',
    image: '/images/step-browse-center.jpg',
    icon: Search,
    gradient: 'from-violet-600 to-indigo-600',
    highlight: '5 Academic Hubs',
  },
  {
    step: '02',
    title: 'Pick Your Desk or Bed Pod & Pay',
    description: 'Select your preferred study desk on interactive floor plans or book overnight stay pods with live vacancy tracking. Pay easily via bKash or Nagad.',
    image: '/images/step-reserve-seat.jpg',
    icon: CalendarCheck,
    gradient: 'from-blue-600 to-cyan-600',
    highlight: 'Seats from ৳35 • Stays from ৳680',
  },
  {
    step: '03',
    title: 'Instant Confirmation & Check-In',
    description: 'Receive your instant digital reservation, check in at the reception desk, plug into high-speed fiber, and study with 100% peace of mind.',
    image: '/images/step-checkin-study.jpg',
    icon: Zap,
    gradient: 'from-emerald-600 to-teal-600',
    highlight: 'Instant Confirmation',
  },
];

export function VisualHowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-200">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            How <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">StudySpace Works</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Reserve your quiet seat and start studying with zero friction in under 60 seconds.
          </p>
        </div>

        {/* 3 Steps with Real Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200/80 hover:border-violet-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

                  {/* Step Number Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-black text-lg flex items-center justify-center shadow-lg font-sans`}>
                      {item.step}
                    </div>
                  </div>

                  {/* Highlight pill */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-md">
                      {item.highlight}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-600">
                    <span>Step {item.step} of 03</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center mt-16">
          <Link href="/centers">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-violet-500/25">
              <span>Book Your First Session Today</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
