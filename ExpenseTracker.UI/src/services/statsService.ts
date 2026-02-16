import api from './api';
import axios from 'axios';

export interface PublicStatsResponse {
  totalSpent: number;
  thisMonth: number;
  monthChange: number;
  transactionsThisMonth: number;
  activeCategories: number;
  totalBalance: number;
  categories: { name: string; amount: number }[];
  monthlyTrend: { label: string; amount: number }[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const statsService = {
  getPublic: () => publicApi.get<PublicStatsResponse>('/stats/public'),

  getPublicAuth: () => api.get<PublicStatsResponse>('/stats/public'),
};
