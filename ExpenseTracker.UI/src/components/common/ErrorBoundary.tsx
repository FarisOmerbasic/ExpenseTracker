import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-danger-50 rounded-2xl flex items-center justify-center ring-1 ring-danger-100">
              <AlertTriangle className="w-8 h-8 text-danger-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-surface-500 mb-6 text-sm leading-relaxed">
              An unexpected error occurred. Try refreshing the page or going back to the home screen.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-surface-100 rounded-xl p-4 border border-surface-200">
                <summary className="text-xs font-medium text-surface-600 cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-danger-600 whitespace-pre-wrap wrap-break-word font-mono">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-surface-200 text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
