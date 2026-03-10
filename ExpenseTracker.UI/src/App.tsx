import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const PaymentMethodsPage = lazy(() => import('./pages/PaymentMethodsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-50"><LoadingSpinner size="lg" /></div>}>
          <Routes>
            
            <Route path="/" element={<LandingPage />} />

            
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterPage />
                </AuthRedirect>
              }
            />

            
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<HomePage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="payment-methods" element={<PaymentMethodsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </Router>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#fff',
            color: '#1c1917',
            borderRadius: '14px',
            border: '1px solid #e7e5e4',
            padding: '12px 16px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
