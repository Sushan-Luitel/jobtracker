import { Router, Request, Response } from 'express';
import { body, param, query as vQuery, validationResult } from 'express-validator';
import { query } from '../db/pool';
import {
  Application,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ListApplicationsQuery,
  PaginatedResponse,
} from '../types';

const router = Router();

const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return true;
  }
  return false;
};

// GET /applications
router.get(
  '/',
  [
    vQuery('status').optional().isIn(STATUSES).withMessage('Invalid status'),
    vQuery('search').optional().isString().trim(),
    vQuery('page').optional().isInt({ min: 1 }).toInt(),
    vQuery('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { status, search } = req.query as ListApplicationsQuery;
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) ?? '20', 10);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search) {
      conditions.push(
        `(company_name ILIKE $${paramIndex} OR job_title ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
      const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) FROM applications ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count, 10);

      const dataResult = await query<Application>(
        `SELECT * FROM applications ${whereClause} ORDER BY applied_date DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      );

      const response: PaginatedResponse<Application> = {
        data: dataResult.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      res.json(response);
    } catch (err) {
      console.error('GET /applications error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /applications/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid application ID')],
  async (req: Request<{ id: string }>, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const result = await query<Application>(
        'SELECT * FROM applications WHERE id = $1',
        [req.params.id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('GET /applications/:id error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /applications
router.post(
  '/',
  [
    body('company_name')
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Company name must be at least 2 characters'),
    body('job_title')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Job title is required'),
    body('job_type')
      .isIn(JOB_TYPES)
      .withMessage('Job type must be Internship, Full-time, or Part-time'),
    body('status')
      .isIn(STATUSES)
      .withMessage('Status must be Applied, Interviewing, Offer, or Rejected'),
    body('applied_date')
      .isISO8601()
      .withMessage('Applied date must be a valid date (YYYY-MM-DD)'),
    body('notes').optional({ nullable: true }).isString().trim(),
  ],
  async (req: Request<Record<string, string>, object, CreateApplicationDTO>, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;

    try {
      const result = await query<Application>(
        `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [company_name, job_title, job_type, status, applied_date, notes ?? null]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('POST /applications error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PATCH /applications/:id
router.patch(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid application ID'),
    body('company_name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Company name must be at least 2 characters'),
    body('job_title').optional().isString().trim().notEmpty(),
    body('job_type').optional().isIn(JOB_TYPES),
    body('status').optional().isIn(STATUSES),
    body('applied_date').optional().isISO8601(),
    body('notes').optional({ nullable: true }).isString().trim(),
  ],
  async (req: Request<{ id: string }, object, UpdateApplicationDTO>, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const updates = req.body;
    const fields = Object.keys(updates).filter(
      (k) => updates[k as keyof UpdateApplicationDTO] !== undefined
    );

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const setClauses = fields.map((field, i) => `${field} = $${i + 2}`);
    const values = fields.map((f) => updates[f as keyof UpdateApplicationDTO]);

    try {
      const result = await query<Application>(
        `UPDATE applications SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
        [req.params.id, ...values]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('PATCH /applications/:id error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /applications/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid application ID')],
  async (req: Request<{ id: string }>, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const result = await query<Application>(
        'DELETE FROM applications WHERE id = $1 RETURNING id',
        [req.params.id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      res.status(200).json({ message: 'Application deleted successfully', id: req.params.id });
    } catch (err) {
      console.error('DELETE /applications/:id error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
