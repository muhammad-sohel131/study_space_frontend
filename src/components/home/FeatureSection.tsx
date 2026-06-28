'use client';

import { BookOpen, MapPin, Users, Sparkles, ArrowRight } from "lucide-react";
import { FC, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const features = [
  {
    icon: MapPin,
    title: "Premium Locations",
    description:
      "Carefully selected study centers with optimal environments for maximum focus and productivity.",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    stats: "50+ Locations",
  },
  {
    icon: BookOpen,
    title: "Vast Library",
    description:
      "Access thousands of books to borrow or purchase. Find exactly what you need for your studies.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    stats: "10K+ Books",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Connect with like-minded students who share your commitment to excellence and growth.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    stats: "5K+ Members",
  },
];

const FeatureSection: FC = () => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isInView = useInView(ref, { amount: 0.15, once: false });

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  return (
    <section
      ref={ref}
      className="py-28 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading with Animated Underline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Premium Features
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Why StudySpace?
            <motion.span
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-2 mx-auto max-w-[200px]"
            />
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to reach your peak productivity
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  x: springX,
                  y: springY,
                }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Icon with glowing effect */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <motion.div
                      animate={{
                        scale: activeIndex === index ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl bg-white/30 blur-xl"
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Stats badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        activeIndex === index
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"
                    >
                      <span className="text-sm font-semibold text-slate-700">
                        {feature.stats}
                      </span>
                    </motion.div>

                    {/* Learn more link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={
                        activeIndex === index
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <button
                        className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Decorative corner accent */}
                  <motion.div
                    animate={
                      activeIndex === index
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-violet-200/50 transition-all duration-300"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;