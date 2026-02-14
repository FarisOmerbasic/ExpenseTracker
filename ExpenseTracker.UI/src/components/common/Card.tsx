import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-surface-200/80 card-shadow',
        paddingClasses[padding],
        hover && 'hover:card-shadow-hover hover:border-surface-300/80 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
