'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_BOOKINGS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { CalendarDays, Clock, MapPin, Armchair, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AllBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['allBookings'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allBookings: any[] }>(GET_ALL_BOOKINGS);
      return response.allBookings;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Bookings</h2>
        <p className="text-slate-500 font-medium">Monitoring all active and past study sessions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking / User</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Center & Seat</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">User #{booking.id.substring(0, 5)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {booking.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      {booking.center?.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-2 mt-1">
                      <Armchair className="h-3.5 w-3.5 text-slate-400" />
                      Seat {booking.seat?.seatNumber} ({booking.bookingType})
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {format(parseISO(booking.startTime), 'MMM d, yyyy')}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={
                      booking.status === 'confirmed' ? 'success' : 
                      booking.status === 'pending' ? 'warning' : 'outline'
                    }>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-black text-slate-900">৳{booking.totalPrice}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${
                      booking.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>{booking.paymentStatus}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
