'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, BookOpen, Users, Coffee, ArrowRight, Check, Sparkles, Bed } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const environments = [
  {
    id: 'quiet-pods',
    category: 'silent',
    title: 'Private Silent Focus Pods',
    tagline: 'Escape noisy mess rooms and crowded hostels for deep exam prep',
    image: '/images/quiet-study-zone.jpg',
    badge: '100% Pin-Drop Silence',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    noiseLevel: '< 30 dB (Whisper Silent)',
    priceTag: 'From ৳35 / hour',
    amenities: [
      'Ergonomic high-back chairs with lumbar support',
      'Personal dimmable warm LED task lamps',
      'Dual multi-plug charging ports for laptops & phones',
      'Acoustic sound-absorbing wooden partition booths',
    ],
    accentGradient: 'from-violet-600 to-indigo-600',
    popularFor: '46th/47th BCS, Medical FCPS & Residency, CA/CMA, IBA & DU admission',
    actionText: 'Reserve Silent Pod',
    actionHref: '/centers',
  },
  {
    id: 'study-stay',
    category: 'stay',
    title: 'Study & Stay Residential Pods',
    tagline: 'Overnight study retreats with quiet sleeping pods, hot showers, and 24/7 desk access',
    image: '/images/quiet-study-zone.jpg',
    badge: 'Overnight Residency (1-7+ Days)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    noiseLevel: 'Silent Sleeping & 24/7 Desk',
    priceTag: 'From ৳680 / night',
    amenities: [
      'Private sound-insulated sleeping pod with fresh linen',
      'Dedicated 24/7 study desk on the main floor',
      'Hot showers, clean washroom, & personal locker',
      'Live vacancy tracking by category (Pod, Suite, Bunk)',
    ],
    accentGradient: 'from-emerald-600 to-indigo-600',
    popularFor: 'Intensive exam cramming, BCS & Medical retreats, students visiting Dhaka',
    actionText: 'Book Overnight Stay',
    actionHref: '/centers',
  },
  {
    id: 'library-lounge',
    category: 'library',
    title: 'Academic Resource Library',
    tagline: 'Center-curated textbooks with physical borrowing and instant digital PDF previews',
    image: '/images/library-reading-zone.jpg',
    badge: 'Curated Academic Books & PDFs',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    noiseLevel: 'Library Ambiance',
    priceTag: 'Rental from ৳15/day',
    amenities: [
      'Comprehensive BCS, Medical, Engineering & IBA textbooks',
      'Dual option: Affordable daily rental or purchase to keep',
      'Instant in-browser PDF preview before reserving',
      'On-site center pickup & return facility',
    ],
    accentGradient: 'from-emerald-600 to-teal-600',
    popularFor: 'Textbook revisions, thesis writing, medical gross anatomy & literature',
    actionText: 'Browse Academic Books',
    actionHref: '/library',
  },
  {
    id: 'collab-room',
    category: 'group',
    title: 'Collaborative Discussion Suites',
    tagline: 'Sound-isolated glass suites for team presentations & hackathon sprints',
    image: '/images/collaborative-room.jpg',
    badge: 'Team Ready (4-10 People)',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
    noiseLevel: 'Conversational Zone',
    priceTag: '৳199 / hour (Entire Suite)',
    amenities: [
      '65" 4K presentation display with HDMI & wireless cast',
      'Wall-to-wall magnetic dry-erase whiteboards',
      'Conference audio & high-speed sharing network',
      'Modular tables designed for flexible group setups',
    ],
    accentGradient: 'from-blue-600 to-cyan-600',
    popularFor: 'BUET, DU, NSU & BRACU student projects, coding sprints & group tutoring',
    actionText: 'Reserve Discussion Suite',
    actionHref: '/centers',
  },
  {
    id: 'cafe-lounge',
    category: 'break',
    title: 'Artisan Café & Break Lounge',
    tagline: 'Recharge your mind with hot tea, coffee, snacks, and dedicated prayer space',
    image: '/images/cafe-lounge.jpg',
    badge: 'Unlimited Hot Cha & Coffee',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    noiseLevel: 'Gentle Coffee Shop Vibe',
    priceTag: 'Complimentary for Students',
    amenities: [
      'Fresh espresso coffee bar, deshi rong cha & green tea',
      'Dedicated quiet prayer room & clean ablution (wudu) area',
      'Microwave, refrigerator & dining counter for homemade meals',
      'Lush indoor greenery with mood-lifting natural sunlight',
    ],
    accentGradient: 'from-amber-600 to-orange-600',
    popularFor: 'Study breaks, quick meals, prayers & informal academic discussions',
    actionText: 'Explore Center Lounges',
    actionHref: '/centers',
  },
];

const filterTabs = [
  { id: 'all', label: 'All Environments', icon: Sparkles },
  { id: 'stay', label: 'Study & Stay (Overnight)', icon: Bed },
  { id: 'silent', label: 'Silent Focus Pods', icon: VolumeX },
  { id: 'library', label: 'Resource Library', icon: BookOpen },
  { id: 'group', label: 'Group Suites', icon: Users },
  { id: 'break', label: 'Café & Prayer Room', icon: Coffee },
];

export function EnvironmentsGallery() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredEnvironments =
    activeTab === 'all'
      ? environments
      : environments.filter((env) => env.category === activeTab);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-4 border border-violet-200">
            <Sparkles className="w-4 h-4 text-violet-600" />
            World-Class Study Environments
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Choose Your Ideal <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Productivity Atmosphere
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every student studies differently. Leave the noise of crowded mess houses and dining tables behind. From pin-drop silent booths to collaborative suites, find your perfect study zone in Dhaka.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredEnvironments.map((env) => (
              <motion.div
                key={env.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-200/80 hover:shadow-2xl hover:border-violet-300 transition-all duration-500 flex flex-col"
              >
                {/* Image Container with Hover Zoom & Badge */}
                <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-900">
                  <Image
                    src={env.image}
                    alt={env.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-white/95 shadow-sm ${env.badgeColor}`}>
                      {env.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/85 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                      {env.priceTag}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-4 left-6 right-6 z-20">
                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {env.title}
                    </h3>
                    <p className="text-sm text-slate-200 line-clamp-1 drop-shadow mt-0.5">
                      {env.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Content & Features */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-bold text-slate-400">
                      <span>Included Amenities</span>
                      <span className="text-violet-600 normal-case font-semibold">{env.noiseLevel}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {env.amenities.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="mt-0.5 w-4 h-4 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl">
                      <strong className="text-slate-800">Popular For:</strong> {env.popularFor}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-3">
                    <Link href={env.actionHref} className="flex-1">
                      <Button className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-xl h-12 transition-all duration-300 group/btn shadow-md hover:shadow-violet-500/25 flex items-center justify-center">
                        <span>{env.actionText}</span>
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
