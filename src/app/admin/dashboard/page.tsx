'use client';

import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_BOOKINGS, GET_ALL_PAYMENTS, GET_CENTERS } from '@/graphql/queries';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Users, 
  MapPin, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Armchair
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['allBookings'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allBookings: any[] }>(GET_ALL_BOOKINGS);
      return response.allBookings;
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allPayments: any[] }>(GET_ALL_PAYMENTS);
      return response.allPayments;
    },
  });

  const { data: centers, isLoading: isLoadingCenters } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: any[] }>(GET_CENTERS);
      return response.centers;
    },
  });

  if (isLoadingBookings || isLoadingPayments || isLoadingCenters) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-3xl" />
      </div>
    );
  }

  const totalRevenue = payments?.reduce((acc, p) => acc + (p.status === 'paid' ? p.amount : 0), 0) || 0;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

  const stats = [
    { name: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Active Bookings', value: activeBookings, icon: CalendarCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Total Centers', value: centers?.length || 0, icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Total Bookings', value: bookings?.length || 0, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 font-medium">Real-time statistics of StudySpace platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Recent Bookings</h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6">
            {bookings?.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Armchair className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{booking.center?.name} - {booking.seat?.seatNumber}</p>
                  <p className="text-xs font-medium text-slate-400">{format(parseISO(booking.startTime), 'PPp')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                  booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {booking.status}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Recent Payments</h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6">
            {payments?.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">Transaction #{payment.transactionId.substring(0, 8)}...</p>
                  <p className="text-xs font-medium text-slate-400">{format(parseISO(payment.createdAt), 'PPp')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">৳{payment.amount}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    payment.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
