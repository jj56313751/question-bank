import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文档格式化',
}

export default async function Page() {
  return <main>文档格式化</main>
}
