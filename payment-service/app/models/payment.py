from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Enum, DECIMAL
from datetime import datetime

Base = declarative_base()

class PaymentStatus(str, Enum):
    pending = 'pending'
    succeeded = 'succeeded'
    failed = 'failed'
    refunded = 'refunded'

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, index=True, nullable=False)
    user_id = Column(Integer, index=True, nullable=False)
    amount = Column(DECIMAL(10,2), nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    method = Column(String(32), nullable=False, default='card')
    status = Column(String(16), nullable=False, default='succeeded')
    provider = Column(String(32), nullable=True)
    provider_payment_id = Column(String(128), nullable=True)
    idempotency_key = Column(String(64), nullable=False, unique=True, index=True)
    error_code = Column(String(64), nullable=True)
    error_message = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
