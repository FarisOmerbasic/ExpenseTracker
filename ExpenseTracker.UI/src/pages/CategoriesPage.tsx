import { useState } from 'react';
import {
  Plus,
  Tag,
  Trash2,
  Edit3,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services/categoryService';
import { getCategoryColor } from '../utils/formatters';
import { extractApiError } from '../utils/helpers';
import type { Category } from '../types';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categories, isLoading, refetch } = useApi<Category[]>(
    () => categoryService.getAll(),
    []
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(deletingId);
      toast.success('Category deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to delete category. It may have expenses linked to it.'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Categories</h1>
          <p className="text-surface-500 mt-1">
            Organize your expenses with categories
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(true)}
        >
          Add Category
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, index) => (
            <Card key={cat.categoryId} hover className="group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: getCategoryColor(index) + '15',
                      color: getCategoryColor(index),
                    }}
                  >
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(cat)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.categoryId)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Tag className="w-8 h-8" />}
            title="No categories yet"
            description="Create categories to organize your expenses"
            action={
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAdd(true)}
              >
                Add Category
              </Button>
            }
          />
        </Card>
      )}

      
      <CategoryFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => {
          setShowAdd(false);
          refetch();
        }}
        userId={user?.userId || 0}
      />

      
      {editing && (
        <CategoryFormModal
          isOpen={!!editing}
          category={editing}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? Expenses linked to it may be affected."
        isLoading={isDeleting}
      />
    </div>
  );
}

function CategoryFormModal({
  isOpen,
  category,
  onClose,
  onSuccess,
  userId,
}: {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(category?.name || '');
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
      const data = { userId, name: name.trim(), sortOrder: 0 };
      if (category) {
        await categoryService.update(category.categoryId, data);
        toast.success('Category updated!');
      } else {
        await categoryService.create(data);
        toast.success('Category created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save category'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {category ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Category Name"
          placeholder="e.g. Food, Transport, Entertainment"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      </div>
    </Modal>
  );
}
