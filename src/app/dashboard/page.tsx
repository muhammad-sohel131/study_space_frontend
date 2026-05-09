'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_MY_BOOKINGS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { CalendarDays, Clock, CreditCard, MapPin, Armchair, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface Booking {
  id: string;
  centerId: string;
  seatId: string;
  startTime: string;
  endTime: string;
  bookingType: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  seat?: {
    seatNumber: string;
    type: string;
  };
  center?: {
    name: string;
    location: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [mounted, user, router]);



  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myBookings: Booking[] }>(GET_MY_BOOKINGS);
      return response.myBookings;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user.name.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                You have {bookings?.filter(b => b.status === 'confirmed').length || 0} active sessions today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Home
              </Link>
              <Link
                href="/centers"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all group"
              >
                Book New Seat
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            Recent Bookings
          </h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <Card className="text-center py-20 bg-white border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8">
              It looks like you haven't booked any study spaces yet.
            </p>
            <Link href="/centers">
              <button className="text-indigo-600 font-bold hover:underline">Browse Centers</button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="group relative overflow-hidden bg-white border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all duration-300">
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${booking.status === 'confirmed' ? 'bg-emerald-500' :
                  booking.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {booking.center?.name || 'Study Center'}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.center?.location || 'Location'}
                      </div>
                    </div>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'success' :
                        booking.status === 'pending' ? 'warning' : 'outline'
                    }>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <Armchair className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seat Number</p>
                          <p className="text-sm font-bold text-slate-900">{booking.seat?.seatNumber || 'N/A'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                        {booking.bookingType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <Clock className="h-3 w-3 mr-1" />
                          Arrival
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                          {format(parseISO(booking.startTime), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <Clock className="h-3 w-3 mr-1" />
                          Departure
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                          {format(parseISO(booking.endTime), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount Paid</p>
                      <p className="text-lg font-black text-slate-900">৳{booking.totalPrice.toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{booking.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
