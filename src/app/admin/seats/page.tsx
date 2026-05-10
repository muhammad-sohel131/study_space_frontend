'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS, GET_SEATS_BY_CENTER } from '@/graphql/queries';
import { CREATE_SEAT, UPDATE_SEAT, DELETE_SEAT } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Armchair, Trash2, SlidersHorizontal, Grid3X3, Save, Info, MapPin, Building2, ChevronRight, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageSeats() {
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState<any>(null);
  const [isGridLayout, setIsGridLayout] = useState(true);
  
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Seats</h2>
          <p className="text-slate-500 font-medium">Design and arrange workspace layouts for your center.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Building2 className="h-3 w-3" /> Select Center
            </label>
            <div className="relative">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
               <select 
                value={selectedCenterId} 
                onChange={e => setSelectedCenterId(e.target.value)}
                className="pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none min-w-[240px] hover:border-indigo-300 transition-colors cursor-pointer"
               >
                 <option value="" disabled>Choose a study center...</option>
                 {centers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                 <ChevronRight className="h-4 w-4 rotate-90" />
               </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsGridLayout(!isGridLayout)}
              className="border-slate-200 h-11"
              disabled={!selectedCenterId}
            >
              {isGridLayout ? <Armchair className="h-4 w-4 mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
              {isGridLayout ? 'List View' : 'Grid View'}
            </Button>
            <Button 
              onClick={() => handleOpenModal()} 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 h-11"
              disabled={!selectedCenterId}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Seat
            </Button>
          </div>
        </div>
      </div>

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
          <div className="mb-6 flex items-center gap-2 text-indigo-600 bg-indigo-50 p-3 rounded-xl inline-flex">
            <Info className="h-4 w-4" />
            <span className="text-xs font-bold">Click any cell to add a seat, or click an existing seat to edit its properties.</span>
          </div>
          
          <div className="inline-grid gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {gridData.map((row, y) => (
              <div key={y} className="flex gap-2">
                {row.map((seat, x) => (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => handleOpenModal(seat, x, y)}
                    className={`
                      w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border-2
                      ${seat 
                        ? seat.type === 'premium' 
                          ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm' 
                          : 'bg-white border-indigo-200 text-indigo-600 shadow-sm'
                        : 'bg-slate-50/50 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-white'
                      }
                    `}
                  >
                    {seat ? (
                      <>
                        <span className="text-[10px] font-black">{seat.seatNumber}</span>
                        <Armchair className="h-3 w-3" />
                      </>
                    ) : (
                      <span className="text-[8px] text-slate-300 font-bold opacity-0 hover:opacity-100 uppercase tracking-tighter">add</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border-2 border-indigo-200"></div> Regular Seat</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-100 border-2 border-amber-300"></div> Premium Seat</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-50 border-2 border-dashed border-slate-200"></div> Empty Slot</div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {seats?.map((seat) => (
            <Card key={seat.id} className={`p-4 border-slate-100 flex flex-col items-center justify-center text-center relative group transition-all duration-300 ${
              seat.type === 'premium' ? 'bg-amber-50 border-amber-200' : 'bg-white'
            }`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${
                seat.type === 'premium' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <Armchair className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900">{seat.seatNumber}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{seat.type}</p>
              
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all rounded-2xl">
                <button 
                  onClick={() => handleOpenModal(seat)}
                  className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => {
                    if(confirm('Delete this seat?')) deleteMutation.mutate(seat.id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
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
              onChange={e => setFormData({...formData, seatNumber: e.target.value})}
            />
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['regular', 'premium'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, type})}
                    className={`py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.type === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400'
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
              onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})}
            />
            <Input 
              label="Price/Month (৳)" 
              type="number" 
              value={formData.pricePerMonth}
              onChange={e => setFormData({...formData, pricePerMonth: Number(e.target.value)})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Grid X (Column)" 
              type="number" 
              value={formData.x}
              onChange={e => setFormData({...formData, x: Number(e.target.value)})}
            />
            <Input 
              label="Grid Y (Row)" 
              type="number" 
              value={formData.y}
              onChange={e => setFormData({...formData, y: Number(e.target.value)})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            {editingSeat && (
              <Button 
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  if(confirm('Are you sure you want to delete this seat?')) {
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
    </div>
  );
}
