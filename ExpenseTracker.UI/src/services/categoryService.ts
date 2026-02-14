import api from './api';
import type { Category, CreateCategoryDto } from '../types';

export const categoryService = {
  getAll: () => api.get<Category[]>('/categories'),

  getById: (id: number) => api.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryDto) => api.post<Category>('/categories', data),

  update: (id: number, data: CreateCategoryDto) =>
    api.put<Category>(`/categories/${id}`, data),

  delete: (id: number) => api.delete(`/categories/${id}`),
};
