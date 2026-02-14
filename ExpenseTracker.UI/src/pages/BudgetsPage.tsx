import { useState, useMemo } from 'react';
import {
  Plus,
  PiggyBank,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  Target,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { expenseService } from '../services/expenseService';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { extractApiError } from '../utils/helpers';
import type { Budget, Category, Expense } from '../types';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const { user } = useAuth();
  const currency = user?.currencyPreference || 'USD';
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: budgets, isLoading: loadingBudgets, refetch } = useApi<Budget[]>(
    () => budgetService.getAll(),
    []
  );
  const { data: categories } = useApi<Category[]>(
    () => categoryService.getAll(),
    []
  );
  const { data: expenses } = useApi<Expense[]>(
    () => expenseService.getAll(),
    []
  );

  const budgetData = useMemo(() => {
    if (!budgets || !categories || !expenses) return [];

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return budgets.map((budget, index) => {
      const isOverall = !budget.categoryId;
      const cat = budget.categoryId
        ? categories.find((c) => c.categoryId === budget.categoryId)
        : null;

      const spent = isOverall
        ? expenses
            .filter((e) => {
              const d = parseISO(e.date);
              return isWithinInterval(d, { start: monthStart, end: monthEnd });
            })
            .reduce((s, e) => s + e.amount, 0)
        : expenses
            .filter((e) => {
              const d = parseISO(e.date);
              return (
                e.categoryId === budget.categoryId &&
                isWithinInterval(d, { start: monthStart, end: monthEnd })
              );
            })
            .reduce((s, e) => s + e.amount, 0);

      const pct = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const remaining = Math.max(0, budget.amount - spent);
      const displayName = budget.name || cat?.name || 'Overall Budget';

      return {
        ...budget,
        categoryName: displayName,
        isOverall,
        spent,
        percentage: pct,
        remaining,
        over: pct > 100,
        colorIndex: index,
      };
    });
  }, [budgets, categories, expenses]);

  const totalBudget = budgetData.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);
  const totalPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await budgetService.delete(deletingId);
      toast.success('Budget deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to delete budget'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingBudgets) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Budgets</h1>
          <p className="text-surface-500 mt-1">
            Set spending limits per category or for the whole month
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(true)}
        >
          Add Budget
        </Button>
      </div>

      {/* Summary Card */}
      {budgetData.length > 0 && (
        <Card className="bg-linear-to-br from-primary-600 via-primary-700 to-primary-900 border-none text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm text-white/70 mb-1">Total Budget This Month</p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalBudget, currency)}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-white/70">Spent</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalSpent, currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">Remaining</p>
                <p className="text-xl font-bold">
                  {formatCurrency(Math.max(0, totalBudget - totalSpent), currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">Usage</p>
                <p className="text-xl font-bold">{totalPct.toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(totalPct, 100)}%`,
                backgroundColor: totalPct > 100 ? '#ef4444' : totalPct > 80 ? '#fbbf24' : '#fff',
              }}
            />
          </div>
        </Card>
      )}

      {/* Budget Cards */}
      {budgetData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgetData.map((b) => (
            <Card key={b.budgetId} hover className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: getCategoryColor(b.colorIndex) + '15',
                      color: getCategoryColor(b.colorIndex),
                    }}
                  >
                    {b.isOverall ? <Target className="w-5 h-5" /> : <PiggyBank className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900">
                      {b.categoryName}
                    </h3>
                    <Badge
                      variant={b.over ? 'danger' : b.percentage > 80 ? 'warning' : 'success'}
                      size="sm"
                    >
                      {b.over ? (
                        <><AlertTriangle className="w-3 h-3 mr-1" /> Over budget</>
                      ) : (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> {b.percentage.toFixed(0)}% used</>
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(b)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(b.budgetId)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">
                    {formatCurrency(b.spent, currency)} spent
                  </span>
                  <span className="font-semibold text-surface-900">
                    {formatCurrency(b.amount, currency)}
                  </span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(b.percentage, 100)}%`,
                      backgroundColor: b.over
                        ? '#ef4444'
                        : b.percentage > 80
                        ? '#fbbf24'
                        : getCategoryColor(b.colorIndex),
                    }}
                  />
                </div>
                <p className="text-xs text-surface-500">
                  {formatCurrency(b.remaining, currency)} remaining
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<PiggyBank className="w-8 h-8" />}
            title="No budgets yet"
            description="Set budgets for your categories to track spending limits"
            action={
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAdd(true)}
              >
                Add Budget
              </Button>
            }
          />
        </Card>
      )}

      {/* Add Modal */}
      <BudgetFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          refetch();
        }}
        userId={user?.userId || 0}
        categories={categories || []}
      />

      {/* Edit Modal */}
      {editing && (
        <BudgetFormModal
          isOpen={!!editing}
          budget={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            refetch();
          }}
          userId={user?.userId || 0}
          categories={categories || []}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        isLoading={isDeleting}
      />
    </div>
  );
}

function BudgetFormModal({
  isOpen,
  budget,
  onClose,
  onSuccess,
  userId,
  categories,
}: {
  isOpen: boolean;
  budget?: Budget;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  categories: Category[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetType, setBudgetType] = useState<'category' | 'overall'>(
    budget ? (budget.categoryId ? 'category' : 'overall') : 'category'
  );
  const [name, setName] = useState(budget?.name || '');
  const [categoryId, setCategoryId] = useState(
    budget?.categoryId ? String(budget.categoryId) : ''
  );
  const [amount, setAmount] = useState(budget ? String(budget.amount) : '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (budgetType === 'category' && !categoryId)
      errs.categoryId = 'Category is required';
    if (budgetType === 'overall' && !name.trim())
      errs.name = 'Budget name is required';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const data = {
        userId,
        categoryId: budgetType === 'category' ? parseInt(categoryId) : null,
        name: budgetType === 'overall' ? name.trim() : null,
        amount: parseFloat(amount),
      };
      if (budget) {
        await budgetService.update(budget.budgetId, data);
        toast.success('Budget updated!');
      } else {
        await budgetService.create(data);
        toast.success('Budget created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save budget'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ? 'Edit Budget' : 'Add Budget'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {budget ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Budget Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Budget Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBudgetType('category')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                budgetType === 'category'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
              }`}
            >
              Per Category
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('overall')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                budgetType === 'overall'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
              }`}
            >
              Monthly Overall
            </button>
          </div>
        </div>

        {budgetType === 'category' ? (
          <Select
            label="Category"
            placeholder="Select a category"
            options={categories.map((c) => ({
              value: c.categoryId,
              label: c.name,
            }))}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            error={errors.categoryId}
          />
        ) : (
          <Input
            label="Budget Name"
            placeholder="e.g. Monthly Spending Limit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
        )}

        <Input
          label="Monthly Budget Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
        />
      </div>
    </Modal>
  );
}
