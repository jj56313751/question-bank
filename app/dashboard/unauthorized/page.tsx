import { Metadata } from 'next'
import Content from '@/app/ui/dashboard/unauthorized/content'

export const metadata: Metadata = {
  title: '该页面不存在或您无权访问',
}

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <Content />
    </main>
  )
}
