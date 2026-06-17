'use client';

import { useState, useEffect } from 'react';
import { Application, CreateApplicationDTO, JOB_TYPES, STATUSES } from '@/types';

interface ApplicationFormProps {
  initial?: Application;
  onSubmit: (data: CreateApplicationDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormErrors = Partial<Record<keyof CreateApplicationDTO, string>>;

function validate(data: Partial<CreateApplicationDTO>): FormErrors {
  const errors: FormErrors = {};
  if (!data.company_name || data.company_name.trim().length < 2) {
    errors.company_name = 'Company name must be at least 2 characters';
  }
  if (!data.job_title || data.job_title.trim().length === 0) {
    errors.job_title = 'Job title is required';
  }
  if (!data.job_type) {
    errors.job_type = 'Job type is required';
  }
  if (!data.status) {
    errors.status = 'Status is required';
  }
  if (!data.applied_date) {
    errors.applied_date = 'Applied date is required';
  }
  return errors;
}

export default function ApplicationForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: ApplicationFormProps) {
  const [form, setForm] = useState<Partial<CreateApplicationDTO>>({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    status: 'Applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateApplicationDTO, boolean>>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        company_name: initial.company_name,
        job_title: initial.job_title,
        job_type: initial.job_type,
        status: initial.status,
        applied_date: initial.applied_date.split('T')[0],
        notes: initial.notes ?? '',
      });
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof CreateApplicationDTO]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof CreateApplicationDTO] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof CreateApplicationDTO] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as typeof touched
    );
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await onSubmit(form as CreateApplicationDTO);
  };

  const inputClass = (field: keyof CreateApplicationDTO) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] && touched[field]
        ? 'border-red-300 bg-red-50 focus:ring-red-400'
        : 'border-gray-200 bg-white focus:border-indigo-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            name="company_name"
            value={form.company_name ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Acme Corp"
            className={inputClass('company_name')}
          />
          {errors.company_name && touched.company_name && (
            <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            name="job_title"
            value={form.job_title ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Software Engineer"
            className={inputClass('job_title')}
          />
          {errors.job_title && touched.job_title && (
            <p className="mt-1 text-xs text-red-600">{errors.job_title}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="job_type"
            value={form.job_type ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('job_type')}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={form.status ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('status')}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Applied Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="applied_date"
            value={form.applied_date ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('applied_date')}
          />
          {errors.applied_date && touched.applied_date && (
            <p className="mt-1 text-xs text-red-600">{errors.applied_date}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={form.notes ?? ''}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional notes, contacts, or reminders..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Saving...' : initial ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}
