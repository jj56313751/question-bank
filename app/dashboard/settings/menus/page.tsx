import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { Flex } from 'antd'
import { fetchAllNestedPermissions } from '@/app/lib/data'
import MenuCreate from '@/app/ui/dashboard/settings/menus/menu-create'
import MenuContent from '@/app/ui/dashboard/settings/menus/menu-content'

export const metadata: Metadata = {
  title: '菜单管理',
}

export default async function Page() {
  // console.log('[searchParams]-29', searchParams)
  // 获取数据
  const result = await fetchAllNestedPermissions()
  // console.log('[result]-17', result)

  return (
    <>
      {/* <SearchForm items={searchItems} btns={<UserCreate />} /> */}
      <Flex className="mb-2.5" gap="middle" justify="flex-end" align="center">
        <MenuCreate />
      </Flex>
      <MenuContent nestedPermissions={result} />
    </>
  )
}
