import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/search-form'
import { searchItems } from './config'
import ListTable from '@/app/ui/dashboard/settings/roles/list-table'
import { fetchRoles } from '@/app/lib/data'
import RoleCreate from '@/app/ui/dashboard/settings/roles/role-create'
import type { Roles } from '@prisma/client'

export const metadata: Metadata = {
  title: '角色管理',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    description?: string
    pageNumber?: number
    pageSize?: number
  }
}) {
  // console.log('[searchParams]-29', searchParams)
  // 获取数据
  const res: any = await fetchRoles({
    description: searchParams?.description,
    pageNumber: searchParams?.pageNumber || 1,
    pageSize: searchParams?.pageSize || 10,
  })
  const dataSource = res.list as Roles[]
  const total = res.total
  // console.log('[dataSource]-29', dataSource)

  return (
    <>
      <SearchForm items={searchItems} btns={<RoleCreate />} />
      <ListTable dataSource={dataSource} total={total} />
    </>
  )
}
