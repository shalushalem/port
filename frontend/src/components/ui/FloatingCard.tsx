'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  icon: string
  year: string
  status: 'Live' | 'Beta' | 'Building'
}

interface FloatingCardProps {
  project: Project
  index: number
  position: 'left' | 'right'
}

export default function FloatingCard({ project, index, position }: FloatingCardProps) {
  const [hovered, setHovered] = useState(false)

  const statusColor = {
    'Live': '#06b6d4',
    'Beta': '#2563eb',
    'Building': '#8b5cf6',
  }[project.status]

  return (
    <motion.div
      className="holo-card glass rounded-2xl p-5 cursor-none"
      style={{
        width: '220px',
        boxShadow: hovered
          ? '0 0 30px rgba(6,182,212,0.08), 0 20px 60px rgba(0,0,0,0.4)'
          : '0 8px 40px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0, x: position === 'left' ? -40 : 40, y: 20 }}
      animate={{
        opacity: 1,
        x: 0,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { delay: 3 + index * 0.2, duration: 1 },
        x: { delay: 3 + index * 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] },
        y: {
          duration: 4 + index * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.8,
        },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${statusColor}40, transparent)`,
        }}
        animate={{ opacity: hovered ? 1 : 0.4 }}
      />

      {/* Icon + status */}
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: '22px' }}>{project.icon}</span>
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full"
            style={{
              width: '5px',
              height: '5px',
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }}
          />
          <span
            style={{
              fontSize: '9px',
              color: statusColor,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-1.5 leading-tight"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'rgba(219,234,254,0.95)',
          letterSpacing: '-0.01em',
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="mb-3 leading-relaxed"
        style={{
          fontSize: '11px',
          color: 'rgba(147,197,253,0.55)',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full"
            style={{
              fontSize: '9px',
              color: 'rgba(96,165,250,0.6)',
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.15)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Year */}
      <p
        className="mt-3"
        style={{
          fontSize: '9px',
          color: 'rgba(96,165,250,0.25)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.15em',
        }}
      >
        {project.year}
      </p>
    </motion.div>
  )
}
