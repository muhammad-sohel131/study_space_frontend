'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_BOOKS, GET_CENTERS } from '@/graphql/queries';
import { BORROW_BOOK, INIT_BORROW_PAYMENT } from '@/graphql/mutations';
import { BookCard } from '@/components/cards/BookCard';
import { BorrowBookModal } from '@/components/library/BorrowBookModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal, BookOpen, Sparkles, MapPin, Building2, ArrowRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

interface CenterItem {
  id: string;
  name: string;
  location: string;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  productType: string;
  price: number;
  borrowPricePerDay?: number;
  stock: number;
  rating?: number;
  reviews?: number;
  coverImageUrl?: string;
  previewPdfUrl?: string;
  centerId?: string;
  center?: {
    id: string;
    name: string;
    location: string;
  };
}

export default function LibraryPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PHYSICAL' | 'PDF'>('ALL');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('ALL');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Borrow Modal State
  const [borrowingBook, setBorrowingBook] = useState<BookItem | null>(null);

  const [page, setPage] = useState(1);
  const limit = 18;

  // Fetch Centers
  const { data: centersData } = useQuery({
    queryKey: ['centers'],
    queryFn: async () => {
      const response = await graphqlClient.request<{ centers: { data: CenterItem[] } }>(GET_CENTERS, { limit: 50 });
      return response.centers?.data || [];
    },
  });

  const centers = centersData || [];

  // Fetch Books with Center filtering
  const { data: booksData, isLoading, refetch } = useQuery({
    queryKey: ['books', page, selectedCenterId],
    queryFn: async () => {
      const response = await graphqlClient.request<{ books: { data: BookItem[]; totalPages: number } }>(GET_BOOKS, {
        page,
        limit,
        centerId: selectedCenterId !== 'ALL' ? selectedCenterId : undefined,
      });
      return response.books;
    },
  });

  const books = booksData?.data || [];
  const totalPages = booksData?.totalPages || 1;

  const activeCenter = useMemo(() => {
    if (selectedCenterId === 'ALL') return null;
    return centers.find((c) => c.id === selectedCenterId);
  }, [centers, selectedCenterId]);

  const addItemToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (book: BookItem) => {
    if (!user) {
      toast.error('Please login first to buy books');
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
    toast.success(`"${book.title}" added to cart`);
  };

  const initBorrowPaymentMutation = useMutation({
    mutationFn: async (borrowId: string) => {
      const res = await graphqlClient.request<{ initBorrowPayment: { paymentUrl: string } }>(
        INIT_BORROW_PAYMENT,
        { borrowId }
      );
      return res.initBorrowPayment;
    },
    onSuccess: (data) => {
      toast.success('Redirecting to SSLCommerz payment gateway...');
      window.location.href = data.paymentUrl;
    },
    onError: (err: any) => {
      toast.error(err.response?.errors?.[0]?.message || 'Failed to initialize payment');
    },
  });

  // Borrow Mutation
  const borrowMutation = useMutation({
    mutationFn: async ({ bookId, durationDays, notes }: { bookId: string; durationDays: number; notes?: string }) => {
      const response = await graphqlClient.request<{ borrowBook: any }>(BORROW_BOOK, {
        borrowBookInput: { bookId, durationDays, notes },
      });
      return response.borrowBook;
    },
    onSuccess: (data) => {
      toast.success(`Rental reserved! Connecting to SSLCommerz...`);
      setBorrowingBook(null);
      if (data?.id) {
        initBorrowPaymentMutation.mutate(data.id);
      }
    },
    onError: (error: any) => {
      const msg = error.response?.errors?.[0]?.message || 'Failed to borrow book';
      toast.error(msg);
    },
  });

  const handleOpenBorrow = (book: BookItem) => {
    if (!user) {
      toast.error('Please login first to borrow books');
      router.push('/login');
      return;
    }
    setBorrowingBook(book);
  };

  const handleConfirmBorrow = async (bookId: string, durationDays: number, notes?: string) => {
    await borrowMutation.mutateAsync({ bookId, durationDays, notes });
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
      
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-violet-600" />
            StudySpace Academic Library
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Borrow & Buy Academic Resources
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Borrow physical textbooks for your study session, or purchase hard copies and e-books to keep across our study hubs.
          </p>
        </div>

        {user && (
          <Link href="/dashboard?tab=borrows">
            <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50 font-bold shrink-0">
              <span>View My Borrowed Books</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Feature Highlight Banner */}
      <div className="mb-10 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider mb-3 border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Affordable Rental & Purchase
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Rent per Day or Buy to Keep
          </h2>
          <p className="text-sm sm:text-base text-violet-200 leading-relaxed">
            Borrow physical textbooks from your center shelf for flexible durations starting at only ৳15/day. Need permanent access? Buy copies directly to keep and study anywhere!
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-black text-violet-300">10,000+</div>
            <div className="text-xs text-violet-200">Curated Textbooks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-black text-amber-400">From ৳15/day</div>
            <div className="text-xs text-violet-200">Flexible Rental</div>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search and Center Filter Section */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search books by title, author, or exam topic (BCS, Medical, BUET)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Format:</span>
            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { label: 'All', value: 'ALL' as const },
                { label: 'Physical', value: 'PHYSICAL' as const },
                { label: 'PDF', value: 'PDF' as const },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === tab.value
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Filter Navigation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Filter by Study Center / Branch:
              </span>
            </div>

            {selectedCenterId !== 'ALL' && (
              <button
                onClick={() => {
                  setSelectedCenterId('ALL');
                  setPage(1);
                }}
                className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Show all centers</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => {
                setSelectedCenterId('ALL');
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCenterId === 'ALL'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200 ring-1 ring-violet-500'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Branches</span>
            </button>

            {centers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCenterId(c.id);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedCenterId === c.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200 ring-1 ring-violet-500'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{c.name}</span>
                {c.location && (
                  <span className={`text-[10px] font-normal ${selectedCenterId === c.id ? 'text-violet-200' : 'text-slate-400'}`}>
                    • {c.location}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeCenter && (
            <div className="text-xs text-slate-600 pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-violet-700">Active Branch:</span>
                <span>Showing physical and digital books at <strong>{activeCenter.name}</strong> ({activeCenter.location})</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Pick up available on site
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No books found"
          description={
            activeCenter 
              ? `No books are currently listed for "${activeCenter.name}". Try switching to All Branches or adjusting your search.`
              : "Try adjusting your search criteria or switch between physical books and e-books."
          }
          actionLabel={activeCenter ? "View All Branches" : "Clear Search"}
          onAction={() => {
            if (activeCenter) {
              setSelectedCenterId('ALL');
              setPage(1);
            } else {
              setSearchQuery('');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              price={book.price}
              borrowPricePerDay={book.borrowPricePerDay || 15}
              productType={book.productType || 'physical'}
              rating={book.rating || 0}
              reviews={book.reviews || 0}
              image={book.coverImageUrl}
              previewPdfUrl={book.previewPdfUrl}
              center={book.center}
              isAvailable={book.stock > 0}
              isFavorite={favorites.has(book.id)}
              onAddToCart={() => handleAddToCart(book)}
              onBorrow={() => handleOpenBorrow(book)}
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

      {/* Borrow Book Modal */}
      <BorrowBookModal
        isOpen={!!borrowingBook}
        onClose={() => setBorrowingBook(null)}
        book={borrowingBook}
        onConfirmBorrow={handleConfirmBorrow}
        isLoading={borrowMutation.isPending || initBorrowPaymentMutation.isPending}
      />
    </div>
  );
}
