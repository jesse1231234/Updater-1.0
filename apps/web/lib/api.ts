// apps/web/lib/api.ts
'use client';

import axios, { AxiosInstance } from 'axios';

/**
 * In the browser, always talk to the Next proxy at /api.
 * Do NOT use NEXT_PUBLIC_* here; we want to prevent localhost leaks.
 */
export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 30000,
});

export default api;
