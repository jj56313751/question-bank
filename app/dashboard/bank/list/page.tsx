import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/bank/search-form'
import { searchItems } from './config'
import ListTable from '@/app/ui/dashboard/bank/list-table'
import { fetchBanks } from '@/app/lib/data'
import { BankList } from '@/app/lib/types'
import BankCreate from '@/app/ui/dashboard/bank/bank-create'

export const metadata: Metadata = {
  title: '题库列表',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    name?: string
    pageNumber?: number
    pageSize?: number
  }
}) {
  const banks: any = await fetchBanks({
    name: searchParams?.name,
    pageNumber: searchParams?.pageNumber,
    pageSize: searchParams?.pageSize,
  })
  const dataSource = banks.list as BankList[]
  const total = banks.total
  // console.log('[dataSource]-29', dataSource)

  return (
    <>
      <SearchForm items={searchItems} btns={<BankCreate />} />
      <ListTable dataSource={dataSource} total={total} />
    </>
  )
}
