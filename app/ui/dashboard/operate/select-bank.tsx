'use client'
import { Button, Form, Select } from 'antd'
import type { Bank } from '@/app/lib/definitions'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export default function SelectBank({
  bankValue,
  next,
  bankChange,
  bankList,
}: {
  bankValue?: number
  next: any
  bankChange: any
  bankList: Bank[]
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleBankChange = (value: number) => {
    // console.log('[value]-24', value)
    const params = new URLSearchParams(searchParams)
    // console.log('[params]-15', params.toString())
    bankChange(value)

    if (value) {
      params.set('bankId', value.toString())
    } else {
      params.delete('bankId')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const defaultValue =
    searchParams.get('bankId') && Number(searchParams.get('bankId'))

  if (defaultValue) {
    bankChange(defaultValue)
  }

  const handleNext = (e: any) => {
    ;(bankValue || defaultValue) && next()
  }

  const data = bankList.map((item) => {
    return {
      value: item.id,
      label: item.name + '-' + item.description,
    }
  })

  return (
    <Form
      name="form"
      initialValues={{
        Bank: bankValue || defaultValue,
      }}
      style={{ width: '100%' }}
      size="middle"
    >
      <Form.Item
        name="Bank"
        rules={[{ required: true, message: '请选择题库!' }]}
      >
        <Select
          style={{ flex: 1 }}
          onChange={handleBankChange}
          options={data}
          placeholder="选择题库"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={(e) => handleNext(e)}>
          下一步
        </Button>
      </Form.Item>
    </Form>
  )
}
