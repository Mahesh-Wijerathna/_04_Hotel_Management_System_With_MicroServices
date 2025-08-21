from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://booking_user:booking_password@booking-mysql:3306/booking_db"
    JWT_SECRET_KEY: str = "please_change_me"
    JWT_ALGORITHM: str = "HS256"
    HOTEL_SERVICE_BASE_URL: str = "http://hotel-service:8002"
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
