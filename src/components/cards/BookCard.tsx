import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface BookCardProps {
 id: string;
 title: string;
 author: string;
 price: number;
 rating?: number;
 reviews?: number;
 image?: string;
 isAvailable?: boolean;
 isFavorite?: boolean;
 onBorrow?: () => void;
 onBuy?: () => void;
 onToggleFavorite?: () => void;
}

export function BookCard({
 id,
 title,
 author,
 price,
 rating = 0,
 reviews = 0,
 image,
 isAvailable = true,
 isFavorite = false,
 onBorrow,
 onBuy,
 onToggleFavorite,
}: BookCardProps) {
 return (
 <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col">
 {/* Book Cover */}
 <div className="relative h-48 bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center overflow-hidden">
 {image ? (
 <img src={image} alt={title} className="w-full h-full object-cover" />
 ) : (
 <div className="text-center">
 <div className="text-5xl mb-2">📚</div>
 <p className="text-sm text-violet-600 font-medium">{title}</p>
 </div>
 )}

 {/* Favorite Button */}
 <button
 onClick={onToggleFavorite}
 className="absolute top-3 right-3 p-2 bg-white border border-slate-200 rounded-full shadow-md hover:shadow-lg transition-all"
 >
 <Heart
 size={20}
 className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}
 />
 </button>

 {/* Available Badge */}
 {!isAvailable && (
 <Badge variant="danger" className="absolute bottom-3 left-3">
 Out of Stock
 </Badge>
 )}
 </div>

 {/* Book Info */}
 <div className="p-4 flex-1 flex flex-col">
 <h3 className="font-bold text-slate-900 text-lg line-clamp-2">{title}</h3>
 <p className="text-sm text-slate-600 mb-2">{author}</p>

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
 <span className="text-xs text-slate-600">({reviews})</span>
 </div>
 )}

 {/* Price */}
 <div className="mb-4 pt-4 border-t border-slate-100">
 <p className="text-2xl font-bold text-violet-600">৳{price}</p>
 </div>

 {/* Actions */}
 <div className="flex gap-2 mt-auto">
 <Button
 variant="outline"
 size="sm"
 onClick={onBorrow}
 disabled={!isAvailable}
 className="flex-1"
 >
 Borrow
 </Button>
 <Button
 variant="primary"
 size="sm"
 onClick={onBuy}
 className="flex-1"
 >
 Buy
 </Button>
 </div>
 </div>
 </div>
 );
}
