from __future__ import annotations

from app.config import Settings
from app.schemas import ChatResponse
from app.services.ai_engine import generate_reply
from app.services.event_engine import generate_events
from app.services.storage import StorageService


def run_orchestration(input_text: str, session_id: str, storage: StorageService, settings: Settings) -> ChatResponse:
    history = storage.get_recent_messages(session_id, limit=6)
    context_lines = [f"{item['role']}: {item['content']}" for item in history]
    speech = generate_reply(input_text, context_lines=context_lines, settings=settings)
    events = generate_events(input_text)

    storage.save_message(session_id, "user", input_text)
    storage.save_message(session_id, "assistant", speech)

    return ChatResponse(speech=speech, events=events)
