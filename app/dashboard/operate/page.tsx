import { Suspense } from 'react'
import { Metadata } from 'next'
import OperateContent from '@/app/ui/dashboard/operate/operate-content'
import { fetchAllBanks } from '@/app/lib/data'
import type { Bank } from '@/app/lib/definitions'
import SearchResult from '@/app/ui/dashboard/operate/search-result'

export const metadata: Metadata = {
  title: '搜索题目',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    title?: string
    bankId?: number
  }
}) {
  const banksRes = await fetchAllBanks({
    isEnabled: 1,
  })
  const banks = banksRes as any as Bank[]
  const title = searchParams?.title || ''
  const bankId = searchParams?.bankId || 0
  // const currentPage = Number(searchParams?.page) || 1

  return (
    <>
      <OperateContent
        bankList={JSON.parse(JSON.stringify(banks))}
        title={title}
        bankId={bankId}
      />
      {title ? <SearchResult title={title} bankId={bankId} /> : null}
    </>
  )
}
