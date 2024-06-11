'use client'
import { useState } from 'react'
import { Steps } from 'antd'

export default function StepsBar() {
  const [current, setCurrent] = useState(0)
  const onChange = (value: number) => {
    // console.log('onChange:', value)
    setCurrent(value)
  }
  const items = [
    {
      title: '第一步',
      description: '选择题库',
    },
    {
      title: '第二步',
      description: '搜索题目',
    },
  ]

  return (
    <div className="mx-auto w-5/6">
      <Steps
        current={current}
        onChange={onChange}
        items={items}
        responsive={false}
      />
    </div>
  )
}
