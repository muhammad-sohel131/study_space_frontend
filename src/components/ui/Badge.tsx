import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 ',
    success: 'bg-emerald-100 text-emerald-800 ',
    warning: 'bg-amber-100 text-amber-800 ',
    danger: 'bg-red-100 text-red-800 ',
    info: 'bg-violet-100 text-violet-800 ',
    premium: 'bg-amber-100 text-amber-900 font-semibold',
    secondary: 'bg-slate-200 text-slate-900 ',
    outline: 'bg-transparent border border-slate-200 text-slate-600 ',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

 return (
 <div
 className={`inline-flex items-center rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
 {...props}
 >
 {children}
 </div>
 );
}
