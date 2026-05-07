import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 mix-blend-multiply opacity-50" />
        
        {/* Abstract shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Focus Better.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Study Smarter.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-300 mx-auto mb-10">
            Book premium study seats, access dedicated focus zones, and purchase or borrow the resources you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/centers">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Book a Seat <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/books">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                Explore Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to excel</h2>
            <p className="mt-4 text-lg text-slate-500">Designed specifically for students who demand the best environment.</p>
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
    </div>
  );
}
