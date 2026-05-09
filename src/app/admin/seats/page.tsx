'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS, GET_SEATS_BY_CENTER } from '@/graphql/queries';
import { CREATE_SEAT } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Armchair, Layers, DollarSign, Trash2, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageSeats() {
  const [selectedCenterId, setSelectedCenterId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    centerId: '',
    seatNumber: '',
    type: 'regular',
    pricePerHour: 50,
    pricePerMonth: 8000,
  });

  const { data: centers } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: any[] }>(GET_CENTERS);
      if (response.centers.length > 0 && !selectedCenterId) {
        setSelectedCenterId(response.centers[0].id);
      }
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
      return graphqlClient.request(CREATE_SEAT, { createSeatInput: input });
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

  const handleOpenModal = () => {
    setFormData({ ...formData, centerId: selectedCenterId });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Seats</h2>
          <p className="text-slate-500 font-medium">Add or manage seats for specific study centers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <select 
              value={selectedCenterId} 
              onChange={e => setSelectedCenterId(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
             >
               {centers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>
          <Button onClick={handleOpenModal} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            <Plus className="h-5 w-5 mr-2" />
            Add Seat
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
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
              
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-2xl">
                <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Seat">
        <div className="space-y-6 pt-4">
          <Input 
            label="Seat Number" 
            placeholder="e.g. A1, B12" 
            value={formData.seatNumber}
            onChange={e => setFormData({...formData, seatNumber: e.target.value})}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Seat Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['regular', 'premium'].map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, type})}
                  className={`py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                    formData.type === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price / Hour (৳)" 
              type="number" 
              value={formData.pricePerHour}
              onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})}
            />
            <Input 
              label="Price / Month (৳)" 
              type="number" 
              value={formData.pricePerMonth}
              onChange={e => setFormData({...formData, pricePerMonth: Number(e.target.value)})}
            />
          </div>
          <Button 
            onClick={() => createMutation.mutate(formData)} 
            className="w-full bg-indigo-600 py-3 shadow-lg shadow-indigo-200"
            isLoading={createMutation.isPending}
          >
            Create Seat
          </Button>
        </div>
      </Modal>
    </div>
  );
}
