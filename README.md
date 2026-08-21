# ModernTech HR Backend

A Node.js/Express REST API backing an HR management system — employees, payroll, attendance, performance reviews, time-off requests, and a dashboard, backed by MySQL.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 5
- **Database:** MySQL (via `mysql2/promise`, connection pool)
- **Auth:** JWT (`jsonwebtoken`) + `bcrypt` for password hashing
- **Dev tooling:** `nodemon`

## Project Structure

```
backend/
├── src/
│   ├── server.js              # App entry point, route mounting, error handlers
│   ├── config/
│   │   └── db.js              # MySQL connection pool + env var validation
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── userModel.js
│   │   ├── employeeModel.js
│   │   ├── payrollModel.js
│   │   ├── timeoffModel.js
│   │   └── dashboardModel.js
│   └── routes/
│       ├── auth.js            # POST /api/auth/login
│       ├── dashboard.js       # GET  /api/dashboard/stats
│       ├── timeoff.js         # /api/timeoff
│       ├── employees.js       # /api/employees
│       ├── payroll.js         # /api/payroll
│       ├── attendance.js      # /api/attendance
│       └── reviews.js         # /api/reviews
├── package.json
└── .env                       # Local environment config (not committed)
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A running MySQL instance with the project schema loaded

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/` with:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
PORT=5000
JWT_SECRET=your_jwt_secret
```

`config/db.js` validates on startup that `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` are all set, and will throw immediately if any are missing.

### Running the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000` by default (or whatever `PORT` is set to). A health-check root route is available at `GET /`.

## API Overview

All routes are mounted under `/api`. Routes marked  require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Authenticate with `username`/`password`, returns a JWT + user info |

### Dashboard — `/api/dashboard` 
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Aggregate stats: total employees, approved leave, payroll totals, open requests, growth trend |

### Employees — `/api/employees`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all employees |
| GET | `/:id` | Get a single employee |
| POST | `/` | Create an employee |
| PUT | `/:id` | Update an employee |
| DELETE | `/:id` | Delete an employee |

### Payroll — `/api/payroll`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all payroll records (joined with employee names) |
| GET | `/summary` | Payroll summary stats |
| GET | `/:id` | Get one employee's payroll record |
| PUT | `/:id` | Update a payroll record |

### Attendance — `/api/attendance`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all attendance records |
| GET | `/stats` | Present/absent percentage breakdown |
| POST | `/` | Add an attendance record (`employee_id`, `date`, `status`) |
| DELETE | `/:employeeId/:date` | Delete a specific record |

### Reviews — `/api/reviews`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all reviews (joined with employee info) |
| GET | `/average` | Average rating across all reviews |
| GET | `/stats` | Total review count |
| POST | `/` | Add a review (`employee_id`, `rating` 1–5, `comments`, optional `quarter`) |
| DELETE | `/:id` | Delete a review |

### Time Off — `/api/timeoff` 
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all time-off requests |
| POST | `/` | Submit a request (`employee_id`, `leave_type`, `start_date`, `end_date`, optional `reason`) |
| PUT | `/:id` | Approve/reject a request (`status`: `Approved` or `Rejected`) |

## Notes

- CORS is enabled globally.
- Unmatched routes return a `404` JSON error; unhandled exceptions return a `500` JSON error.
- The `node_modules1/` folder present in this repo appears to be a stray/duplicate dependency directory — it's not referenced by `package.json` and can likely be safely removed.

## env file
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD="H$1gh#7iD@3"
DB_NAME=db_moderntech
PORT=3000
JWT_SECRET=super_secret_key_123

# Documentation
https://acrobat.adobe.com/id/urn:aaid:sc:EU:852f37c2-b57c-5b23-9c22-472a925abba7

# Figma Link
https://www.figma.com/design/JzYts1PFmtYdwDX9KAb2ZR/Module-1-HR-project?node-id=0-1&t=cTo2VHlarVSw91xw-1
