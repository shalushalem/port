'use client'

import { useEffect } from 'react'

type FullscreenElementWithVendor = HTMLElement & {
  requestFullscreen?: (options?: { navigationUI?: 'auto' | 'hide' | 'show' }) => Promise<void> | void
  webkitRequestFullscreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

type FullscreenDocumentWithVendor = Document & {
  webkitFullscreenElement?: Element | null
  msFullscreenElement?: Element | null
}

function isInFullscreen(doc: FullscreenDocumentWithVendor) {
  return Boolean(
    doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement,
  )
}

async function requestFullscreen(root: FullscreenElementWithVendor) {
  if (root.requestFullscreen) {
    await root.requestFullscreen({ navigationUI: 'hide' })
    return
  }
  if (root.webkitRequestFullscreen) {
    await root.webkitRequestFullscreen()
    return
  }
  if (root.msRequestFullscreen) {
    await root.msRequestFullscreen()
  }
}

export function useImmersiveFullscreen() {
  useEffect(() => {
    const root = document.documentElement as FullscreenElementWithVendor
    const doc = document as FullscreenDocumentWithVendor

    let detached = false

    const tryEnterFullscreen = async () => {
      if (detached || isInFullscreen(doc)) return true
      try {
        await requestFullscreen(root)
        return true
      } catch {
        return false
      }
    }

    const hideAddressBar = () => {
      window.setTimeout(() => {
        window.scrollTo(0, 1)
      }, 0)
    }

    const retryAttempts = 8
    let attempts = 0

    const retryTimer = window.setInterval(() => {
      if (detached || isInFullscreen(doc) || attempts >= retryAttempts) {
        window.clearInterval(retryTimer)
        return
      }
      attempts += 1
      void tryEnterFullscreen()
    }, 450)

    const onVisibilityOrFocus = () => {
      void tryEnterFullscreen()
      hideAddressBar()
    }

    void tryEnterFullscreen()
    hideAddressBar()
    window.addEventListener('focus', onVisibilityOrFocus)
    document.addEventListener('visibilitychange', onVisibilityOrFocus)

    return () => {
      detached = true
      window.clearInterval(retryTimer)
      window.removeEventListener('focus', onVisibilityOrFocus)
      document.removeEventListener('visibilitychange', onVisibilityOrFocus)
    }
  }, [])
}
