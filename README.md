# Job Tracker

A clean, full-stack web application to track job applications through different hiring stages.

<img width="1568" height="1492" alt="Screenshot 2026-06-17 203752" src="https://github.com/user-attachments/assets/eab96b32-b6e2-4fbb-8984-1547827123d5" />

## Features
- Track all job applications with status, company, role, and type.
- Add, Edit, and Delete applications easily.
- Filter applications by status or search by company name.
- Simple, fast, and responsive design.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 16

## Quick Start (Docker)

```bash
git clone https://github.com/Sushan-Luitel/jobtracker.git
cd jobtracker
docker compose up --build
```
Then open http://localhost:3000

## Manual Setup

1. **Clone repo**: `git clone https://github.com/Sushan-Luitel/jobtracker.git`
2. **Database**: Make sure you have PostgreSQL running and create a database named `jobtracker`.
3. **Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run migrate
   npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

That's it! Visit `http://localhost:3000` to use the app.
