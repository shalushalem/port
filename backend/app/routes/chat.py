from fastapi import APIRouter, Request

from app.config import Settings
from app.schemas import ChatRequest, LeadRequest
from app.services.orchestration import run_orchestration
from app.services.storage import StorageService

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message")
def message(payload: ChatRequest, request: Request):
    storage: StorageService = request.app.state.storage
    settings: Settings = request.app.state.settings
    return run_orchestration(payload.input, payload.session_id, storage, settings)


@router.post("/lead")
def save_lead(payload: LeadRequest, request: Request) -> dict[str, str]:
    storage: StorageService = request.app.state.storage
    storage.save_lead(
        session_id=payload.session_id,
        name=payload.name,
        email=payload.email,
        idea_summary=payload.idea_summary,
    )
    return {"status": "saved"}
