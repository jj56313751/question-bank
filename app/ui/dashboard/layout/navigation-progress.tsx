'use client'

import { useNavigationContext } from './navigation-context'

export default function NavigationProgress() {
  const ctx = useNavigationContext()
  const isNavigating = ctx?.isNavigating

  if (!ctx || !isNavigating) return null

  return (
    <div
      role="progressbar"
      aria-busy={isNavigating}
      className="navigation-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
        transformOrigin: 'left',
        animation: 'navigation-progress 1.5s ease-in-out infinite',
        zIndex: 9999,
      }}
    />
  )
}
