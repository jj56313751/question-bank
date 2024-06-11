import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '操作台',
}

export default async function Page() {
  return <main>operate</main>
}
