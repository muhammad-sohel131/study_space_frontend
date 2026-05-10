'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, parseISO, addDays, startOfMonth, endOfMonth, addMonths, isWithinInterval } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_AVAILABLE_SEATS, GET_CENTER, GET_SEATS_BY_CENTER } from '@/graphql/queries';
import { CREATE_BOOKING, INIT_PAYMENT } from '@/graphql/mutations';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { MapPin, Clock, Armchair, Info, ShieldCheck, ChevronLeft, CreditCard, Calendar, Sparkles, Zap, Coffee, Wifi, Monitor, User, Grid3X3, Timer, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';

interface BookingInfo {
  startTime: string;
  endTime: string;
}

interface Seat {
  id: string;
  centerId: string;
  seatNumber: string;
  type: string;
  pricePerHour: number;
  pricePerMonth: number;
  isActive: boolean;
  x: number | null;
  y: number | null;
  bookings?: BookingInfo[];
}

interface Center {
  id: string;
  name: string;
  location: string;
  openingTime: string;
  closingTime: string;
  coverImage?: string;
}

export default function BookSeatPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = params.id as string;
  const { user } = useAuthStore();
  const { selectedSeatId, setSeatId } = useBookingStore();

  const [bookingType, setBookingType] = useState('hourly');

  // Hourly states
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endTimeStr, setEndTimeStr] = useState('11:00');

  // Monthly states
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Center Details Query
  const { data: center, isLoading: isLoadingCenter } = useQuery({
    queryKey: ['center', centerId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ center: Center }>(GET_CENTER, { id: centerId });
      return response.center;
    },
  });

  const getISOStrings = () => {
    if (bookingType === 'hourly') {
      const start = new Date(`${date}T${startTimeStr}:00.000Z`).toISOString();
      const end = new Date(`${date}T${endTimeStr}:00.000Z`).toISOString();
      return { start, end };
    } else {
      const monthDate = parseISO(`${selectedMonth}-01`);
      const start = startOfMonth(monthDate).toISOString();
      const end = endOfMonth(monthDate).toISOString();
      return { start, end };
    }
  };

  const { start: startTimeISO, end: endTimeISO } = useMemo(getISOStrings, [bookingType, date, startTimeStr, endTimeStr, selectedMonth]);

  // All Seats Query
  const { data: allSeats, isLoading: isLoadingAllSeats } = useQuery({
    queryKey: ['allSeats', centerId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ seats: Seat[] }>(GET_SEATS_BY_CENTER, { centerId });
      return response.seats;
    },
  });

  // Available Seats Query
  const { data: availableSeats, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ['availableSeats', centerId, startTimeISO, endTimeISO],
    queryFn: async () => {
      const variables = { centerId, startTime: startTimeISO, endTime: endTimeISO };
      const response = await graphqlClient.request<{ availableSeats: Seat[] }>(GET_AVAILABLE_SEATS, variables);
      return response.availableSeats;
    },
    enabled: !!startTimeISO && !!endTimeISO,
  });

  const gridData = useMemo(() => {
    if (!allSeats) return [];
    const maxX = Math.max(...allSeats.map(s => s.x ?? 0), 0);
    const maxY = Math.max(...allSeats.map(s => s.y ?? 0), 0);

    const grid = Array(maxY + 1).fill(0).map(() => Array(maxX + 1).fill(null));
    allSeats.forEach(seat => {
      if (seat.y !== null && seat.x !== null) {
        grid[seat.y][seat.x] = seat;
      }
    });
    return grid;
  }, [allSeats]);

  const durationHours = useMemo(() => {
    if (bookingType === 'monthly') return 0;
    try {
      const start = new Date(startTimeISO).getTime();
      const end = new Date(endTimeISO).getTime();
      const diff = (end - start) / (1000 * 60 * 60);
      return diff > 0 ? diff : 0;
    } catch (e) { return 0; }
  }, [startTimeISO, endTimeISO, bookingType]);

  const isInvalidTime = bookingType === 'hourly' && durationHours <= 0;

  const isOutsideHours = useMemo(() => {
    if (bookingType === 'monthly' || !center) return false;
    return startTimeStr < center.openingTime || endTimeStr > center.closingTime || startTimeStr >= endTimeStr;
  }, [startTimeStr, endTimeStr, center, bookingType]);

  useEffect(() => {
    if (selectedSeatId && availableSeats && !availableSeats.some(s => s.id === selectedSeatId)) {
      setSeatId('');
    }
  }, [availableSeats, selectedSeatId, setSeatId]);

  const selectedSeat = useMemo(() => allSeats?.find(s => s.id === selectedSeatId), [allSeats, selectedSeatId]);

  const totalPrice = useMemo(() => {
    if (!selectedSeat) return 0;
    if (bookingType === 'hourly') return selectedSeat.pricePerHour * durationHours;
    return selectedSeat.pricePerMonth;
  }, [selectedSeat, bookingType, durationHours]);

  const initPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) => graphqlClient.request<{ initPayment: { paymentUrl: string } }>(INIT_PAYMENT, { bookingId }),
    onSuccess: (data) => { window.location.href = data.initPayment.paymentUrl; },
    onError: () => { toast.error('Failed to initialize payment'); }
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const variables = {
        createBookingInput: {
          centerId,
          seatId: selectedSeatId,
          startTime: startTimeISO,
          endTime: endTimeISO,
          bookingType,
        }
      };
      return graphqlClient.request<{ createBooking: { id: string } }>(CREATE_BOOKING, variables);
    },
    onSuccess: (data) => {
      toast.success('Booking created! Redirecting to payment...');
      initPaymentMutation.mutate(data.createBooking.id);
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to create booking');
    }
  });

  if (isLoadingCenter) return <div className="p-20 text-center"><Skeleton className="h-40 w-full rounded-3xl" /></div>;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-20">
      {/* Premium Banner */}
      <div className="relative h-72 w-full bg-slate-900 overflow-hidden">
        {center?.coverImage && (
          <img
            src={center.coverImage}
            alt={center?.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent mix-blend-overlay" />
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link href="/centers" className="flex items-center text-indigo-300 hover:text-white transition-colors mb-6 group w-fit">
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to centers</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                {center?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                <div className="flex items-center bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="text-sm font-bold">{center?.location}</span>
                </div>
                <div className="flex items-center bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Clock className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="text-sm font-bold">{center?.openingTime} - {center?.closingTime}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Zap className="h-4 w-4" />
                Live Availability
              </div>
              <div className="flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                Secure Booking
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Form & Comparison */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 border-slate-200 shadow-2xl bg-white/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Configure Visit</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reserve your space</p>
                </div>
              </div>

              <Tabs
                items={[
                  { label: 'Hourly Plan', value: 'hourly', content: null },
                  { label: 'Monthly Elite', value: 'monthly', content: null },
                ]}
                onChange={setBookingType}
                defaultValue={bookingType}
              />

              <div className="mt-8 space-y-6">
                {bookingType === 'hourly' ? (
                  <>
                    <Input
                      label="Target Date"
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="bg-slate-50 border-slate-100"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Check-in" type="time" value={startTimeStr} onChange={e => setStartTimeStr(e.target.value)} className="bg-slate-50 border-slate-100" />
                      <Input label="Check-out" type="time" value={endTimeStr} onChange={e => setEndTimeStr(e.target.value)} className="bg-slate-50 border-slate-100" />
                    </div>
                    {isOutsideHours && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex gap-3 animate-pulse">
                        <Info className="h-5 w-5 shrink-0" />
                        Operating Hours: {center?.openingTime} - {center?.closingTime}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Membership Term</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[0, 1, 2].map(offset => {
                        const mDate = addMonths(new Date(), offset);
                        const val = format(mDate, 'yyyy-MM');
                        const label = format(mDate, 'MMMM yyyy');
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedMonth(val)}
                            className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-between ${selectedMonth === val
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]'
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-400'
                              }`}
                          >
                            <span>{label}</span>
                            {selectedMonth === val && <ShieldCheck className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic p-2 border-l-2 border-indigo-100">
                      Monthly Elite access includes 24/7 keycard entry and a dedicated permanent locker.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-8 border-slate-200 shadow-2xl bg-white overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Checkout</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final pricing</p>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Seat Selection</span>
                  <span className="text-slate-900 font-black">{selectedSeat ? `Unit ${selectedSeat.seatNumber}` : '--'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Plan Structure</span>
                  <span className="text-slate-900 font-black capitalize">{bookingType}</span>
                </div>
                {bookingType === 'hourly' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-tighter">Duration</span>
                    <span className="text-slate-900 font-black">{durationHours.toFixed(1)} Hours</span>
                  </div>
                )}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Total Amount</span>
                    <div className="text-4xl font-black text-slate-900 tracking-tight">৳{totalPrice.toFixed(0)}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <ShieldCheck className="h-8 w-8 text-emerald-500 opacity-20 mb-1" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full h-14 text-md font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 rounded-2xl transition-transform active:scale-95"
                onClick={() => createBookingMutation.mutate()}
                disabled={!selectedSeatId || createBookingMutation.isPending || isOutsideHours || isInvalidTime}
                isLoading={createBookingMutation.isPending}
              >
                Confirm & Pay ৳{totalPrice.toFixed(0)}
              </Button>
            </Card>
          </div>

          {/* Right Column - Grid */}
          <div className="lg:col-span-8">
            <Card className="p-10 border-slate-200 shadow-2xl min-h-[700px] flex flex-col bg-white rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Grid3X3 className="h-64 w-64" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Workspace</h2>
                  <p className="text-sm font-medium text-slate-500">Pick your preferred physical spot in the center.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border-2 border-slate-200"></div> Available</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-600 ring-4 ring-indigo-100"></div> Selected</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200 border-2 border-slate-300"></div> Occupied</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500 ring-4 ring-amber-100"></div> Premium</div>
                </div>
              </div>

              {isLoadingAllSeats || isLoadingAvailable ? (
                <div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                  {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-12 w-full rounded-2xl" />)}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 relative">
                  {/* Entrance Marker */}
                  <div className="w-full max-w-md h-2 bg-slate-100 rounded-full mb-20 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Main Entrance / Reception</span>
                      <div className="w-12 h-1 bg-indigo-500 rounded-full opacity-30" />
                    </div>
                  </div>

                  {/* Physical Grid Layout */}
                  <div className="space-y-4 w-full overflow-x-auto pb-12 scrollbar-hide flex flex-col items-center">
                    {gridData.map((row, y) => (
                      <div key={y} className="flex gap-4 p-1">
                        {row.map((seat, x) => {
                          // Transparent placeholder for empty grid cells
                          if (!seat) return <div key={`${x}-${y}`} className="w-14 h-16 pointer-events-none opacity-0" />;

                          const isSelected = selectedSeatId === seat.id;
                          const isAvailable = availableSeats?.some(s => s.id === seat.id);
                          const isPremium = seat.type === 'premium';

                          // Find active bookings for today
                          const todayBookings = seat.bookings?.filter((b: BookingInfo) => {
                            const bStart = new Date(b.startTime);
                            const now = new Date();
                            return bStart.getDate() === now.getDate() && bStart.getMonth() === now.getMonth();
                          });

                          return (
                            <button
                              key={seat.id}
                              disabled={!isAvailable}
                              onClick={() => setSeatId(seat.id)}
                              className={`
                                relative group w-14 h-16 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center border-2
                                ${!isAvailable
                                  ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed scale-90 grayscale'
                                  : isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-400 -translate-y-2 ring-4 ring-indigo-50/50'
                                    : isPremium
                                      ? 'bg-white border-amber-400 text-amber-600 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-100 hover:-translate-y-1'
                                      : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1'}
                              `}
                            >
                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-md">
                                  <ShieldCheck className="h-3 w-3" />
                                </div>
                              )}

                              {/* Premium Indicator */}
                              {isPremium && !isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md animate-pulse">
                                  <Sparkles className="h-3 w-3" />
                                </div>
                              )}

                              <span className={`text-[11px] font-black mb-1.5 ${isSelected ? 'text-white' : isPremium ? 'text-amber-700' : 'text-slate-900'}`}>
                                {seat.seatNumber}
                              </span>

                              <Armchair className={`h-5 w-5 transition-transform duration-500 ${isSelected ? 'text-white scale-110' : isPremium ? 'text-amber-500' : 'text-slate-200'}`} />

                              {/* Enhanced Tooltip with Booking Time */}
                              <div className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-3 bg-slate-900 text-white text-[10px] font-black rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 whitespace-nowrap shadow-2xl scale-0 group-hover:scale-100 pointer-events-none">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex items-center justify-between w-full gap-8 border-b border-slate-800 pb-1.5 mb-0.5">
                                    <span className="uppercase text-[8px] text-slate-500 tracking-tighter">{seat.type} Unit</span>
                                    <span className="text-indigo-400">৳{bookingType === 'hourly' ? `${seat.pricePerHour}/hr` : `${seat.pricePerMonth}/mo`}</span>
                                  </div>

                                  {todayBookings && todayBookings.length > 0 ? (
                                    <div className="space-y-1.5 w-full">
                                      <div className="flex items-center gap-1.5 text-red-400 text-[8px] uppercase tracking-widest">
                                        <Timer className="h-3 w-3" />
                                        Today's Schedule
                                      </div>
                                      {todayBookings.map((b: BookingInfo, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between gap-4 bg-white/5 px-2 py-1 rounded-lg">
                                          <span className="text-slate-300">{format(new Date(b.startTime), 'hh:mm a')}</span>
                                          <span className="text-slate-500 text-[8px]">TO</span>
                                          <span className="text-slate-300">{format(new Date(b.endTime), 'hh:mm a')}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : isAvailable ? (
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-[8px] uppercase tracking-widest">
                                      <ShieldCheck className="h-3 w-3" />
                                      Fully Available Today
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-amber-400 text-[8px] uppercase tracking-widest">
                                      <Timer className="h-3 w-3" />
                                      Currently Occupied
                                    </div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Aesthetic Background Accents */}
                  <div className="absolute bottom-10 left-10 opacity-5 pointer-events-none">
                    <Wifi className="h-32 w-32 text-indigo-900" />
                  </div>
                  <div className="absolute top-20 right-10 opacity-5 pointer-events-none">
                    <Coffee className="h-32 w-32 text-indigo-900" />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Feature Comparison Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-indigo-600/5 -skew-y-2 rounded-[3rem]" />
          <div className="relative p-10 md:p-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="info" className="mb-4 uppercase tracking-[0.3em] font-black px-4 py-1.5">Choice of Experience</Badge>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Compare Workspace Tiers</h2>
              <p className="text-slate-500 font-medium">Whether you need a quick study session or a deep work retreat, we have the perfect spot for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Regular Tier */}
              <Card className="p-8 md:p-10 border-slate-200 bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    <Monitor className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Regular Seat</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 uppercase tracking-widest">The Essential Setup</p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: <Wifi className="h-4 w-4" />, text: "100Mbps Shared Fiber" },
                      { icon: <Zap className="h-4 w-4" />, text: "Dual Power Outlets" },
                      { icon: <Armchair className="h-4 w-4" />, text: "Ergonomic Task Chair" },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: "Standard Desk Space" },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                        <span className="text-indigo-500">{feature.icon}</span>
                        {feature.text}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Premium Tier */}
              <Card className="p-8 md:p-10 border-amber-200 bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden border-2 shadow-xl shadow-amber-50">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute top-6 right-6">
                  <Star className="h-6 w-6 text-amber-400 fill-amber-400 animate-pulse" />
                </div>
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-8 shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Premium Suite</h3>
                  <p className="text-amber-600 text-sm font-black mb-8 uppercase tracking-widest">Ultimate Productivity</p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: <Wifi className="h-4 w-4" />, text: "Dedicated 1Gbps Bandwidth" },
                      { icon: <Coffee className="h-4 w-4" />, text: "Unlimited Premium Beverages" },
                      { icon: <User className="h-4 w-4" />, text: "Private Acoustic Divider" },
                      { icon: <ShieldCheck className="h-4 w-4" />, text: "Priority Tech Support" },
                      { icon: <CheckCircle2 className="h-4 w-4" />, text: "Extended Desk Surface" },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-800 font-black text-sm">
                        <span className="text-amber-500">{feature.icon}</span>
                        {feature.text}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
