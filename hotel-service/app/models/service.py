from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, func, UniqueConstraint

Base = declarative_base()

class HotelService(Base):
    __tablename__ = "services"
    __table_args__ = (
        UniqueConstraint('service', name='uq_service_name'),
    )

    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(255), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
