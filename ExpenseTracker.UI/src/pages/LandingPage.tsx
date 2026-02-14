import { Link } from 'react-router-dom';
import {
  TrendingDown,
  ArrowRight,
  BarChart3,
  PiggyBank,
  Receipt,
  Wallet,
  CreditCard,
  Tag,
  Settings,
  LayoutDashboard,
  ChevronRight,
  Download,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/common/Button';

const appFeatures = [
  {
    icon: Receipt,
    title: 'Full expense management',
    desc: 'Add, edit, delete, search, filter by category, sort by date or amount. Paginated table with real-time totals.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: PiggyBank,
    title: 'Budgets that actually track',
    desc: 'Set monthly limits per category. See live progress bars, remaining amounts, and over-budget warnings.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: BarChart3,
    title: 'Three chart types, zero fluff',
    desc: 'Area chart for 6-month trends. Donut for category breakdown. Bar chart for daily spending this month.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Wallet,
    title: 'Multi-account support',
    desc: 'Checking, savings, cash, credit card, investment — each with its own balance tracking.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: CreditCard,
    title: 'Payment methods',
    desc: 'Card, cash, mobile payment, bank transfer. Every expense linked to how you actually paid.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: Download,
    title: 'CSV export',
    desc: 'Export filtered expenses to CSV. Date, description, category, payment method, amount — all included.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
];

const techStack = [
  { label: 'React + TypeScript', detail: 'Vite-powered frontend' },
  { label: 'ASP.NET Core', detail: 'Clean architecture API' },
  { label: 'PostgreSQL', detail: 'Reliable data storage' },
  { label: 'Docker Compose', detail: 'One command to run' },
  { label: 'JWT Auth', detail: 'Secure token-based' },
  { label: 'Tailwind CSS v4', detail: 'Utility-first styling' },
];

const dashboardPages = [
  { icon: LayoutDashboard, name: 'Dashboard', desc: 'Stats, charts, recent transactions, budget overview', route: '/dashboard' },
  { icon: Receipt, name: 'Expenses', desc: 'Searchable table with filters, sort, pagination, CSV export', route: '/expenses' },
  { icon: Tag, name: 'Categories', desc: 'Organize expenses with color-coded category cards', route: '/categories' },
  { icon: PiggyBank, name: 'Budgets', desc: 'Monthly limits with progress tracking per category', route: '/budgets' },
  { icon: Wallet, name: 'Accounts', desc: 'Multiple account types with balance tracking', route: '/accounts' },
  { icon: CreditCard, name: 'Payment Methods', desc: 'Card, cash, mobile, bank transfer management', route: '/payment-methods' },
  { icon: Settings, name: 'Settings', desc: 'Profile, currency preference, password management', route: '/settings' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Background — subtle, not distracting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-150 h-150 bg-primary-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-125 h-125 bg-emerald-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* ────── Nav ────── */}
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-16 h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-surface-400 hover:text-white hover:bg-white/8">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="shadow-md shadow-primary-600/20">
                Get started
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* ────── Hero ────── */}
        <section className="px-6 md:px-10 lg:px-16 pt-20 sm:pt-28 pb-20 max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-surface-500 text-xs font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Smart budgeting &middot; Clear insights &middot; Easy tracking
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
              Know where your
              <br />
              money goes.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-surface-400 leading-relaxed max-w-lg">
              A modern expense tracker built with React, .NET, and PostgreSQL.
              Manage spending, set budgets, and understand your finances
              with a clean and simple experience.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to="/register">
                <Button size="lg" className="shadow-lg shadow-primary-600/20" icon={<ArrowRight className="w-4 h-4" />}>
                  Create your account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg" className="text-surface-400 hover:text-white hover:bg-white/6">
                  I already have one
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ────── Dashboard preview ────── */}
        <section className="px-6 md:px-10 lg:px-16 pb-24 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/6 bg-white/2 p-1.5">
            <div className="rounded-xl bg-surface-900/60 border border-white/6 p-5 sm:p-6">
              {/* Header bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-surface-500 font-medium">Dashboard</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Stat cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
                {[
                  { label: 'Total Spent', value: '$3,247.50', sub: 'All time' },
                  { label: 'This Month', value: '$891.20', sub: '↓ 12% vs last' },
                  { label: 'Transactions', value: '47', sub: 'This month' },
                  { label: 'Categories', value: '6', sub: 'Active' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/3 border border-white/6 rounded-lg p-3">
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-base sm:text-lg font-bold text-white">{s.value}</p>
                    <p className="text-[10px] text-surface-600 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
                {/* Area chart mock */}
                <div className="lg:col-span-2 bg-white/3 border border-white/6 rounded-lg p-4">
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-3">Spending Trend — 6 Months</p>
                  <div className="h-28 flex items-end gap-1">
                    {[30, 45, 35, 55, 40, 65, 50, 75, 55, 70, 45, 60, 50, 80, 60, 70, 55, 85, 65, 75, 50, 90, 70, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-primary-500/40"
                        style={{ height: `${h}%`, opacity: 0.4 + (i / 24) * 0.6 }}
                      />
                    ))}
                  </div>
                </div>
                {/* Donut chart mock */}
                <div className="bg-white/3 border border-white/6 rounded-lg p-4">
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-3">By Category</p>
                  <div className="flex items-center justify-center h-28">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="4" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#818cf8" strokeWidth="4" strokeDasharray="30 70" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#34d399" strokeWidth="4" strokeDasharray="22 78" strokeDashoffset="-30" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-52" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#f472b6" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-70" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {[
                      { c: 'bg-primary-400', l: 'Food' },
                      { c: 'bg-emerald-400', l: 'Transport' },
                      { c: 'bg-amber-400', l: 'Bills' },
                      { c: 'bg-pink-400', l: 'Other' },
                    ].map((d) => (
                      <div key={d.l} className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${d.c}`} />
                        <span className="text-[9px] text-surface-500">{d.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-surface-600 mt-3">
            This is a preview of the actual dashboard you get after signing up.
          </p>
        </section>

        {/* ────── What you get (real features) ────── */}
        <section className="px-6 md:px-10 lg:px-16 py-20 max-w-6xl mx-auto border-t border-white/6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              What's actually inside
            </h2>
            <p className="mt-3 text-surface-400 max-w-lg leading-relaxed">
              No vague promises. Here's every feature, built and working.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appFeatures.map((f) => (
              <div
                key={f.title}
                className={`${f.bg} border ${f.border} rounded-xl p-5 transition-colors duration-200 hover:bg-white/6`}
              >
                <f.icon className={`w-5 h-5 ${f.color} mb-3`} />
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────── 7 pages ────── */}
        <section className="px-6 md:px-10 lg:px-16 py-20 max-w-6xl mx-auto border-t border-white/6">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              7 pages, all functional
            </h2>
            <p className="mt-3 text-surface-400 max-w-lg leading-relaxed">
              Every page has full CRUD operations. Nothing is a placeholder.
            </p>
          </div>

          <div className="space-y-2">
            {dashboardPages.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-4 bg-white/2 border border-white/6 rounded-xl px-5 py-4 hover:bg-white/4 transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4 text-surface-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-surface-500 truncate">{p.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-surface-600 hidden sm:block">{p.route}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ────── Tech stack ────── */}
        <section className="px-6 md:px-10 lg:px-16 py-20 max-w-6xl mx-auto border-t border-white/6">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-surface-500" />
              <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Tech Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Built with real tools
            </h2>
            <p className="mt-3 text-surface-400 max-w-lg leading-relaxed">
              Production-grade stack. Clean architecture on the backend,
              modern React on the frontend, PostgreSQL for data.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((t) => (
              <div key={t.label} className="bg-white/3 border border-white/6 rounded-lg p-4 text-center">
                <p className="text-xs font-semibold text-white mb-0.5">{t.label}</p>
                <p className="text-[10px] text-surface-500">{t.detail}</p>
              </div>
            ))}
          </div>

          {/* Docker command */}
          <div className="mt-8 bg-white/3 border border-white/6 rounded-xl p-5">
            <p className="text-xs text-surface-500 mb-3">Run the whole stack with one command:</p>
            <div className="flex items-center gap-3 bg-surface-950 rounded-lg px-4 py-3 font-mono text-sm">
              <span className="text-emerald-400">$</span>
              <code className="text-surface-300">docker compose up --build -d</code>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4">
              {[
                'PostgreSQL database',
                '.NET API server',
                'React app via Nginx',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-surface-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────── Honest pitch / CTA ────── */}
        <section className="px-6 md:px-10 lg:px-16 py-20 max-w-6xl mx-auto border-t border-white/6">
          <div className="bg-linear-to-br from-primary-600/20 to-primary-800/10 border border-primary-500/15 rounded-2xl px-8 py-12 sm:py-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Start tracking today
            </h2>
            <p className="text-surface-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
              Create your account and get a complete view of your expenses,
              budgets, and monthly trends in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="shadow-lg shadow-primary-600/20 px-8" icon={<ArrowRight className="w-4 h-4" />}>
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ────── Footer ────── */}
        <footer className="border-t border-white/6 px-6 md:px-10 lg:px-16 py-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 gradient-primary rounded-md flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-surface-400">ExpenseTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[11px] text-surface-600">
                &copy; {new Date().getFullYear()} ExpenseTracker
              </p>
              <span className="text-surface-700">&middot;</span>
              <p className="text-[11px] text-surface-600">
                All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
