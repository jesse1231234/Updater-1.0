// apps/web/lib/api.ts
import axios, { AxiosInstance } from 'axios';

const isBrowser = typeof window !== 'undefined';

/**
 * Browser:
 *   Always call the Next.js proxy at /api so requests go to your public domain,
 *   and Next rewrites them to Nest (port 4000) inside the container.
 */
const browserBase = '/api';

/**
 * Server (Next server components / route handlers):
 *   Call Nest directly inside the container.
 *   If your Nest app does NOT use app.setGlobalPrefix('api'), leave as http://localhost:4000
 *   If it DOES use a global 'api' prefix, set INTERNAL_API_BASE to http://localhost:4000/api
 */
const serverBase =
  process.env.INTERNAL_API_BASE || 'http://localhost:4000';

export const api: AxiosInstance = axios.create({
  baseURL: isBrowser ? browserBase : serverBase,
  withCredentials: false,
  timeout: 30000,
});

// Optional convenience helpers
export const get  = <T = any>(url: string, config?: any) => api.get<T>(url, config);
export const post = <T = any>(url: string, data?: any, config?: any) => api.post<T>(url, data, config);
export const put  = <T = any>(url: string, data?: any, config?: any) => api.put<T>(url, data, config);
export const del  = <T = any>(url: string, config?: any) => api.delete<T>(url, config);

export default api;
