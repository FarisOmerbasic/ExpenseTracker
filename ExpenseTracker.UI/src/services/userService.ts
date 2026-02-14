import api from './api';
import type { User } from '../types';

export const userService = {
  getById: (id: number) => api.get<User>(`/users/${id}`),

  update: (id: number, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: number) => api.delete(`/users/${id}`),
};
