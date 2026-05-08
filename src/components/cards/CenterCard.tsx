import React from 'react';
import { MapPin, Phone, Users, BookOpen, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface CenterCardProps {
  id: string;
  name: string;
  location: string;
  distance?: number;
  totalSeats: number;
  availableSeats: number;
  phone?: string;
  rating?: number;
  totalBooks?: number;
  image?: string;
  onBook?: () => void;
  onViewDetails?: () => void;
}

export function CenterCard({
  id,
  name,
  location,
  distance,
  totalSeats,
  availableSeats,
  phone,
  rating = 0,
  totalBooks = 0,
  image,
  onBook,
  onViewDetails,
}: CenterCardProps) {
  const occupancyRate = Math.round(((totalSeats - availableSeats) / totalSeats) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header Image */}
      <div className="h-40 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">📍</div>
            <p className="text-sm text-indigo-600 font-medium">{name}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(rating) ? 'fill-amber-400' : 'fill-slate-200'}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-600 ml-1">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin size={18} className="text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-sm">{location}</p>
              {distance && <p className="text-xs text-slate-500">{distance} km away</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Users size={18} className="text-indigo-600 flex-shrink-0" />
            <span className="text-sm">
              {availableSeats} of {totalSeats} seats available
            </span>
          </div>

          {totalBooks > 0 && (
            <div className="flex items-center gap-3 text-slate-600">
              <BookOpen size={18} className="text-indigo-600 flex-shrink-0" />
              <span className="text-sm">{totalBooks} books available</span>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={18} className="text-indigo-600 flex-shrink-0" />
              <span className="text-sm">{phone}</span>
            </div>
          )}
        </div>

        {/* Occupancy Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Occupancy</span>
            <span className="text-xs font-bold text-slate-900">{occupancyRate}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onBook}
            disabled={availableSeats === 0}
            className="flex-1"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
