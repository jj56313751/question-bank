import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/search-form'
import { searchItems } from './config'
import ListTable from '@/app/ui/dashboard/settings/users/list-table'
import { fetchUsers } from '@/app/lib/data'
import { UserList } from '@/app/lib/types'
import UserCreate from '@/app/ui/dashboard/settings/users/user-create'

export const metadata: Metadata = {
  title: '用户管理',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    name?: string
    email?: string
    isEnabled?: number
    pageNumber?: number
    pageSize?: number
  }
}) {
  // console.log('[searchParams]-29', searchParams)
  // 获取数据
  const users: any = await fetchUsers({
    name: searchParams?.name,
    email: searchParams?.email,
    isEnabled: searchParams?.isEnabled,
    pageNumber: searchParams?.pageNumber || 1,
    pageSize: searchParams?.pageSize || 10,
  })
  const dataSource = users.list as UserList[]
  const total = users.total
  // console.log('[dataSource]-29', dataSource)

  return (
    <>
      <SearchForm items={searchItems} btns={<UserCreate />} />
      <ListTable dataSource={dataSource} total={total} />
    </>
  )
}
