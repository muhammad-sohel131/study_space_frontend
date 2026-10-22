import React from 'react';
import { Star, Eye, Heart, BookOpen, ShoppingCart, Sparkles, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  price: number;
  borrowPricePerDay?: number;
  productType: string;
  rating?: number;
  reviews?: number;
  image?: string;
  isAvailable?: boolean;
  isFavorite?: boolean;
  previewPdfUrl?: string;
  center?: {
    id?: string;
    name?: string;
    location?: string;
  };
  onAddToCart?: () => void;
  onBorrow?: () => void;
  onToggleFavorite?: () => void;
}

export function BookCard({
  id,
  title,
  author,
  price,
  borrowPricePerDay = 15,
  productType,
  rating = 0,
  reviews = 0,
  image,
  isAvailable = true,
  isFavorite = false,
  previewPdfUrl,
  center,
  onAddToCart,
  onBorrow,
  onToggleFavorite,
}: BookCardProps) {
  const isPhysical = productType !== 'pdf';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col relative">
      {/* Book Cover */}
      <div className="relative h-52 bg-gradient-to-br from-violet-100/60 via-slate-100 to-indigo-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="text-center p-4">
            <BookOpen className="w-12 h-12 text-violet-400 mx-auto mb-2" />
            <p className="text-xs text-violet-700 font-semibold line-clamp-1">{title}</p>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <Badge variant="secondary" className="uppercase tracking-wider text-[10px] font-bold bg-white/95 text-slate-800 backdrop-blur shadow-sm">
            {isPhysical ? 'Physical Book' : 'E-Book (PDF)'}
          </Badge>
          {isPhysical && isAvailable && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Borrow or Buy
            </span>
          )}
        </div>

        {/* Out of Stock Badge */}
        {!isAvailable && (
          <Badge variant="danger" className="absolute bottom-3 left-3 z-10">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Book Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-2 group-hover:text-violet-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 mb-2">by {author}</p>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(rating) ? 'fill-amber-400' : 'fill-slate-200 '}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({reviews})</span>
            </div>
          )}

          {/* Center Location */}
          {center?.name && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs mb-3 font-medium border border-slate-200/80 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span className="truncate">{center.name}</span>
              {center.location && <span className="text-slate-400 text-[11px] truncate">• {center.location}</span>}
            </div>
          )}
        </div>

        <div>
          {/* Price & Borrow info */}
          <div className="mb-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Buy to Keep</span>
              <p className="text-2xl font-black text-violet-600 font-sans">৳{price}</p>
            </div>
            {isPhysical && (
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Rent to Read</span>
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-200 inline-block">
                  ৳{borrowPricePerDay}/day
                </span>
              </div>
            )}
          </div>

          {/* Dual Action Buttons: Buy and Borrow */}
          <div className="flex flex-col gap-2">
            {isPhysical && onBorrow && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBorrow}
                disabled={!isAvailable}
                className="w-full border-violet-500 text-violet-700 hover:bg-violet-50 font-bold h-10 flex items-center justify-center gap-1.5"
              >
                <BookOpen size={16} />
                <span>Rent / Borrow (৳{borrowPricePerDay}/day)</span>
              </Button>
            )}

            <div className="flex gap-2">
              {previewPdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewPdfUrl, '_blank')}
                  className="flex-1 text-slate-600 h-10"
                >
                  <Eye size={16} className="mr-1.5" />
                  Preview
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onAddToCart}
                disabled={!isAvailable}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold h-10 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={16} />
                <span>Buy Book</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
