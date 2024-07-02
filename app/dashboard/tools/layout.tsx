import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 工具',
    default: '文档格式化',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col">{children}</div>
}
