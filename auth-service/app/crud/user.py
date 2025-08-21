from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models.user import User
from ..core.security import get_password_hash, verify_password


def get_by_email(db: Session, email: str) -> User | None:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def create(db: Session, email: str, password: str, full_name: str | None = None, role: str | None = None) -> User:
    user = User(email=email, hashed_password=get_password_hash(password), full_name=full_name, role=role or "customer")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, email: str, password: str) -> User | None:
    user = get_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
