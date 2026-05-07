'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_BOOKS } from '@/graphql/queries';
import { BUY_BOOK, BORROW_BOOK } from '@/graphql/mutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Book, ShoppingCart, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface BookItem {
  id: string;
  title: string;
  author: string;
  type: string;
  price: number;
  stock: number;
}

export default function BooksPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'BORROW'>('ALL');

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ books: BookItem[] }>(GET_BOOKS);
      return response.books;
    },
  });

  const buyMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const variables = { createOrderInput: { bookId, quantity: 1 } };
      return graphqlClient.request(BUY_BOOK, variables);
    },
    onSuccess: () => {
      toast.success('Book purchased successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to purchase book');
    }
  });

  const borrowMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const variables = { createOrderInput: { bookId, quantity: 1 } };
      return graphqlClient.request(BORROW_BOOK, variables);
    },
    onSuccess: () => {
      toast.success('Book borrowed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.errors?.[0]?.message || 'Failed to borrow book');
    }
  });

  const handleAction = (type: 'BUY' | 'BORROW', bookId: string) => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    
    if (type === 'BUY') buyMutation.mutate(bookId);
    else borrowMutation.mutate(bookId);
  };

  const filteredBooks = books?.filter(book => {
    if (filter === 'ALL') return true;
    return book.type.toUpperCase() === filter;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Book Store</h1>
        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
          Purchase or borrow resources to aid your study sessions.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button 
          variant={filter === 'ALL' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('ALL')}
        >
          All Books
        </Button>
        <Button 
          variant={filter === 'BUY' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('BUY')}
        >
          For Sale
        </Button>
        <Button 
          variant={filter === 'BORROW' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('BORROW')}
        >
          For Borrowing
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks?.map((book) => {
            const isBuyType = book.type.toUpperCase() === 'BUY';
            return (
              <Card key={book.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
                <div className="h-48 bg-slate-100 rounded-t-xl -mx-6 -mt-6 mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50 transition-colors">
                  <Book className="w-16 h-16 text-slate-300 group-hover:text-blue-300 transition-colors" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                      isBuyType ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {book.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-2xl font-black text-slate-900">${book.price.toFixed(2)}</div>
                      <div className="text-sm text-slate-500 font-medium">Stock: {book.stock}</div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={isBuyType ? 'primary' : 'secondary'}
                      onClick={() => handleAction(isBuyType ? 'BUY' : 'BORROW', book.id)}
                      disabled={book.stock <= 0 || buyMutation.isPending || borrowMutation.isPending}
                    >
                      {isBuyType ? (
                        <><ShoppingCart className="w-4 h-4 mr-2" /> Buy Now</>
                      ) : (
                        <><Clock className="w-4 h-4 mr-2" /> Borrow Book</>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {filteredBooks?.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No books found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
