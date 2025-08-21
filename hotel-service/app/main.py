from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import services as services_router
from .models.service import Base
from .db.session import engine

app = FastAPI(title="Hotel Service", version="0.1.0")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tables are created via MySQL init.sql for hotel-service.

app.include_router(services_router.router, prefix="/api/v1", tags=["hotel-services"]) 

@app.get("/health")
def health():
    return {"status": "ok"}
