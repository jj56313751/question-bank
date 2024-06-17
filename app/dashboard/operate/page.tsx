import { Suspense } from 'react'
import { Metadata } from 'next'
import OperateContent from '@/app/ui/dashboard/operate/operate-content'
import { fetchBanks } from '@/app/lib/data'
import type { Bank } from '@/app/lib/definitions'
import SearchResult from '@/app/ui/dashboard/operate/search-result'

export const metadata: Metadata = {
  title: '搜索题目',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    bankId?: number
  }
}) {
  const banksRes = await fetchBanks({})
  const banks = (banksRes as any)?.list as Bank[]
  const query = searchParams?.query || ''
  const bankId = searchParams?.bankId || 0
  // const currentPage = Number(searchParams?.page) || 1

  return (
    <>
      <OperateContent
        bankList={JSON.parse(JSON.stringify(banks))}
        query={query}
        bankId={bankId}
      />
      {query ? <SearchResult query={query} bankId={bankId} /> : null}
    </>
  )
}
