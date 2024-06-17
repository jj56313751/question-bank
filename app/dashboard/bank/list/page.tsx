import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { Flex, Space } from 'antd'
import SearchForm from '@/app/ui/dashboard/bank/search-form'
import { searchItems } from './config'
import ListTable from '@/app/ui/dashboard/bank/list-table'

export const metadata: Metadata = {
  title: '题库列表',
}

export default async function Page() {
  return (
    <Flex gap="middle" vertical>
      <SearchForm items={searchItems} />
      <ListTable dataSource={[]} />
    </Flex>
  )
}
