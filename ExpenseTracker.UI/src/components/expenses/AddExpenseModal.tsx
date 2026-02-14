import { useState } from 'react';
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
import { extractApiError } from '../../utils/helpers';
import type { Category, PaymentMethod, Account } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: '',
    categoryId: '',
    paymentMethodId: '',
    accountId: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!form.categoryId) errs.categoryId = 'Category is required';
    if (!form.amount || parseFloat(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    if (!form.paymentMethodId) errs.paymentMethodId = 'Payment method is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setIsSubmitting(true);
    try {
      await expenseService.create({
        userId: user.userId,
        categoryId: parseInt(form.categoryId),
        paymentMethodId: parseInt(form.paymentMethodId),
        accountId: form.accountId ? parseInt(form.accountId) : null,
        amount: parseFloat(form.amount),
        date: form.date,
        description: form.description || undefined,
      });
      toast.success('Expense added successfully!');
      setForm({
        description: '',
        categoryId: '',
        paymentMethodId: '',
        accountId: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to add expense'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Expense"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-expense-form" isLoading={isSubmitting}>
            Add Expense
          </Button>
        </>
      }
    >
      <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Description"
          placeholder="Enter description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            placeholder="Select category"
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
            placeholder="0.00"
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
            placeholder="Select method"
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
          placeholder="None (don't deduct)"
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
