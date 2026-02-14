export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-400 mb-4 ring-1 ring-primary-100">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-surface-800 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
