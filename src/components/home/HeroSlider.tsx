'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  // activeIndex lets us re-key the content per slide, which restarts the per-slide animations
  const [activeIndex, setActiveIndex] = useState(0);
  // controls the scroll-triggered reveal of the whole slider
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // only needs to fire once
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 transition-all duration-1000 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
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
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-[calc(100vh-var(--header-height,80px))] min-h-[480px]"
        >
          {slides.map((slide, slideIdx) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image with Zoom Animation */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className={`object-cover object-center transition-transform duration-[10000ms] ease-out ${
                    activeIndex === slideIdx ? 'scale-110' : 'scale-100'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
                />
                {/* Dark Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
              </div>

              {/* Content — re-keyed on activeIndex so animations replay each time the slide becomes active */}
              <div className="relative z-20 h-full max-w-7xl mx-auto flex items-center">
                <div className="w-full max-w-4xl px-6 sm:px-12 lg:px-20" key={activeIndex === slideIdx ? `active-${slide.id}` : `inactive-${slide.id}`}>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-md opacity-0 animate-slide-in cursor-default hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-colors duration-300"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    Premium Study Space
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1] flex flex-wrap">
                    {slide.title.split(' ').map((word, i, arr) => {
                      const isHighlighted = i >= arr.length - 2;
                      return (
                        <span
                          key={i}
                          className={`opacity-0 animate-slide-in inline-block mr-3 cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
                            isHighlighted
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200 hover:from-indigo-300 hover:to-white'
                              : 'hover:text-indigo-200'
                          }`}
                          style={{ animationDelay: `${0.25 + i * 0.08}s` }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </h1>

                  <p
                    className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed opacity-0 animate-slide-in"
                    style={{ animationDelay: '0.6s' }}
                  >
                    {slide.description}
                  </p>

                  <div
                    className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-in"
                    style={{ animationDelay: '0.75s' }}
                  >
                    <Link href="/centers">
                      <Button size="lg" className="w-full cursor-pointer sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1 hover:scale-105 group/cta">
                        Book Seat
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/centers">
                      <Button size="lg" variant="outline" className="w-full cursor-pointer sm:w-auto h-14 px-8 bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-full text-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 group/cta2">
                        Explore Centers
                        <MapPin className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/cta2:scale-125" />
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
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

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