from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.user import UserCreate, UserRead, Token
from ...crud import user as crud_user
from ...core.security import create_access_token, decode_token
from ...models.user import User

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = crud_user.get_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    created = crud_user.create(db, email=payload.email, password=payload.password, full_name=payload.full_name, role=payload.role)
    return created

@router.post("/login", response_model=Token)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = crud_user.authenticate(db, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": token, "token_type": "bearer", "role": user.role}

@router.get("/verify", response_model=UserRead)
def verify(token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
