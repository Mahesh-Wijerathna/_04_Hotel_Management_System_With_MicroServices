from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, Enum, func
import enum

Base = declarative_base()

class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    service_id = Column(Integer, nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    scheduled_for = Column(DateTime, nullable=True)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.pending)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
