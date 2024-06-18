import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 题库管理',
    default: '题库列表',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
