"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_ORDERS } from '@/graphql/queries';
import { MARK_ORDER_DELIVERED } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, User, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ allOrders: any[] }>(GET_ALL_ORDERS);
      return response.allOrders;
    },
  });

  const markDeliveredMutation = useMutation({
    mutationFn: async (orderId: string) => graphqlClient.request(MARK_ORDER_DELIVERED, { orderId }),
    onSuccess: () => {
      toast.success('Order marked delivered');
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
    onError: (err: any) => toast.error(err.response?.errors?.[0]?.message || 'Failed to mark delivered'),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Orders</h2>
        <p className="text-slate-500 font-medium">Manage and mark orders as delivered.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-24 animate-pulse bg-slate-100" />)
        ) : orders?.map((order: any) => (
          <Card key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-6 hover:border-indigo-200 transition-all group">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${order.deliveryStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Package className="h-7 w-7" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm font-black text-slate-900">Order: {order.id} — User: {order.userId}</span>
              </div>

              <div className="text-sm text-slate-600">Items: {order.items?.map((i: any) => i.book?.title + (i.quantity > 1 ? ` x${i.quantity}` : '')).join(', ')}</div>
              <div className="text-sm text-slate-500">Payment: {order.paymentStatus} • Delivery: {order.deliveryStatus}</div>

              {order.items?.some((it: any) => it.book?.productType === 'pdf') && (
                <div className="mt-2 text-sm">
                  <strong className="font-bold">Soft Products:</strong>
                  <ul className="list-disc ml-5">
                    {order.items.filter((it: any) => it.book?.productType === 'pdf').map((it: any) => (
                      <li key={it.bookId} className="text-sm">
                        {it.book?.title} — {it.book?.fullPdfUrl ? <a className="text-indigo-600 font-bold" href={it.book.fullPdfUrl} target="_blank" rel="noreferrer">Download</a> : 'No file'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-8 md:border-l border-slate-100 md:pl-8">
              <div className={`flex flex-col items-end gap-1 ${order.deliveryStatus === 'delivered' ? 'text-emerald-600' : 'text-amber-600'}`}>
                <div className="flex items-center gap-1.5">
                  {order.deliveryStatus === 'delivered' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span className="text-xs font-black uppercase tracking-widest">{order.deliveryStatus}</span>
                </div>
                {order.deliveryStatus !== 'delivered' && (
                  <Button onClick={() => markDeliveredMutation.mutate(order.id)} className="mt-3 bg-indigo-600 hover:bg-indigo-700">Mark Delivered</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
