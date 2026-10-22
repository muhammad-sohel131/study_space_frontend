'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    author: string;
    coverImageUrl?: string;
    productType?: string;
    price?: number;
    borrowPricePerDay?: number;
    stock?: number;
    center?: {
      id?: string;
      name?: string;
      location?: string;
    };
  } | null;
  onConfirmBorrow: (bookId: string, durationDays: number, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export function BorrowBookModal({
  isOpen,
  onClose,
  book,
  onConfirmBorrow,
  isLoading = false,
}: BorrowBookModalProps) {
  const [durationDays, setDurationDays] = useState(7);
  const [notes, setNotes] = useState('');

  if (!book) return null;

  const dailyRate = book.borrowPricePerDay || 15;
  const totalCost = dailyRate * durationDays;
  const dueDate = addDays(new Date(), durationDays);

  const durationOptions = [
    { days: 3, label: '3 Days', sub: `৳${dailyRate * 3}` },
    { days: 7, label: '7 Days', sub: `৳${dailyRate * 7}` },
    { days: 14, label: '14 Days', sub: `৳${dailyRate * 14}` },
    { days: 30, label: '30 Days', sub: `৳${dailyRate * 30}` },
  ];

  const handleConfirm = async () => {
    await onConfirmBorrow(book.id, durationDays, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rent & Borrow Physical Book" size="lg">
      <div className="space-y-6 pt-2">
        {/* Book Preview Header */}
        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="relative w-20 h-28 bg-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
            {book.coverImageUrl ? (
              <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-violet-100 text-violet-800 mb-1">
                Rental: ৳{dailyRate} / day
              </span>
              <h3 className="font-bold text-slate-900 text-base line-clamp-2">{book.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">by {book.author}</p>
              {book.center?.name && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span>Available at: <strong>{book.center.name}</strong></span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
              <span className="font-semibold text-slate-700">Buy to keep: ৳{book.price || 0}</span>
              <span className="text-slate-300">•</span>
              <span className="text-violet-700 font-bold">Daily Rental: ৳{dailyRate}/day</span>
            </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Borrow Duration & Price
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {durationOptions.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setDurationDays(opt.days)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  durationDays === opt.days
                    ? 'border-violet-600 bg-violet-50 text-violet-900 font-bold shadow-sm ring-1 ring-violet-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="text-sm font-bold">{opt.label}</div>
                <div className="text-xs font-semibold text-violet-600 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date & Pricing Summary */}
        <div className="p-4 bg-violet-50/70 border border-violet-100 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-600" />
              Borrow Date:
            </span>
            <span className="font-semibold text-slate-900">{format(new Date(), 'dd MMMM yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Return Due Date:
            </span>
            <span className="font-bold text-violet-700">{format(dueDate, 'dd MMMM yyyy')}</span>
          </div>
          <div className="pt-2.5 border-t border-violet-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 block">Rental Calculation</span>
              <span className="text-[11px] text-slate-500 font-medium">৳{dailyRate} × {durationDays} days</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Payable Fee</span>
              <span className="text-lg font-black text-violet-700">৳{totalCost}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-violet-200/40 flex items-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <span>Rental fee of ৳{totalCost} will be applied for {durationDays} days. Please return on or before due date.</span>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Pickup Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Will collect from the front reception desk today"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold h-11"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Pay ৳${totalCost} & Confirm Borrow`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
