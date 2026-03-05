'use client'

import React, {
  createContext,
  useCallback,
  useTransition,
  useContext,
} from 'react'
import { useRouter } from 'next/navigation'

type NavigationContextValue = {
  isNavigating: boolean
  navigate: (href: string) => void
  replace: (href: string) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href)
      })
    },
    [router],
  )

  const replace = useCallback(
    (href: string) => {
      startTransition(() => {
        router.replace(href)
      })
    },
    [router],
  )

  return (
    <NavigationContext.Provider
      value={{ isNavigating: isPending, navigate, replace }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext() {
  const ctx = useContext(NavigationContext)
  return ctx
}
