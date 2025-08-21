# Hotel Service

Simple microservice to manage hotel services and prices.

## Endpoints
- POST /api/v1/services (staff): create a service
- PATCH /api/v1/services/{id}/price (staff): update price
- GET /api/v1/services: list
- GET /api/v1/services/{id}: get one

Auth: provide Bearer JWT from auth-service; role must be `staff` for write.

Env uses `DATABASE_URL` pointing to the shared MySQL (same as auth-service).
