'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS } from '@/graphql/queries';
import { CREATE_CENTER } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, MapPin, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCenters() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    openingTime: '08:00',
    closingTime: '22:00',
  });

  const { data: centers, isLoading, refetch } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: any[] }>(GET_CENTERS);
      return response.centers;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: any) => {
      return graphqlClient.request(CREATE_CENTER, { createCenterInput: input });
    },
    onSuccess: () => {
      toast.success('Center created successfully');
      setModalOpen(false);
      refetch();
      setFormData({ name: '', location: '', openingTime: '08:00', closingTime: '22:00' });
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to create center');
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Centers</h2>
          <p className="text-slate-500 font-medium">Add, edit, or remove study center locations.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus className="h-5 w-5 mr-2" />
          Add New Center
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {centers?.map((center) => (
          <Card key={center.id} className="p-6 border-slate-200 hover:border-indigo-200 transition-all group shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {center.name}
            </h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center text-sm font-medium text-slate-500">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                {center.location}
              </div>
              <div className="flex items-center text-sm font-medium text-slate-500">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                {center.openingTime} - {center.closingTime}
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Study Center">
        <div className="space-y-6 pt-4">
          <Input 
            label="Center Name" 
            placeholder="e.g. Dhanmondi Library" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Location / City" 
            placeholder="e.g. Dhaka" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Opening Time" 
              type="time" 
              value={formData.openingTime}
              onChange={e => setFormData({...formData, openingTime: e.target.value})}
            />
            <Input 
              label="Closing Time" 
              type="time" 
              value={formData.closingTime}
              onChange={e => setFormData({...formData, closingTime: e.target.value})}
            />
          </div>
          <Button 
            onClick={() => createMutation.mutate(formData)} 
            className="w-full bg-indigo-600 py-3 shadow-lg shadow-indigo-200"
            isLoading={createMutation.isPending}
          >
            Create Center
          </Button>
        </div>
      </Modal>
    </div>
  );
}
