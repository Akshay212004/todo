import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken } from '../utils/storage';

/** Single Axios instance shared by every service. */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// AuthContext registers a callback here so an expired token logs the user out.
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

// Attach the JWT to every outgoing request.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 on a protected route means the token is expired or invalid -> force logout.
// (Auth routes are excluded because a 401 there just means "wrong password".)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth');
    if (error.response?.status === 401 && !isAuthRoute) unauthorizedHandler?.();
    return Promise.reject(error);
  }
);

export default api;
