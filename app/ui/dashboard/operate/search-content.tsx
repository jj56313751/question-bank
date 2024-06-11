'use client'
import { useState } from 'react'
import { Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'

const { Search } = Input

export default function StepsBar() {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value)

  return (
    <>
      <Search
        placeholder="输入题目关键字"
        size="middle"
        onSearch={onSearch}
        enterButton
      />
    </>
  )
}
