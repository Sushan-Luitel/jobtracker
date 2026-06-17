#  Job Tracker

A clean, full-stack web application to track job applications through different hiring stages.

![Job Tracker Screenshot](https://via.placeholder.com/1200x630/6366f1/ffffff?text=Job+Tracker+App)

##  Features

- **Application List** — View all applications with company, role, type, status, and applied date
- **Add Application** — Create new applications with a validated form
- **Edit Application** — Update any field of an existing application
- **Delete Application** — Remove applications with a confirmation dialog
- **Filter by Status** — One-click filter: All, Applied, Interviewing, Offer, Rejected
- **Search** — Live search by company name or job title
- **Pagination** — Navigate large datasets (20 per page by default)
- **Optimistic UI Updates** — Deletes and edits feel instant
- **Toast Notifications** — Success and error feedback
- **Loading States** — Spinners and empty states with helpful messages

##  Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS |
| Backend  | Node.js, Express 4, TypeScript (strict) |
| Database | PostgreSQL 16 with UUID primary keys and enum types |
| API      | REST with full CRUD, `?status=` + `?search=` + `?page=` query params |
| Testing  | Jest + ts-jest (8 unit tests) |
| DevOps   | Docker + docker-compose |

##  Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (or Docker)

##  Quick Start with Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/yourusername/jobtracker.git
cd jobtracker

# Start everything (DB + backend + frontend)
docker compose up --build
```

Then open http://localhost:3000.

---

##  Manual Setup

### 1. Clone and prepare

```bash
git clone https://github.com/yourusername/jobtracker.git
cd jobtracker
```

### 2. Set up the database

```bash
# Create the database
createdb jobtracker

# Or with psql
psql -U postgres -c "CREATE DATABASE jobtracker;"
```

### 3. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations (creates tables, indexes, triggers)
npm run migrate

# Start dev server
npm run dev
# Runs on http://localhost:4000
```

### 4. Frontend setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit if your backend runs on a different port

# Start dev server
npm run dev
# Runs on http://localhost:3000
```

##  Running Tests

```bash
cd backend
npm test
```

Output:
```
PASS src/__tests__/applications.test.ts
  Application data model
    ✓ should have all required fields
    ✓ should accept valid job types
    ✓ should accept valid statuses
    ✓ should allow null notes
  Validation rules
    ✓ should reject company names shorter than 2 chars
    ✓ should accept company names 2+ chars
    ✓ should validate ISO8601 dates
    ✓ should reject invalid dates

Tests: 8 passed, 8 total
```

##  Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                          | Default                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string         | `postgresql://postgres:password@localhost:5432/jobtracker` |
| `PORT`         | Port to run the API server on        | `4000`                                       |
| `NODE_ENV`     | Environment (`development`/`production`) | `development`                             |
| `FRONTEND_URL` | CORS allowed origin                  | `http://localhost:3000`                      |

### Frontend (`frontend/.env.local`)

| Variable              | Description             | Default                  |
|-----------------------|-------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL` | URL of the backend API  | `http://localhost:4000`  |

##  REST API Documentation

Base URL: `http://localhost:4000`

### Endpoints

#### `GET /applications`

List all applications. Supports filtering, search, and pagination.

**Query parameters:**

| Param    | Type   | Description                                                         |
|----------|--------|---------------------------------------------------------------------|
| `status` | string | Filter by status: `Applied`, `Interviewing`, `Offer`, `Rejected`   |
| `search` | string | Search company name or job title (case-insensitive)                |
| `page`   | number | Page number (default: 1)                                            |
| `limit`  | number | Items per page (default: 20, max: 100)                              |

**Response:**
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

#### `GET /applications/:id`

Get a single application by UUID.

#### `POST /applications`

Create a new application.

**Body:**
```json
{
  "company_name": "Acme Corp",
  "job_title": "Software Engineer",
  "job_type": "Full-time",
  "status": "Applied",
  "applied_date": "2024-06-17",
  "notes": "Optional notes"
}
```

#### `PATCH /applications/:id`

Partially update an application. All fields are optional.

#### `DELETE /applications/:id`

Delete an application. Returns `200` with `{ message, id }`.

### Health Check

`GET /health` → `{ "status": "ok", "timestamp": "..." }`

##  Database Schema

```sql
CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
CREATE TYPE status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');

CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  job_title    VARCHAR(255) NOT NULL,
  job_type     job_type_enum NOT NULL,
  status       status_enum NOT NULL DEFAULT 'Applied',
  applied_date DATE NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Auto-updating `updated_at` is handled by a PostgreSQL trigger. Indexes on `status`, `applied_date`, and a GIN index on `company_name` for fast search.

##  Project Structure

```
jobtracker/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.ts          # PostgreSQL connection
│   │   │   └── migrate.ts       # Database migration
│   │   ├── routes/
│   │   │   └── applications.ts  # REST endpoints
│   │   ├── types/
│   │   │   └── index.ts         # Shared TypeScript types
│   │   ├── __tests__/
│   │   │   └── applications.test.ts
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Server entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx          # Main dashboard
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ApplicationForm.tsx
    │   │   ├── ApplicationRow.tsx
    │   │   ├── DeleteConfirmDialog.tsx
    │   │   ├── Modal.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── Toast.tsx
    │   │   └── ViewApplicationModal.tsx
    │   ├── hooks/
    │   │   └── useApplications.ts  # Data fetching + optimistic updates
    │   ├── lib/
    │   │   └── api.ts             # Typed API client
    │   └── types/
    │       └── index.ts
    ├── .env.example
    ├── Dockerfile
    ├── next.config.mjs
    └── package.json
```

##  Bonus Features Implemented

-  Search by company name or job title
-  Pagination with page/limit controls
-  Loading states and error messages with retry
-  Unit tests (8 tests, all passing)
-  Docker + docker-compose.yml
-  Optimistic UI updates (delete is instant)
-  TypeScript strict mode (both frontend and backend)
