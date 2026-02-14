import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        <div className="w-28 h-28 mx-auto mb-8 bg-linear-to-br from-primary-50 to-primary-100 rounded-3xl flex items-center justify-center ring-1 ring-primary-200/50">
          <span className="text-5xl font-bold bg-linear-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent">404</span>
        </div>
        <h1 className="text-3xl font-bold text-surface-900 mb-3">
          Page not found
        </h1>
        <p className="text-surface-500 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button icon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
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
