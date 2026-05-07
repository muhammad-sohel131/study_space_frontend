'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_MY_BOOKINGS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { CalendarDays, Clock, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Booking {
  id: string;
  centerId: string;
  seatId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name}</h1>
        <p className="text-slate-500 mt-2">Manage your study sessions and bookings.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">My Bookings</h2>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings?.length === 0 ? (
          <Card className="text-center py-12">
            <CalendarDays className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-500">You haven't booked any study seats yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings?.map((booking) => (
              <Card key={booking.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                    Seat {booking.seatId.substring(0, 5)}...
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-600 text-sm">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {format(parseISO(booking.startTime), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <CreditCard className="w-4 h-4 mr-2" />
                    ${booking.totalPrice.toFixed(2)} ({booking.paymentStatus})
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
