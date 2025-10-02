// apps/web/app/runs/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NewRunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await api.post('/runs', {
        // TODO: include fields your DTO needs; start with an empty object if allowed
      });

      const data = await res.data;
      if (!data?.id) {
        setErr('Create returned no id');
        return;
      }
      router.push(`/runs/${data.id}`);
    } catch (e: any) {
      setErr(e?.response?.data ?? e?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      {/* your form fields here */}
      <button disabled={loading} type="submit" className="px-3 py-2 border">
        {loading ? 'Creating…' : 'Create Run'}
      </button>
      {err && <p className="text-red-600 text-sm">{String(err)}</p>}
    </form>
  );
}
