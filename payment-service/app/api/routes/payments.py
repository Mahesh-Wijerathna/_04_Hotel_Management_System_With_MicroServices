from fastapi import APIRouter, Depends, Header, HTTPException, status, Request
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.payment import PaymentCreate, PaymentRead
from ...models.payment import Payment
from ...core.config import settings
import jwt
import httpx
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


def require_staff(payload = Depends(require_user)):
    if payload.get("role") != "staff":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff only")
    return payload


@router.post("/payments", response_model=PaymentRead, status_code=201)
async def create_payment(
    request: Request,
    data: PaymentCreate,
    db: Session = Depends(get_db),
    payload=Depends(require_user)
):
    # Idempotency
    key = request.headers.get("Idempotency-Key")
    if not key:
        raise HTTPException(status_code=400, detail="Idempotency-Key header required")
    existing = db.query(Payment).filter(Payment.idempotency_key == key).first()
    if existing:
        return existing

    # Fetch booking details from booking-service
    user_id = int(payload.get("sub"))
    # Forward the Authorization header as-is (it already includes 'Bearer <token>')
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(
            f"{settings.BOOKING_SERVICE_URL}/api/v1/bookings/{data.booking_id}",
            headers={"Authorization": auth_header} if auth_header else {},
        )
    if r.status_code != 200:
        # Add more details for debugging
        response_text = r.text if hasattr(r, 'text') else str(r.content)
        raise HTTPException(
            status_code=404, 
            detail=f"Booking fetch failed: {r.status_code} - {response_text[:200]}"
        )
    booking = r.json()
    # If not staff, ensure owner
    role = payload.get("role")
    if role != "staff" and booking.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    amount = Decimal(str(booking.get("total_price")))
    currency = booking.get("currency") or "USD"

    item = Payment(
        booking_id=data.booking_id,
        user_id=user_id,
        amount=amount,
        currency=currency,
        method=data.method,
        status="succeeded",  # MVP: immediately succeed
        idempotency_key=key,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/payments/me", response_model=list[PaymentRead])
async def list_my_payments(db: Session = Depends(get_db), payload=Depends(require_user)):
    return db.query(Payment).filter(Payment.user_id == int(payload.get("sub"))).order_by(Payment.id.desc()).all()


@router.get("/payments/{payment_id}", response_model=PaymentRead)
async def get_payment(payment_id: int, db: Session = Depends(get_db), payload=Depends(require_user)):
    item = db.query(Payment).get(payment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    if payload.get("role") != "staff" and item.user_id != int(payload.get("sub")):
        raise HTTPException(status_code=403, detail="Forbidden")
    return item


@router.post("/payments/{payment_id}/refund", response_model=PaymentRead, dependencies=[Depends(require_staff)])
async def refund_payment(payment_id: int, db: Session = Depends(get_db)):
    item = db.query(Payment).get(payment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    if item.status != "succeeded":
        raise HTTPException(status_code=400, detail="Only succeeded payments can be refunded")
    item.status = "refunded"
    db.commit()
    db.refresh(item)
    return item
