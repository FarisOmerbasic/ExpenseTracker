import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { Mail, Lock, User, TrendingDown, ArrowRight, Check } from 'lucide-react';
import { extractApiError } from '../utils/helpers';
import { CURRENCY_OPTIONS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    currencyPreference: 'USD',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        currencyPreference: form.currencyPreference,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(extractApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-125 h-125 bg-accent-500/15 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-primary-600/15 rounded-full blur-[128px]" />
      </div>

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ExpenseTracker</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-white mb-6">
            Start your
            <br />
            <span className="bg-linear-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">financial journey</span>
          </h1>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Set up your account in seconds and start tracking expenses,
            setting budgets, and understanding where your money goes.
          </p>

          <div className="mt-14 space-y-4">
            {[
              'Track expenses across multiple accounts',
              'Set budgets and get smart alerts',
              'Beautiful charts and insights',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-surface-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
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
              Create your account
            </h2>
            <p className="text-surface-400 mb-8">
              Get started in just a few seconds
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                dark
              />

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

              <div className="grid grid-cols-2 gap-4">
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

                <Input
                  label="Confirm"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  dark
                />
              </div>

              <Select
                label="Currency"
                options={CURRENCY_OPTIONS}
                value={form.currencyPreference}
                onChange={(e) => setForm({ ...form, currencyPreference: e.target.value })}
                dark
              />

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary-600/25"
                size="lg"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
