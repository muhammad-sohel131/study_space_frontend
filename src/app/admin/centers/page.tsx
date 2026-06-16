'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_CENTERS } from '@/graphql/queries';
import { CREATE_CENTER, UPDATE_CENTER, DELETE_CENTER } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, MapPin, Clock, MoreVertical, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageCenters() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    openingTime: '08:00',
    closingTime: '22:00',
    coverImage: '',
  });

  const { data: centersData, isLoading } = useQuery({
    queryKey: ['centers', page],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: { data: any[]; totalPages: number } }>(GET_CENTERS, { page, limit });
      return response.centers;
    },
  });

  const centers = centersData?.data || [];
  const totalPages = centersData?.totalPages || 1;

  const createMutation = useMutation({
    mutationFn: async (input: any) => {
      return graphqlClient.request(CREATE_CENTER, { createCenterInput: input });
    },
    onSuccess: () => {
      toast.success('Center created successfully');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to create center');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: any) => {
      return graphqlClient.request(UPDATE_CENTER, { updateCenterInput: input });
    },
    onSuccess: () => {
      toast.success('Center updated successfully');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to update center');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return graphqlClient.request(DELETE_CENTER, { id });
    },
    onSuccess: () => {
      toast.success('Center deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to delete center');
    },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', location: '', openingTime: '08:00', closingTime: '22:00', coverImage: '' });
  };

  const handleEdit = (center: any) => {
    setEditingId(center.id);
    setFormData({
      name: center.name,
      location: center.location,
      openingTime: center.openingTime,
      closingTime: center.closingTime,
      coverImage: center.coverImage || '',
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, coverImage: url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId });
    } else {
      createMutation.mutate(formData);
    }
  };

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
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-slate-100"><div /></Card>)
        ) : centers?.map((center: any) => (
          <Card key={center.id} className="p-0 border-slate-200 hover:border-indigo-200 transition-all group shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 w-full bg-slate-100 relative">
              {center.coverImage ? (
                <img src={center.coverImage} alt={center.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="p-6">
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
                <button
                  onClick={() => handleEdit(center)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this center?')) {
                      deleteMutation.mutate(center.id);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Study Center' : 'Add New Study Center'}
      >
        <div className="space-y-6 pt-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cover Image</label>
            <div className="relative group h-40 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-400">
              {formData.coverImage ? (
                <>
                  <img src={formData.coverImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="relative cursor-pointer">
                      Change Image
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-400">Click to upload branch cover</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                </div>
              )}
            </div>
          </div>

          <Input
            label="Center Name"
            placeholder="e.g. Dhanmondi Library"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Location / City"
            placeholder="e.g. Dhaka"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Opening Time"
              type="time"
              value={formData.openingTime}
              onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
            />
            <Input
              label="Closing Time"
              type="time"
              value={formData.closingTime}
              onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 py-3 shadow-lg shadow-indigo-200"
            isLoading={createMutation.isPending || updateMutation.isPending}
            disabled={isUploading}
          >
            {editingId ? 'Update Center' : 'Create Center'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
