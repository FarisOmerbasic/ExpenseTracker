export interface User {
  userId: number;
  name: string;
  email: string;
  currencyPreference: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  currencyPreference: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  expiresAtUtc: string;
  user: User;
}

export interface TokenResult {
  accessToken: string;
  expiresAtUtc: string;
}

export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetConfirmDto {
  token: string;
  newPassword: string;
}

export interface Account {
  accountId: number;
  userId: number;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
}

export interface CreateAccountDto {
  userId: number;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
}

export interface Category {
  categoryId: number;
  userId: number;
  name: string;
  sortOrder: number;
}

export interface CreateCategoryDto {
  userId: number;
  name: string;
  sortOrder: number;
}

export interface Expense {
  expenseId: number;
  amount: number;
  date: string;
  description?: string;
  categoryId: number;
  paymentMethodId: number;
  accountId: number | null;
  userId: number;
}

export interface CreateExpenseDto {
  userId: number;
  categoryId: number;
  paymentMethodId: number;
  accountId?: number | null;
  amount: number;
  date: string;
  description?: string;
}

export interface PaymentMethod {
  paymentMethodId: number;
  userId: number;
  name: string;
  type: string;
}

export interface CreatePaymentMethodDto {
  userId: number;
  name: string;
  type: string;
}

export interface Budget {
  budgetId: number;
  userId: number;
  categoryId: number | null;
  name: string | null;
  amount: number;
}

export interface CreateBudgetDto {
  userId: number;
  categoryId: number | null;
  name: string | null;
  amount: number;
}

export interface SidebarLink {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SelectOption {
  value: string | number;
  label: string;
}
