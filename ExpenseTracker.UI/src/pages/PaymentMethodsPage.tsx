import { useState } from 'react';
import {
  Plus,
  CreditCard,
  Trash2,
  Edit3,
  Banknote,
  Smartphone,
  Building2,
  Wallet,
  Bitcoin,
  CircleDollarSign,
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
import { paymentMethodService } from '../services/paymentMethodService';
import { extractApiError } from '../utils/helpers';
import { PAYMENT_METHOD_TYPES } from '../utils/constants';
import type { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const typeIcons: Record<string, React.ReactNode> = {
  'debit card': <CreditCard className="w-5 h-5" />,
  'credit card': <CreditCard className="w-5 h-5" />,
  cash: <Banknote className="w-5 h-5" />,
  'bank transfer': <Building2 className="w-5 h-5" />,
  paypal: <CircleDollarSign className="w-5 h-5" />,
  'digital wallet': <Wallet className="w-5 h-5" />,
  crypto: <Bitcoin className="w-5 h-5" />,
  other: <Smartphone className="w-5 h-5" />,
  card: <CreditCard className="w-5 h-5" />,
  mobile: <Smartphone className="w-5 h-5" />,
  bank: <Building2 className="w-5 h-5" />,
  default: <CreditCard className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  'debit card': '#6366f1',
  'credit card': '#8b5cf6',
  cash: '#10b981',
  'bank transfer': '#f59e0b',
  paypal: '#3b82f6',
  'digital wallet': '#ec4899',
  crypto: '#f97316',
  other: '#9ca3af',
  card: '#6366f1',
  mobile: '#3b82f6',
  bank: '#f59e0b',
  default: '#9ca3af',
};

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: methods, isLoading, refetch } = useApi<PaymentMethod[]>(
    () => paymentMethodService.getAll(),
    []
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await paymentMethodService.delete(deletingId);
      toast.success('Payment method deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to delete. It may have linked expenses.'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Payment Methods
          </h1>
          <p className="text-surface-500 mt-1">
            Manage how you pay for things
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(true)}
        >
          Add Method
        </Button>
      </div>

      {methods && methods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((method) => {
            const color =
              typeColors[method.type.toLowerCase()] || typeColors.default;
            const icon =
              typeIcons[method.type.toLowerCase()] || typeIcons.default;
            return (
              <Card key={method.paymentMethodId} hover className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: color + '15',
                        color,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900">
                        {method.name}
                      </h3>
                      <Badge variant="neutral" size="sm">
                        {method.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(method)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(method.paymentMethodId)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<CreditCard className="w-8 h-8" />}
            title="No payment methods yet"
            description="Add your cards, wallets, and other payment methods"
            action={
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAdd(true)}
              >
                Add Method
              </Button>
            }
          />
        </Card>
      )}

      {/* Add Modal */}
      <PaymentMethodFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          refetch();
        }}
        userId={user?.userId || 0}
      />

      {/* Edit Modal */}
      {editing && (
        <PaymentMethodFormModal
          isOpen={!!editing}
          method={editing}
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
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method?"
        isLoading={isDeleting}
      />
    </div>
  );
}

function PaymentMethodFormModal({
  isOpen,
  method,
  onClose,
  onSuccess,
  userId,
}: {
  isOpen: boolean;
  method?: PaymentMethod;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(method?.name || '');
  const [type, setType] = useState(method?.type || 'Debit Card');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const data = { userId, name: name.trim(), type };
      if (method) {
        await paymentMethodService.update(method.paymentMethodId, data);
        toast.success('Payment method updated!');
      } else {
        await paymentMethodService.create(data);
        toast.success('Payment method created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={method ? 'Edit Payment Method' : 'Add Payment Method'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {method ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Name"
          placeholder="e.g. Visa, PayPal, Cash"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Select
          label="Type"
          options={PAYMENT_METHOD_TYPES}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
    </Modal>
  );
}
