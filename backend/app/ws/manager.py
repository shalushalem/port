from __future__ import annotations

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, message: dict) -> None:
        for connection in list(self.connections):
            await connection.send_json(message)
