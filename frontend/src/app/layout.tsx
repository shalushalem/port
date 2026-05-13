import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shalem | AI Digital Consciousness',
  description: 'AI engineer and full stack developer from Vijayawada, India. A cinematic digital consciousness experience with voice interaction.',
  keywords: [
    'AI Engineer', 'Full Stack Developer', 'Freelancer India',
    'React Developer', 'Next.js Developer', 'Machine Learning',
    'Vijayawada Developer', 'Hire AI Developer', 'Portfolio'
  ],
  authors: [{ name: 'Shalem' }],
  openGraph: {
    title: 'Shalem | AI Digital Consciousness',
    description: 'Cinematic AI avatar portfolio with real-time 3D presence and voice-first interaction.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shalem | AI Engineer',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Shalem",
              "jobTitle": "AI Engineer & Full Stack Developer",
              "description": "Freelance AI Engineer building intelligent digital experiences",
              "url": "https://shalem.dev",
              "sameAs": [],
              "knowsAbout": ["Artificial Intelligence", "React", "Next.js", "Machine Learning", "Full Stack Development"]
            })
          }}
        />
      </head>
      <body className="bg-neural-chamber">
        {children}
      </body>
    </html>
  )
}
