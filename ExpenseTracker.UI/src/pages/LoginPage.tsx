import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Lock, TrendingDown, ArrowRight } from 'lucide-react';
import { extractApiError } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(extractApiError(err, 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-primary-600/15 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/3 w-100 h-100 bg-accent-500/10 rounded-full blur-[128px]" />
      </div>

      
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ExpenseTracker</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-white mb-6">
            Welcome
            <br />
            <span className="bg-linear-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">back</span>
          </h1>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Track expenses, set budgets, and gain clear insights into your
            spending — all in one clean dashboard.
          </p>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/4 backdrop-blur-xl border border-white/8 rounded-2xl p-8 lg:p-10 shadow-2xl shadow-black/20">
            
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ExpenseTracker</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1.5">
              Sign in to your account
            </h2>
            <p className="text-surface-400 mb-8">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                dark
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                dark
              />

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary-600/25"
                size="lg"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-8">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
