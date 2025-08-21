from pydantic import BaseModel, condecimal
from typing import Optional

class ServiceBase(BaseModel):
    service: str
    price: condecimal(max_digits=10, decimal_places=2)
    currency: Optional[str] = 'USD'

class ServiceCreate(ServiceBase):
    pass

class ServiceRead(ServiceBase):
    id: int

    class Config:
        from_attributes = True

class ServiceUpdatePrice(BaseModel):
    price: condecimal(max_digits=10, decimal_places=2)
