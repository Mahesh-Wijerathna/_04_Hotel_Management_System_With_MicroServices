from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.service import ServiceCreate, ServiceRead, ServiceUpdatePrice
from ...models.service import Base, HotelService
from typing import List
import jwt
from fastapi import Header
from ...core.config import settings

router = APIRouter()

# Simple JWT decode using the shared secret; assumes HS256 from auth-service

def decode_jwt(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def require_staff(authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    payload = decode_jwt(token)
    role = payload.get("role")
    if role != "staff":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff only")
    return payload


@router.post("/services", response_model=ServiceRead, status_code=201, dependencies=[Depends(require_staff)])
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    existing = db.query(HotelService).filter_by(service=data.service).first()
    if existing:
        raise HTTPException(status_code=409, detail="Service already exists")
    item = HotelService(service=data.service, price=data.price, currency=data.currency or 'USD')
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/services/{service_id}/price", response_model=ServiceRead, dependencies=[Depends(require_staff)])
def update_price(service_id: int, data: ServiceUpdatePrice, db: Session = Depends(get_db)):
    item = db.query(HotelService).get(service_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    item.price = data.price
    db.commit()
    db.refresh(item)
    return item


@router.get("/services", response_model=List[ServiceRead])
def list_services(db: Session = Depends(get_db)):
    return db.query(HotelService).order_by(HotelService.service.asc()).all()


@router.get("/services/{service_id}", response_model=ServiceRead)
def get_service(service_id: int, db: Session = Depends(get_db)):
    item = db.query(HotelService).get(service_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
