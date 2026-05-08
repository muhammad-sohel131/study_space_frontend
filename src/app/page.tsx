import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen, Users, MapPin, Zap, TrendingUp, CheckCircle, Clock, ShieldCheck, Star, Search, CalendarCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 rounded-full">
              <span className="text-sm font-semibold text-indigo-600">✨ Your Premium Study Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Focus Deeper.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
                Achieve More.
              </span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-xl text-slate-600 mx-auto mb-8">
              Premium study centers, curated books, and everything you need to concentrate and succeed. Experience the difference of focused learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/centers">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Book a Seat <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/books">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Explore Books
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">50+</p>
                <p className="text-sm text-slate-600 mt-1">Centers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">10K+</p>
                <p className="text-sm text-slate-600 mt-1">Books</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">5K+</p>
                <p className="text-sm text-slate-600 mt-1">Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why StudySpace?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to reach your peak productivity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Locations</h3>
              <p className="text-slate-600">Carefully selected study centers with optimal environments for maximum focus and productivity.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Vast Library</h3>
              <p className="text-slate-600">Access thousands of books to borrow or purchase. Find exactly what you need for your studies.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">Connect with like-minded students who share your commitment to excellence and growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">Premium Features</h2>

          <div className="space-y-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: 'Instant Booking', desc: 'Reserve your seat in seconds with our intuitive booking system.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Track Progress', desc: 'Monitor your study hours and achievements with detailed analytics.' },
              { icon: <CheckCircle className="w-6 h-6" />, title: 'Quality Assurance', desc: 'All centers meet our strict standards for cleanliness and comfort.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 hover:shadow-lg transition-all flex gap-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Offerings Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Offerings</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover the resources and flexibility we provide to enhance your study routine.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Flexible Booking</h3>
              <p className="text-slate-500 leading-relaxed">Book by the hour or month. Choose your exact seat in advance and guarantee your spot during peak times.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Resource Library</h3>
              <p className="text-slate-500 leading-relaxed">Access our extensive collection of textbooks and reference materials. Buy to keep or borrow for your session.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Payments</h3>
              <p className="text-slate-500 leading-relaxed">Pay securely online with SSLCommerz. Instant confirmations and easy management of all your bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get started with StudySpace in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-indigo-100 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">1</div>
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Find a Center</h3>
              <p className="text-slate-600">Browse our premium locations and find the perfect environment for your studies.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">2</div>
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Book Your Seat</h3>
              <p className="text-slate-600">Select your preferred date, time, and specific seat using our interactive map.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 shadow-md text-xl font-bold">3</div>
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
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
      <section className="py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-lg text-indigo-100 mb-8">Join thousands of students who are achieving more with StudySpace.</p>
          <Link href="/centers">
            <Button size="lg" variant="secondary" className="px-8 text-indigo-600 bg-white hover:bg-slate-50">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
