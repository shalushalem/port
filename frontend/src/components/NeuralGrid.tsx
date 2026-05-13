'use client'

export default function NeuralGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="neural-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="#38bdf8" strokeWidth="0.45" />
          </pattern>
          <radialGradient id="grid-light" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="55%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural-grid)" />
        <rect width="100%" height="100%" fill="url(#grid-light)" />
      </svg>
    </div>
  )
}
