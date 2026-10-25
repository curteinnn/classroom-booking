# SmartClass Classroom Booking

Web application for account activation and classroom booking.

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS, GSAP
- Backend: Node.js, Express, MySQL (`mysql2`), JWT, bcrypt, Nodemailer
- Dependency managers: npm, with separate manifests in `frontend/` and `backend/`

## Project structure

```text
frontend/src/
  app/            Router and server-verified role guards
  features/       Feature pages, API modules, hooks, and admin UI components
  shared/         HTTP client, session storage, shared layout
  assets/         Images and other static files
  animations/     GSAP page animations
backend/src/
  app.js          Express middleware and mounted routes
  server.js       Backend process entry point
  config/         MySQL connection pool
  controllers/    HTTP request handlers
  routes/         Auth, activation, admin, rooms, and bookings APIs
  utils/          Shared validation helpers
  middleware/     Authentication and admin authorization
  services/       Activation token and email delivery
```

## Run locally

Install dependencies separately in `backend/` and `frontend/` using `npm install`.
Configure the backend environment locally with the database, JWT, application URL,
SMTP, and CORS settings required by the code. Do not commit secret values.
The backend reads `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
`DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `APP_BASE_URL`, `SMTP_HOST`,
`SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and
`CORS_ORIGIN`.
The frontend optionally reads `VITE_API_BASE_URL`; it defaults to the local API
address on port 3000. The backend allows the Vite development origin on port 5173
by default; set `CORS_ORIGIN` to a comma-separated list of trusted origins when
needed.

Start the backend with `npm run dev` from `backend/`, then start the frontend with
`npm run dev` from `frontend/`.

## API routes

- `POST /api/auth/login` — authenticate with `identifier` or email and `password`
- `GET /api/auth/me` — return the current authenticated account
- `POST /api/activation/complete` — complete account activation
- `GET /api/health` — API and database connectivity status
- `/api/admin/users` — create and list users (admin)
- `PATCH /api/admin/users/:id/status` — activate/deactivate a non-admin account (admin)
- `/api/admin/bookings` — list bookings; `PATCH /:id/status` to approve/reject (admin)
- `/api/admin/rooms` — list/create/update/delete rooms and room status (admin)
- `DELETE /api/admin/rooms/:id` — delete a room only if it has no booking history (admin)
- `GET /api/admin/rooms/search/available` — search available rooms (authenticated)
- `GET /api/admin/rooms/:id/schedule` — room schedule (authenticated)
- `GET /api/admin/rooms/search` — search rooms by name (authenticated)
- `POST /api/bookings` — submit a booking (authenticated)
- `GET /api/bookings/my` — list the current user's bookings (authenticated)
- `PATCH /api/bookings/:id/cancel` — cancel the current user's booking (authenticated)

The frontend stores the login token in browser local storage and sends it as a
Bearer token for protected API requests. The backend verifies account status on
each authenticated request.

## Database

The application queries the MySQL tables `users`, `rooms`, `bookings`, and
`account_activation_tokens`. The repository does not currently include schema
migrations; create and maintain the database schema separately.
