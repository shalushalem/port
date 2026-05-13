from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any


class StorageService:
    def __init__(self, db_path: str) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._get_connection() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS voice_ideas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    audio_path TEXT NOT NULL,
                    transcript TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS leads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    name TEXT,
                    email TEXT,
                    idea_summary TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

    def save_message(self, session_id: str, role: str, content: str) -> None:
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO conversations (session_id, role, content) VALUES (?, ?, ?)",
                (session_id, role, content),
            )

    def get_recent_messages(self, session_id: str, limit: int = 6) -> list[dict[str, Any]]:
        with self._get_connection() as conn:
            rows = conn.execute(
                """
                SELECT role, content, created_at FROM conversations
                WHERE session_id = ?
                ORDER BY id DESC LIMIT ?
                """,
                (session_id, limit),
            ).fetchall()
        return [dict(row) for row in reversed(rows)]

    def save_voice_idea(self, session_id: str, audio_path: str, transcript: str | None = None) -> None:
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO voice_ideas (session_id, audio_path, transcript) VALUES (?, ?, ?)",
                (session_id, audio_path, transcript),
            )

    def save_lead(self, session_id: str, name: str | None, email: str | None, idea_summary: str | None) -> None:
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO leads (session_id, name, email, idea_summary) VALUES (?, ?, ?, ?)",
                (session_id, name, email, idea_summary),
            )
