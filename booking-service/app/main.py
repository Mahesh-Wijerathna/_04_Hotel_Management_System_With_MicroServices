from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import bookings as bookings_router

app = FastAPI(title="Booking Service", version="0.1.0")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bookings_router.router, prefix="/api/v1", tags=["bookings"]) 

@app.get("/health")
def health():
    return {"status": "ok"}
