'use client'
import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

const particleOptions: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: false },
    },
    modes: {
      grab: {
        distance: 140,
        links: { opacity: 0.15 },
      },
    },
  },
  particles: {
    color: {
      value: ['#2563eb', '#06b6d4', '#93c5fd'],
    },
    links: {
      color: '#2563eb',
      distance: 160,
      enable: true,
      opacity: 0.06,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'bounce' },
      random: true,
      speed: 0.4,
      straight: false,
    },
    number: {
      density: { enable: true },
      value: 80,
    },
    opacity: {
      value: { min: 0.04, max: 0.25 },
      animation: {
        enable: true,
        speed: 0.8,
        sync: false,
      },
    },
    shape: { type: 'circle' },
    size: {
      value: { min: 1, max: 2.5 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
  },
  detectRetina: true,
}

export default function ParticleField() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {init && (
        <Particles
          id="tsparticles"
          options={particleOptions}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}
