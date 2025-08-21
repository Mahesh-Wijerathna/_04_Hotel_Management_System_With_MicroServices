# Hotel Management Frontend

A minimal Next.js frontend for the microservices stack via the Nginx gateway.

## Configuration

- Env var: `NEXT_PUBLIC_API_BASE` (default http://localhost:8000)

## Run locally

- Using Docker Compose (recommended):

The compose file already includes a `frontend` service. Ensure the stack is up; the frontend will run on http://localhost:3000.

## Pages

- `/login` – authenticate, stores JWT in localStorage
- `/register` – create user (customer/staff)
- `/services` – list and create services (requires staff token for create)
- `/bookings` – list and cancel my bookings
- `/payments` – list and create my payments (requires Idempotency-Key, generated client-side)

Note: This is a simple UI to exercise the APIs.
