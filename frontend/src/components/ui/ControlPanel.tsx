'use client'
import { FormEvent } from 'react'
import { Loader2, Send, Terminal } from 'lucide-react'
import { AvatarState } from '@/lib/constants'
import VoiceOrb from '@/components/ui/VoiceOrb'

interface ControlPanelProps {
  state: AvatarState
  commandInput: string
  isTyping: boolean
  onCommandChange: (value: string) => void
  onSubmitCommand: (command: string) => void
  onVoiceToggle: () => void
}

export default function ControlPanel({
  state,
  commandInput,
  isTyping,
  onCommandChange,
  onSubmitCommand,
  onVoiceToggle,
}: ControlPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commandInput.trim()) return
    onSubmitCommand(commandInput)
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-[min(960px,95vw)] -translate-x-1/2">
      <div className="rounded-3xl border border-cyan-300/30 bg-slate-950/66 px-3 py-2.5 backdrop-blur-2xl shadow-[0_16px_80px_rgba(2,6,23,0.65)] md:px-4 md:py-3">
        <div className="flex items-center gap-3">
          <VoiceOrb state={state} onToggle={onVoiceToggle} />

          <form className="flex min-w-0 flex-1 items-center gap-2" onSubmit={handleSubmit}>
            <div className="relative flex-1">
              <Terminal
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/45"
              />
              <input
                value={commandInput}
                onChange={(event) => onCommandChange(event.target.value)}
                placeholder="Enter a command for the AI consciousness..."
                className="h-11 w-full rounded-2xl border border-cyan-300/25 bg-slate-900/62 pl-9 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-blue-100/35 focus:border-cyan-200/70 focus:bg-slate-900/82"
              />
            </div>

            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-2xl border border-cyan-200/35 bg-cyan-400/14 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-300/22"
            >
              {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Run
            </button>
          </form>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-blue-100/40">
            {state === AvatarState.THINKING
              ? 'Processing command'
              : state === AvatarState.TALKING
                ? 'Response stream active'
                : state === AvatarState.LISTENING
                  ? 'Voice capture active'
                  : 'System idle'}
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/35">
            {isTyping ? 'Typing indicator active' : 'Type or use voice'}
          </p>
        </div>
      </div>
    </div>
  )
}
