from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://hotel_user:hotel_password@mysql:3306/hotel_db"
    JWT_SECRET_KEY: str = "please_change_me"
    JWT_ALGORITHM: str = "HS256"
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
