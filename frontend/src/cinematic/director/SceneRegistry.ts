import { EmotionalScene, NormalizedAnchor } from '@/cinematic/types'

const anchor = (x: number, y: number): NormalizedAnchor => ({ x, y })

const SCENE_REGISTRY: EmotionalScene[] = [
  {
    id: 'DORMANT',
    durationMs: 5200,
    cameraPresetId: 'deskPan',
    lightingProfileId: 'dormant',
    atmosphereProfileId: 'dormant',
    avatarEmotionId: 'dormant',
    cues: [
      { id: 'dormant-boot-1', atMs: 420, kind: 'boot', text: 'INITIALIZING NEURAL INTERFACE...' },
      { id: 'dormant-boot-2', atMs: 1260, kind: 'boot', text: 'LOADING MEMORY CORE...' },
      { id: 'dormant-boot-3', atMs: 2180, kind: 'boot', text: 'ESTABLISHING CONNECTION...' },
    ],
  },
  {
    id: 'AWARENESS',
    durationMs: 8200,
    cameraPresetId: 'closeUp',
    lightingProfileId: 'awareness',
    atmosphereProfileId: 'awareness',
    avatarEmotionId: 'awareness',
    cues: [
      {
        id: 'awareness-sub-1',
        atMs: 560,
        kind: 'subtitle',
        text: "Hi... I'm Shalem Raju.",
        payload: { cameraPresetId: 'awarenessSplit', splitPortrait: true },
      },
      {
        id: 'awareness-sub-2',
        atMs: 2860,
        kind: 'subtitle',
        text: 'Welcome to my world.',
        payload: { cameraPresetId: 'closeUp', splitPortrait: false },
      },
    ],
  },
  {
    id: 'CONNECTION',
    durationMs: 9000,
    cameraPresetId: 'orbitLeft',
    lightingProfileId: 'connection',
    atmosphereProfileId: 'connection',
    avatarEmotionId: 'connection',
    cues: [
      {
        id: 'connection-sub-1',
        atMs: 580,
        kind: 'subtitle',
        text: 'I build intelligent systems...',
      },
      {
        id: 'connection-vision-1',
        atMs: 1500,
        kind: 'vision',
        payload: {
          label: 'Intelligent systems',
          anchor: anchor(0.76, 0.29),
          mediaSrc: '/projects/ai-app.svg',
        },
      },
      {
        id: 'connection-sub-2',
        atMs: 2480,
        kind: 'subtitle',
        text: 'immersive interfaces...',
        payload: { cameraPresetId: 'mediumShot' },
      },
      {
        id: 'connection-vision-2',
        atMs: 3440,
        kind: 'vision',
        payload: {
          label: 'Immersive interfaces',
          anchor: anchor(0.24, 0.32),
          mediaSrc: '/projects/design-board.svg',
        },
      },
      {
        id: 'connection-sub-3',
        atMs: 4340,
        kind: 'subtitle',
        text: 'and experiences that feel alive.',
      },
      {
        id: 'connection-vision-3',
        atMs: 5380,
        kind: 'vision',
        payload: {
          label: 'Live systems',
          anchor: anchor(0.78, 0.65),
          mediaSrc: '/projects/desk-scene.svg',
        },
      },
    ],
  },
  {
    id: 'MEMORY',
    durationMs: 9800,
    cameraPresetId: 'memoryFocus',
    lightingProfileId: 'memory',
    atmosphereProfileId: 'memory',
    avatarEmotionId: 'memory',
    cues: [
      {
        id: 'memory-sub-1',
        atMs: 640,
        kind: 'subtitle',
        text: 'What started as curiosity...',
      },
      {
        id: 'memory-1',
        atMs: 1480,
        kind: 'memory',
        payload: {
          label: 'Curiosity logs',
          anchor: anchor(0.2, 0.66),
          mediaSrc: '/projects/life-snippet.svg',
        },
      },
      {
        id: 'memory-sub-2',
        atMs: 2320,
        kind: 'subtitle',
        text: 'slowly became obsession.',
      },
      {
        id: 'memory-sub-3',
        atMs: 3900,
        kind: 'subtitle',
        text: 'Late nights... unfinished ideas...',
      },
      {
        id: 'memory-2',
        atMs: 4860,
        kind: 'memory',
        payload: {
          label: 'Unfinished ideas',
          anchor: anchor(0.69, 0.24),
          mediaSrc: '/projects/desk-scene.svg',
        },
      },
      {
        id: 'memory-sub-4',
        atMs: 5940,
        kind: 'subtitle',
        text: 'systems that failed before they finally worked.',
      },
      {
        id: 'memory-3',
        atMs: 7080,
        kind: 'memory',
        payload: {
          label: 'Prototype failures',
          anchor: anchor(0.8, 0.61),
          mediaSrc: '/projects/design-board.svg',
        },
      },
    ],
  },
  {
    id: 'VISION',
    durationMs: 14200,
    cameraPresetId: 'dramaticLowAngle',
    lightingProfileId: 'vision',
    atmosphereProfileId: 'vision',
    avatarEmotionId: 'vision',
    cues: [
      {
        id: 'vision-sub-1',
        atMs: 720,
        kind: 'subtitle',
        text: 'I explored artificial intelligence...',
      },
      {
        id: 'vision-1',
        atMs: 1540,
        kind: 'vision',
        payload: {
          label: 'Artificial intelligence',
          anchor: anchor(0.24, 0.2),
          mediaSrc: '/projects/ai-app.svg',
        },
      },
      {
        id: 'vision-sub-2',
        atMs: 2260,
        kind: 'subtitle',
        text: 'voice systems...',
      },
      {
        id: 'vision-2',
        atMs: 3040,
        kind: 'vision',
        payload: {
          label: 'Voice systems',
          anchor: anchor(0.76, 0.35),
          mediaSrc: '/projects/design-board.svg',
        },
      },
      {
        id: 'vision-sub-3',
        atMs: 3780,
        kind: 'subtitle',
        text: 'cinematic interactions...',
      },
      {
        id: 'vision-sub-4',
        atMs: 5200,
        kind: 'subtitle',
        text: 'and the future of human-computer experiences.',
      },
      {
        id: 'vision-sub-5',
        atMs: 7340,
        kind: 'subtitle',
        text: 'Because I believe...',
      },
      {
        id: 'vision-sub-6',
        atMs: 8660,
        kind: 'subtitle',
        text: "the future of software won't feel like software.",
      },
      {
        id: 'vision-sub-7',
        atMs: 10800,
        kind: 'subtitle',
        text: 'It will feel responsive... emotional... almost human.',
      },
      {
        id: 'vision-3',
        atMs: 12120,
        kind: 'vision',
        payload: {
          label: 'Human-computer future',
          anchor: anchor(0.5, 0.2),
          mediaSrc: '/projects/skyline-future.svg',
          cameraPresetId: 'skylineRise',
        },
      },
    ],
  },
  {
    id: 'INVITATION',
    durationMs: 9800,
    cameraPresetId: 'overShoulder',
    lightingProfileId: 'invitation',
    atmosphereProfileId: 'invitation',
    avatarEmotionId: 'invitation',
    cues: [
      {
        id: 'invitation-sub-1',
        atMs: 660,
        kind: 'subtitle',
        text: 'This portfolio is more than a website.',
      },
      {
        id: 'invitation-sub-2',
        atMs: 2460,
        kind: 'subtitle',
        text: "It's a glimpse into the future I want to build.",
        payload: { cameraPresetId: 'mediumShot' },
      },
      {
        id: 'invitation-sub-3',
        atMs: 4180,
        kind: 'subtitle',
        text: 'So... take a look around.',
      },
      {
        id: 'invitation-pulse',
        atMs: 5180,
        kind: 'invitation',
        payload: {
          label: 'Voice channel online',
          anchor: anchor(0.78, 0.82),
        },
      },
      {
        id: 'invitation-sub-4',
        atMs: 6100,
        kind: 'subtitle',
        text: "Or press the mic... and let's talk.",
      },
      {
        id: 'invitation-sub-5',
        atMs: 7800,
        kind: 'subtitle',
        text: 'This... is only the beginning.',
      },
    ],
  },
]

export function getSceneRegistry() {
  return SCENE_REGISTRY
}

