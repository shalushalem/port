from typing import Any
from pydantic import BaseModel, Field


class CinematicEvent(BaseModel):
    type: str
    payload: dict[str, Any] | None = None


class ChatRequest(BaseModel):
    input: str = Field(min_length=1, max_length=4000)
    session_id: str = Field(min_length=3, max_length=128)


class ChatResponse(BaseModel):
    speech: str
    events: list[CinematicEvent]
    transcript: str | None = None


class LeadRequest(BaseModel):
    session_id: str
    name: str | None = None
    email: str | None = None
    idea_summary: str | None = None
