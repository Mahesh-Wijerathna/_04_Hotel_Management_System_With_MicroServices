from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://auth_user:auth_password@mysql:3306/auth_db"
    JWT_SECRET_KEY: str = "please_change_me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
