import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, Zap, TrendingUp, CheckCircle, Clock, ShieldCheck, Star, Search, CalendarCheck } from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import FeatureSection from '@/components/home/FeatureSection';
import PremiumFeatures from '@/components/home/PremiumFeatures';
import CoreOfferings from '@/components/home/CoreOfferings';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <HeroSlider />

            {/* Features Section */}
           <FeatureSection />

            {/* Premium Features Section */}
           <PremiumFeatures />

            {/* Our Offerings Section */}
            <CoreOfferings />

            {/* How It Works Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get started with StudySpace in three simple steps.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-violet-100 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="h-12 w-12 bg-violet-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">1</div>
                            <div className="h-16 w-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Find a Center</h3>
                            <p className="text-slate-600">Browse our premium locations and find the perfect environment for your studies.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="h-12 w-12 bg-violet-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">2</div>
                            <div className="h-16 w-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4">
                                <CalendarCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Book Your Seat</h3>
                            <p className="text-slate-600">Select your preferred date, time, and specific seat using our interactive map.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="h-12 w-12 bg-violet-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">3</div>
                            <div className="h-16 w-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Start Studying</h3>
                            <p className="text-slate-600">Arrive at the center, check in, and enjoy your highly focused, distraction-free session.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Students Say</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Join a community of motivated learners achieving their academic goals.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah M.', role: 'Medical Student', quote: 'StudySpace has completely transformed my prep for the USMLE. The distraction-free environment and comfortable seating let me pull 8-hour sessions with ease.' },
                            { name: 'David K.', role: 'Software Engineer', quote: 'I use StudySpace for my remote work and upskilling. The internet is blazingly fast, and being around other focused people keeps me accountable.' },
                            { name: 'Emily R.', role: 'Law Student', quote: 'The ability to borrow reference books on-site is a game changer. The facilities are top-notch and the booking process is incredibly smooth.' }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-md transition-all">
                                <div className="flex gap-1 text-amber-400 mb-6">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                                <p className="text-slate-700 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-violet-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Study Experience?</h2>
                    <p className="text-lg text-violet-100 mb-8">Join thousands of students who are achieving more with StudySpace.</p>
                    <Link href="/centers">
                        <Button size="lg" variant="secondary" className="px-8 text-violet-600 bg-white hover:bg-slate-50">
                            Get Started Today
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
