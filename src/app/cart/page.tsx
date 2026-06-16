'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphqlClient';
import { BUY_BOOK, INIT_ORDER_PAYMENT } from '@/graphql/mutations';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  const initOrderPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => graphqlClient.request<{ initOrderPayment: { paymentUrl: string } }>(INIT_ORDER_PAYMENT, { orderId }),
    onSuccess: (data) => {
      clearCart();
      window.location.href = data.initOrderPayment.paymentUrl;
    },
    onError: () => {
      toast.error('Failed to initialize payment');
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error('Please login to checkout');
        router.push('/login');
        return;
      }
      
      const orderItems = items.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity
      }));

      const variables = { createOrderInput: { items: orderItems } };
      return graphqlClient.request<{ buyBook: { id: string } }>(BUY_BOOK, variables);
    },
    onSuccess: (data) => {
      toast.success('Order created! Redirecting to payment...');
      if (data?.buyBook?.id) {
        initOrderPaymentMutation.mutate(data.buyBook.id);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to checkout cart');
    }
  });

  const handleCheckout = () => {
    if (items.length === 0) return;
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          description="Looks like you haven't added any books to your cart yet."
          actionLabel="Browse Library"
          onAction={() => router.push('/library')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          <ShoppingCart className="w-10 h-10 text-violet-600" />
          Shopping Cart
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.bookId} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 items-center">
              {item.coverImageUrl ? (
                <img src={item.coverImageUrl} alt={item.title} className="w-20 h-28 object-cover rounded-lg" />
              ) : (
                <div className="w-20 h-28 bg-violet-100 flex items-center justify-center rounded-lg text-2xl">
                  📚
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                <p className="text-violet-600 font-bold mt-1">৳{item.price}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.bookId)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="text-sm text-slate-500 mb-1">Total</p>
                <p className="text-xl font-bold text-slate-900">৳{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 h-fit bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({items.length} items)</span>
              <span>৳{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="h-px bg-slate-200 w-full my-4"></div>
            <div className="flex justify-between text-slate-900 font-bold text-xl">
              <span>Total</span>
              <span>৳{getTotalPrice()}</span>
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full h-12 text-lg"
            onClick={handleCheckout}
            disabled={createOrderMutation.isPending || initOrderPaymentMutation.isPending}
          >
            {createOrderMutation.isPending || initOrderPaymentMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
