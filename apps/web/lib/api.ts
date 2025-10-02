// apps/web/lib/api.ts
import axios from 'axios';

// Use /api on the public domain for browser requests.
// (Optional) If you ALSO need a server-side internal base, keep it simple and still use /api.
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE || '/api'; // fallback ensures prod works even if env is missing

export const api = axios.create({
  baseURL,
  withCredentials: false,
});
