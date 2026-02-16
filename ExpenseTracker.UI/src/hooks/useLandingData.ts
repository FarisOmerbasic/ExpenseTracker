import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { statsService, type PublicStatsResponse } from '../services/statsService';
import { CATEGORY_COLORS } from '../utils/formatters';
import type { MockStats, MockCategory, MockMonth } from '../data/landingMock';

export interface LandingData {
  stats: MockStats;
  categories: MockCategory[];
  monthlyTrend: MockMonth[];
  isLoading: boolean;
  currency: string;
  totalBalance: number;
  hasData: boolean;
}

export function useLandingData(): LandingData {
  const { user } = useAuth();
  const currency = user?.currencyPreference || 'USD';

  const { data, isLoading } = useApi<PublicStatsResponse>(
    () => statsService.getPublic(),
    [],
  );

  return useMemo(() => {
    if (!data) {
      return {
        stats: { totalSpent: 0, thisMonth: 0, monthChange: 0, transactionsThisMonth: 0, activeCategories: 0 },
        categories: [],
        monthlyTrend: [],
        isLoading,
        currency,
        totalBalance: 0,
        hasData: false,
      };
    }

    const stats: MockStats = {
      totalSpent: data.totalSpent,
      thisMonth: data.thisMonth,
      monthChange: data.monthChange,
      transactionsThisMonth: data.transactionsThisMonth,
      activeCategories: data.activeCategories,
    };

    const groupedByName = new Map<string, number>();
    for (const c of data.categories) {
      groupedByName.set(c.name, (groupedByName.get(c.name) ?? 0) + c.amount);
    }

    const categories: MockCategory[] = Array.from(groupedByName.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .map((c, i) => ({
        ...c,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }));

    const monthlyTrend: MockMonth[] = data.monthlyTrend.map((m) => ({
      label: m.label,
      amount: m.amount,
    }));

    return {
      stats,
      categories,
      monthlyTrend,
      isLoading,
      currency,
      totalBalance: data.totalBalance,
      hasData: data.totalSpent > 0,
    };
  }, [data, isLoading, currency]);
}
