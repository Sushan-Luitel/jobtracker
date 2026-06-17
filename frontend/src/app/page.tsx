'use client';

import { useState, useCallback, useDeferredValue } from 'react';
import { Application, ApplicationStatus, CreateApplicationDTO, STATUSES } from '@/types';
import { api } from '@/lib/api';
import { useApplications } from '@/hooks/useApplications';
import ApplicationRow from '@/components/ApplicationRow';
import ApplicationForm from '@/components/ApplicationForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import Modal from '@/components/Modal';
import ViewApplicationModal from '@/components/ViewApplicationModal';
import StatusBadge from '@/components/StatusBadge';
import Toast, { useToast, ToastItem } from '@/components/Toast';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; app: Application }
  | { type: 'view'; app: Application }
  | { type: 'delete'; app: Application };

export default function Home() {
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toasts, showToast, dismiss } = useToast();

  const deferredSearch = useDeferredValue(search);

  const { applications, total, totalPages, isLoading, error, refresh, deleteApplication } =
    useApplications({
      status: statusFilter || undefined,
      search: deferredSearch || undefined,
      page,
    });

  const closeModal = useCallback(() => setModal({ type: 'none' }), []);

  const handleCreate = async (data: CreateApplicationDTO) => {
    setFormLoading(true);
    try {
      await api.applications.create(data);
      showToast('Application added successfully');
      closeModal();
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to add application', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: CreateApplicationDTO) => {
    if (modal.type !== 'edit') return;
    setFormLoading(true);
    try {
      await api.applications.update(modal.app.id, data);
      showToast('Application updated successfully');
      closeModal();
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update application', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    setDeleteLoading(true);
    try {
      await deleteApplication(modal.app.id);
      showToast('Application deleted');
      closeModal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete application', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusFilter = (s: ApplicationStatus | '') => {
    setStatusFilter(s);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Stats for the header
  const stats = STATUSES.map((s) => ({
    status: s,
    count: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t: ToastItem) => (
          <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {total} application{total !== 1 ? 's' : ''} tracked
              </p>
            </div>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Application
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by company or job title..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleStatusFilter('')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(statusFilter === s ? '' : s)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="text-sm text-gray-500">Loading applications...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">{error}</p>
              <button onClick={refresh} className="text-sm text-indigo-600 hover:underline">
                Try again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">
                  {search || statusFilter ? 'No matching applications' : 'No applications yet'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {search || statusFilter
                    ? 'Try adjusting your search or filter'
                    : 'Add your first job application to get started'}
                </p>
              </div>
              {!search && !statusFilter && (
                <button
                  onClick={() => setModal({ type: 'add' })}
                  className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Application
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Company / Role
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Applied
                    </th>
                    <th className="py-3.5 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      application={app}
                      onView={(a) => setModal({ type: 'view', app: a })}
                      onEdit={(a) => setModal({ type: 'edit', app: a })}
                      onDelete={(a) => setModal({ type: 'delete', app: a })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={modal.type === 'add'}
        onClose={closeModal}
        title="Add Application"
        size="lg"
      >
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        title="Edit Application"
        size="lg"
      >
        {modal.type === 'edit' && (
          <ApplicationForm
            initial={modal.app}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            isLoading={formLoading}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.type === 'view'}
        onClose={closeModal}
        title="Application Details"
        size="md"
      >
        {modal.type === 'view' && (
          <ViewApplicationModal
            application={modal.app}
            onEdit={() => setModal({ type: 'edit', app: modal.app })}
            onClose={closeModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.type === 'delete'}
        onClose={closeModal}
        title="Delete Application"
        size="sm"
      >
        {modal.type === 'delete' && (
          <DeleteConfirmDialog
            companyName={modal.app.company_name}
            jobTitle={modal.app.job_title}
            onConfirm={handleDelete}
            onCancel={closeModal}
            isLoading={deleteLoading}
          />
        )}
      </Modal>
    </div>
  );
}
