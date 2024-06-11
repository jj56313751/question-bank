import React from 'react'
import { Metadata } from 'next'
import Index from '@/app/ui/dashboard/index'

export const metadata: Metadata = {
  title: {
    template: '%s | 控制台',
    default: '控制台',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Index>{children}</Index>
}
