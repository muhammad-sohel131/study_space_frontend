'use client';

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_PAYMENTS } from '@/graphql/queries';
import { CreditCard, Hash, Calendar, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AllPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allPayments: any[] }>(GET_ALL_PAYMENTS);
      return response.allPayments;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Ledger</h2>
        <p className="text-slate-500 font-medium">Tracking all financial transactions on the platform.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-3xl" />)
        ) : payments?.map((payment) => (
          <div key={payment.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-6 hover:border-indigo-200 transition-all group">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
              payment.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <CreditCard className="h-7 w-7" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm font-black text-slate-900">{payment.transactionId}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(parseISO(payment.createdAt), 'PPpp')}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">REF: {payment.bookingId.substring(0, 8)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 md:border-l border-slate-100 md:pl-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                <p className="text-xl font-black text-slate-900">৳{payment.amount}</p>
              </div>

              <div className={`flex flex-col items-end gap-1 ${
                payment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                <div className="flex items-center gap-1.5">
                  {payment.status === 'paid' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span className="text-xs font-black uppercase tracking-widest">{payment.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
