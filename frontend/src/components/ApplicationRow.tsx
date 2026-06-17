import { Application } from '@/types';
import StatusBadge from './StatusBadge';

interface ApplicationRowProps {
  application: Application;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-pink-100 text-pink-700',
    'bg-cyan-100 text-cyan-700',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function ApplicationRow({ application, onView, onEdit, onDelete }: ApplicationRowProps) {
  const { company_name, job_title, job_type, status, applied_date } = application;

  return (
    <tr className="group border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${getAvatarColor(company_name)}`}
          >
            {getInitials(company_name)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{company_name}</div>
            <div className="text-xs text-gray-500">{job_title}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {job_type}
        </span>
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={status} />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">{formatDate(applied_date)}</td>
      <td className="py-4 pl-3 pr-6">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(application)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="View details"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(application)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Edit application"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(application)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete application"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
