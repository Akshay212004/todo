import api from './api';
import { AuthResponse } from '../types';

export const registerRequest = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
  return data;
};

export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
};
