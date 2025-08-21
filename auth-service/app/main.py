from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import auth
# ORM models/engine are available via app package if needed by tooling

app = FastAPI(title="Auth Service", version="0.1.0")

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tables are created via MySQL init.sql; ORM metadata is available for tooling.

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"]) 

@app.get("/health")
def health_check():
    return {"status": "ok"}
