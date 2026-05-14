export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface BackendChatResponse {
  speech?: string
}

interface StreamPacket {
  type?: string
  request_id?: string
  payload?: Record<string, unknown>
}

export interface AIStreamHandlers {
  onDelta?: (delta: string, fullText: string) => void
  onFinal?: (fullText: string) => void
  onEvents?: (events: unknown[]) => void
  onError?: (message: string) => void
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || 'http://127.0.0.1:8000'
const SESSION_STORAGE_KEY = 'shalem_voice_session_id'

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'web-session-fallback'
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (existing && existing.length >= 3) return existing

  const next = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(SESSION_STORAGE_KEY, next)
  return next
}

async function requestBackendReply(userMessage: string): Promise<string | null> {
  const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: userMessage,
      session_id: getOrCreateSessionId(),
    }),
  })

  if (!response.ok) return null
  const payload = (await response.json()) as BackendChatResponse
  const speech = String(payload.speech ?? '').trim()
  return speech || null
}

function resolveBackendWsUrl() {
  if (!BACKEND_URL.startsWith('http')) return null
  const wsBase = BACKEND_URL.replace(/^http/i, 'ws')
  return `${wsBase.replace(/\/$/, '')}/ws/orchestrate`
}

function createRequestId() {
  return `rq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

async function requestBackendReplyStreaming(
  userMessage: string,
  handlers: AIStreamHandlers,
): Promise<string | null> {
  if (typeof window === 'undefined' || typeof window.WebSocket === 'undefined') {
    return null
  }

  const wsUrl = resolveBackendWsUrl()
  if (!wsUrl) return null

  return new Promise((resolve, reject) => {
    const socket = new window.WebSocket(wsUrl)
    const requestId = createRequestId()
    let fullText = ''
    let settled = false
    const timeoutMs = 35_000
    const timeout = window.setTimeout(() => {
      if (settled) return
      settled = true
      try {
        socket.close()
      } catch {
        // no-op
      }
      reject(new Error('orchestrate_timeout'))
    }, timeoutMs)

    const finish = (value: string | null) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      resolve(value)
    }

    const fail = (message: string) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      handlers.onError?.(message)
      reject(new Error(message))
    }

    socket.onopen = () => {
      const payload = {
        type: 'orchestrate',
        request_id: requestId,
        payload: {
          input: userMessage,
          session_id: getOrCreateSessionId(),
        },
      }
      socket.send(JSON.stringify(payload))
    }

    socket.onmessage = (event) => {
      let packet: StreamPacket
      try {
        packet = JSON.parse(String(event.data))
      } catch {
        return
      }

      if ((packet.request_id ?? '') !== requestId) return
      const payload = packet.payload ?? {}
      const packetType = String(packet.type ?? '')

      if (packetType === 'event_batch') {
        const events = Array.isArray(payload.events) ? payload.events : []
        handlers.onEvents?.(events)
        return
      }

      if (packetType === 'speech_chunk') {
        const delta = String(payload.delta ?? '')
        if (!delta) return
        fullText += delta
        handlers.onDelta?.(delta, fullText)
        return
      }

      if (packetType === 'final') {
        const speech = String(payload.speech ?? fullText).trim()
        handlers.onFinal?.(speech)
        finish(speech || null)
        try {
          socket.close()
        } catch {
          // no-op
        }
        return
      }

      if (packetType === 'error') {
        const message = String(payload.message ?? 'stream_error')
        fail(message)
      }
    }

    socket.onerror = () => {
      fail('stream_socket_error')
    }

    socket.onclose = () => {
      if (settled) return
      finish(fullText.trim() || null)
    }
  })
}

function localFallbackReply(userMessage: string) {
  const msg = userMessage.toLowerCase()

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hey, I'm Shalem. Great to meet you - what would you like to explore?"
  }
  if (msg.includes('who are you') || msg.includes('introduce') || msg.includes('about you')) {
    return "I'm Shalem, an AI engineer and full stack developer. I build intelligent systems and immersive digital experiences."
  }
  if (msg.includes('project') || msg.includes('work') || msg.includes('built')) {
    return "I've built AI-first web products, voice interfaces, and cinematic interaction systems. I can walk you through any project in detail."
  }
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack')) {
    return "My core stack is React, Next.js, TypeScript, Python, Node.js, and AI integration pipelines."
  }
  if (
    msg.includes('hire') ||
    msg.includes('freelance') ||
    msg.includes('available') ||
    msg.includes('work with')
  ) {
    return "I'd love to work with you. Reach out from my contact page and let's schedule a call."
  }
  if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
    return 'You can reach me at hello@shalem.dev, and I usually reply within 24 hours.'
  }
  return 'I am here and listening. Ask me about my projects, your product idea, or how we can build it.'
}

export async function getAIResponse(
  userMessage: string,
  _history: Message[] = [],
): Promise<string> {
  try {
    const backendReply = await requestBackendReply(userMessage)
    if (backendReply) return backendReply
  } catch {
    // Keep a resilient local fallback so voice interaction never feels broken.
  }
  return localFallbackReply(userMessage)
}

export async function streamAIResponse(
  userMessage: string,
  handlers: AIStreamHandlers = {},
): Promise<string> {
  try {
    const streamed = await requestBackendReplyStreaming(userMessage, handlers)
    if (streamed) return streamed
  } catch {
    // Keep a resilient fallback path if stream transport fails.
  }

  const fallback = (await requestBackendReply(userMessage)) ?? localFallbackReply(userMessage)
  handlers.onFinal?.(fallback)
  return fallback
}
