# ExpenseTracker

A full-stack web app for personal expense tracking. React + TypeScript frontend, ASP.NET Core API, and PostgreSQL — all running with Docker Compose.

## Features

- Registration and login (JWT authentication)
- Dashboard with stats, charts, and budget overview
- Full CRUD for expenses, categories, budgets, accounts, and payment methods
- Budgets per category or monthly overall budget
- Automatic account balance updates when adding expenses
- Expense CSV export
- 30 currencies with country flags

## Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, Recharts |
| Backend | ASP.NET Core 9.0 (Clean Architecture) |
| Database | PostgreSQL 16 |
| Auth | JWT Bearer tokens |
| Deploy | Docker Compose |

## Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

### Start the app

```bash
git clone <repo-url>
cd ExpenseTracker

docker compose -f docker/compose/docker-compose.yml up --build -d
```

Docker Compose starts three services:

| Service | URL / Port | Description |
|--------|-----------|------|
| **web** | http://localhost:5173 | React app (Nginx) |
| **api** | http://localhost:8081 | .NET API + Swagger |
| **db** | localhost:5433 | PostgreSQL |

The database is created automatically, and migrations are applied on API startup.

### Usage

1. Open http://localhost:5173
2. Click **Get started** or **Create your account**
3. Register (name, email, password, currency)
4. You can now add expenses, categories, budgets, accounts, and payment methods

### Stop the app

```bash
docker compose -f docker/compose/docker-compose.yml down
```

To remove the database volume (fresh start):

```bash
docker compose -f docker/compose/docker-compose.yml down -v
```

### Local development (without full Docker stack)

```bash
# 1. Start only the database
docker compose -f docker/compose/docker-compose.yml up db -d

# 2. API
cd ExpenseTracker.Presentation
dotnet run

# 3. Frontend (in another terminal)
cd ExpenseTracker.UI
npm install
npm run dev
```

API: http://localhost:5145 | Frontend: http://localhost:5173

### Swagger

When the API is running, Swagger UI is available at:
- Docker: http://localhost:8081/swagger
- Local: http://localhost:5145/swagger
