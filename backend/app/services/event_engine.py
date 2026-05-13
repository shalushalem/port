from __future__ import annotations

from app.schemas import CinematicEvent


def generate_events(user_input: str) -> list[CinematicEvent]:
    text = user_input.lower()
    events: list[CinematicEvent] = [CinematicEvent(type="AVATAR_GLOW", payload={"intensity": 0.8})]

    if any(word in text for word in ["project", "portfolio", "work"]):
        events.extend(
            [
                CinematicEvent(type="SCENE_TRANSITION", payload={"scene": "projects"}),
                CinematicEvent(type="BACKGROUND_CHANGE", payload={"theme": "cyber"}),
                CinematicEvent(type="HIGHLIGHT_PROJECT", payload={"project": infer_project(text)}),
            ]
        )

    if any(word in text for word in ["contact", "hire", "mail", "appointment", "call"]):
        events.extend(
            [
                CinematicEvent(type="SCENE_TRANSITION", payload={"scene": "contact"}),
                CinematicEvent(type="BACKGROUND_CHANGE", payload={"theme": "contact"}),
                CinematicEvent(type="CONTACT_INTENT", payload={"channel": "email"}),
            ]
        )

    if any(word in text for word in ["who are you", "about you", "introduce"]):
        events.append(CinematicEvent(type="SCENE_TRANSITION", payload={"scene": "intro"}))

    if any(word in text for word in ["idea", "startup", "build this", "product"]):
        events.extend(
            [
                CinematicEvent(type="SCENE_TRANSITION", payload={"scene": "ai-room"}),
                CinematicEvent(type="BACKGROUND_CHANGE", payload={"theme": "neural"}),
            ]
        )

    return events


def infer_project(text: str) -> str:
    if "comic" in text:
        return "comic_ai"
    if "voice" in text:
        return "voice_os"
    if "idea" in text:
        return "idea_engine"
    return "voice_os"
