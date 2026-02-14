import { formatDistanceToNow, format } from 'date-fns';

export function formatCurrency(
  amount: number,
  currency = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, 'MMM dd, yyyy');
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, 'MMM dd');
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return formatDistanceToNow(date, { addSuffix: true });
  return format(date, 'MMM dd');
}

export function getCurrencySymbol(currency = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    BAM: 'KM',
    RSD: 'din.',
  };
  return symbols[currency] || '$';
}

export const CATEGORY_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
  '#14b8a6',
  '#e11d48',
  '#3b82f6',
  '#84cc16',
  '#d946ef',
  '#0ea5e9',
  '#eab308',
  '#64748b',
];

export function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
