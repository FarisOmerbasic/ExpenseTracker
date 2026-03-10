import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
      <div className="text-center animate-fade-in max-w-sm">
        <p className="text-8xl font-black text-surface-200 select-none mb-2 tracking-tighter">404</p>
        <h1 className="text-xl font-bold text-surface-900 mb-2">
          Wrong turn
        </h1>
        <p className="text-sm text-surface-500 mb-8 leading-relaxed">
          This page doesn&apos;t exist. It may have been moved,
          or the URL might be off.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button size="sm" icon={<Home className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
