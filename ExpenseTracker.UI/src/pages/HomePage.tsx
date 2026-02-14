import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Tag,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { budgetService } from '../services/budgetService';
import { formatCurrency, formatRelativeDate, getCategoryColor } from '../utils/formatters';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import type { Expense, Category, Budget } from '../types';

const CHART_PRIMARY = '#6366f1';
const CHART_BAR = '#818cf8';
const CHART_GRID = '#f3f4f6';
const CHART_TICK = '#9ca3af';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currency = user?.currencyPreference || 'USD';
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { data: expenses, isLoading: loadingExpenses, refetch: refetchExpenses } = useApi<Expense[]>(
    () => expenseService.getAll(),
    []
  );
  const { data: categories, isLoading: loadingCategories } = useApi<Category[]>(
    () => categoryService.getAll(),
    []
  );
  const { data: budgets } = useApi<Budget[]>(
    () => budgetService.getAll(),
    []
  );

  const isLoading = loadingExpenses || loadingCategories;

  const stats = useMemo(() => {
    if (!expenses) return null;

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const thisMonthExpenses = expenses.filter((e) => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start: thisMonthStart, end: thisMonthEnd });
    });
    const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

    const lastMonthExpenses = expenses.filter((e) => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start: lastMonthStart, end: lastMonthEnd });
    });
    const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

    const monthChange =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    return {
      totalSpent,
      thisMonthTotal,
      thisMonthCount: thisMonthExpenses.length,
      monthChange,
      categoryCount: categories?.length || 0,
    };
  }, [expenses, categories]);

  const trendData = useMemo(() => {
    if (!expenses) return [];
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      return {
        month: format(date, 'MMM'),
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    });

    return months.map(({ month, start, end }) => {
      const total = expenses
        .filter((e) => {
          const d = parseISO(e.date);
          return isWithinInterval(d, { start, end });
        })
        .reduce((s, e) => s + e.amount, 0);
      return { month, amount: total };
    });
  }, [expenses]);

  const categoryData = useMemo(() => {
    if (!expenses || !categories) return [];
    const map = new Map<number, number>();
    expenses.forEach((e) => {
      map.set(e.categoryId, (map.get(e.categoryId) || 0) + e.amount);
    });
    return categories
      .map((cat, i) => ({
        name: cat.name,
        value: map.get(cat.categoryId) || 0,
        color: getCategoryColor(i),
      }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  const budgetOverview = useMemo(() => {
    if (!budgets || !expenses || !categories) return [];

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    return budgets.map((budget) => {
      const isOverall = !budget.categoryId;
      const cat = budget.categoryId
        ? categories.find((c) => c.categoryId === budget.categoryId)
        : null;

      const spent = isOverall
        ? expenses
            .filter((e) => {
              const d = parseISO(e.date);
              return isWithinInterval(d, { start: thisMonthStart, end: thisMonthEnd });
            })
            .reduce((s, e) => s + e.amount, 0)
        : expenses
            .filter((e) => {
              const d = parseISO(e.date);
              return (
                e.categoryId === budget.categoryId &&
                isWithinInterval(d, { start: thisMonthStart, end: thisMonthEnd })
              );
            })
            .reduce((s, e) => s + e.amount, 0);

      const pct = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return {
        category: budget.name || cat?.name || 'Overall Budget',
        budgetAmount: budget.amount,
        spent,
        percentage: Math.min(pct, 100),
        over: pct > 100,
      };
    });
  }, [budgets, expenses, categories]);

  const recentExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }, [expenses]);

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-surface-500 mt-1">
            Here's what's happening with your expenses
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddExpense(true)}
          className="shadow-lg shadow-primary-600/20"
        >
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Spent"
          value={formatCurrency(stats?.totalSpent || 0, currency)}
          icon={<DollarSign className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          label="This Month"
          value={formatCurrency(stats?.thisMonthTotal || 0, currency)}
          change={stats?.monthChange}
          icon={<Calendar className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          label="Transactions"
          value={stats?.thisMonthCount || 0}
          icon={<Receipt className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          label="Categories"
          value={stats?.categoryCount || 0}
          icon={<Tag className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spending Trend */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-surface-900">Spending Trend</h3>
              <p className="text-sm text-surface-500">Last 6 months overview</p>
            </div>
            <Badge variant="primary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Monthly
            </Badge>
          </div>
          {trendData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_PRIMARY} stopOpacity={0.15} />
                      <stop offset="50%" stopColor={CHART_PRIMARY} stopOpacity={0.06} />
                      <stop offset="95%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: CHART_TICK }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: CHART_TICK }} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      padding: '12px 16px',
                    }}
                    formatter={(value) => [formatCurrency(Number(value ?? 0), currency), 'Spent']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke={CHART_PRIMARY}
                    strokeWidth={2.5}
                    fill="url(#colorAmount)"
                    dot={{ r: 3, fill: CHART_PRIMARY, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 5, fill: CHART_PRIMARY, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<TrendingUp className="w-8 h-8" />}
              title="No trend data yet"
              description="Add expenses to see your spending trend"
            />
          )}
        </Card>

        {/* Category Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-surface-900">By Category</h3>
              <p className="text-sm text-surface-500">Expense distribution</p>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        padding: '8px 12px',
                      }}
                      formatter={(value) => [formatCurrency(Number(value ?? 0), currency)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4">
                {categoryData.slice(0, 5).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-white"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-surface-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-surface-900">
                      {formatCurrency(cat.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Tag className="w-8 h-8" />}
              title="No categories yet"
              description="Create categories and add expenses"
            />
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2" padding="none">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="text-base font-bold text-surface-900">
                Recent Transactions
              </h3>
              <p className="text-sm text-surface-500">
                Your latest expenses
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/expenses')}>
              View All
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {recentExpenses.length > 0 ? (
            <div className="divide-y divide-surface-100">
              {recentExpenses.map((expense) => {
                const cat = categories?.find(
                  (c) => c.categoryId === expense.categoryId
                );
                const catIndex = Math.max(
                  0,
                  categories?.findIndex(
                    (c) => c.categoryId === expense.categoryId
                  ) ?? 0
                );
                return (
                  <div
                    key={expense.expenseId}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: getCategoryColor(catIndex) + '12',
                          color: getCategoryColor(catIndex),
                        }}
                      >
                        <ArrowDownRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">
                          {expense.description || 'Expense'}
                        </p>
                        <p className="text-xs text-surface-500">
                          {cat?.name || 'Uncategorized'} • {formatRelativeDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-surface-900">
                      -{formatCurrency(expense.amount, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<Receipt className="w-8 h-8" />}
                title="No transactions yet"
                description="Add your first expense to get started"
                action={
                  <Button
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowAddExpense(true)}
                  >
                    Add Expense
                  </Button>
                }
              />
            </div>
          )}
        </Card>

        {/* Budget Progress */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-surface-900">Budget Overview</h3>
              <p className="text-sm text-surface-500">This month's progress</p>
            </div>
          </div>

          {budgetOverview.length > 0 ? (
            <div className="space-y-5">
              {budgetOverview.map((b, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">
                      {b.category}
                    </span>
                    <span className="text-xs text-surface-500">
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.budgetAmount, currency)}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${b.percentage}%`,
                        backgroundColor: b.over
                          ? '#ef4444'
                          : b.percentage > 80
                          ? '#fbbf24'
                          : '#10b981',
                      }}
                    />
                  </div>
                  {b.over && (
                    <p className="text-xs text-danger-500 mt-1 font-medium">
                      Over budget!
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CreditCard className="w-8 h-8" />}
              title="No budgets set"
              description="Create budgets to track your spending limits"
            />
          )}
        </Card>
      </div>

      {/* Daily spending (bar chart) */}
      {expenses && expenses.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-surface-900">Daily Spending</h3>
              <p className="text-sm text-surface-500">This month's daily breakdown</p>
            </div>
          </div>
          <DailySpendingChart expenses={expenses} currency={currency} />
        </Card>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSuccess={() => {
          setShowAddExpense(false);
          refetchExpenses();
        }}
      />
    </div>
  );
}

function DailySpendingChart({
  expenses,
  currency,
}: {
  expenses: Expense[];
  currency: string;
}) {
  const data = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const daysInMonth = end.getDate();

    const dailyMap = new Map<number, number>();
    expenses
      .filter((e) => {
        const d = parseISO(e.date);
        return isWithinInterval(d, { start, end });
      })
      .forEach((e) => {
        const day = parseISO(e.date).getDate();
        dailyMap.set(day, (dailyMap.get(day) || 0) + e.amount);
      });

    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: `${i + 1}`,
      amount: dailyMap.get(i + 1) || 0,
    }));
  }, [expenses]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.9} />
              <stop offset="100%" stopColor={CHART_BAR} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: CHART_TICK }}
            interval={2}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: CHART_TICK }} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              padding: '8px 12px',
            }}
            formatter={(value) => [formatCurrency(Number(value ?? 0), currency), 'Spent']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
