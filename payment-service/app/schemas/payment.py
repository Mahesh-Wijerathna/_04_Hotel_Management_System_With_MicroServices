from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    booking_id: int
    amount: condecimal(max_digits=10, decimal_places=2)
    currency: str = 'USD'
    method: str = 'card'

class PaymentCreate(BaseModel):
    booking_id: int
    method: str = 'card'

class PaymentRead(PaymentBase):
    id: int
    user_id: int
    status: str
    provider: Optional[str] = None
    provider_payment_id: Optional[str] = None
    idempotency_key: str
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
