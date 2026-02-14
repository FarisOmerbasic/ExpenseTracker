import { clsx } from 'clsx';
import type { SelectOption } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  dark?: boolean;
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  dark,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className={clsx(
            'block text-sm font-medium',
            dark ? 'text-surface-300' : 'text-surface-700'
          )}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-xl border px-4 py-2.5 text-sm',
          'transition-all duration-200 appearance-none',
          'focus:outline-none focus:ring-2',
          dark
            ? 'bg-white/6 border-white/10 text-white focus:ring-primary-500/30 focus:border-primary-500/50 hover:border-white/15'
            : 'bg-white border-surface-200 text-surface-900 focus:ring-primary-200 focus:border-primary-400 hover:border-surface-300',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238e97b3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")]',
          'bg-size-[20px] bg-position-[right_12px_center] bg-no-repeat pr-10',
          error && 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}
