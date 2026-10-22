'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote, Award } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Nusrat Jahan',
    role: 'Medical Scholar • FCPS Part-1 Candidate (DMC)',
    center: 'Dhanmondi Focus Hub',
    avatar: '/images/avatar-nusrat.jpg',
    quote: 'Preparing for FCPS in a crowded hostel was nearly impossible. StudySpace Dhanmondi gives me 8-10 hours of pure, distraction-free focus every day. The pin-drop silence and ergonomic chairs are unmatched in Dhaka.',
    rating: 5,
    tag: 'Verified Medical Scholar',
  },
  {
    name: 'Sakib Ahmed',
    role: 'Lead Software Engineer • Remote Tech Professional',
    center: 'Banani Tech Hub',
    avatar: '/images/avatar-tanvir.jpg',
    quote: 'Dhaka’s frequent load-shedding and sluggish Wi-Fi used to disrupt my coding sprints. With 1 Gbps dedicated BDIX fiber and automated generator backup, I can work and upskill with total peace of mind.',
    rating: 5,
    tag: 'Verified Tech Lead',
  },
  {
    name: 'Ayesha Siddiqua',
    role: '46th BCS Aspirant • University of Dhaka',
    center: 'Nilkhet & Palashi Hub',
    avatar: '/images/avatar-emily.jpg',
    quote: 'Having the extensive Nilkhet-curated book bank right beside my study desk is incredible. Booking my favorite silent pod takes 10 seconds via bKash, and the unlimited tea keeps me alert during long revisions.',
    rating: 5,
    tag: 'Verified BCS Candidate',
  },
];

export function TestimonialsWithAvatars() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Student Stories & Social Proof
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Loved By Thousands of <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Ambitious Learners Across Bangladesh
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Hear from students and professionals who achieved their biggest goals in our study spaces.
          </p>
        </div>

        {/* Testimonials 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-violet-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-violet-200 group-hover:text-violet-400 transition-colors" />
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info with Photographic Avatar */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-violet-500/30 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.name}</h3>
                    <CheckCircle className="w-3.5 h-3.5 text-violet-600 fill-violet-100" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.role}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                    {t.center}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats Ticker */}
        <div className="mt-16 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-slate-900">4.95 / 5</div>
            <div className="text-xs font-medium text-slate-500">Google & Facebook Reviews</div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-200" />
          <div>
            <div className="text-2xl font-black text-slate-900">25,000+</div>
            <div className="text-xs font-medium text-slate-500">Study Hours Logged in Dhaka</div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-200" />
          <div>
            <div className="text-2xl font-black text-slate-900">98.2%</div>
            <div className="text-xs font-medium text-slate-500">Exam Pass & Target Success Rate</div>
          </div>
        </div>

      </div>
    </section>
  );
}
