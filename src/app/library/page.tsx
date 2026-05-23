'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_BOOKS } from '@/graphql/queries';
import { BUY_BOOK, BORROW_BOOK } from '@/graphql/mutations';
import { BookCard } from '@/components/cards/BookCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface BookItem {
 id: string;
 title: string;
 author: string;
 type: string;
 price: number;
 stock: number;
 rating?: number;
 reviews?: number;
}

export default function LibraryPage() {
 const { user } = useAuthStore();
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState('');
 const [filter, setFilter] = useState<'ALL' | 'SELL' | 'BORROW'>('ALL');
 const [favorites, setFavorites] = useState<Set<string>>(new Set());

 const { data: books, isLoading } = useQuery({
 queryKey: ['books'],
 queryFn: async () => {
 const response = await graphqlClient.request<{ books: BookItem[] }>(GET_BOOKS);
 return response.books || [];
 },
 });

 const buyMutation = useMutation({
 mutationFn: async (bookId: string) => {
 if (!user) {
 toast.error('Please login to buy books');
 router.push('/login');
 return;
 }
 const variables = { createOrderInput: { bookId, quantity: 1 } };
 return graphqlClient.request(BUY_BOOK, variables);
 },
 onSuccess: () => {
 toast.success('Book added to cart!');
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

 const filteredBooks = useMemo(() => {
 const filtered = books?.filter(book => {
 if (filter === 'ALL') return true;
 return book.type.toUpperCase() === filter;
 }) || [];

 return filtered.filter(
 (book) =>
 book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 book.author.toLowerCase().includes(searchQuery.toLowerCase())
 );
 }, [books, filter, searchQuery]);

 const toggleFavorite = (bookId: string) => {
 const newFavorites = new Set(favorites);
 if (newFavorites.has(bookId)) {
 newFavorites.delete(bookId);
 } else {
 newFavorites.add(bookId);
 }
 setFavorites(newFavorites);
 };

 return (
 <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
 <div className="mb-10">
 <h1 className="text-4xl font-bold text-slate-900">Library</h1>
 <p className="mt-2 text-lg text-slate-600">
 Explore and acquire resources to elevate your study sessions.
 </p>
 </div>


 {/* Search and Filter Section */}
 <div className="space-y-6 mb-8">
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="flex-1">
 <Input
 placeholder="Search books by title or author..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 <Button variant="secondary" size="md" className="sm:w-auto">
 <SlidersHorizontal size={18} />
 Filters
 </Button>
 </div>

 {/* Type Filter Tabs */}
 <div className="flex gap-2 overflow-x-auto">
 {[
 { label: 'All Books', value: 'ALL' as const },
 { label: 'For Sale', value: 'SELL' as const },
 { label: 'For Borrowing', value: 'BORROW' as const },
 ].map((tab) => (
 <Button
 key={tab.value}
 variant={filter === tab.value ? 'primary' : 'secondary'}
 size="sm"
 onClick={() => setFilter(tab.value)}
 >
 {tab.label}
 </Button>
 ))}
 </div>
 </div>

 {/* Books Grid */}
 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {Array.from({ length: 6 }).map((_, i) => (
 <CardSkeleton key={i} />
 ))}
 </div>
 ) : filteredBooks.length === 0 ? (
 <EmptyState
 icon="📚"
 title="No books found"
 description="Try adjusting your search criteria or filters."
 actionLabel="Clear Search"
 onAction={() => setSearchQuery('')}
 />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredBooks.map((book) => {
 const isBuyType = book.type.toUpperCase() === 'SELL';
 return (
 <BookCard
 key={book.id}
 id={book.id}
 title={book.title}
 author={book.author}
 price={book.price}
 rating={book.rating || 0}
 reviews={book.reviews || 0}
 isAvailable={book.stock > 0}
 isFavorite={favorites.has(book.id)}
 onBorrow={() => handleAction('BORROW', book.id)}
 onBuy={() => handleAction('BUY', book.id)}
 onToggleFavorite={() => toggleFavorite(book.id)}
 />
 );
 })}
 </div>
 )}
 </div>
 );
}
