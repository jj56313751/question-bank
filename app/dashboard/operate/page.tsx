import { Suspense } from 'react'
import { Metadata } from 'next'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Index from '@/app/ui/dashboard/operate/index'
import { fetchBanks } from '@/app/api/banks'

export const metadata: Metadata = {
  title: '搜索题目',
}

export default async function Page() {
  const banks = await fetchBanks()
  console.log('[banks]-13', banks)

  return <Index bankList={banks as any[]} />
}
