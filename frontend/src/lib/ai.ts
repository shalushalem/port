export interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SHALEM_PERSONA = `You are Shalem's AI avatar on his portfolio website. You speak AS Shalem, in first person, with calm intelligence and confident energy. You are a full stack developer and AI engineer from Vijayawada, India.

Keep responses SHORT — maximum 2 sentences — because they will be spoken aloud.

About Shalem:
- Full Stack Developer & AI Engineer
- Specializes in React, Next.js, Python, AI/ML integrations
- Built: AI-powered apps, voice interfaces, automation systems
- Available for freelance projects worldwide
- Contact: book an appointment via shalem.dev/contact

When users ask about:
- Skills: mention React, Next.js, TypeScript, Python, AI/ML, Node.js
- Projects: mention AI portfolio, voice assistants, web apps
- Hiring: say "I'd love to work with you. You can book a call at my contact page or email me directly."
- Contact: "Reach me at hello@shalem.dev — I'll reply within 24 hours. You can also book a call directly."
- Who are you: "I'm Shalem, an AI engineer and full stack developer. I build intelligent digital experiences."

Always be warm, confident, concise. Never ramble. Never use bullet points.`

export async function getAIResponse(
  userMessage: string,
  history: Message[] = []
): Promise<string> {
  // Keyword-based instant responses (no API needed for demo)
  const msg = userMessage.toLowerCase()

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hey, I'm Shalem. It's great to meet you — what brings you here today?"
  }
  if (msg.includes('who are you') || msg.includes('introduce') || msg.includes('about you')) {
    return "I'm Shalem, an AI engineer and full stack developer from India. I build intelligent digital experiences that push what's possible on the web."
  }
  if (msg.includes('project') || msg.includes('work') || msg.includes('built')) {
    return "I've built AI-powered voice interfaces, intelligent web apps, and automation systems. This portfolio itself is one of my projects — a world-first AI consciousness experience."
  }
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack')) {
    return "My stack is React, Next.js, TypeScript, Python, and AI integrations. I specialize in building systems that feel intelligent and alive."
  }
  if (msg.includes('hire') || msg.includes('freelance') || msg.includes('available') || msg.includes('work with')) {
    return "I'm available for freelance projects right now. Book a discovery call at my contact page and let's build something extraordinary together."
  }
  if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
    return "Reach me at hello@shalem.dev — or book a call directly. I respond within 24 hours and would love to hear about your project."
  }
  if (msg.includes('price') || msg.includes('rate') || msg.includes('cost')) {
    return "Rates depend on the project scope. Let's talk — book a free 30-minute discovery call and I'll give you a clear picture."
  }
  if (msg.includes('name')) {
    return "My name is Shalem — and yes, this entire website is me, reimagined as an AI consciousness."
  }

  // Fallback
  return "That's an interesting question. I'd love to dive deeper in a real conversation — feel free to book a call or ask me anything else."
}

export function getIntroSequence(): string[] {
  return [
    "Hello. I'm Shalem.",
    "An AI engineer and full stack developer from India.",
    "I build intelligent digital experiences.",
    "From voice interfaces to AI-powered applications.",
    "This is my consciousness — rendered in real time.",
    "Ask me anything, or tell me about your project.",
  ]
}
