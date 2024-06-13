'use client'
import { useState } from 'react'
import { Button, Form, Select } from 'antd'

export default function SelectBank({
  bankValue,
  next,
  bankChange,
  bankList,
}: {
  bankValue?: string
  next: any
  bankChange: any
  bankList: any[]
}) {
  const handleBankChange = (value: string) => {
    bankChange(value)
  }

  const handleNext = (e: any) => {
    bankValue && next()
  }

  const data = bankList.map((item) => {
    return {
      value: item.id,
      label: item.name + '-' + item.description,
    }
  })

  return (
    <Form name="form" style={{ width: '100%' }} size="middle">
      <Form.Item
        name="Bank"
        rules={[{ required: true, message: '请选择题库!' }]}
      >
        <Select
          defaultValue={bankValue}
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
