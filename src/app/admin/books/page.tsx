'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_BOOKS, GET_CENTERS } from '@/graphql/queries';
import { CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Book as BookIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageBooks() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    stock: 0,
    productType: 'physical',
    centerId: '',
    coverImageUrl: '',
    previewPdfUrl: '',
    fullPdfUrl: '',
  });

  const { data: booksData, isLoading: loadingBooks } = useQuery({
    queryKey: ['books', page],
    queryFn: async () => {
      const response = await graphqlClient.request<{ books: { data: any[]; totalPages: number } }>(GET_BOOKS, { page, limit });
      return response.books;
    },
  });

  const books = booksData?.data || [];
  const totalPages = booksData?.totalPages || 1;

  const { data: centers } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: { data: any[] } }>(GET_CENTERS, { page: 1, limit: 100 });
      return response.centers.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: any) => graphqlClient.request(CREATE_BOOK, { createBookInput: input }),
    onSuccess: () => {
      toast.success('Book created successfully');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => toast.error(err.response?.errors?.[0]?.message || 'Failed to create book'),
  });

  const updateMutation = useMutation({
    mutationFn: async (input: any) => graphqlClient.request(UPDATE_BOOK, { updateBookInput: input }),
    onSuccess: () => {
      toast.success('Book updated successfully');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => toast.error(err.response?.errors?.[0]?.message || 'Failed to update book'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => graphqlClient.request(DELETE_BOOK, { id }),
    onSuccess: () => {
      toast.success('Book deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => toast.error(err.response?.errors?.[0]?.message || 'Failed to delete book'),
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '', author: '', price: 0, stock: 0, productType: 'physical', centerId: '',
      coverImageUrl: '', previewPdfUrl: '', fullPdfUrl: ''
    });
  };

  const handleEdit = (book: any) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      productType: book.productType || 'physical',
      centerId: book.centerId,
      coverImageUrl: book.coverImageUrl || '',
      previewPdfUrl: book.previewPdfUrl || '',
      fullPdfUrl: book.fullPdfUrl || '',
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, [field]: url });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    const input = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
    if (editingId) {
      updateMutation.mutate({ ...input, id: editingId });
    } else {
      createMutation.mutate(input);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Books</h2>
          <p className="text-slate-500 font-medium">Add, edit, or remove books from your library.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <Plus className="h-5 w-5 mr-2" /> Add New Book
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loadingBooks ? (
          [1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-slate-100"><div /></Card>)
        ) : books?.map((book: any) => (
          <Card key={book.id} className="p-0 border-slate-200 hover:border-indigo-200 transition-all group shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="h-40 w-full bg-slate-100 relative">
              {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <BookIcon className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-4">By {book.author}</p>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                  {book.productType}
                </span>
                <span className="text-lg font-black text-indigo-600">৳{book.price}</span>
              </div>

              <div className="flex gap-2 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(book)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this book?')) {
                      deleteMutation.mutate(book.id);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Book' : 'Add New Book'}>
        <div className="space-y-6 pt-4 h-[70vh] overflow-y-auto pr-2">
          <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <Input label="Author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (৳)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
            <Input label="Stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Center</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
              value={formData.centerId}
              onChange={e => setFormData({ ...formData, centerId: e.target.value })}
            >
              <option value="">Select Center</option>
              {centers?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Type</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
              value={formData.productType}
              onChange={e => setFormData({ ...formData, productType: e.target.value })}
            >
              <option value="physical">Physical Book</option>
              <option value="pdf">PDF E-book</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cover Image</label>
            <div className="relative group h-40 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-400">
              {formData.coverImageUrl ? (
                <>
                  <img src={formData.coverImageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="relative cursor-pointer">
                      Change Image
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'coverImageUrl')} accept="image/*" />
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
                      <p className="text-xs font-bold text-slate-400">Click to upload cover image</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'coverImageUrl')} accept="image/*" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Preview PDF (Optional)</label>
            <div className="relative group h-20 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-400">
              {formData.previewPdfUrl ? (
                <div className="text-center flex flex-col items-center justify-center h-full w-full">
                  <span className="text-sm font-bold text-emerald-500">✓ Preview PDF Uploaded</span>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'previewPdfUrl')} accept="application/pdf" />
                </div>
              ) : (
                <div className="text-center w-full h-full flex flex-col items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mx-auto" />
                  ) : (
                    <p className="text-xs font-bold text-slate-400">Click to upload Preview PDF</p>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'previewPdfUrl')} accept="application/pdf" />
                </div>
              )}
            </div>
          </div>

          {formData.productType === 'pdf' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full PDF (Required for E-book)</label>
              <div className="relative group h-20 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-400">
                {formData.fullPdfUrl ? (
                  <div className="text-center flex flex-col items-center justify-center h-full w-full">
                    <span className="text-sm font-bold text-emerald-500">✓ Full PDF Uploaded</span>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'fullPdfUrl')} accept="application/pdf" />
                  </div>
                ) : (
                  <div className="text-center w-full h-full flex flex-col items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mx-auto" />
                    ) : (
                      <p className="text-xs font-bold text-slate-400">Click to upload Full PDF</p>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'fullPdfUrl')} accept="application/pdf" />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 py-3 shadow-lg shadow-indigo-200"
            isLoading={createMutation.isPending || updateMutation.isPending || isUploading}
            disabled={isUploading || !formData.centerId || !formData.title || !formData.author}
          >
            {editingId ? 'Update Book' : 'Create Book'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
