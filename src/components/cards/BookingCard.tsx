import React from 'react';
import { MapPin, Calendar, Users, Phone, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface BookingCardProps {
  id: string;
  centerName: string;
  location: string;
  date: string;
  time: string;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  phoneNumber?: string;
  onCancel?: () => void;
  onReschedule?: () => void;
  onViewDetails?: () => void;
}

export function BookingCard({
  id,
  centerName,
  location,
  date,
  time,
  seats,
  totalPrice,
  status,
  phoneNumber,
  onCancel,
  onReschedule,
  onViewDetails,
}: BookingCardProps) {
  const statusVariants = {
    pending: 'warning' as const,
    confirmed: 'info' as const,
    completed: 'success' as const,
    cancelled: 'danger' as const,
  };

  const statusLabels = {
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{centerName}</h3>
          <Badge variant={statusVariants[status]} className="mt-2">
            {statusLabels[status]}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">৳{totalPrice}</p>
          <p className="text-xs text-slate-600">Total</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-600">
          <MapPin size={18} className="text-indigo-600 flex-shrink-0" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          <Calendar size={18} className="text-indigo-600 flex-shrink-0" />
          <span className="text-sm">{date} at {time}</span>
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          <Users size={18} className="text-indigo-600 flex-shrink-0" />
          <span className="text-sm">{seats} seat{seats > 1 ? 's' : ''} booked</span>
        </div>

        {phoneNumber && (
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={18} className="text-indigo-600 flex-shrink-0" />
            <span className="text-sm">{phoneNumber}</span>
          </div>
        )}
      </div>

      {status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">Please confirm your booking before the specified time.</p>
        </div>
      )}

      <div className="flex gap-2">
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="flex-1">
            View Details
          </Button>
        )}
        {onReschedule && status !== 'cancelled' && (
          <Button variant="outline" size="sm" onClick={onReschedule} className="flex-1">
            Reschedule
          </Button>
        )}
        {onCancel && status !== 'cancelled' && status !== 'completed' && (
          <Button variant="danger" size="sm" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
