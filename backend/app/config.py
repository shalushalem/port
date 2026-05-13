from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    llm_provider: str = "ollama"
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3.1:8b"
    ollama_timeout_seconds: int = 90
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    use_mock_ai: bool = True
    enable_openai_transcribe: bool = False
    frontend_origin: str = "http://localhost:3000"
    sqlite_path: str = "./storage/portfolio.db"
    mail_to: str = "shalem@example.com"
    calendly_url: str = "https://calendly.com/"


@lru_cache
def get_settings() -> Settings:
    return Settings()
