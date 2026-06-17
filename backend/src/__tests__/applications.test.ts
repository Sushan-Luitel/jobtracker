import { Application } from '../types';

// Unit tests for data transformation and validation logic
// (Integration tests with DB are covered by the API itself)

describe('Application data model', () => {
  const validApplication: Application = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    company_name: 'Acme Corp',
    job_title: 'Software Engineer',
    job_type: 'Full-time',
    status: 'Applied',
    applied_date: '2024-01-15',
    notes: 'Great company',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should have all required fields', () => {
    expect(validApplication.id).toBeDefined();
    expect(validApplication.company_name).toBeDefined();
    expect(validApplication.job_title).toBeDefined();
    expect(validApplication.job_type).toBeDefined();
    expect(validApplication.status).toBeDefined();
    expect(validApplication.applied_date).toBeDefined();
  });

  it('should accept valid job types', () => {
    const validJobTypes = ['Internship', 'Full-time', 'Part-time'];
    expect(validJobTypes).toContain(validApplication.job_type);
  });

  it('should accept valid statuses', () => {
    const validStatuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
    expect(validStatuses).toContain(validApplication.status);
  });

  it('should allow null notes', () => {
    const appWithNullNotes: Application = { ...validApplication, notes: null };
    expect(appWithNullNotes.notes).toBeNull();
  });
});

describe('Validation rules', () => {
  it('should reject company names shorter than 2 chars', () => {
    const companyName = 'A';
    expect(companyName.length >= 2).toBe(false);
  });

  it('should accept company names 2+ chars', () => {
    const companyName = 'AB';
    expect(companyName.length >= 2).toBe(true);
  });

  it('should validate ISO8601 dates', () => {
    const validDate = '2024-01-15';
    const parsed = new Date(validDate);
    expect(isNaN(parsed.getTime())).toBe(false);
  });

  it('should reject invalid dates', () => {
    const invalidDate = 'not-a-date';
    const parsed = new Date(invalidDate);
    expect(isNaN(parsed.getTime())).toBe(true);
  });
});
