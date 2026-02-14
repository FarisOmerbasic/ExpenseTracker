import api from './api';
import type { PaymentMethod, CreatePaymentMethodDto } from '../types';

export const paymentMethodService = {
  getAll: () => api.get<PaymentMethod[]>('/paymentmethods'),

  getById: (id: number) => api.get<PaymentMethod>(`/paymentmethods/${id}`),

  create: (data: CreatePaymentMethodDto) =>
    api.post<PaymentMethod>('/paymentmethods', data),

  update: (id: number, data: CreatePaymentMethodDto) =>
    api.put<PaymentMethod>(`/paymentmethods/${id}`, data),

  delete: (id: number) => api.delete(`/paymentmethods/${id}`),
};
