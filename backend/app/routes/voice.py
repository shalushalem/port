from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, Form, Request, UploadFile

from app.config import Settings
from app.services.speech import transcribe_audio
from app.services.storage import StorageService

router = APIRouter(prefix="/api/voice", tags=["voice"])


def _write_upload(upload: UploadFile, directory: Path) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    suffix = Path(upload.filename or ".webm").suffix or ".webm"
    path = directory / f"{uuid4().hex}{suffix}"
    with path.open("wb") as file_handle:
        file_handle.write(upload.file.read())
    return path


@router.post("/record")
def record_voice(
    request: Request,
    file: UploadFile = File(...),
    session_id: str = Form(...),
) -> dict[str, str]:
    storage: StorageService = request.app.state.storage
    settings: Settings = request.app.state.settings
    audio_dir = Path(settings.sqlite_path).resolve().parent / "audio"
    saved_path = _write_upload(file, audio_dir)
    storage.save_voice_idea(session_id=session_id, audio_path=str(saved_path))
    return {"file_url": str(saved_path)}


@router.post("/transcribe")
def transcribe_voice(
    request: Request,
    file: UploadFile = File(...),
    session_id: str = Form(...),
) -> dict[str, str]:
    storage: StorageService = request.app.state.storage
    settings: Settings = request.app.state.settings
    audio_dir = Path(settings.sqlite_path).resolve().parent / "audio"
    saved_path = _write_upload(file, audio_dir)
    transcript = transcribe_audio(saved_path, settings=settings)
    storage.save_voice_idea(session_id=session_id, audio_path=str(saved_path), transcript=transcript)
    return {"transcript": transcript}
