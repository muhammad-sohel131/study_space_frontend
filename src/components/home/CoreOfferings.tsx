'use client';

import { Clock, BookOpen, ShieldCheck, Sparkles, ArrowRight, Award, Users, Globe } from "lucide-react";
import { FC, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const offerings = [
  {
    icon: Clock,
    title: 'Flexible Booking',
    description: 'Book by the hour or month. Choose your exact seat in advance and guarantee your spot during peak times.',
    gradient: 'from-violet-500 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
    color: 'violet',
    delay: 0.1,
    features: ['Hourly & Monthly', 'Guaranteed Spot', 'Peak Time Access'],
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access our extensive collection of textbooks and reference materials. Buy to keep or borrow for your session.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    color: 'blue',
    delay: 0.2,
    features: ['10K+ Books', 'Borrow or Buy', 'All Subjects'],
  },
  {
    icon: ShieldCheck,
    title: 'Seamless Payments',
    description: 'Pay securely online with SSLCommerz. Instant confirmations and easy management of all your bookings.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    color: 'emerald',
    delay: 0.3,
    features: ['SSLCommerz', 'Instant Confirm', 'Easy Management'],
  },
];

const OfferingCard: FC<{
  offering: typeof offerings[0];
  index: number;
  isInView: boolean;
}> = ({ offering, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = offering.icon;

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 20;
    const rotateY = (e.clientX - centerX) / 20;
    x.set(-rotateY);
    y.set(rotateX);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.7,
          delay: offering.delay + 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }
      } : { 
        opacity: 0, 
        y: 50 
      }}
      style={{
        rotateX: springY,
        rotateY: springX,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className="group relative transform-gpu will-change-transform"
    >
      {/* Background glow */}
      <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-r ${offering.gradient} blur-xl opacity-40`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${offering.gradient} opacity-20`} />
      </div>

      {/* Card */}
      <div
        className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 flex flex-col items-center text-center ${
          isHovered
            ? 'border-transparent shadow-2xl scale-[1.02]'
            : 'border-slate-200/80 shadow-lg hover:shadow-xl'
        }`}
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Icon with animated effects */}
        <div className="relative mb-6">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            className={`w-20 h-20 bg-gradient-to-r ${offering.bgGradient} rounded-2xl flex items-center justify-center relative shadow-sm`}
          >
            <Icon className={`w-9 h-9 text-${offering.color}-600 relative z-10`} />
            
            {/* Icon glow */}
            <motion.div
              animate={{
                scale: isHovered ? 1.4 : 1,
                opacity: isHovered ? 0.5 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${offering.gradient} blur-xl`}
            />

            {/* Border ring */}
            <motion.div
              animate={{
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0.6 : 0,
              }}
              transition={{ duration: 0.4 }}
              className={`absolute -inset-1 rounded-2xl border-2 border-transparent bg-gradient-to-r ${offering.gradient} opacity-0`}
              style={{
                backgroundImage: `linear-gradient(white, white), linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
              }}
            />
          </motion.div>

          {/* Index badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: offering.delay + 0.4 }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-slate-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
          >
            {index + 1}
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            animate={{
              color: isHovered ? '#0f172a' : '#0f172a',
            }}
            className="text-2xl font-bold text-slate-900 mb-3"
          >
            {offering.title}
          </motion.h3>

          <p className="text-slate-600 leading-relaxed mb-5">
            {offering.description}
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {offering.features.map((feature, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0.7,
                  scale: isHovered ? 1 : 0.95,
                }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${offering.bgGradient} text-slate-700 border border-slate-200/50`}
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Learn more link */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 5,
            }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <button
              className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${offering.gradient} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${offering.gradient} rounded-b-2xl origin-left`}
        />

        {/* Corner decoration */}
        <motion.div
          animate={{
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.4 }}
          className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${offering.gradient} rounded-bl-full`}
        />
      </div>
    </motion.div>
  );
};

const CoreOfferings: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { 
    amount: 0.15,
    once: false,
  });

  // Floating particles for background
  const particles = [
    { x: '10%', y: '20%', size: 'w-64 h-64', color: 'violet-200/20', duration: 20 },
    { x: '80%', y: '60%', size: 'w-80 h-80', color: 'blue-200/20', duration: 25 },
    { x: '50%', y: '80%', size: 'w-72 h-72', color: 'emerald-200/15', duration: 22 },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: [1, 1.1, 1],
              x: ['0%', '10%', '-10%', '0%'],
              y: ['0%', '-10%', '10%', '0%'],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${particle.size} bg-${particle.color} rounded-full blur-3xl`}
            style={{
              left: particle.x,
              top: particle.y,
            }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-50/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut",
              }
            } : { 
              opacity: 0, 
              y: 20 
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Our Core Offerings
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.1,
                ease: "easeOut",
              }
            } : { 
              opacity: 0, 
              y: 20 
            }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4"
          >
            Everything You Need to
            <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Succeed in Your Studies
            </span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { 
              scaleX: 1,
              transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }
            } : { 
              scaleX: 0 
            }}
            className="h-1 w-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }
            } : { 
              opacity: 0, 
              y: 20 
            }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4"
          >
            Discover the resources and flexibility we provide to enhance your study routine
          </motion.p>
        </div>

        {/* Offerings Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {offerings.map((offering, idx) => (
            <OfferingCard
              key={offering.title}
              offering={offering}
              index={idx}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.6,
              delay: 0.6,
              ease: "easeOut",
            }
          } : { 
            opacity: 0, 
            y: 30 
          }}
          className="mt-16 pt-10 border-t border-slate-200/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">10,000+</div>
                <div className="text-sm text-slate-500">Active Students</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                <div className="text-sm text-slate-500">Average Rating</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">50+</div>
                <div className="text-sm text-slate-500">Study Centers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreOfferings;