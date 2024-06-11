'use client'
import { Suspense, useState } from 'react'
import { Steps, message } from 'antd'
// // import { Metadata } from 'next'
// import StepsBar from '@/app/ui/dashboard/operate/steps-bar'
import SelectBank from '@/app/ui/dashboard/operate/select-bank'
import SearchContent from '@/app/ui/dashboard/operate/search-content'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

// export const metadata: Metadata = {
//   title: '操作台',
// }

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage()

  const [currentSteps, setCurrentSteps] = useState<number>(0)
  const onStepsChange = (value: number) => {
    // console.log('onChange:', value)
    if (bankValue) {
      setCurrentSteps(value)
    } else {
      messageApi.open({
        type: 'warning',
        content: '请先选择题库',
      })
    }
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

  const [bankValue, setBankValue] = useState<string | undefined>()
  const handleNext = (e: any) => {
    setCurrentSteps(currentSteps + 1)
  }
  const bankChange = (value: string) => {
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
          />
        )
      case 1:
        return <SearchContent />
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
