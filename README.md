# Job Tracker

## Project Overview
A clean, full-stack web application to track job applications through different hiring stages. It features a complete dashboard to view, add, edit, and delete job applications with real-time optimistic updates and search/filtering capabilities.

<img width="1568" height="1492" alt="Screenshot 2026-06-17 203752" src="https://github.com/user-attachments/assets/eab96b32-b6e2-4fbb-8984-1547827123d5" />

## Tech Stack Used
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS
- **Backend**: Node.js, Express 4, TypeScript (strict)
- **Database**: PostgreSQL 16
- **DevOps**: Docker + Docker Compose

## Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+ (or Docker)

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Sushan-Luitel/jobtracker.git
   cd jobtracker
   ```
2. Set up the database:
   Make sure you have PostgreSQL running and create a database named `jobtracker`.
   ```bash
   createdb jobtracker
   ```

3. Install Backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Install Frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## How to Run in Development Mode

**Using Docker:**
From the root directory, simply run:
```bash
docker compose up --build
```
Then open http://localhost:3000.

**Manual Setup:**
1. **Backend**:
   ```bash
   cd backend
   npm run migrate  # Creates tables and indexes
   npm run dev      # Starts API on http://localhost:4000
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm run dev      # Starts UI on http://localhost:3000
   ```

## How to Run Tests
The backend includes Jest unit tests. To run them:
```bash
cd backend
npm test
```

## Required Environment Variables & `.env.example`

It's recommended to copy the provided `.env.example` files to configure your environment.

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobtracker
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## API Docs

The REST API is available at `http://localhost:4000`.

- `GET /applications` - List all applications (supports `?status=`, `?search=`, `?page=`)
- `GET /applications/:id` - Get a single application by UUID
- `POST /applications` - Create a new application
- `PATCH /applications/:id` - Partially update an application
- `DELETE /applications/:id` - Delete an application
- `GET /health` - API Health check
