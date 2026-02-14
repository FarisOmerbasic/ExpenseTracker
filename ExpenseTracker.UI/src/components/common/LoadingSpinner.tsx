export default function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-3 border-primary-100 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
}
