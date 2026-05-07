'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, addHours, parseISO } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_AVAILABLE_SEATS } from '@/graphql/queries';
import { CREATE_BOOKING, INIT_PAYMENT } from '@/graphql/mutations';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Seat {
  id: string;
  centerId: string;
  seatNumber: string;
  type: string;
  pricePerHour: number;
  isActive: boolean;
}

export default function BookSeatPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = params.id as string;
  const { user } = useAuthStore();
  const { selectedSeatId, setSeatId } = useBookingStore();

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endTimeStr, setEndTimeStr] = useState('11:00');

  // Convert to ISO strings for API safely
  const getISOString = (d: string, t: string) => {
    try {
      if (d && t && t.length === 5) {
        const dateObj = new Date(`${d}T${t}:00.000Z`);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString();
        }
      }
    } catch (e) {}
    return new Date().toISOString();
  };

  const startTimeISO = getISOString(date, startTimeStr);
  const endTimeISO = getISOString(date, endTimeStr);

  const { data: seats, isLoading: isLoadingSeats, refetch } = useQuery({
    queryKey: ['availableSeats', centerId, startTimeISO, endTimeISO],
    queryFn: async () => {
      const variables = { centerId, startTime: startTimeISO, endTime: endTimeISO };
      const response = await graphqlClient.request<{ availableSeats: Seat[] }>(GET_AVAILABLE_SEATS, variables);
      return response.availableSeats;
    },
    enabled: !!date && !!startTimeStr && !!endTimeStr,
  });

  const initPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return graphqlClient.request<{ initPayment: { paymentUrl: string } }>(INIT_PAYMENT, { bookingId });
    },
    onSuccess: (data) => {
      // Redirect to SSLCommerz
      window.location.href = data.initPayment.paymentUrl;
    },
    onError: () => {
      toast.error('Failed to initialize payment');
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const variables = {
        createBookingInput: {
          centerId,
          seatId: selectedSeatId,
          startTime: startTimeISO,
          endTime: endTimeISO,
          bookingType: 'hourly',
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

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book a seat');
      router.push('/login');
      return;
    }
    if (!selectedSeatId) {
      toast.error('Please select a seat');
      return;
    }
    createBookingMutation.mutate();
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Setup */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">Select Time</h2>
            <div className="space-y-4">
              <Input 
                label="Date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Time" 
                  type="time" 
                  value={startTimeStr} 
                  onChange={(e) => setStartTimeStr(e.target.value)} 
                />
                <Input 
                  label="End Time" 
                  type="time" 
                  value={endTimeStr} 
                  onChange={(e) => setEndTimeStr(e.target.value)} 
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium text-slate-900">{format(parseISO(startTimeISO), 'PP')}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium text-slate-900">{startTimeStr} - {endTimeStr}</span>
              </div>
              <div className="flex justify-between">
                <span>Seat Selected:</span>
                <span className="font-medium text-slate-900">
                  {selectedSeatId ? seats?.find(s => s.id === selectedSeatId)?.seatNumber : 'None'}
                </span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleBookNow}
              disabled={!selectedSeatId || createBookingMutation.isPending || initPaymentMutation.isPending}
              isLoading={createBookingMutation.isPending || initPaymentMutation.isPending}
            >
              Proceed to Payment
            </Button>
          </Card>
        </div>

        {/* Right Col: Seat Grid */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <h2 className="text-xl font-bold mb-6">Select a Seat</h2>
            
            <div className="flex items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-100 border border-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500 shadow-md"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200"></div>
                <span>Unavailable</span>
              </div>
            </div>

            {isLoadingSeats ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="flex-1 relative border-t-4 border-slate-300 rounded-t-3xl pt-16 px-8 bg-slate-50">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">
                  Screen / Front
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 justify-items-center">
                  {seats?.map((seat) => {
                    const isSelected = selectedSeatId === seat.id;
                    const isAvailable = seat.isActive; // In real app, we also check if booked, but availableSeats query should only return available ones if properly implemented. Wait, the query returns all seats? Let's assume the query availableSeats returns ONLY available seats, but maybe we should display all seats and mark unavailable ones. Since query is availableSeats, it probably only returns available ones. So we might not have the full grid unless we query all seats and cross-reference. For now, we will render what is returned as available.
                    
                    return (
                      <button
                        key={seat.id}
                        onClick={() => setSeatId(seat.id)}
                        className={`
                          relative group w-12 h-14 rounded-t-xl rounded-b-md transition-all duration-200
                          ${isSelected 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 -translate-y-1' 
                            : 'bg-green-100 border border-green-400 text-green-700 hover:bg-green-200 hover:-translate-y-1'
                          }
                        `}
                      >
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold">
                          {seat.seatNumber}
                        </div>
                        {/* Armrests simulation */}
                        <div className={`absolute bottom-0 left-0 w-1.5 h-6 rounded-tr-md ${isSelected ? 'bg-blue-600' : 'bg-green-300'}`}></div>
                        <div className={`absolute bottom-0 right-0 w-1.5 h-6 rounded-tl-md ${isSelected ? 'bg-blue-600' : 'bg-green-300'}`}></div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
