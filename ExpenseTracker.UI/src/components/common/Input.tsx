import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  dark?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, dark, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium',
              dark ? 'text-surface-300' : 'text-surface-700'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={clsx(
              'absolute left-3 top-1/2 -translate-y-1/2',
              dark ? 'text-surface-500' : 'text-surface-400'
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border px-4 py-2.5 text-sm',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              dark
                ? 'bg-white/6 border-white/10 text-white placeholder:text-surface-500 focus:ring-primary-500/30 focus:border-primary-500/50 hover:border-white/15'
                : 'bg-white border-surface-200 text-surface-900 placeholder:text-surface-400 focus:ring-primary-200 focus:border-primary-400 hover:border-surface-300',
              icon && 'pl-10',
              error && 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger-500 mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className={clsx('text-xs mt-1', dark ? 'text-surface-500' : 'text-surface-500')}>{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
