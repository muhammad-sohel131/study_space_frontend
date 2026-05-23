'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, parseISO, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS, GET_SEATS_BY_CENTER } from '@/graphql/queries';
import { CREATE_SEAT, UPDATE_SEAT, DELETE_SEAT } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Plus, Armchair, Trash2, SlidersHorizontal, Grid3X3, Save, Info, MapPin, Building2, ChevronRight, LayoutGrid, Calendar, Activity, User, Clock, Filter, Eye, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageSeats() {
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState<any>(null);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const [viewMode, setViewMode] = useState<'design' | 'tracking'>('design');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedTrackingSeat, setSelectedTrackingSeat] = useState<any>(null);

  const [formData, setFormData] = useState({
    seatNumber: '',
    type: 'regular',
    pricePerHour: 50,
    pricePerMonth: 8000,
    x: 0,
    y: 0,
  });

  const { data: centers } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: any[] }>(GET_CENTERS);
      return response.centers;
    },
  });

  const { data: seats, isLoading, refetch } = useQuery({
    queryKey: ['seatsByCenter', selectedCenterId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ seats: any[] }>(GET_SEATS_BY_CENTER, { centerId: selectedCenterId });
      return response.seats;
    },
    enabled: !!selectedCenterId,
    refetchInterval: viewMode === 'tracking' ? 10000 : false, // 10s auto-refresh in tracking mode
  });

  const createMutation = useMutation({
    mutationFn: async (input: any) => {
      return graphqlClient.request(CREATE_SEAT, { createSeatInput: { ...input, centerId: selectedCenterId } });
    },
    onSuccess: () => {
      toast.success('Seat created successfully');
      setModalOpen(false);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to create seat');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: any) => {
      const { id, ...data } = input;
      const { centerId, isActive, bookings, ...updateData } = data;
      return graphqlClient.request(UPDATE_SEAT, { updateSeatInput: { id, ...updateData } });
    },
    onSuccess: () => {
      toast.success('Seat updated successfully');
      setModalOpen(false);
      setEditingSeat(null);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to update seat');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return graphqlClient.request(DELETE_SEAT, { id });
    },
    onSuccess: () => {
      toast.success('Seat deleted successfully');
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to delete seat');
    },
  });

  const gridData = useMemo(() => {
    if (!seats) return [];
    const maxX = Math.max(...seats.map(s => s.x || 0), 10);
    const maxY = Math.max(...seats.map(s => s.y || 0), 8);

    const grid = Array(maxY + 2).fill(0).map(() => Array(maxX + 2).fill(null));
    seats.forEach(seat => {
      if (seat.y !== null && seat.x !== null) {
        grid[seat.y][seat.x] = seat;
      }
    });
    return grid;
  }, [seats]);

  const handleOpenModal = (seat?: any, x?: number, y?: number) => {
    if (!selectedCenterId) {
      toast.error('Please select a center first');
      return;
    }
    if (seat) {
      setEditingSeat(seat);
      setFormData({
        seatNumber: seat.seatNumber,
        type: seat.type,
        pricePerHour: seat.pricePerHour,
        pricePerMonth: seat.pricePerMonth,
        x: seat.x,
        y: seat.y,
      });
    } else {
      setEditingSeat(null);
      setFormData({
        seatNumber: '',
        type: 'regular',
        pricePerHour: 50,
        pricePerMonth: 8000,
        x: x ?? 0,
        y: y ?? 0,
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingSeat) {
      updateMutation.mutate({ id: editingSeat.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSeatClick = (seat: any, x: number, y: number) => {
    if (viewMode === 'design') {
      handleOpenModal(seat, x, y);
    } else if (seat) {
      setSelectedTrackingSeat(seat);
      setTrackingModalOpen(true);
    }
  };

  const getSeatStatus = (seat: any) => {
    if (!seat || !seat.bookings) return 'available';
    
    const filterStart = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}:00`);
    const filterEnd = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}:00`);

    const hasCollision = seat.bookings.some((b: any) => {
      const bStart = parseISO(b.startTime);
      const bEnd = parseISO(b.endTime);
      return b.status !== 'cancelled' && (
        (bStart >= filterStart && bStart < filterEnd) ||
        (bEnd > filterStart && bEnd <= filterEnd) ||
        (bStart <= filterStart && bEnd >= filterEnd)
      );
    });

    return hasCollision ? 'booked' : 'available';
  };

  const getActiveBooking = (seat: any) => {
    if (!seat || !seat.bookings) return null;
    
    const filterStart = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}:00`);
    const filterEnd = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}:00`);

    return seat.bookings.find((b: any) => {
      const bStart = parseISO(b.startTime);
      const bEnd = parseISO(b.endTime);
      return b.status !== 'cancelled' && (
        (bStart >= filterStart && bStart < filterEnd) ||
        (bEnd > filterStart && bEnd <= filterEnd) ||
        (bStart <= filterStart && bEnd >= filterEnd)
      );
    });
  };

  const getUpcomingBookings = (seat: any) => {
    if (!seat || !seat.bookings) return [];
    const now = new Date();
    return seat.bookings
      .filter((b: any) => b.status !== 'cancelled' && parseISO(b.startTime) >= now)
      .sort((a: any, b: any) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
  };

  const trackingStats = useMemo(() => {
    if (!seats) return { total: 0, booked: 0, available: 0 };
    let booked = 0;
    seats.forEach(s => {
      if (getSeatStatus(s) === 'booked') booked++;
    });
    return {
      total: seats.length,
      booked,
      available: seats.length - booked
    };
  }, [seats, selectedDate]);



  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {viewMode === 'design' ? <Settings2 className="h-6 w-6 text-indigo-600" /> : <Activity className="h-6 w-6 text-emerald-500" />}
            {viewMode === 'design' ? 'Seat Layout Designer' : 'Live Booking Tracker'}
          </h2>
          <p className="text-slate-500 font-medium">
            {viewMode === 'design'
              ? 'Design and arrange workspace layouts for your center.'
              : 'Monitor real-time occupancy and manage active bookings.'}
          </p>
          {viewMode === 'tracking' && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Live & Tracking</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Building2 className="h-3 w-3" /> Study Center
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
              <select
                value={selectedCenterId}
                onChange={e => setSelectedCenterId(e.target.value)}
                className="pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none min-w-[200px] hover:border-indigo-300 transition-colors cursor-pointer"
              >
                <option value="" disabled>Select Center...</option>
                {centers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden lg:block" />

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('design')}
              className={`flex items-center gap-3 px-6 py-2 rounded-xl text-sm font-black transition-all ${viewMode === 'design' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Grid3X3 className="h-4 w-4" /> Design Layout
            </button>
            <button
              onClick={() => setViewMode('tracking')}
              className={`flex items-center gap-3 px-6 py-2 rounded-xl text-sm font-black transition-all ${viewMode === 'tracking' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Activity className={`h-4 w-4 ${viewMode === 'tracking' ? 'animate-pulse' : ''}`} /> Live Tracker
            </button>
          </div>

          {viewMode === 'tracking' && (
            <>
              <div className="h-10 w-px bg-slate-100 hidden lg:block" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Select Date
                </label>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Time Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="h-10 w-px bg-slate-100 hidden lg:block" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsGridLayout(!isGridLayout)}
              className="border-slate-200 h-10 px-3 rounded-xl"
              disabled={!selectedCenterId}
            >
              {isGridLayout ? <Armchair className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-slate-200 h-10 px-3 rounded-xl hover:bg-slate-50"
              disabled={!selectedCenterId || isLoading}
            >
              <Activity className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {viewMode === 'design' && (
              <Button
                onClick={() => handleOpenModal()}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 h-10 px-4 rounded-xl"
                disabled={!selectedCenterId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Seat
              </Button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'tracking' && selectedCenterId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-100 bg-white shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Armchair className="h-16 w-16" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</p>
            <h3 className="text-3xl font-black text-slate-900">{trackingStats.total} <span className="text-sm font-medium text-slate-400">Seats</span></h3>
            <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: '100%' }} />
            </div>
          </Card>

          <Card className="p-6 border-emerald-100 bg-white shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-16 w-16 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Booked Today</p>
            <h3 className="text-3xl font-black text-slate-900">{trackingStats.booked} <span className="text-sm font-medium text-slate-400">Occupied</span></h3>
            <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(trackingStats.booked / trackingStats.total) * 100}%` }} />
            </div>
          </Card>

          <Card className="p-6 border-slate-100 bg-white shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutGrid className="h-16 w-16 text-indigo-500" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Seats</p>
            <h3 className="text-3xl font-black text-slate-900">{trackingStats.available} <span className="text-sm font-medium text-slate-400">Ready</span></h3>
            <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-100" style={{ width: `${(trackingStats.available / trackingStats.total) * 100}%` }} />
            </div>
          </Card>
        </div>
      )}

      {!selectedCenterId ? (
        <Card className="p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
          <div className="h-20 w-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 mb-6 shadow-sm">
            <LayoutGrid className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No Center Selected</h3>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">
            Please select a study center from the dropdown menu above to manage its seat layout and physical grid configuration.
          </p>
          <div className="flex items-center gap-2 text-indigo-500 text-sm font-bold animate-bounce">
            <ChevronRight className="h-4 w-4 -rotate-90" />
            Select from the menu above
          </div>
        </Card>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Layout...</p>
        </div>
      ) : isGridLayout ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
          <div className="mb-6 flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-3 text-indigo-700">
              <Info className="h-5 w-5" />
              <span className="text-sm font-bold">
                {viewMode === 'design' 
                  ? 'Layout Designer: Drag or click cells to arrange seats.' 
                  : 'Live Tracker: Click booked seats to view guest details.'}
              </span>
            </div>
            {viewMode === 'design' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('tracking')}
                className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100"
              >
                Switch to Tracking <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>

          <div className="inline-grid gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {gridData.map((row, y) => (
              <div key={y} className="flex gap-2">
                {row.map((seat, x) => {
                  const status = getSeatStatus(seat);
                  const isBooked = status === 'booked';

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => handleSeatClick(seat, x, y)}
                      className={`
                        w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border-2
                        ${seat
                          ? viewMode === 'tracking'
                            ? isBooked
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-100 animate-pulse-slow'
                              : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300'
                            : seat.type === 'premium'
                              ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
                              : 'bg-white border-indigo-200 text-indigo-600 shadow-sm'
                          : 'bg-slate-50/50 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-white'
                        }
                      `}
                    >
                      {seat ? (
                        <>
                          <span className={`text-[10px] font-black ${isBooked && viewMode === 'tracking' ? 'text-white' : ''}`}>{seat.seatNumber}</span>
                          {isBooked && viewMode === 'tracking' ? <User className="h-3 w-3" /> : <Armchair className="h-3 w-3" />}
                        </>
                      ) : (
                        viewMode === 'design' && <span className="text-[8px] text-slate-300 font-bold opacity-0 hover:opacity-100 uppercase tracking-tighter">add</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 pt-6">
            {viewMode === 'design' ? (
              <>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border-2 border-indigo-200"></div> Regular Seat</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-100 border-2 border-amber-300"></div> Premium Seat</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-50 border-2 border-dashed border-slate-200"></div> Empty Slot</div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500 border-2 border-emerald-600"></div> Currently Booked</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border-2 border-slate-200"></div> Available</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {seats?.map((seat) => {
            const status = getSeatStatus(seat);
            const isBooked = status === 'booked';

            return (
              <Card
                key={seat.id}
                onClick={() => handleSeatClick(seat, seat.x, seat.y)}
                className={`p-4 border-slate-100 flex flex-col items-center justify-center text-center relative group transition-all duration-300 cursor-pointer hover:shadow-md ${viewMode === 'tracking'
                    ? isBooked ? 'bg-emerald-50 border-emerald-200' : 'bg-white'
                    : seat.type === 'premium' ? 'bg-amber-50 border-amber-200' : 'bg-white'
                  }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${viewMode === 'tracking'
                    ? isBooked ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    : seat.type === 'premium' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                  {isBooked && viewMode === 'tracking' ? <User className="h-5 w-5" /> : <Armchair className="h-5 w-5" />}
                </div>
                <h4 className="text-sm font-black text-slate-900">{seat.seatNumber}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {viewMode === 'tracking' ? status : seat.type}
                </p>

                {viewMode === 'design' && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all rounded-2xl">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(seat);
                      }}
                      className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this seat?')) deleteMutation.mutate(seat.id);
                      }}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {isBooked && viewMode === 'tracking' && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSeat ? `Edit Seat ${editingSeat.seatNumber}` : "Add New Seat"}
      >
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Seat Number"
              placeholder="e.g. A1"
              value={formData.seatNumber}
              onChange={e => setFormData({ ...formData, seatNumber: e.target.value })}
            />
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['regular', 'premium'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, type })}
                    className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price/Hr (৳)"
              type="number"
              value={formData.pricePerHour}
              onChange={e => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
            />
            <Input
              label="Price/Month (৳)"
              type="number"
              value={formData.pricePerMonth}
              onChange={e => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Grid X (Column)"
              type="number"
              value={formData.x}
              onChange={e => setFormData({ ...formData, x: Number(e.target.value) })}
            />
            <Input
              label="Grid Y (Row)"
              type="number"
              value={formData.y}
              onChange={e => setFormData({ ...formData, y: Number(e.target.value) })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            {editingSeat && (
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this seat?')) {
                    deleteMutation.mutate(editingSeat.id);
                    setModalOpen(false);
                  }
                }}
              >
                Delete
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="flex-[2] bg-indigo-600 shadow-lg shadow-indigo-200"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingSeat ? 'Update Seat' : 'Create Seat'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTrackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        title={`Seat Tracking: ${selectedTrackingSeat?.seatNumber}`}
      >
        {selectedTrackingSeat && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Building2 className="h-20 w-20" />
              </div>
              <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-4 ${getSeatStatus(selectedTrackingSeat) === 'booked' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-200 text-slate-500'
                }`}>
                <Armchair className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Seat {selectedTrackingSeat.seatNumber}</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-indigo-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {centers?.find(c => c.id === selectedCenterId)?.name || 'Center'}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Badge variant={getSeatStatus(selectedTrackingSeat) === 'booked' ? 'success' : 'outline'}>
                  {getSeatStatus(selectedTrackingSeat) === 'booked' ? 'Occupied in Range' : 'Available in Range'}
                </Badge>
                <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase text-[9px]">
                  {selectedTrackingSeat.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Upcoming Bookings
              </h4>
              
              {getUpcomingBookings(selectedTrackingSeat).length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {getUpcomingBookings(selectedTrackingSeat).map((booking: any) => (
                    <div key={booking.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{booking.user?.name || 'Anonymous User'}</p>
                            <p className="text-[10px] text-slate-500">{booking.user?.email}</p>
                          </div>
                        </div>
                        <Badge className={`text-[9px] uppercase ${booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Start</p>
                          <p className="text-xs font-bold text-slate-700">{format(parseISO(booking.startTime), 'MMM dd, hh:mm a')}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">End</p>
                          <p className="text-xs font-bold text-slate-700">{format(parseISO(booking.endTime), 'MMM dd, hh:mm a')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                         <span className="text-[9px] text-slate-400 font-medium">Booked at {format(parseISO(booking.createdAt), 'MMM dd, HH:mm')}</span>
                         <Badge className="bg-indigo-600 text-white text-[9px] px-2 py-0.5">{booking.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-6 border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-slate-400 font-medium italic">No upcoming bookings found for this seat.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
