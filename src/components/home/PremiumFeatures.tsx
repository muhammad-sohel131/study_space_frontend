'use client';

import { Zap, TrendingUp, CheckCircle, ArrowRight, Sparkles, Shield, Star, Award, Clock } from "lucide-react";
import { FC, useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Reserve your seat in seconds with our intuitive booking system. No waiting, no hassle.',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    delay: 0.1,
    stats: '2.5s Avg. Booking',
    tag: 'Fastest',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    desc: 'Monitor your study hours and achievements with detailed analytics and insights.',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    delay: 0.2,
    stats: '93% Improvement',
    tag: 'Analytics',
  },
  {
    icon: CheckCircle,
    title: 'Quality Assurance',
    desc: 'All centers meet our strict standards for cleanliness, comfort, and productivity.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    delay: 0.3,
    stats: '4.9/5 Rating',
    tag: 'Premium',
  },
];

const FeatureItem: FC<{
  feature: typeof features[0];
  index: number;
  isInView: boolean;
}> = ({ feature, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  // 3D tilt effect - only on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const springY = useSpring(y, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 25;
    const rotateY = (e.clientX - centerX) / 25;
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
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.7,
          delay: feature.delay + 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }
      } : {
        opacity: 0,
        y: 40,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }
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
      {/* Glowing background effect - improved */}
      <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl opacity-60`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20`} />
      </div>

      {/* Main Card */}
      <div
        className={`relative bg-white rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
          isHovered
            ? 'border-transparent shadow-2xl scale-[1.02]'
            : 'border-slate-200/80 shadow-lg hover:shadow-xl'
        }`}
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Icon Section */}
          <div className="relative flex-shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 bg-gradient-to-r ${feature.bgGradient} rounded-2xl flex items-center justify-center relative`}
            >
              <Icon className={`w-7 h-7 text-${feature.gradient.split(' ')[1] || 'violet-600'} relative z-10`} />
              
              {/* Icon glow effect */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.3 : 1,
                  opacity: isHovered ? 0.6 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} blur-xl`}
              />
            </motion.div>

            {/* Index Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
              {index + 1}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5 text-violet-600" />
              </motion.div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              {feature.desc}
            </p>

            {/* Stats & Tags - Always visible but animated on hover */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-medium text-slate-700">{feature.stats}</span>
              </div>

              <motion.div
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  backgroundColor: isHovered ? '#8b5cf6' : '#f1f5f9',
                }}
                transition={{ duration: 0.3 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                  isHovered 
                    ? 'text-white' 
                    : `bg-gradient-to-r ${feature.bgGradient} text-slate-700`
                }`}
              >
                {feature.tag}
              </motion.div>

              {/* Animated progress indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '40px' : '0px' }}
                transition={{ duration: 0.4 }}
                className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Bottom border gradient on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-b-2xl origin-left`}
        />
      </div>
    </motion.div>
  );
};

const PremiumFeatures: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const isInView = useInView(sectionRef, { 
    amount: 0.15,
    once: false,
  });

  // Track when features should animate
  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden min-h-screen"
    >
      {/* Background Elements - Simplified for performance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-64 -right-64 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-64 -left-64 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section - Always visible */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4"
          >
            Premium Features
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="h-1 w-24 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full mx-auto"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4"
          >
            Everything you need for an exceptional study experience
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="space-y-6 md:space-y-8">
          {features.map((feature, idx) => (
            <FeatureItem
              key={feature.title}
              feature={feature}
              index={idx}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
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
          className="text-center mt-16"
        >

          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ students
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Rated 4.9/5
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              24/7 Support
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFeatures;