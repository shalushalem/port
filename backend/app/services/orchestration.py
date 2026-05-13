from __future__ import annotations

from collections.abc import Iterable

from app.config import Settings
from app.schemas import ChatResponse, CinematicEvent
from app.services.ai_engine import stream_reply
from app.services.event_engine import generate_events
from app.services.storage import StorageService


def run_orchestration(input_text: str, session_id: str, storage: StorageService, settings: Settings) -> ChatResponse:
    context_lines, events = prepare_orchestration(input_text, session_id, storage)
    speech = "".join(stream_reply(input_text, context_lines=context_lines, settings=settings)).strip()
    if not speech:
        speech = "I am here with you. Tell me what you want to explore next."

    finalize_orchestration(session_id, speech, storage)

    return ChatResponse(speech=speech, events=events)


def prepare_orchestration(
    input_text: str, session_id: str, storage: StorageService
) -> tuple[list[str], list[CinematicEvent]]:
    history = storage.get_recent_messages(session_id, limit=6)
    context_lines = [f"{item['role']}: {item['content']}" for item in history]
    events = generate_events(input_text)
    storage.save_message(session_id, "user", input_text)
    return context_lines, events


def stream_orchestration_reply(
    input_text: str, context_lines: list[str], settings: Settings
) -> Iterable[str]:
    yield from stream_reply(input_text, context_lines=context_lines, settings=settings)


def finalize_orchestration(session_id: str, speech: str, storage: StorageService) -> None:
    storage.save_message(session_id, "assistant", speech)
