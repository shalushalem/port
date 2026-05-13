from __future__ import annotations

from pathlib import Path

from app.config import Settings


def transcribe_audio(file_path: Path, settings: Settings) -> str:
    if settings.enable_openai_transcribe and settings.openai_api_key:
        try:
            from openai import OpenAI
        except ModuleNotFoundError:
            return "Voice note received. I can continue in text mode now."

        client = OpenAI(api_key=settings.openai_api_key)
        with file_path.open("rb") as file_handle:
            transcript = client.audio.transcriptions.create(model="whisper-1", file=file_handle)
        return transcript.text

    return "User shared a voice note. Please ask a follow-up clarifying question."
