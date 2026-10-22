'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, parseISO, addDays, startOfMonth, endOfMonth, addMonths, differenceInCalendarDays } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_AVAILABLE_SEATS, GET_CENTER, GET_SEATS_BY_CENTER, GET_STAY_AVAILABILITY } from '@/graphql/queries';
import { CREATE_BOOKING, INIT_PAYMENT } from '@/graphql/mutations';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import {
  MapPin,
  Clock,
  Armchair,
  Info,
  ShieldCheck,
  ChevronLeft,
  CreditCard,
  Calendar,
  Sparkles,
  Zap,
  Coffee,
  Wifi,
  Grid3X3,
  CheckCircle2,
  Bed,
  Moon,
  Flame,
  Check,
  Sun,
  Lock,
  AlertCircle,
  Users,
  Activity,
} from 'lucide-react';
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
  hasStayFacility?: boolean;
  stayPricePerNight?: number;
  stayAmenities?: string[];
  availableStayBeds?: number;
  stayRules?: string;
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

  // Stay states
  const [checkInDate, setCheckInDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkOutDate, setCheckOutDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [stayNights, setStayNights] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState('Standard Study Pod');
  const [selectedBedUnit, setSelectedBedUnit] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState(1);

  const handleCheckInChange = (newInStr: string) => {
    setCheckInDate(newInStr);
    try {
      const inDate = new Date(`${newInStr}T12:00:00`);
      const currentOut = new Date(`${checkOutDate}T11:00:00`);
      const diff = differenceInCalendarDays(currentOut, inDate);
      if (diff >= 1) {
        setStayNights(diff);
      } else {
        const nextOut = addDays(inDate, Math.max(1, stayNights));
        setCheckOutDate(format(nextOut, 'yyyy-MM-dd'));
      }
    } catch {
      // fallback
    }
  };

  const handleCheckOutChange = (newOutStr: string) => {
    setCheckOutDate(newOutStr);
    try {
      const inDate = new Date(`${checkInDate}T12:00:00`);
      const outDate = new Date(`${newOutStr}T11:00:00`);
      const diff = differenceInCalendarDays(outDate, inDate);
      if (diff >= 1) {
        setStayNights(diff);
      } else {
        toast.error('Check-out date must be at least 1 day after check-in');
        const minOut = addDays(inDate, 1);
        setCheckOutDate(format(minOut, 'yyyy-MM-dd'));
        setStayNights(1);
      }
    } catch {
      // fallback
    }
  };

  const handleQuickNightsSelect = (nights: number) => {
    setStayNights(nights);
    try {
      const inDate = new Date(`${checkInDate}T12:00:00`);
      const outDate = addDays(inDate, nights);
      setCheckOutDate(format(outDate, 'yyyy-MM-dd'));
    } catch {
      // fallback
    }
  };

  // Center Details Query
  const { data: center, isLoading: isLoadingCenter } = useQuery({
    queryKey: ['center', centerId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ center: Center }>(GET_CENTER, { id: centerId });
      return response.center;
    },
  });

  const roomTypes = useMemo(() => {
    const base = center?.stayPricePerNight || 850;
    return [
      {
        id: 'Standard Study Pod',
        title: 'Standard Study Pod',
        tag: 'Most Popular',
        desc: 'Private quiet sleeping pod + dedicated study desk + personal RFID locker.',
        price: base,
        features: ['Sound-dampening pod', 'Dedicated 24/7 Desk', 'Hot Shower Access', 'Complimentary Morning Tea'],
      },
      {
        id: 'Executive Private Suite',
        title: 'Executive Private Suite',
        tag: 'Premium Focus',
        desc: 'Fully private enclosed room with en-suite desk, ergonomic recliner, & natural light.',
        price: Math.round(base * 1.35),
        features: ['Private Enclosed Suite', 'Ergonomic Executive Chair', 'Private Attached Restroom', 'Priority High-Speed WiFi'],
      },
      {
        id: 'Shared Scholar Dorm (Bunk)',
        title: 'Shared Scholar Dorm (Bunk)',
        tag: 'Budget Friendly',
        desc: 'Cozy bunk bed in 4-pod silent study dorm with blackout curtains & reading lamp.',
        price: Math.round(base * 0.8),
        features: ['Blackout Privacy Curtain', 'Reading Lamp & Socket', 'Shared Study Hall Desk', 'High-Speed WiFi'],
      },
    ];
  }, [center?.stayPricePerNight]);

  const activeRoom = useMemo(() => {
    return roomTypes.find((r) => r.id === selectedRoomType) || roomTypes[0];
  }, [roomTypes, selectedRoomType]);

  const getISOStrings = () => {
    if (bookingType === 'hourly') {
      const start = new Date(`${date}T${startTimeStr}`).toISOString();
      const end = new Date(`${date}T${endTimeStr}`).toISOString();
      return { start, end };
    } else if (bookingType === 'monthly') {
      const monthDate = parseISO(`${selectedMonth}-01`);
      const start = startOfMonth(monthDate).toISOString();
      const end = endOfMonth(monthDate).toISOString();
      return { start, end };
    } else {
      // Stay (Check-in 12:00 PM, Check-out 11:00 AM)
      const checkIn = new Date(`${checkInDate}T12:00:00`);
      const checkOut = new Date(`${checkOutDate}T11:00:00`);
      return { start: checkIn.toISOString(), end: checkOut.toISOString() };
    }
  };

  const { start: startTimeISO, end: endTimeISO } = useMemo(getISOStrings, [
    bookingType,
    date,
    startTimeStr,
    endTimeStr,
    selectedMonth,
    checkInDate,
    checkOutDate,
  ]);

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

  // Live Stay Bed Availability Query
  interface BedUnitStatus {
    unitNumber: string;
    isBooked: boolean;
  }

  interface RoomTypeAvailability {
    roomType: string;
    totalBeds: number;
    bookedBeds: number;
    emptyBeds: number;
    isAvailable: boolean;
    bedUnits: BedUnitStatus[];
  }

  interface StayAvailabilityData {
    totalBeds: number;
    bookedBeds: number;
    availableBeds: number;
    isAvailable: boolean;
    statusNote?: string;
    roomTypeBreakdown?: RoomTypeAvailability[];
  }

  const { data: stayAvailability, isLoading: isLoadingStayAvail } = useQuery({
    queryKey: ['stayAvailability', centerId, startTimeISO, endTimeISO],
    queryFn: async () => {
      const response = await graphqlClient.request<{ stayAvailability: StayAvailabilityData }>(
        GET_STAY_AVAILABILITY,
        { centerId, startTime: startTimeISO, endTime: endTimeISO }
      );
      return response.stayAvailability;
    },
    enabled: bookingType === 'stay' && !!startTimeISO && !!endTimeISO,
    refetchInterval: 10000,
  });

  const activeRoomAvail = useMemo(() => {
    if (!stayAvailability?.roomTypeBreakdown) return null;
    return stayAvailability.roomTypeBreakdown.find((b) => {
      const bType = b.roomType.toLowerCase();
      const sType = selectedRoomType.toLowerCase();
      return bType === sType || bType.includes(sType) || sType.includes(bType);
    });
  }, [stayAvailability, selectedRoomType]);

  useEffect(() => {
    if (activeRoomAvail && activeRoomAvail.bedUnits) {
      const emptyUnits = activeRoomAvail.bedUnits.filter((u) => !u.isBooked);
      if (selectedBedUnit && !emptyUnits.some((u) => u.unitNumber === selectedBedUnit)) {
        setSelectedBedUnit(emptyUnits[0]?.unitNumber || '');
      } else if (!selectedBedUnit && emptyUnits.length > 0) {
        setSelectedBedUnit(emptyUnits[0].unitNumber);
      }
    }
  }, [activeRoomAvail, selectedBedUnit]);

  const gridData = useMemo(() => {
    if (!allSeats) return [];
    const maxX = Math.max(...allSeats.map((s) => s.x ?? 0), 0);
    const maxY = Math.max(...allSeats.map((s) => s.y ?? 0), 0);

    const grid = Array(maxY + 1)
      .fill(0)
      .map(() => Array(maxX + 1).fill(null));
    allSeats.forEach((seat) => {
      if (seat.y !== null && seat.x !== null) {
        grid[seat.y][seat.x] = seat;
      }
    });
    return grid;
  }, [allSeats]);

  const durationHours = useMemo(() => {
    if (bookingType !== 'hourly') return 0;
    try {
      const start = new Date(startTimeISO).getTime();
      const end = new Date(endTimeISO).getTime();
      const diff = (end - start) / (1000 * 60 * 60);
      return diff > 0 ? diff : 0;
    } catch (e) {
      return 0;
    }
  }, [startTimeISO, endTimeISO, bookingType]);

  const isInvalidTime = bookingType === 'hourly' && durationHours <= 0;

  const isOutsideHours = useMemo(() => {
    if (bookingType !== 'hourly' || !center) return false;
    return startTimeStr < center.openingTime || endTimeStr > center.closingTime || startTimeStr >= endTimeStr;
  }, [startTimeStr, endTimeStr, center, bookingType]);

  useEffect(() => {
    if (selectedSeatId && availableSeats && !availableSeats.some((s) => s.id === selectedSeatId)) {
      setSeatId('');
    }
  }, [availableSeats, selectedSeatId, setSeatId]);

  const selectedSeat = useMemo(() => allSeats?.find((s) => s.id === selectedSeatId), [allSeats, selectedSeatId]);

  const totalPrice = useMemo(() => {
    if (bookingType === 'stay') {
      let rate = activeRoom.price;
      if (stayNights >= 7) {
        rate = Math.round(rate * 0.9); // 10% discount
      } else if (stayNights >= 3) {
        rate = Math.round(rate * 0.95); // 5% discount
      }
      return rate * stayNights;
    }

    if (!selectedSeat) return 0;
    if (bookingType === 'hourly') return selectedSeat.pricePerHour * durationHours;
    return selectedSeat.pricePerMonth;
  }, [selectedSeat, bookingType, durationHours, activeRoom, stayNights]);

  const initPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) =>
      graphqlClient.request<{ initPayment: { paymentUrl: string } }>(INIT_PAYMENT, { bookingId }),
    onSuccess: (data) => {
      window.location.href = data.initPayment.paymentUrl;
    },
    onError: () => {
      toast.error('Failed to initialize payment');
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error('Please login first to reserve');
        router.push('/login');
        return;
      }
      const variables = {
        createBookingInput: {
          centerId,
          seatId: selectedSeatId || undefined,
          startTime: startTimeISO,
          endTime: endTimeISO,
          bookingType,
          stayNights: bookingType === 'stay' ? stayNights : undefined,
          roomType: bookingType === 'stay' ? selectedRoomType : undefined,
          bedUnit: bookingType === 'stay' ? selectedBedUnit || undefined : undefined,
          guestsCount: bookingType === 'stay' ? guestsCount : undefined,
        },
      };
      return graphqlClient.request<{ createBooking: { id: string } }>(CREATE_BOOKING, variables);
    },
    onSuccess: (data) => {
      if (data) {
        toast.success('Reservation created! Redirecting to payment...');
        initPaymentMutation.mutate(data.createBooking.id);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to create booking');
    },
  });

  if (isLoadingCenter)
    return (
      <div className="p-20 text-center">
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );

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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-transparent mix-blend-overlay" />
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link
            href="/centers"
            className="flex items-center text-indigo-300 hover:text-white transition-colors mb-6 group w-fit"
          >
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to centers</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                StudySpace Hub & Stay
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
                {center?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <div className="flex items-center bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="text-sm font-bold">{center?.location}</span>
                </div>
                <div className="flex items-center bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Clock className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="text-sm font-bold">
                    {center?.openingTime} - {center?.closingTime}
                  </span>
                </div>
                {center?.hasStayFacility !== false && (
                  <div className="flex items-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold">
                    <Bed className="h-3.5 w-3.5 mr-1.5" />
                    <span>Study & Stay Facility: ৳{center?.stayPricePerNight || 850}/night</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Zap className="h-4 w-4" />
                Live Availability
              </div>
              <div className="flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                SSLCommerz Secured
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Plan Configuration */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 sm:p-8 border-slate-200 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Configure Your Plan</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Study desk or overnight residency
                  </p>
                </div>
              </div>

              <Tabs
                items={[
                  { label: 'Hourly Plan', value: 'hourly', content: null },
                  { label: 'Monthly Elite', value: 'monthly', content: null },
                  {
                    label: 'Study & Stay (Overnight)',
                    value: 'stay',
                    icon: <Bed className="w-4 h-4 text-emerald-500" />,
                    content: null,
                  },
                ]}
                onChange={setBookingType}
                defaultValue={bookingType}
              />

              <div className="mt-6 space-y-6">
                {/* 1. HOURLY PLAN */}
                {bookingType === 'hourly' && (
                  <div className="space-y-4">
                    <Input
                      label="Target Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="bg-slate-50 border-slate-100"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Check-in"
                        type="time"
                        value={startTimeStr}
                        onChange={(e) => setStartTimeStr(e.target.value)}
                        className="bg-slate-50 border-slate-100"
                      />
                      <Input
                        label="Check-out"
                        type="time"
                        value={endTimeStr}
                        onChange={(e) => setEndTimeStr(e.target.value)}
                        className="bg-slate-50 border-slate-100"
                      />
                    </div>
                    {isOutsideHours && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex gap-3 animate-pulse">
                        <Info className="h-5 w-5 shrink-0" />
                        Operating Hours: {center?.openingTime} - {center?.closingTime}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MONTHLY ELITE PLAN */}
                {bookingType === 'monthly' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Membership Term
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[0, 1, 2].map((offset) => {
                        const mDate = addMonths(new Date(), offset);
                        const val = format(mDate, 'yyyy-MM');
                        const label = format(mDate, 'MMMM yyyy');
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSelectedMonth(val)}
                            className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                              selectedMonth === val
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.01]'
                                : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-400'
                            }`}
                          >
                            <span>{label}</span>
                            {selectedMonth === val && <ShieldCheck className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium italic p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      Monthly Elite access includes 24/7 keycard entry and a dedicated personal study locker.
                    </p>
                  </div>
                )}

                {/* 3. STUDY & STAY (OVERNIGHT RESIDENCY) */}
                {bookingType === 'stay' && (
                  <div className="space-y-6">
                    {/* Stay Intro Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-violet-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                        <Moon className="w-4 h-4 text-emerald-600" />
                        <span>Intensive Exam Retreat & Overnight Stay</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Stay at <strong>{center?.name}</strong> for 1, 2, or more days! Includes your private sleeping pod, 24/7 quiet study desk access, hot shower, and high-speed Wi-Fi.
                      </p>
                    </div>

                    {/* Live Bed Occupancy & Availability Tracker Widget */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl space-y-3.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Bed className="w-32 h-32" />
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Live Bed Occupancy Tracker
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                          {format(new Date(`${checkInDate}T12:00:00`), 'dd MMM')} - {format(new Date(`${checkOutDate}T11:00:00`), 'dd MMM')}
                        </span>
                      </div>

                      {/* 3 Metric Counters */}
                      <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Beds</div>
                          <div className="text-xl font-black text-white mt-0.5">
                            {stayAvailability?.totalBeds || center?.availableStayBeds || 16}
                          </div>
                          <div className="text-[9px] text-slate-400">Hub Capacity</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm">
                          <div className="text-[10px] font-bold text-rose-300 uppercase tracking-tight">Booked</div>
                          <div className="text-xl font-black text-rose-400 mt-0.5">
                            {stayAvailability?.bookedBeds ?? 0}
                          </div>
                          <div className="text-[9px] text-rose-300">Occupied</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm">
                          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-tight">Available</div>
                          <div className="text-xl font-black text-emerald-400 mt-0.5">
                            {stayAvailability?.availableBeds ?? (center?.availableStayBeds || 16)}
                          </div>
                          <div className="text-[9px] text-emerald-300 font-bold">Ready to Book</div>
                        </div>
                      </div>

                      {/* Live Empty Beds Breakdown by Room Type */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 relative z-10 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-indigo-400" /> Category-Wise Empty Bed Tracking
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            For {stayNights} Night{stayNights > 1 ? 's' : ''} Stay
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {(stayAvailability?.roomTypeBreakdown || [
                            { roomType: 'Standard Study Pod', totalBeds: 8, bookedBeds: 0, emptyBeds: 8, isAvailable: true },
                            { roomType: 'Executive Private Suite', totalBeds: 4, bookedBeds: 0, emptyBeds: 4, isAvailable: true },
                            { roomType: 'Shared Scholar Dorm (Bunk)', totalBeds: 4, bookedBeds: 0, emptyBeds: 4, isAvailable: true },
                          ]).map((cat) => {
                            const isSoldOut = cat.emptyBeds <= 0;
                            return (
                              <div
                                key={cat.roomType}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                  isSoldOut
                                    ? 'bg-rose-500/10 border-rose-500/30'
                                    : 'bg-emerald-500/10 border-emerald-500/30'
                                }`}
                              >
                                <div className="text-[10px] font-bold truncate text-slate-300">{cat.roomType}</div>
                                <div className="flex items-baseline justify-between mt-1">
                                  <span className={`text-base font-black ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {cat.emptyBeds} Empty
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {cat.bookedBeds}/{cat.totalBeds} Booked
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Visual Bed Units Grid Grouped by Category */}
                      <div className="pt-2 border-t border-white/10 relative z-10 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Grid3X3 className="w-3.5 h-3.5 text-indigo-400" /> Physical Bed Units (Duration: {stayNights}N)
                          </span>
                          <span>
                            {stayAvailability?.isAvailable ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {stayAvailability.statusNote || `${stayAvailability.availableBeds} Empty Beds Ready`}
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold">Sold Out For Selected Dates</span>
                            )}
                          </span>
                        </div>

                        {stayAvailability?.roomTypeBreakdown && stayAvailability.roomTypeBreakdown.length > 0 ? (
                          <div className="space-y-2">
                            {stayAvailability.roomTypeBreakdown.map((cat) => (
                              <div key={cat.roomType} className="p-2 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between text-[10px] mb-1.5 font-bold">
                                  <span className="text-slate-300">{cat.roomType}</span>
                                  <span className={cat.emptyBeds > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                    {cat.emptyBeds} Empty • {cat.bookedBeds} Booked
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {cat.bedUnits?.map((unit) => {
                                    const isSelected = selectedBedUnit === unit.unitNumber;
                                    return (
                                      <button
                                        key={unit.unitNumber}
                                        type="button"
                                        disabled={unit.isBooked}
                                        onClick={() => {
                                          setSelectedRoomType(cat.roomType);
                                          setSelectedBedUnit(unit.unitNumber);
                                        }}
                                        className={`h-7 px-2 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                                          unit.isBooked
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 opacity-60 cursor-not-allowed'
                                            : isSelected
                                            ? 'bg-indigo-600 text-white border-2 border-white shadow-md ring-2 ring-indigo-400'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                        }`}
                                        title={
                                          unit.isBooked
                                            ? `${unit.unitNumber}: Booked for this duration`
                                            : `${unit.unitNumber}: Empty & Available (Click to select)`
                                        }
                                      >
                                        <Bed className="w-3 h-3 shrink-0" />
                                        <span>{unit.unitNumber}</span>
                                        <span className="text-[8px] opacity-75 font-normal">
                                          {unit.isBooked ? 'Booked' : isSelected ? '✓ Selected' : 'Empty'}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 p-2 bg-white/5 rounded-xl border border-white/10 items-center">
                            {Array.from({ length: stayAvailability?.totalBeds || center?.availableStayBeds || 16 }).map((_, idx) => {
                              const isBooked = idx < (stayAvailability?.bookedBeds || 0);
                              return (
                                <div
                                  key={idx}
                                  title={isBooked ? `Bed Pod #${idx + 1}: Occupied` : `Bed Pod #${idx + 1}: Available`}
                                  className={`h-6 px-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all ${
                                    isBooked
                                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 opacity-70'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  }`}
                                >
                                  <Bed className="w-3 h-3 shrink-0" />
                                  <span>{idx + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Sold Out Notice if 0 beds available */}
                      {stayAvailability && !stayAvailability.isAvailable && (
                        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>All overnight pods are fully booked for these dates. Please choose alternative dates above.</span>
                        </div>
                      )}
                    </div>

                    {/* Room / Pod Type Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                          Choose Accommodation Type
                        </label>
                        {stayAvailability?.isAvailable && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {stayAvailability.availableBeds} total empty beds ready
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {roomTypes.map((room) => {
                          const isSelected = selectedRoomType === room.id;
                          const roomAvail = stayAvailability?.roomTypeBreakdown?.find(
                            (b) =>
                              b.roomType.toLowerCase() === room.id.toLowerCase() ||
                              b.roomType.includes(room.id) ||
                              room.id.includes(b.roomType)
                          );
                          const totalBeds = roomAvail?.totalBeds ?? (room.id.includes('Standard') ? 8 : 4);
                          const emptyBeds = roomAvail ? roomAvail.emptyBeds : totalBeds;
                          const bookedBeds = roomAvail ? roomAvail.bookedBeds : 0;
                          const isSoldOut = roomAvail ? roomAvail.emptyBeds <= 0 : false;

                          return (
                            <div
                              key={room.id}
                              onClick={() => {
                                setSelectedRoomType(room.id);
                                if (roomAvail && roomAvail.bedUnits) {
                                  const firstEmpty = roomAvail.bedUnits.find((u) => !u.isBooked);
                                  if (firstEmpty) setSelectedBedUnit(firstEmpty.unitNumber);
                                }
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-1 ring-indigo-500'
                                  : isSoldOut
                                  ? 'border-slate-200 bg-slate-50/60 opacity-80'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-slate-900">{room.title}</h4>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        isSelected
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {room.tag}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">{room.desc}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-base font-black text-indigo-700 font-sans">৳{room.price}</div>
                                  <div className="text-[10px] text-slate-400">per night</div>
                                </div>
                              </div>

                              {/* Prominent Live Empty Beds Tracker Badge */}
                              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs">
                                  {isSoldOut ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                      Sold Out (0 Empty Beds for these dates)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="font-black text-emerald-900">{emptyBeds} Empty Beds Available</span>
                                      <span className="text-[10px] text-emerald-700 font-normal">({bookedBeds} booked of {totalBeds})</span>
                                    </span>
                                  )}
                                </div>

                                <div className="text-[10px] font-semibold text-slate-500">
                                  Duration: {stayNights} Night{stayNights > 1 ? 's' : ''}
                                </div>
                              </div>

                              {/* Interactive Individual Physical Bed Unit Selector if Selected */}
                              {isSelected && roomAvail && roomAvail.bedUnits && roomAvail.bedUnits.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-indigo-200/60">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                                    <span className="flex items-center gap-1.5 text-indigo-900 font-extrabold">
                                      <Armchair className="w-3.5 h-3.5 text-indigo-600" />
                                      Select Physical Bed Unit:
                                    </span>
                                    <span className="text-[10px] text-indigo-600 font-semibold">
                                      {selectedBedUnit ? `Assigned: ${selectedBedUnit}` : 'Auto-select on reserve'}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {roomAvail.bedUnits.map((unit) => {
                                      const isUnitSelected = selectedBedUnit === unit.unitNumber;
                                      return (
                                        <button
                                          key={unit.unitNumber}
                                          type="button"
                                          disabled={unit.isBooked}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBedUnit(unit.unitNumber);
                                          }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                            unit.isBooked
                                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed line-through'
                                              : isUnitSelected
                                              ? 'bg-indigo-600 text-white border-2 border-indigo-700 shadow-md ring-2 ring-indigo-300'
                                              : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                                          }`}
                                        >
                                          <Bed className={`w-3.5 h-3.5 ${isUnitSelected ? 'text-white' : unit.isBooked ? 'text-slate-400' : 'text-indigo-600'}`} />
                                          <span>{unit.unitNumber}</span>
                                          <span className="text-[9px] font-normal">
                                            {unit.isBooked ? '(Booked)' : isUnitSelected ? '(Selected)' : '(Empty)'}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration / Nights Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Select Duration or Custom Dates
                        </label>
                        <span className="text-xs font-bold text-indigo-600">
                          {stayNights} Night{stayNights > 1 ? 's' : ''} Stay
                          {stayNights >= 7 ? ' • 10% OFF' : stayNights >= 3 ? ' • 5% OFF' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { n: 1, label: '1 Night', sub: 'Retreat' },
                          { n: 2, label: '2 Nights', sub: 'Weekend' },
                          { n: 3, label: '3 Nights', sub: '5% OFF' },
                          { n: 7, label: '7 Nights', sub: '10% OFF' },
                        ].map((item) => (
                          <button
                            key={item.n}
                            type="button"
                            onClick={() => handleQuickNightsSelect(item.n)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              stayNights === item.n
                                ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-xs font-bold">{item.label}</div>
                            <div className={`text-[9px] ${stayNights === item.n ? 'text-indigo-100' : 'text-slate-400 font-semibold'}`}>
                              {item.sub}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom Check-in & Check-out Date Inputs */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Check-in Date"
                            type="date"
                            value={checkInDate}
                            onChange={(e) => handleCheckInChange(e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="bg-slate-50 border-slate-100"
                          />
                          <Input
                            label="Check-out Date (Custom)"
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => handleCheckOutChange(e.target.value)}
                            min={format(addDays(new Date(`${checkInDate}T12:00:00`), 1), 'yyyy-MM-dd')}
                            className="bg-slate-50 border-slate-100"
                          />
                        </div>

                        {/* Stay Schedule Details */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Sun className="w-3.5 h-3.5 text-amber-500" /> Check-in:
                            </span>
                            <span className="font-bold text-slate-800">
                              {format(new Date(`${checkInDate}T12:00:00`), 'dd MMM yyyy')} at 12:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Moon className="w-3.5 h-3.5 text-indigo-500" /> Check-out:
                            </span>
                            <span className="font-bold text-slate-800">
                              {format(new Date(`${checkOutDate}T11:00:00`), 'dd MMM yyyy')} at 11:00 AM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Included Perks */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Included In Your Stay
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>24/7 Silent Desk Access</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Hot Showers & Towels</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>High-Speed 100Mbps WiFi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Unlimited Filtered Tea</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Air Conditioned Pod</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Full Generator Backup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Seat & Workspace Floor Plan + Checkout Summary */}
          <div className="lg:col-span-6 space-y-6">
            {/* Seat & Workspace Floor Plan Card */}
            <Card className="p-6 sm:p-8 border-slate-200 shadow-2xl flex flex-col bg-white rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Grid3X3 className="h-64 w-64" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Study Floor Layout</h2>
                    {bookingType === 'stay' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                        Desk Included With Stay
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {bookingType === 'stay'
                      ? 'Pick your preferred study desk for 24/7 access during your stay, or leave unselected to auto-assign.'
                      : 'Pick your preferred physical study spot in the center.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-white border-2 border-slate-200"></div> Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-600 ring-2 ring-indigo-200"></div> Selected
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></div> Occupied
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-400 ring-2 ring-amber-100"></div> Premium
                  </div>
                </div>
              </div>

              {isLoadingAllSeats || isLoadingAvailable ? (
                <div className="space-y-4 flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-8">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-start justify-start py-2 relative">
                  {/* Entrance Marker */}
                  <div className="w-full max-w-md h-2 bg-slate-100 rounded-full mb-8 relative mx-auto">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Main Floor Entrance & Reception
                      </span>
                      <div className="w-10 h-0.5 bg-indigo-500 rounded-full opacity-40" />
                    </div>
                  </div>

                  {/* Physical Grid Layout */}
                  <div className="space-y-3 w-full overflow-x-auto pb-4 scrollbar-hide flex flex-col items-center">
                    {gridData.map((row, y) => (
                      <div key={y} className="flex gap-3.5 p-0.5">
                        {row.map((seat, x) => {
                          if (!seat) return <div key={`${x}-${y}`} className="w-13 h-15 pointer-events-none opacity-0" />;

                          const isSelected = selectedSeatId === seat.id;
                          const isAvailable = availableSeats?.some((s) => s.id === seat.id);
                          const isPremium = seat.type === 'premium';

                          return (
                            <button
                              key={seat.id}
                              disabled={!isAvailable}
                              onClick={() => {
                                if (isSelected) {
                                  setSeatId('');
                                } else {
                                  setSeatId(seat.id);
                                }
                              }}
                              className={`
                                relative group w-13 h-15 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center border-2 cursor-pointer
                                ${
                                  !isAvailable
                                    ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed scale-90 grayscale'
                                    : isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-300 -translate-y-1 ring-4 ring-indigo-100'
                                    : isPremium
                                    ? 'bg-white border-amber-400 text-amber-600 hover:border-amber-500 hover:shadow-lg hover:-translate-y-0.5'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-lg hover:-translate-y-0.5'
                                }
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
                                <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
                                  <Sparkles className="h-2.5 w-2.5" />
                                </div>
                              )}

                              <span
                                className={`text-[11px] font-black mb-0.5 ${
                                  isSelected ? 'text-white' : isPremium ? 'text-amber-700' : 'text-slate-900'
                                }`}
                              >
                                {seat.seatNumber}
                              </span>

                              <Armchair
                                className={`h-4.5 w-4.5 transition-transform duration-300 ${
                                  isSelected ? 'text-white scale-110' : isPremium ? 'text-amber-500' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Floor Plan Footer Note */}
                  <div className="w-full mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-500" />
                      Ergonomic chairs, high-speed sockets & ambient LED reading lights on every unit.
                    </span>
                    {bookingType === 'stay' && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        24/7 Floor Access Active
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Checkout / Summary Card */}
            <Card className="p-6 sm:p-8 border-slate-200 shadow-2xl bg-white rounded-3xl overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Checkout Summary</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Live Calculation in BDT
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Plan Type</span>
                  <span className="text-slate-900 font-black">
                    {bookingType === 'stay' ? 'Study & Stay Residency' : bookingType === 'hourly' ? 'Hourly Session' : 'Monthly Elite'}
                  </span>
                </div>

                {bookingType === 'stay' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Accommodation</span>
                      <span className="text-slate-900 font-black">{activeRoom.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Assigned Bed Unit</span>
                      <span className="text-indigo-600 font-black flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-indigo-600" />
                        {selectedBedUnit ? `Unit ${selectedBedUnit} (Selected)` : 'Auto-assigned'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Category Availability</span>
                      <span className={`text-xs font-bold ${activeRoomAvail && activeRoomAvail.emptyBeds > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {activeRoomAvail ? `${activeRoomAvail.emptyBeds} Empty Beds (${activeRoomAvail.totalBeds} Total)` : 'Checking...'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Stay Duration</span>
                      <span className="text-slate-900 font-black">
                        {stayNights} Night{stayNights > 1 ? 's' : ''} ({format(new Date(`${checkInDate}T12:00:00`), 'dd MMM')} - {format(new Date(`${checkOutDate}T11:00:00`), 'dd MMM')})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Desk Workspace</span>
                      <span className="text-indigo-600 font-bold">
                        {selectedSeat ? `Unit ${selectedSeat.seatNumber}` : 'Included (Auto-assigned)'}
                      </span>
                    </div>
                    {stayNights >= 3 && (
                      <div className="flex justify-between items-center text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <span>Multi-Night Discount Applied</span>
                        <span>{stayNights >= 7 ? '10% OFF' : '5% OFF'}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Seat Selection</span>
                      <span className="text-slate-900 font-black">
                        {selectedSeat ? `Unit ${selectedSeat.seatNumber}` : 'Please select on grid'}
                      </span>
                    </div>
                    {bookingType === 'hourly' && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Duration</span>
                        <span className="text-slate-900 font-black">{durationHours.toFixed(1)} Hours</span>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">
                      Total Payable Amount
                    </span>
                    <div className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                      ৳{totalPrice.toFixed(0)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <ShieldCheck className="h-6 w-6 text-emerald-500 opacity-30 mb-0.5" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      100% Guaranteed
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-13 text-sm font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 rounded-2xl transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => createBookingMutation.mutate()}
                disabled={
                  (bookingType !== 'stay' && !selectedSeatId) ||
                  (bookingType === 'stay' && (
                    (stayAvailability && !stayAvailability.isAvailable) ||
                    (activeRoomAvail && activeRoomAvail.emptyBeds <= 0)
                  )) ||
                  createBookingMutation.isPending ||
                  isOutsideHours ||
                  isInvalidTime
                }
                isLoading={createBookingMutation.isPending}
              >
                {bookingType === 'stay'
                  ? (stayAvailability && !stayAvailability.isAvailable) || (activeRoomAvail && activeRoomAvail.emptyBeds <= 0)
                    ? `Sold Out (${activeRoom.title} has 0 Empty Beds)`
                    : `Confirm & Book Stay (৳${totalPrice.toFixed(0)})`
                  : `Confirm & Pay ৳${totalPrice.toFixed(0)}`}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
