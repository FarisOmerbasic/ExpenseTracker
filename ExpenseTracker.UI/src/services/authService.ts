import api from './api';
import type {
  AuthResponseDto,
  LoginRequestDto,
  CreateUserDto,
  PasswordResetRequestDto,
  PasswordResetConfirmDto,
} from '../types';

export const authService = {
  login: (data: LoginRequestDto) =>
    api.post<AuthResponseDto>('/auth/login', data),

  register: (data: CreateUserDto) =>
    api.post<AuthResponseDto>('/auth/register', data),

  requestPasswordReset: (data: PasswordResetRequestDto) =>
    api.post('/auth/password-reset/request', data),

  confirmPasswordReset: (data: PasswordResetConfirmDto) =>
    api.post('/auth/password-reset/confirm', data),
};
