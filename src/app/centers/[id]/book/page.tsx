'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, parseISO, addDays, startOfMonth, endOfMonth, addMonths } from 'date-fns';
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
import { MapPin, Clock, Armchair, Info, ShieldCheck, ChevronLeft, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Seat {
  id: string;
  centerId: string;
  seatNumber: string;
  type: string;
  pricePerHour: number;
  pricePerMonth: number;
  isActive: boolean;
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

  const seatMap = useMemo(() => {
    if (!allSeats) return [];
    const rows: { [key: string]: Seat[] } = {};
    allSeats.forEach(seat => {
      const row = seat.seatNumber[0];
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    return Object.keys(rows).sort().map(rowLabel => ({
      label: rowLabel,
      seats: rows[rowLabel].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }))
    }));
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

  // Check if times are within center hours
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
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        {center?.coverImage && (
          <img 
            src={center.coverImage} 
            alt={center?.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 mix-blend-overlay" />
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link href="/centers" className="flex items-center text-indigo-300 hover:text-white transition-colors mb-4 group">
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to centers
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">{center?.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-indigo-400" />{center?.location}</div>
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-indigo-400" />{center?.openingTime} - {center?.closingTime}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5">Distraction-Free</Badge>
              <Badge variant="secondary" className="bg-indigo-500 text-white px-4 py-1.5">Ultra-Fast WiFi</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Calendar className="h-5 w-5" /></div>
                <h2 className="text-lg font-bold text-slate-900">Booking Plan</h2>
              </div>
              
              <Tabs 
                items={[
                  { label: 'Hourly', value: 'hourly', content: null },
                  { label: 'Monthly', value: 'monthly', content: null },
                ]}
                onChange={setBookingType}
                defaultValue={bookingType}
              />

              <div className="mt-6 space-y-4">
                {bookingType === 'hourly' ? (
                  <>
                    <Input label="Select Date" type="date" value={date} onChange={e => setDate(e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Start" type="time" value={startTimeStr} onChange={e => setStartTimeStr(e.target.value)} />
                      <Input label="End" type="time" value={endTimeStr} onChange={e => setEndTimeStr(e.target.value)} />
                    </div>
                    {isOutsideHours && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold flex gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        Time must be within center hours ({center?.openingTime} - {center?.closingTime})
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block mb-1">Select Start Month</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[0, 1, 2].map(offset => {
                        const mDate = addMonths(new Date(), offset);
                        const val = format(mDate, 'yyyy-MM');
                        const label = format(mDate, 'MMMM yyyy');
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedMonth(val)}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                              selectedMonth === val ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Monthly plans grant 24/7 access to your dedicated seat for the full calendar month.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border-slate-200 shadow-xl overflow-hidden relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><CreditCard className="h-5 w-5" /></div>
                <h2 className="text-lg font-bold text-slate-900">Summary</h2>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">Seat</span>
                  <span className="text-slate-900 font-bold">{selectedSeat?.seatNumber || 'None'}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">Plan</span>
                  <span className="text-slate-900 font-bold capitalize">{bookingType}</span>
                </div>
                {bookingType === 'hourly' && (
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-slate-900 font-bold">{durationHours.toFixed(1)} hrs</span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total</span>
                    <div className="text-3xl font-black text-slate-900">৳{totalPrice.toFixed(0)}</div>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-emerald-500 opacity-20" />
                </div>
              </div>
              <Button 
                className="w-full h-12 text-md font-bold shadow-lg shadow-indigo-200"
                onClick={() => createBookingMutation.mutate()}
                disabled={!selectedSeatId || createBookingMutation.isPending || isOutsideHours || isInvalidTime}
                isLoading={createBookingMutation.isPending}
              >
                Proceed to Payment
              </Button>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <Card className="p-8 border-slate-200 shadow-xl min-h-[600px] flex flex-col bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <h2 className="text-2xl font-bold text-slate-900">Select Workspace</h2>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-slate-200"></div>Available</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-600"></div>Selected</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>Booked</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500"></div>Premium</div>
                </div>
              </div>

              {isLoadingAllSeats || isLoadingAvailable ? (
                <div className="space-y-8">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
              ) : (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full max-w-md h-1.5 bg-slate-200 rounded-full mb-16 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Entrance / Screen</div>
                  </div>

                  <div className="space-y-8 w-full overflow-x-auto pb-8 scrollbar-hide">
                    {seatMap.map(row => (
                      <div key={row.label} className="flex items-center gap-6 min-w-max">
                        <div className="w-4 text-xs font-black text-slate-300">{row.label}</div>
                        <div className="flex gap-2.5">
                          {row.seats.map(seat => {
                            const isSelected = selectedSeatId === seat.id;
                            const isAvailable = availableSeats?.some(s => s.id === seat.id);
                            const isPremium = seat.type === 'premium';
                            return (
                              <button
                                key={seat.id}
                                disabled={!isAvailable}
                                onClick={() => setSeatId(seat.id)}
                                className={`
                                  relative group w-10 h-12 rounded-t-lg rounded-b-md transition-all duration-300 flex flex-col items-center justify-center
                                  ${!isAvailable ? 'bg-slate-50 border border-slate-100 opacity-30 cursor-not-allowed' : 
                                    isSelected ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 -translate-y-1.5 ring-2 ring-indigo-400 ring-offset-2' : 
                                    isPremium ? 'bg-white border-2 border-amber-500 text-amber-600 hover:-translate-y-1' : 
                                    'bg-white border-2 border-slate-100 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:-translate-y-1'}
                                `}
                              >
                                <span className="text-[9px] font-black mb-1">{seat.seatNumber}</span>
                                <Armchair className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : isPremium ? 'text-amber-500' : 'text-slate-200'}`} />
                                {isAvailable && (
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                    ৳{bookingType === 'hourly' ? `${seat.pricePerHour}/hr` : `${seat.pricePerMonth}/mo`}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
