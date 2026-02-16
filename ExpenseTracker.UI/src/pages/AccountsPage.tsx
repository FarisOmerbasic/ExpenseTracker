import { useState } from 'react';
import {
  Plus,
  Wallet,
  Trash2,
  Edit3,
  Building,
  Landmark,
  Banknote,
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
import { accountService } from '../services/accountService';
import { formatCurrency } from '../utils/formatters';
import { extractApiError } from '../utils/helpers';
import { ACCOUNT_TYPES } from '../utils/constants';
import type { Account } from '../types';
import toast from 'react-hot-toast';

const accountTypeIcons: Record<string, React.ReactNode> = {
  checking: <Building className="w-5 h-5" />,
  savings: <Landmark className="w-5 h-5" />,
  cash: <Banknote className="w-5 h-5" />,
  default: <Wallet className="w-5 h-5" />,
};

const accountTypeColors: Record<string, string> = {
  checking: '#3b82f6',
  savings: '#10b981',
  cash: '#f59e0b',
  default: '#6366f1',
};

export default function AccountsPage() {
  const { user } = useAuth();
  const currency = user?.currencyPreference || 'USD';
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: accounts, isLoading, refetch } = useApi<Account[]>(
    () => accountService.getAll(),
    []
  );

  const totalBalance = accounts?.reduce((s, a) => s + a.currentBalance, 0) || 0;

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await accountService.delete(deletingId);
      toast.success('Account deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to delete account'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Accounts</h1>
          <p className="text-surface-500 mt-1">
            Manage your financial accounts
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(true)}
        >
          Add Account
        </Button>
      </div>

      
      {accounts && accounts.length > 0 && (
        <Card className="bg-linear-to-br from-surface-900 via-surface-800 to-surface-900 border-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Total Balance</p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalBalance, currency)}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white/80" />
            </div>
          </div>
        </Card>
      )}

      
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((account) => {
            const color = accountTypeColors[account.type.toLowerCase()] || accountTypeColors.default;
            const icon = accountTypeIcons[account.type.toLowerCase()] || accountTypeIcons.default;
            return (
              <Card key={account.accountId} hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: color + '15',
                        color: color,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900">
                        {account.name}
                      </h3>
                      <Badge variant="neutral" size="sm">
                        {account.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(account)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(account.accountId)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500">Current Balance</span>
                    <span className="text-lg font-bold text-surface-900">
                      {formatCurrency(account.currentBalance, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500">Initial Balance</span>
                    <span className="text-surface-600">
                      {formatCurrency(account.initialBalance, currency)}
                    </span>
                  </div>
                  {account.currentBalance !== account.initialBalance && (
                    <div className="pt-2 border-t border-surface-100">
                      <span className={`text-xs font-medium ${
                        account.currentBalance >= account.initialBalance
                          ? 'text-success-600'
                          : 'text-danger-500'
                      }`}>
                        {account.currentBalance >= account.initialBalance ? '+' : ''}
                        {formatCurrency(account.currentBalance - account.initialBalance, currency)} net change
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Wallet className="w-8 h-8" />}
            title="No accounts yet"
            description="Add your bank accounts, wallets, or cash accounts"
            action={
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAdd(true)}
              >
                Add Account
              </Button>
            }
          />
        </Card>
      )}

      
      <AccountFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          refetch();
        }}
        userId={user?.userId || 0}
      />

      
      {editing && (
        <AccountFormModal
          isOpen={!!editing}
          account={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            refetch();
          }}
          userId={user?.userId || 0}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account?"
        isLoading={isDeleting}
      />
    </div>
  );
}

function AccountFormModal({
  isOpen,
  account,
  onClose,
  onSuccess,
  userId,
}: {
  isOpen: boolean;
  account?: Account;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: account?.name || '',
    type: account?.type || 'Checking',
    initialBalance: String(account?.initialBalance || '0'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const initialBal = parseFloat(form.initialBalance) || 0;
      const data = {
        userId,
        name: form.name.trim(),
        type: form.type,
        initialBalance: initialBal,
        currentBalance: account ? account.currentBalance : initialBal,
      };
      if (account) {
        await accountService.update(account.accountId, data);
        toast.success('Account updated!');
      } else {
        await accountService.create(data);
        toast.success('Account created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save account'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={account ? 'Edit Account' : 'Add Account'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {account ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Account Name"
          placeholder="e.g. Main Bank, Cash Wallet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Select
          label="Account Type"
          options={ACCOUNT_TYPES}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Initial Balance"
            type="number"
            step="0.01"
            value={form.initialBalance}
            onChange={(e) =>
              setForm({ ...form, initialBalance: e.target.value })
            }
          />
          {account && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">
                Current Balance
              </label>
              <div className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-600">
                {account.currentBalance.toFixed(2)}
              </div>
              <p className="text-xs text-surface-500">
                Auto-updated when expenses are linked
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
