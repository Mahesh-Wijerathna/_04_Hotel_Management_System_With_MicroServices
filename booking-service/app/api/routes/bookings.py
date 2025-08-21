from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.booking import BookingCreate, BookingRead
from ...models.booking import Booking, BookingStatus
from typing import List
import jwt
import httpx
from ...core.config import settings
from decimal import Decimal

router = APIRouter()


def decode_jwt(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def require_user(authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    payload = decode_jwt(token)
    return payload


@router.post("/bookings", response_model=BookingRead, status_code=201)
async def create_booking(data: BookingCreate, db: Session = Depends(get_db), payload=Depends(require_user)):
    # fetch service details from hotel-service
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(f"{settings.HOTEL_SERVICE_BASE_URL}/api/v1/services/{data.service_id}")
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail="Service not found")
    svc = r.json()
    unit_price = Decimal(str(svc.get("price")))
    qty = Decimal(data.quantity)
    total = (unit_price * qty).quantize(Decimal("0.01"))

    item = Booking(
        user_id=int(payload.get("sub")),
        service_id=data.service_id,
        quantity=int(data.quantity),
        unit_price=unit_price,
        total_price=total,
        currency=svc.get("currency") or "USD",
        scheduled_for=data.scheduled_for,
        status=BookingStatus.pending,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/bookings/me", response_model=List[BookingRead])
async def list_my_bookings(db: Session = Depends(get_db), payload=Depends(require_user)):
    return db.query(Booking).filter(Booking.user_id == int(payload.get("sub"))).order_by(Booking.created_at.desc()).all()


@router.get("/bookings/{booking_id}", response_model=BookingRead)
async def get_booking(booking_id: int, db: Session = Depends(get_db), payload=Depends(require_user)):
    item = db.query(Booking).get(booking_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    role = payload.get("role")
    if role != "staff" and item.user_id != int(payload.get("sub")):
        raise HTTPException(status_code=403, detail="Forbidden")
    return item


@router.patch("/bookings/{booking_id}/cancel", response_model=BookingRead)
async def cancel_booking(booking_id: int, db: Session = Depends(get_db), payload=Depends(require_user)):
    item = db.query(Booking).get(booking_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    role = payload.get("role")
    if role != "staff" and item.user_id != int(payload.get("sub")):
        raise HTTPException(status_code=403, detail="Forbidden")
    item.status = BookingStatus.cancelled
    db.commit()
    db.refresh(item)
    return item
