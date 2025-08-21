from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://payment_user:payment_password@payment-mysql:3306/payment_db"
    JWT_SECRET_KEY: str = "please_change_me"
    JWT_ALGORITHM: str = "HS256"
    BOOKING_SERVICE_URL: str = "http://booking-service:8003"
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
