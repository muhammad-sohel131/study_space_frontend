'use client';

import React, { useState } from 'react';
import { Card } from './Card';

export interface SeatType {
  id: string;
  number: string;
  status: 'available' | 'selected' | 'booked' | 'premium';
  isPremium?: boolean;
}

interface SeatGridProps {
  seats: SeatType[];
  onSeatClick?: (seat: SeatType) => void;
  selectedSeats?: string[];
  cols?: number;
}

export function SeatGrid({
  seats,
  onSeatClick,
  selectedSeats = [],
  cols = 6,
}: SeatGridProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const getStatusStyles = (seat: SeatType) => {
    if (selectedSeats.includes(seat.id)) {
      return 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 scale-105';
    }

    switch (seat.status) {
      case 'available':
        return 'bg-white border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 hover:shadow-lg';
      case 'booked':
        return 'bg-slate-200 border-2 border-slate-400 text-slate-500 cursor-not-allowed opacity-60';
      case 'premium':
        return 'bg-amber-50 border-2 border-amber-400 text-amber-700 hover:bg-amber-100 hover:shadow-lg';
      default:
        return 'bg-slate-100 border-2 border-slate-200 text-slate-600';
    }
  };

  const handleSeatClick = (seat: SeatType) => {
    if (seat.status !== 'booked') {
      onSeatClick?.(seat);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white border-2 border-indigo-300"></div>
          <span className="text-sm text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600"></div>
          <span className="text-sm text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-200 border-2 border-slate-400"></div>
          <span className="text-sm text-slate-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-50 border-2 border-amber-400"></div>
          <span className="text-sm text-slate-600">Premium</span>
        </div>
      </div>

      <div
        className="grid gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            onMouseEnter={() => setHoveredSeat(seat.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            disabled={seat.status === 'booked'}
            className={`
              relative h-12 rounded-lg font-semibold transition-all duration-200 transform
              ${getStatusStyles(seat)}
              ${hoveredSeat === seat.id && seat.status !== 'booked' ? 'scale-105' : 'scale-100'}
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            `}
            title={`Seat ${seat.number}${seat.isPremium ? ' (Premium)' : ''}`}
          >
            <span className="text-xs sm:text-sm">{seat.number}</span>
            {seat.isPremium && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900">
                ✨
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-emerald-700">{selectedSeats.length}</span>
            {' '}
            {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
          </p>
        </Card>
      )}
    </div>
  );
}
