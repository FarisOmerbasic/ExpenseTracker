import api from './api';
import type { Account, CreateAccountDto } from '../types';

export const accountService = {
  getAll: () => api.get<Account[]>('/accounts'),

  getById: (id: number) => api.get<Account>(`/accounts/${id}`),

  create: (data: CreateAccountDto) => api.post<Account>('/accounts', data),

  update: (id: number, data: CreateAccountDto) =>
    api.put<Account>(`/accounts/${id}`, data),

  delete: (id: number) => api.delete(`/accounts/${id}`),
};
