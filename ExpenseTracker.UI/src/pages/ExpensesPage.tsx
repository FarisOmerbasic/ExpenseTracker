import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ArrowDownRight,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import EditExpenseModal from '../components/expenses/EditExpenseModal';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { paymentMethodService } from '../services/paymentMethodService';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { exportToCsv, extractApiError } from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';
import type { Expense, Category, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currency = user?.currencyPreference || 'USD';
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const { data: expenses, isLoading: loadingExpenses, refetch } = useApi<Expense[]>(
    () => expenseService.getAll(),
    []
  );
  const { data: categories } = useApi<Category[]>(
    () => categoryService.getAll(),
    []
  );
  const { data: paymentMethods } = useApi<PaymentMethod[]>(
    () => paymentMethodService.getAll(),
    []
  );

  const getCategoryName = useMemo(
    () => (id: number) => categories?.find((c) => c.categoryId === id)?.name || 'Unknown',
    [categories]
  );
  const getPaymentMethodName = useMemo(
    () => (id: number) => paymentMethods?.find((p) => p.paymentMethodId === id)?.name || 'Unknown',
    [paymentMethods]
  );

  const filtered = useMemo(() => {
    if (!expenses) return [];
    let result = [...expenses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.description?.toLowerCase().includes(q) ||
          getCategoryName(e.categoryId).toLowerCase().includes(q)
      );
    }

    if (filterCategory) {
      result = result.filter(
        (e) => e.categoryId === parseInt(filterCategory)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        cmp = a.amount - b.amount;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [expenses, searchQuery, filterCategory, sortBy, sortDir, getCategoryName]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalFiltered = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await expenseService.delete(deletingId);
      toast.success('Expense deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to delete expense'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingExpenses) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Expenses</h1>
          <p className="text-surface-500 mt-1">
            Manage and track all your expenses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => {
              if (!filtered.length) {
                toast.error('No expenses to export');
                return;
              }
              exportToCsv(
                filtered.map((e) => ({
                  description: e.description || '',
                  category: getCategoryName(e.categoryId),
                  paymentMethod: getPaymentMethodName(e.paymentMethodId),
                  amount: e.amount,
                  date: e.date,
                })),
                `expenses-${new Date().toISOString().slice(0, 10)}`,
                [
                  { key: 'date', label: 'Date' },
                  { key: 'description', label: 'Description' },
                  { key: 'category', label: 'Category' },
                  { key: 'paymentMethod', label: 'Payment Method' },
                  { key: 'amount', label: 'Amount' },
                ]
              );
              toast.success('Exported to CSV!');
            }}
          >
            Export
          </Button>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAdd(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search expenses..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...(categories?.map((c) => ({
                  value: c.categoryId,
                  label: c.name,
                })) || []),
              ]}
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
            />
            <Select
              options={[
                { value: 'date', label: 'Sort by Date' },
                { value: 'amount', label: 'Sort by Amount' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              <Filter
                className={`w-4 h-4 transition-transform ${
                  sortDir === 'asc' ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
          <p className="text-sm text-surface-500">
            Showing <span className="font-semibold text-surface-900">{filtered.length}</span> expenses
          </p>
          <p className="text-sm text-surface-500">
            Total:{' '}
            <span className="font-semibold text-surface-900">
              {formatCurrency(totalFiltered, currency)}
            </span>
          </p>
        </div>
      </Card>

      {/* Table */}
      {paginated.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Description
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Payment
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Amount
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-surface-500 px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {paginated.map((expense) => {
                  const catIndex = Math.max(
                    0,
                    categories?.findIndex(
                      (c) => c.categoryId === expense.categoryId
                    ) ?? 0
                  );
                  return (
                    <tr
                      key={expense.expenseId}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor:
                                getCategoryColor(catIndex) + '15',
                              color: getCategoryColor(catIndex),
                            }}
                          >
                            <ArrowDownRight className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-surface-900">
                            {expense.description || 'No description'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">
                          {getCategoryName(expense.categoryId)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-surface-600">
                          {getPaymentMethodName(expense.paymentMethodId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-surface-600">
                          <Calendar className="w-3.5 h-3.5 text-surface-400" />
                          {formatDate(expense.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-surface-900">
                          -{formatCurrency(expense.amount, currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingExpense(expense)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(expense.expenseId)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100">
              <p className="text-sm text-surface-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {(() => {
                  const maxVisible = 5;
                  let start = Math.max(1, page - Math.floor(maxVisible / 2));
                  const end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                  }
                  return Array.from({ length: end - start + 1 }, (_, i) => {
                    const p = start + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          page === p
                            ? 'bg-primary-600 text-white'
                            : 'text-surface-600 hover:bg-surface-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  });
                })()}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={<ArrowDownRight className="w-8 h-8" />}
            title={searchQuery ? 'No expenses found' : 'No expenses yet'}
            description={
              searchQuery
                ? 'Try adjusting your search or filters'
                : 'Add your first expense to start tracking your spending'
            }
            action={
              !searchQuery ? (
                <Button
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAdd(true)}
                >
                  Add Expense
                </Button>
              ) : undefined
            }
          />
        </Card>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          refetch();
        }}
      />

      {editingExpense && (
        <EditExpenseModal
          isOpen={!!editingExpense}
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setEditingExpense(null);
            refetch();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
