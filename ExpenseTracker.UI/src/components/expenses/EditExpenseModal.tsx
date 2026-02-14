import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { paymentMethodService } from '../../services/paymentMethodService';
import { accountService } from '../../services/accountService';
import { toDateInputValue, extractApiError } from '../../utils/helpers';
import type { Expense, Category, PaymentMethod, Account } from '../../types';
import toast from 'react-hot-toast';

interface EditExpenseModalProps {
  isOpen: boolean;
  expense: Expense;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditExpenseModal({
  isOpen,
  expense,
  onClose,
  onSuccess,
}: EditExpenseModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: expense.description || '',
    categoryId: String(expense.categoryId),
    paymentMethodId: String(expense.paymentMethodId),
    accountId: expense.accountId ? String(expense.accountId) : '',
    amount: String(expense.amount),
    date: toDateInputValue(expense.date),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      description: expense.description || '',
      categoryId: String(expense.categoryId),
      paymentMethodId: String(expense.paymentMethodId),
      accountId: expense.accountId ? String(expense.accountId) : '',
      amount: String(expense.amount),
      date: toDateInputValue(expense.date),
    });
  }, [expense]);

  const { data: categories } = useApi<Category[]>(
    () => categoryService.getAll(),
    []
  );
  const { data: paymentMethods } = useApi<PaymentMethod[]>(
    () => paymentMethodService.getAll(),
    []
  );
  const { data: accounts } = useApi<Account[]>(
    () => accountService.getAll(),
    []
  );

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.categoryId) errs.categoryId = 'Required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Invalid amount';
    if (!form.date) errs.date = 'Required';
    if (!form.paymentMethodId) errs.paymentMethodId = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setIsSubmitting(true);
    try {
      await expenseService.update(expense.expenseId, {
        userId: user.userId,
        categoryId: parseInt(form.categoryId),
        paymentMethodId: parseInt(form.paymentMethodId),
        accountId: form.accountId ? parseInt(form.accountId) : null,
        amount: parseFloat(form.amount),
        date: form.date,
        description: form.description || undefined,
      });
      toast.success('Expense updated!');
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to update expense'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Expense"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-expense-form" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-expense-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Description"
          placeholder="Enter description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={
              categories?.map((c) => ({
                value: c.categoryId,
                label: c.name,
              })) || []
            }
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            error={errors.categoryId}
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            error={errors.amount}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Payment Method"
            options={
              paymentMethods?.map((p) => ({
                value: p.paymentMethodId,
                label: p.name,
              })) || []
            }
            value={form.paymentMethodId}
            onChange={(e) =>
              setForm({ ...form, paymentMethodId: e.target.value })
            }
            error={errors.paymentMethodId}
          />

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            error={errors.date}
          />
        </div>

        <Select
          label="Deduct from Account"
          options={[
            { value: '', label: 'None (don\'t deduct)' },
            ...(accounts?.map((a) => ({
              value: a.accountId,
              label: `${a.name}`,
            })) || []),
          ]}
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        />
      </form>
    </Modal>
  );
}
