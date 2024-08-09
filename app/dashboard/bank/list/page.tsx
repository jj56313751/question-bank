import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/search-form'
import { searchItems } from './config'
import ListTable from '@/app/ui/dashboard/bank/list-table'
import { fetchBanks } from '@/app/lib/data'
import { BankList } from '@/app/lib/types'
import BankCreate from '@/app/ui/dashboard/bank/bank-create'
import { auth } from '@/auth'
import { hasFunctionalPermission } from '@/app/lib/checkPermission'

export const metadata: Metadata = {
  title: '题库列表',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    name?: string
    isEnabled?: number
    pageNumber?: number
    pageSize?: number
  }
}) {
  const session: any = await auth()
  // console.log('session', session)
  const canCreate = hasFunctionalPermission(
    session,
    'dashboard_bank_list_create',
  )
  // console.log('[canCreate]-29', canCreate)
  // console.log('[searchParams]-29', searchParams)
  // 获取数据
  const banks: any = await fetchBanks({
    name: searchParams?.name,
    isEnabled: searchParams?.isEnabled,
    pageNumber: searchParams?.pageNumber || 1,
    pageSize: searchParams?.pageSize || 10,
  })
  const dataSource = banks.list as BankList[]
  const total = banks.total
  // console.log('[dataSource]-29', dataSource)

  return (
    <>
      <SearchForm items={searchItems} btns={canCreate && <BankCreate />} />
      <ListTable dataSource={dataSource} total={total} />
    </>
  )
}
