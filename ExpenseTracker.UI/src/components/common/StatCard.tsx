import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  prefix?: string;
}

const colorMap = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', ring: 'ring-primary-100' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', ring: 'ring-success-100' },
  warning: { bg: 'bg-warning-50', icon: 'text-warning-600', ring: 'ring-warning-100' },
  danger: { bg: 'bg-danger-50', icon: 'text-danger-600', ring: 'ring-danger-100' },
  info: { bg: 'bg-info-50', icon: 'text-info-600', ring: 'ring-info-100' },
};

export default function StatCard({
  label,
  value,
  change,
  icon,
  color,
  prefix = '',
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-surface-200/80 p-5 card-shadow transition-all duration-300 hover:card-shadow-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-surface-900 tracking-tight truncate">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {change >= 0 ? (
                <div className="flex items-center gap-1 bg-danger-50 text-danger-500 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-[11px] font-semibold">
                    +{change.toFixed(1)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-success-50 text-success-600 px-1.5 py-0.5 rounded-md">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-[11px] font-semibold">
                    {change.toFixed(1)}%
                  </span>
                </div>
              )}
              <span className="text-[11px] text-surface-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ring-1', c.bg, c.icon, c.ring)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
