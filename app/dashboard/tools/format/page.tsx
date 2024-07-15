import { Suspense } from 'react'
import { Metadata } from 'next'
import FormatContent from '@/app/ui/dashboard/tools/format/format-content'

export const metadata: Metadata = {
  title: '文档格式化',
}

export default async function Page() {
  return <FormatContent />
}
