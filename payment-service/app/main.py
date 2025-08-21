from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import payments

app = FastAPI(title="Payment Service", version="0.1.0")

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

# Mount payment routes at /api/v1 (routes already have /payments prefix)
app.include_router(payments.router, prefix="/api/v1", tags=["payments"])
