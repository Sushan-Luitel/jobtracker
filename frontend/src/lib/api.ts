import {
  Application,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  PaginatedResponse,
  ApplicationStatus,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    const err = data as { error?: string };
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }

  return data as T;
}

export interface ListParams {
  status?: ApplicationStatus | '';
  search?: string;
  page?: number;
  limit?: number;
}

export const api = {
  applications: {
    list: ({ status, search, page = 1, limit = 20 }: ListParams = {}) => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', String(limit));
      return fetchJSON<PaginatedResponse<Application>>(
        `${BASE_URL}/applications?${params.toString()}`
      );
    },

    get: (id: string) =>
      fetchJSON<Application>(`${BASE_URL}/applications/${id}`),

    create: (data: CreateApplicationDTO) =>
      fetchJSON<Application>(`${BASE_URL}/applications`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateApplicationDTO) =>
      fetchJSON<Application>(`${BASE_URL}/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchJSON<{ message: string; id: string }>(`${BASE_URL}/applications/${id}`, {
        method: 'DELETE',
      }),
  },
};
