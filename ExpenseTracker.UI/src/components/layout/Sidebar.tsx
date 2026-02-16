import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tag,
  Wallet,
  PiggyBank,
  CreditCard,
  Settings,
  LogOut,
  X,
  TrendingDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: Receipt },
  { label: 'Categories', path: '/categories', icon: Tag },
  { label: 'Budgets', path: '/budgets', icon: PiggyBank },
  { label: 'Accounts', path: '/accounts', icon: Wallet },
  { label: 'Payment Methods', path: '/payment-methods', icon: CreditCard },
];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { logout, user } = useAuth();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
        : 'text-surface-400 hover:bg-white/[0.08] hover:text-surface-200'
    );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen w-65 bg-surface-950 border-r border-white/6 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        
        <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-md shadow-primary-600/30">
              <TrendingDown className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">
              ExpenseTracker
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-white/6 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        
        <nav className="flex-1 px-3 pt-4 pb-4 space-y-1 overflow-y-auto">
          <p className="px-3.5 mb-2 text-[10px] font-semibold text-surface-600 uppercase tracking-widest">
            Menu
          </p>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClasses}
              onClick={onClose}
            >
              <link.icon className="w-4.5 h-4.5 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        
        <div className="px-3 pb-3 space-y-1 border-t border-white/6 pt-3">
          <NavLink
            to="/settings"
            className={linkClasses}
            onClick={onClose}
          >
            <Settings className="w-4.5 h-4.5 shrink-0" />
            Settings
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            Log Out
          </button>
        </div>

        
        <div className="px-3 pb-4 pt-1">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-md shadow-primary-600/25">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-surface-200 truncate leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-surface-500 truncate leading-tight">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
