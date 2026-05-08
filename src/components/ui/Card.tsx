import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
 return (
 <div
 className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}
 {...props}
 >
 {children}
 </div>
 );
}
