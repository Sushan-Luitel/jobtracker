'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { api, ListParams } from '@/lib/api';

interface UseApplicationsState {
  applications: Application[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export function useApplications(params: ListParams) {
  const [state, setState] = useState<UseApplicationsState>({
    applications: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    error: null,
  });

  const fetchApplications = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await api.applications.list(params);
      setState({
        applications: res.data,
        total: res.total,
        totalPages: res.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load applications',
      }));
    }
  }, [params.status, params.search, params.page, params.limit]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const deleteApplication = async (id: string): Promise<void> => {
    // Optimistic update
    const previous = state.applications;
    setState((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
      total: prev.total - 1,
    }));

    try {
      await api.applications.delete(id);
    } catch (err) {
      // Rollback on failure
      setState((prev) => ({ ...prev, applications: previous }));
      throw err;
    }
  };

  const updateStatus = async (id: string, status: ApplicationStatus): Promise<void> => {
    // Optimistic update
    const previous = state.applications;
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    }));

    try {
      await api.applications.update(id, { status });
    } catch (err) {
      setState((prev) => ({ ...prev, applications: previous }));
      throw err;
    }
  };

  return {
    ...state,
    refresh: fetchApplications,
    deleteApplication,
    updateStatus,
  };
}
