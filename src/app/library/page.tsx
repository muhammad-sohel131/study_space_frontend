'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_BOOKS } from '@/graphql/queries';
import { BUY_BOOK, INIT_ORDER_PAYMENT } from '@/graphql/mutations';
import { BookCard } from '@/components/cards/BookCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface BookItem {
 id: string;
 title: string;
 author: string;
 productType: string;
 price: number;
 stock: number;
 rating?: number;
 reviews?: number;
 coverImageUrl?: string;
 previewPdfUrl?: string;
}

export default function LibraryPage() {
 const { user } = useAuthStore();
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState('');
 const [filter, setFilter] = useState<'ALL' | 'PHYSICAL' | 'PDF'>('ALL');
 const [favorites, setFavorites] = useState<Set<string>>(new Set());

 const [page, setPage] = useState(1);
 const limit = 10;

 const { data: booksData, isLoading } = useQuery({
   queryKey: ['books', page],
   queryFn: async () => {
     const response = await graphqlClient.request<{ books: { data: BookItem[]; totalPages: number } }>(GET_BOOKS, { page, limit });
     return response.books;
   },
 });

 const books = booksData?.data || [];
 const totalPages = booksData?.totalPages || 1;

 const addItemToCart = useCartStore((state) => state.addItem);

 const handleAddToCart = (book: BookItem) => {
   if (!user) {
     toast.error('Please login first');
     router.push('/login');
     return;
   }
   addItemToCart({
     bookId: book.id,
     title: book.title,
     price: book.price,
     quantity: 1,
     coverImageUrl: book.coverImageUrl,
   });
   toast.success(`${book.title} added to cart`);
 };

 const filteredBooks = useMemo(() => {
   const filtered = books?.filter(book => {
     if (filter === 'ALL') return true;
     return book.productType?.toUpperCase() === filter;
   }) || [];

   return filtered.filter(
     (book) =>
       book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       book.author.toLowerCase().includes(searchQuery.toLowerCase())
   );
 }, [books, filter, searchQuery]);

 const toggleFavorite = (bookId: string) => {
   const newFavorites = new Set(favorites);
   if (newFavorites.has(bookId)) newFavorites.delete(bookId);
   else newFavorites.add(bookId);
   setFavorites(newFavorites);
 };

 return (
   <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
     <div className="mb-10">
       <h1 className="text-4xl font-bold text-slate-900">Library</h1>
       <p className="mt-2 text-lg text-slate-600">Explore and acquire resources to elevate your study sessions.</p>
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
           { label: 'Physical Books', value: 'PHYSICAL' as const },
           { label: 'E-Books (PDF)', value: 'PDF' as const },
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
         {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
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
         {filteredBooks.map((book) => (
           <BookCard
             key={book.id}
             id={book.id}
             title={book.title}
             author={book.author}
             price={book.price}
             productType={book.productType || 'physical'}
             rating={book.rating || 0}
             reviews={book.reviews || 0}
             image={book.coverImageUrl}
             previewPdfUrl={book.previewPdfUrl}
             isAvailable={book.stock > 0}
             isFavorite={favorites.has(book.id)}
             onAddToCart={() => handleAddToCart(book)}
             onToggleFavorite={() => toggleFavorite(book.id)}
           />
         ))}
       </div>
     )}

     <Pagination 
       currentPage={page} 
       totalPages={totalPages} 
       onPageChange={setPage} 
     />
   </div>
 );
}
