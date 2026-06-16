'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { format, isAfter, isBefore, addHours, differenceInMinutes } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_MY_BOOKINGS, GET_MY_ORDERS } from '@/graphql/queries';
import { CREATE_BOOKING, INIT_PAYMENT, CANCEL_BOOKING } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { CalendarDays, Clock, MapPin, Armchair, ChevronRight, LogOut, RefreshCw, CheckCircle2, Timer, Sparkles, CreditCard, XCircle, Book as BookIcon, Download } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Pagination } from '@/components/ui/Pagination';

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
  createdAt: string;
  seat?: {
    seatNumber: string;
    type: string;
    pricePerHour: number;
    pricePerMonth: number;
  };
  center?: {
    id: string;
    name: string;
    location: string;
    openingTime: string;
    closingTime: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Renewal Modal States
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [renewalHours, setRenewalHours] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) router.push('/login');
      else if (user.role === 'ADMIN') router.push('/admin/dashboard');
    }
  }, [mounted, user, router]);

  const { data: bookingsData, isLoading: loadingBookings, refetch } = useQuery({
    queryKey: ['myBookings', page],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myBookings: { data: Booking[]; totalPages: number } }>(GET_MY_BOOKINGS, { page, limit });
      return response.myBookings;
    },
    enabled: !!user,
  });

  const bookings = bookingsData?.data || [];
  const totalPages = bookingsData?.totalPages || 1;

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myOrders: any[] }>(GET_MY_ORDERS);
      return response.myOrders;
    },
    enabled: !!user,
  });

  const initPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) => graphqlClient.request<{ initPayment: { paymentUrl: string } }>(INIT_PAYMENT, { bookingId }),
    onSuccess: (data) => { window.location.href = data.initPayment.paymentUrl; },
    onError: () => { toast.error('Failed to initialize payment'); }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => graphqlClient.request(CANCEL_BOOKING, { bookingId }),
    onSuccess: () => {
      toast.success('Booking cancelled');
      refetch();
    },
    onError: () => toast.error('Failed to cancel booking')
  });

  const createBookingMutation = useMutation({
    mutationFn: async (variables: any) => graphqlClient.request<{ createBooking: { id: string } }>(CREATE_BOOKING, variables),
    onSuccess: (data) => {
      toast.success('Renewal requested! Redirecting to payment...');
      initPaymentMutation.mutate(data.createBooking.id);
    },
    onError: (error: any) => toast.error(error.response?.errors?.[0]?.message || 'Failed to renew booking')
  });

  const getBookingStatus = (booking: Booking) => {
    const now = currentTime;
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    if (booking.status === 'cancelled') return { label: 'Cancelled', color: 'bg-rose-500', icon: <XCircle className="h-3 w-3" /> };
    if (booking.status === 'pending') {
      const created = new Date(booking.createdAt);
      const minutesLeft = 10 - differenceInMinutes(now, created);
      return { 
        label: minutesLeft > 0 ? `Pay within ${minutesLeft}m` : 'Expired', 
        color: 'bg-amber-500', 
        icon: <Timer className="h-3 w-3" />,
        isPending: true,
        minutesLeft
      };
    }
    
    if (isAfter(now, end)) return { label: 'Finished', color: 'bg-slate-500', icon: <CheckCircle2 className="h-3 w-3" /> };
    if (isAfter(now, start) && isBefore(now, end)) {
      const isExpiringSoon = booking.bookingType === 'hourly' 
        ? isAfter(now, addHours(end, -2))
        : isAfter(now, addHours(end, -48));
      if (isExpiringSoon) return { label: 'Expiring Soon', color: 'bg-amber-500', icon: <Timer className="h-3 w-3" />, canRenew: true };
      return { label: 'Running', color: 'bg-emerald-500', icon: <RefreshCw className="h-3 w-3 animate-spin-slow" />, canRenew: true };
    }
    if (isBefore(now, start)) return { label: 'Upcoming', color: 'bg-indigo-500', icon: <Clock className="h-3 w-3" /> };
    return { label: 'Confirmed', color: 'bg-emerald-500', icon: <CheckCircle2 className="h-3 w-3" /> };
  };

  const handleRenewClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setRenewalHours(booking.bookingType === 'hourly' ? 1 : 0);
    setRenewModalOpen(true);
  };

  const handleConfirmRenewal = () => {
    if (!selectedBooking) return;
    const start = new Date(selectedBooking.endTime);
    let end: Date;
    if (selectedBooking.bookingType === 'hourly') {
      end = addHours(start, renewalHours);
    } else {
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
    }
    createBookingMutation.mutate({
      createBookingInput: {
        centerId: selectedBooking.centerId,
        seatId: selectedBooking.seatId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        bookingType: selectedBooking.bookingType,
      }
    });
  };

  const renewalPrice = useMemo(() => {
    if (!selectedBooking) return 0;
    if (selectedBooking.bookingType === 'hourly') return (selectedBooking.seat?.pricePerHour || 0) * renewalHours;
    return selectedBooking.seat?.pricePerMonth || 0;
  }, [selectedBooking, renewalHours]);

  if (!user) return null;

  const seatBookingsContent = (
    <div className="mt-8">
      {loadingBookings ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No seat bookings found.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bookings?.map((booking) => {
            const status = getBookingStatus(booking);
            return (
              <Card key={booking.id} className="group relative overflow-hidden bg-white border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
                <div className={`absolute top-0 left-0 w-2 h-full ${status.color}`} />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{booking.center?.name}</h3>
                      <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        <MapPin className="h-3 w-3 mr-1.5 text-indigo-400" />{booking.center?.location}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${status.color}`}>
                      {status.icon}{status.label}
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Armchair className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Unit Number</p>
                          <p className="text-lg font-black text-slate-900 leading-none">{booking.seat?.seatNumber}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-white border-slate-200">{booking.bookingType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-6 px-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <Clock className="h-3 w-3 mr-1.5 text-emerald-500" />Arrival
                        </div>
                        <p className="text-xs font-black text-slate-700">{format(new Date(booking.startTime), 'MMM d, h:mm a')}</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <Clock className="h-3 w-3 mr-1.5 text-rose-500" />Departure
                        </div>
                        <p className="text-xs font-black text-slate-700">{format(new Date(booking.endTime), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                  {status.isPending && status.minutesLeft > 0 ? (
                    <div className="space-y-3">
                      <Button onClick={() => initPaymentMutation.mutate(booking.id)} isLoading={initPaymentMutation.isPending} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-100">
                        <CreditCard className="h-4 w-4 mr-2" /> Complete Payment
                      </Button>
                      <Button onClick={() => cancelBookingMutation.mutate(booking.id)} isLoading={cancelBookingMutation.isPending} variant="outline" className="w-full h-12 rounded-xl border-2 border-rose-100 text-rose-500 hover:bg-rose-50 font-black uppercase tracking-widest text-[11px]">
                        Cancel Booking
                      </Button>
                    </div>
                  ) : status.canRenew ? (
                    <Button onClick={() => handleRenewClick(booking)} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-100 group/btn">
                      <RefreshCw className="h-4 w-4 mr-2 group-hover/btn:rotate-180 transition-transform duration-500" /> Quick Renew
                    </Button>
                  ) : (
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Investment</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">৳{booking.totalPrice.toFixed(0)}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-slate-50 ${booking.paymentStatus === 'paid' ? 'bg-emerald-500 ring-emerald-50' : 'bg-amber-500 ring-amber-50'}`} />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{booking.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );

  const libraryContent = (
    <div className="mt-8">
      {loadingOrders ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      ) : orders?.filter(o => o.paymentStatus === 'paid').length === 0 ? (
        <div className="text-center py-12 text-slate-500">You haven't purchased any books yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {orders?.filter(o => o.paymentStatus === 'paid').map((order) => (
            <Card key={order.id} className="p-0 border-slate-200 hover:shadow-xl overflow-hidden group transition-all">
              <div className="h-48 w-full bg-slate-100 relative">
                {order.book?.coverImageUrl ? (
                  <img src={order.book.coverImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookIcon className="h-10 w-10" />
                  </div>
                )}
                <Badge variant="secondary" className="absolute top-3 left-3 uppercase tracking-widest text-[10px] bg-white/90 backdrop-blur">
                  {order.book?.productType === 'pdf' ? 'E-Book' : 'Physical'}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-2">{order.book?.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{order.book?.author}</p>
                {order.book?.productType === 'pdf' && order.book?.fullPdfUrl && (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => window.open(order.book.fullPdfUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" /> Read Book
                  </Button>
                )}
                {order.book?.productType === 'physical' && (
                  <div className="text-sm text-slate-500 bg-slate-50 p-2 rounded text-center font-medium">
                    Collect from Center
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]} 👋</h1>
              <p className="text-slate-500 mt-2 font-medium">Manage your bookings and library collection.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">Home</Link>
              <Link href="/library" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">Shop Books</Link>
              <button onClick={() => { logout(); router.push('/login'); }} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all">
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs
          items={[
            { label: 'Seat Bookings', value: 'seats', icon: <Armchair className="w-4 h-4" />, content: seatBookingsContent },
            { label: 'My Library', value: 'library', icon: <BookIcon className="w-4 h-4" />, content: libraryContent },
          ]}
        />
      </div>

      <Modal isOpen={isRenewModalOpen} onClose={() => setRenewModalOpen(false)} title="Instant Renewal">
        <div className="space-y-8 pt-4">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles className="h-20 w-20 text-indigo-900" /></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ends At</span>
                <span className="text-xs font-black text-slate-900">{selectedBooking && format(new Date(selectedBooking.endTime), 'MMM d, h:mm a')}</span>
              </div>
              {selectedBooking?.bookingType === 'hourly' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 8].map(h => (
                      <button key={h} onClick={() => setRenewalHours(h)} className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${renewalHours === h ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-end p-2">
            <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Renewal Total</p><p className="text-4xl font-black text-slate-900 tracking-tighter">৳{renewalPrice.toFixed(0)}</p></div>
          </div>
          <Button className="w-full h-14 rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-200 font-black uppercase tracking-[0.2em] text-xs" onClick={handleConfirmRenewal} isLoading={createBookingMutation.isPending}>Pay & Extend Session</Button>
        </div>
      </Modal>
    </div>
  );
}
