'use client'
import { useState } from 'react'
import { Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const { Search } = Input

export default function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const onSearch: SearchProps['onSearch'] = useDebouncedCallback(
    (value, _e, info) => {
      // console.log(info?.source, value)
      const params = new URLSearchParams(searchParams)
      // console.log('[params]-15', params.toString())
      // params.set('page', '1');
      if (value) {
        params.set('query', value)
      } else {
        params.delete('query')
      }
      replace(`${pathname}?${params.toString()}`)
    },
    300,
  )

  return (
    <Search
      defaultValue={searchParams.get('query')?.toString()}
      placeholder="输入题目关键字"
      size="middle"
      onSearch={onSearch}
      enterButton
    />
  )
}
