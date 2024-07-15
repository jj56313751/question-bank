import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 设置',
    default: '系统设置',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col">{children}</div>
}
