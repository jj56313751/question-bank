'use client'

import { NavigationProvider } from './navigation-context'
import NavigationProgress from './navigation-progress'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationProvider>
      <NavigationProgress />
      {children}
    </NavigationProvider>
  )
}
