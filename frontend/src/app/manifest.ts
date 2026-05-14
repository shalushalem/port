import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shalem | AI Digital Consciousness',
    short_name: 'Shalem',
    description:
      'Cinematic AI avatar portfolio with real-time 3D presence and voice-first interaction.',
    start_url: '/',
    display: 'fullscreen',
    background_color: '#050816',
    theme_color: '#050816',
    icons: [
      {
        src: '/avatar/shalem.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

