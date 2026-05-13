from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.config import get_settings
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router
from app.routes.voice import router as voice_router
from app.schemas import ChatRequest
from app.services.orchestration import (
    finalize_orchestration,
    prepare_orchestration,
    stream_orchestration_reply,
)
from app.services.storage import StorageService
from app.ws.manager import ConnectionManager

settings = get_settings()
app = FastAPI(title="Digital Consciousness Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.settings = settings
app.state.storage = StorageService(settings.sqlite_path)
app.state.ws_manager = ConnectionManager()

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(voice_router)


@app.websocket("/ws/events")
async def websocket_events(websocket: WebSocket) -> None:
    manager: ConnectionManager = app.state.ws_manager
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_json()
            await manager.broadcast({"type": "echo", "payload": message})
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.websocket("/ws/orchestrate")
async def websocket_orchestrate(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            packet = await websocket.receive_json()
            packet_type = str(packet.get("type", ""))
            payload = packet.get("payload") or {}
            request_id = str(packet.get("request_id", ""))

            if packet_type != "orchestrate":
                await websocket.send_json(
                    {
                        "type": "error",
                        "request_id": request_id,
                        "payload": {"message": "Unsupported websocket packet type."},
                    }
                )
                continue

            try:
                chat_request = ChatRequest(
                    input=str(payload.get("input", "")),
                    session_id=str(payload.get("session_id", "")),
                )
            except ValidationError as exc:
                await websocket.send_json(
                    {
                        "type": "error",
                        "request_id": request_id,
                        "payload": {"message": f"Invalid payload: {exc.errors()}"},
                    }
                )
                continue

            storage: StorageService = app.state.storage
            settings = app.state.settings

            context_lines, events = prepare_orchestration(chat_request.input, chat_request.session_id, storage)
            await websocket.send_json(
                {
                    "type": "event_batch",
                    "request_id": request_id,
                    "payload": {"events": [event.model_dump() for event in events]},
                }
            )

            chunks: list[str] = []
            try:
                for delta in stream_orchestration_reply(chat_request.input, context_lines, settings):
                    if not delta:
                        continue
                    chunks.append(delta)
                    await websocket.send_json(
                        {
                            "type": "speech_chunk",
                            "request_id": request_id,
                            "payload": {"delta": delta},
                        }
                    )
            except Exception:
                await websocket.send_json(
                    {
                        "type": "error",
                        "request_id": request_id,
                        "payload": {"message": "Failed while streaming LLM response."},
                    }
                )
                continue

            speech = "".join(chunks).strip() or "I am here with you. Ask me anything."
            finalize_orchestration(chat_request.session_id, speech, storage)

            await websocket.send_json(
                {
                    "type": "final",
                    "request_id": request_id,
                    "payload": {
                        "speech": speech,
                        "events": [event.model_dump() for event in events],
                        "session_id": chat_request.session_id,
                    },
                }
            )
    except WebSocketDisconnect:
        return
