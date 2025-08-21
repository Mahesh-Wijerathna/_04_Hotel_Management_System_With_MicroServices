from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime

class BookingBase(BaseModel):
    service_id: int
    quantity: int = 1
    scheduled_for: Optional[datetime] = None

class BookingCreate(BookingBase):
    pass

class BookingRead(BookingBase):
    id: int
    user_id: int
    unit_price: condecimal(max_digits=10, decimal_places=2)
    total_price: condecimal(max_digits=10, decimal_places=2)
    currency: str = 'USD'
    status: str

    class Config:
        from_attributes = True
