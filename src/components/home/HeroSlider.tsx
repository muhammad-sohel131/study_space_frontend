'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, MapPin } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/diwvm1tyg/image/upload/v1778246114/noisy-study-room_mrnz7v.jpg',
    title: 'Study Anywhere Without Distractions',
    description: 'Escape noisy shared rooms and crowded environments. Find a peaceful and comfortable study space designed for deep focus and productivity.',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/diwvm1tyg/image/upload/v1778246106/modern-study-space_hfttei.jpg',
    title: 'Premium Quiet Study Environment',
    description: 'Experience a calm, modern, and distraction-free study atmosphere with comfortable seating, elegant interiors, and a productivity-focused environment.',
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/diwvm1tyg/image/upload/v1778246104/online-seat-booking_otl1uz.jpg',
    title: 'Book Your Seat Online Instantly',
    description: 'Check real-time seat availability, choose your preferred seat, and reserve your study space online within seconds from anywhere.',
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/diwvm1tyg/image/upload/v1778246112/productive-study-session_lvwude.jpg',
    title: 'Boost Your Focus & Productivity',
    description: 'Study smarter in a focused environment built for students, freelancers, and learners who want better concentration and efficient study sessions.',
  }
];

export function HeroSlider() {
  return (
    <section className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800/50 group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{
            delay: 9000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          loop={true}
          className="w-full h-[600px] lg:h-[700px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image with Zoom Animation */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className="object-cover object-center transform transition-transform duration-[10000ms] ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
                />
                {/* Dark Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
              </div>

              {/* Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto flex items-center">
                <div className="w-full max-w-4xl px-6 sm:px-12 lg:px-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    Premium Study Space
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                    {slide.title.split(' ').map((word, i, arr) => {
                      if (i >= arr.length - 2) {
                        return <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">{word} </span>
                      }
                      return word + ' '
                    })}
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/centers">
                      <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1">
                        Book Seat
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/centers">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-full text-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                        Explore Centers
                        <MapPin className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Arrows */}
          <div className="hidden md:flex absolute right-8 bottom-8 z-30 gap-3">
            <button className="swiper-button-prev-custom w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/40 hover:bg-indigo-600 border border-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 group/btn cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover/btn:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button className="swiper-button-next-custom w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/40 hover:bg-indigo-600 border border-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 group/btn cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover/btn:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          {/* Pagination container */}
          <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 z-30 flex items-center swiper-pagination-custom"></div>
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.5);
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px;
          background-color: #6366f1; /* indigo-500 */
        }
      `}</style>
    </section>
  );
}
