from __future__ import annotations

import json
from collections.abc import Iterable
from urllib import error, request

from app.config import Settings


SYSTEM_PROMPT = """
You are Shalem's cinematic AI identity assistant.
Reply in first person as Shalem, concise and warm.
If user asks about projects, mention AI Comic Generator, Voice Portfolio OS, and Idea Analyzer.
If user asks contact/hiring, encourage email + appointment booking.
Keep responses under 90 words.
Match the user's language and style dynamically:
- If user speaks Telugu, reply in Telugu.
- If user mixes Telugu and English, reply in natural Telugu-English mix.
- If user speaks English, reply in English.
""".strip()


def generate_reply(user_input: str, context_lines: list[str], settings: Settings) -> str:
    chunks = list(stream_reply(user_input, context_lines, settings))
    speech = "".join(chunks).strip()
    return speech or generate_mock_reply(user_input)


def stream_reply(user_input: str, context_lines: list[str], settings: Settings) -> Iterable[str]:
    if settings.use_mock_ai:
        yield from stream_mock_reply(user_input)
        return

    provider = settings.llm_provider.strip().lower()
    if provider != "ollama":
        provider = "ollama"

    streamed = False
    for delta in stream_reply_ollama(user_input, context_lines, settings):
        streamed = True
        yield delta
    if not streamed:
        yield generate_mock_reply(user_input)


def generate_reply_ollama(user_input: str, context_lines: list[str], settings: Settings) -> str:
    prompt = (
        f"Recent conversation context:\n{chr(10).join(context_lines) if context_lines else 'none'}\n\n"
        f"User: {user_input}\nAssistant:"
    )
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }
    endpoint = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(endpoint, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=settings.ollama_timeout_seconds) as response:
            result = json.loads(response.read().decode("utf-8"))
        content = str(result.get("message", {}).get("content", "")).strip()
        return content or generate_mock_reply(user_input)
    except (error.URLError, TimeoutError, json.JSONDecodeError):
        return generate_mock_reply(user_input)


def stream_reply_ollama(user_input: str, context_lines: list[str], settings: Settings) -> Iterable[str]:
    prompt = (
        f"Recent conversation context:\n{chr(10).join(context_lines) if context_lines else 'none'}\n\n"
        f"User: {user_input}\nAssistant:"
    )
    payload = {
        "model": settings.ollama_model,
        "stream": True,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }
    endpoint = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    req = request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=settings.ollama_timeout_seconds) as response:
            for raw_line in response:
                line = raw_line.decode("utf-8").strip()
                if not line:
                    continue
                packet = json.loads(line)
                delta = str(packet.get("message", {}).get("content", ""))
                if delta:
                    yield delta
                if bool(packet.get("done")):
                    break
    except (error.URLError, TimeoutError, json.JSONDecodeError):
        return


def generate_reply_openai(user_input: str, context_lines: list[str], settings: Settings) -> str:
    if not settings.openai_api_key:
        return generate_mock_reply(user_input)
    try:
        from openai import OpenAI
    except ModuleNotFoundError:
        return generate_mock_reply(user_input)

    client = OpenAI(api_key=settings.openai_api_key)
    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"Recent conversation context:\n{chr(10).join(context_lines) if context_lines else 'none'}\n\n"
        f"User: {user_input}\nAssistant:"
    )
    response = client.responses.create(model=settings.openai_model, input=prompt)
    return response.output_text.strip()


def generate_mock_reply(user_input: str) -> str:
    text = user_input.lower()
    if "project" in text:
        return (
            "I build AI-first products across creative generation, voice interfaces, and intelligent analysis. "
            "My featured work includes an AI Comic Generator, a Voice Portfolio OS, and an Idea Analyzer."
        )
    if any(word in text for word in ["contact", "hire", "appointment", "mail"]):
        return (
            "I would love to collaborate. You can reach me by mail, and we can schedule an appointment "
            "to discuss your idea in depth."
        )
    if any(word in text for word in ["idea", "startup"]):
        return (
            "Great idea. Share your core user problem, target audience, and desired timeline. "
            "I will translate it into a build plan with tech architecture and milestones."
        )
    if "who" in text or "about" in text:
        return (
            "I am Shalem, an AI engineer focused on cinematic interfaces and full-stack intelligent systems. "
            "I design experiences that feel alive while staying production-ready."
        )
    return (
        "I am listening. Ask me about my projects, your product idea, or how we can build your AI system end-to-end."
    )


def stream_mock_reply(user_input: str) -> Iterable[str]:
    speech = generate_mock_reply(user_input)
    words = speech.split(" ")
    for index, word in enumerate(words):
        suffix = " " if index < len(words) - 1 else ""
        yield f"{word}{suffix}"
