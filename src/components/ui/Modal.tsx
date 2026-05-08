import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 description?: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
 size?: 'sm' | 'md' | 'lg';
}

export function Modal({
 isOpen,
 onClose,
 title,
 description,
 children,
 footer,
 size = 'md',
}: ModalProps) {
 if (!isOpen) return null;

 const sizes = {
 sm: 'max-w-sm',
 md: 'max-w-md',
 lg: 'max-w-2xl',
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
 <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
 {/* Header */}
 <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 p-6">
 <div>
 <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
 {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
 </div>
 <button
 onClick={onClose}
 className="text-slate-400 hover:text-slate-600 transition-colors"
 >
 <X size={24} />
 </button>
 </div>

 {/* Content */}
 <div className="p-6">{children}</div>

 {/* Footer */}
 {footer && (
 <div className="border-t border-slate-200 bg-slate-50 p-6">
 {footer}
 </div>
 )}
 </div>
 </div>
 );
}
