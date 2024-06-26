'use client'
import { useState } from 'react'
import { Input, message } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const { Search } = Input

export default function SearchBar() {
  const [messageApi, contextHolder] = message.useMessage()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const onSearch: SearchProps['onSearch'] = useDebouncedCallback(
    (value, _e, info) => {
      const { source } = info
      if (source === 'clear') return
      // console.log(info?.source, value)
      const params = new URLSearchParams(searchParams)
      // console.log('[params]-15', params.toString())
      // params.set('page', '1');
      if (value) {
        params.set('title', value)
      } else {
        params.delete('title')
        messageApi.open({
          type: 'warning',
          content: '请输入题目关键字',
        })
      }
      replace(`${pathname}?${params.toString()}`)
    },
    300,
  )

  return (
    <>
      {contextHolder}
      <Search
        defaultValue={searchParams.get('title')?.toString()}
        placeholder="输入题目关键字"
        size="middle"
        onSearch={onSearch}
        enterButton
        allowClear
      />
    </>
  )
}
