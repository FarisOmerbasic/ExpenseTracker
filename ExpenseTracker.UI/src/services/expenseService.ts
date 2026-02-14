import api from './api';
import type { Expense, CreateExpenseDto } from '../types';

export const expenseService = {
  getAll: () => api.get<Expense[]>('/expenses'),

  getById: (id: number) => api.get<Expense>(`/expenses/${id}`),

  create: (data: CreateExpenseDto) => api.post<Expense>('/expenses', data),

  update: (id: number, data: CreateExpenseDto) =>
    api.put<Expense>(`/expenses/${id}`, data),

  delete: (id: number) => api.delete(`/expenses/${id}`),
};
