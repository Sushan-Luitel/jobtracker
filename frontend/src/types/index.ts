export type JobType = 'Internship' | 'Full-time' | 'Part-time';
export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationDTO {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export type UpdateApplicationDTO = Partial<CreateApplicationDTO>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
export const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  Applied: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  Interviewing: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
};
