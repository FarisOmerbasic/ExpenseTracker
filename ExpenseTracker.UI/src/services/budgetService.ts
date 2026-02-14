import api from './api';
import type { Budget, CreateBudgetDto } from '../types';

export const budgetService = {
  getAll: () => api.get<Budget[]>('/budgets'),

  getById: (id: number) => api.get<Budget>(`/budgets/${id}`),

  create: (data: CreateBudgetDto) => api.post<Budget>('/budgets', data),

  update: (id: number, data: CreateBudgetDto) =>
    api.put<Budget>(`/budgets/${id}`, data),

  delete: (id: number) => api.delete(`/budgets/${id}`),
};
