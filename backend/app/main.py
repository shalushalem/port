from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router
from app.routes.voice import router as voice_router
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
