import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatCard({
  title,
  value,
  icon,
  change,
  variant = 'default',
}: StatCardProps) {
  const bgColors = {
    default: 'bg-slate-50 border-slate-200',
    primary: 'bg-indigo-50 border-indigo-200',
    success: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
  };

  const iconColors = {
    default: 'text-slate-600',
    primary: 'text-indigo-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
  };

  return (
    <div className={`rounded-2xl border p-6 ${bgColors[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={`mt-2 text-sm font-medium ${change.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {change.trend === 'up' ? '↑' : '↓'} {change.value}% vs last month
            </p>
          )}
        </div>
        {icon && <div className={`text-2xl ${iconColors[variant]}`}>{icon}</div>}
      </div>
    </div>
  );
}
