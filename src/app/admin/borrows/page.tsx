'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_BORROWS } from '@/graphql/queries';
import { RETURN_BOOK } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, User, CheckCircle2, Clock, AlertTriangle, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

export default function AdminBorrows() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RETURNED' | 'OVERDUE'>('ALL');

  const { data: borrows, isLoading } = useQuery({
    queryKey: ['allBorrows'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allBorrows: any[] }>(GET_ALL_BORROWS);
      return response.allBorrows;
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: async (borrowId: string) => graphqlClient.request(RETURN_BOOK, { borrowId }),
    onSuccess: () => {
      toast.success('Book successfully marked as returned');
      queryClient.invalidateQueries({ queryKey: ['allBorrows'] });
    },
    onError: (err: any) => toast.error(err.response?.errors?.[0]?.message || 'Failed to return book'),
  });

  const filteredBorrows = useMemo(() => {
    if (!borrows) return [];
    return borrows.filter((b) => {
      const isReturned = b.status === 'returned';
      const isOverdue = b.status === 'overdue' || (!isReturned && new Date(b.dueDate) < new Date());

      if (filter === 'ACTIVE' && isReturned) return false;
      if (filter === 'RETURNED' && !isReturned) return false;
      if (filter === 'OVERDUE' && !isOverdue) return false;

      const q = search.toLowerCase();
      const title = b.book?.title?.toLowerCase() || '';
      const userName = b.user?.name?.toLowerCase() || '';
      const userEmail = b.user?.email?.toLowerCase() || '';
      const centerName = b.center?.name?.toLowerCase() || '';

      return title.includes(q) || userName.includes(q) || userEmail.includes(q) || centerName.includes(q);
    });
  }, [borrows, filter, search]);

  const stats = useMemo(() => {
    if (!borrows) return { total: 0, active: 0, returned: 0, overdue: 0 };
    const now = new Date();
    return {
      total: borrows.length,
      active: borrows.filter((b) => b.status !== 'returned').length,
      returned: borrows.filter((b) => b.status === 'returned').length,
      overdue: borrows.filter((b) => b.status === 'overdue' || (b.status !== 'returned' && new Date(b.dueDate) < now)).length,
    };
  }, [borrows]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book Borrowing & Returns</h2>
          <p className="text-slate-500 font-medium">Track all loaned physical books, check due dates, and mark returns.</p>
        </div>
      </div>

      {/* Metrics Ticker */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Loans</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Currently Active</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{stats.active}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Returned</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.returned}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600">Overdue Loans</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.overdue}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, book title, or center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['ALL', 'ACTIVE', 'RETURNED', 'OVERDUE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Borrows List */}
      <div className="grid gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <Card key={i} className="h-28 animate-pulse bg-slate-100"><div /></Card>)
        ) : filteredBorrows.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 rounded-3xl border border-slate-200">
            No borrow records found matching criteria.
          </Card>
        ) : (
          filteredBorrows.map((borrow: any) => {
            const isReturned = borrow.status === 'returned';
            const isOverdue = borrow.status === 'overdue' || (!isReturned && new Date(borrow.dueDate) < new Date());

            return (
              <Card
                key={borrow.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${isReturned ? 'bg-emerald-50' : isOverdue ? 'bg-rose-50' : 'bg-indigo-50'}`}>
                    {borrow.book?.coverImageUrl ? (
                      <img src={borrow.book.coverImageUrl} alt={borrow.book?.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className={`w-6 h-6 ${isReturned ? 'text-emerald-600' : isOverdue ? 'text-rose-600' : 'text-indigo-600'}`} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">{borrow.book?.title}</h3>
                      <Badge
                        variant={isReturned ? 'secondary' : isOverdue ? 'danger' : 'success'}
                        className="uppercase tracking-wider text-[10px]"
                      >
                        {isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{borrow.user?.name || 'Student'}</strong> ({borrow.user?.email})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {borrow.center?.name || 'Main Hub'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                      <span>Borrowed: <strong>{format(new Date(borrow.borrowDate), 'dd MMM yyyy')}</strong></span>
                      <span>Due: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>{format(new Date(borrow.dueDate), 'dd MMM yyyy')}</strong></span>
                      {borrow.returnDate && (
                        <span className="text-emerald-600">Returned: {format(new Date(borrow.returnDate), 'dd MMM yyyy')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {!isReturned && (
                    <Button
                      onClick={() => returnBookMutation.mutate(borrow.id)}
                      disabled={returnBookMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Mark Returned
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
