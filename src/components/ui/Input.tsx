import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ className = '', label, error, ...props }, ref) => {
 return (
 <div className="flex flex-col gap-1.5 w-full">
 {label && (
 <label className="text-sm font-semibold text-slate-700">
 {label}
 </label>
 )}
 <input
 ref={ref}
 className={`h-11 px-4 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 ${
 error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 '
 } ${className}`}
 {...props}
 />
 {error && <span className="text-xs font-medium text-red-500">{error}</span>}
 </div>
 );
 }
);

Input.displayName = 'Input';
