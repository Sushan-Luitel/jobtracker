import { Application } from '@/types';
import StatusBadge from './StatusBadge';

interface ViewApplicationModalProps {
  application: Application;
  onEdit: () => void;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ViewApplicationModal({
  application,
  onEdit,
  onClose,
}: ViewApplicationModalProps) {
  const { company_name, job_title, job_type, status, applied_date, notes, created_at, updated_at } =
    application;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gray-50 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company_name}</h3>
            <p className="text-sm text-gray-600">{job_title}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-md bg-white border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            {job_type}
          </span>
          <span className="text-xs text-gray-500">Applied {formatDate(applied_date)}</span>
        </div>
      </div>

      {notes && (
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">Notes</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      <div className="border-t pt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400">Created</p>
          <p className="text-xs text-gray-600">{formatDateTime(created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Last Updated</p>
          <p className="text-xs text-gray-600">{formatDateTime(updated_at)}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Edit Application
        </button>
      </div>
    </div>
  );
}
