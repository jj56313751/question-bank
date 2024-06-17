'use client'
import { useState, useEffect } from 'react'
import { Steps, message } from 'antd'
import SelectBank from '@/app/ui/dashboard/operate/select-bank'
import SearchBar from '@/app/ui/dashboard/operate/search-bar'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import type { Bank } from '@/app/lib/definitions'

export default function Index({
  bankList,
  query,
  bankId,
}: {
  bankList: Bank[]
  query?: string
  bankId?: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [messageApi, contextHolder] = message.useMessage()

  const [currentSteps, setCurrentSteps] = useState<number>(0)
  const onStepsChange = (value: number) => {
    console.log('onChange:', value)
    if (value === 0) {
      const params = new URLSearchParams(searchParams)
      params.delete('query')
      replace(`${pathname}?${params.toString()}`)
    }
    if (bankValue) {
      setCurrentSteps(value)
    } else {
      messageApi.open({
        type: 'warning',
        content: '请先选择题库',
      })
    }
  }
  useEffect(() => {
    if (query && bankId) {
      setCurrentSteps(1)
    }
  }, [query, bankId])

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

  const [bankValue, setBankValue] = useState<number | undefined>()
  const handleNext = (e: any) => {
    setCurrentSteps(currentSteps + 1)
  }
  const bankChange = (value: number) => {
    // console.log('[value]-48', value)
    setBankValue(value)
  }

  const renderComponent = (currentSteps: number) => {
    switch (currentSteps) {
      case 0:
        return (
          <SelectBank
            bankValue={bankValue}
            bankChange={bankChange}
            next={handleNext}
            bankList={bankList}
          />
        )
      case 1:
        return (
          <>
            <SearchBar />
            {/* <SearchResult query={query} bankId={bankValue as number} /> */}
          </>
        )
      default:
        return
    }
  }

  return (
    <>
      {contextHolder}
      <div className="mx-auto w-5/6">
        <Steps
          current={currentSteps}
          onChange={onStepsChange}
          items={items}
          responsive={false}
        />
      </div>
      <div className="mx-auto mt-2 flex w-11/12 flex-col items-center">
        {renderComponent(currentSteps)}
      </div>
    </>
  )
}
