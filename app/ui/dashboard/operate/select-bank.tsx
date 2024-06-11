'use client'
import { useState } from 'react'
import { Button, Form, Select } from 'antd'

export default function SelectBank({
  bankValue,
  next,
  bankChange,
}: {
  bankValue?: string
  next: any
  bankChange: any
}) {
  const handleBankChange = (value: string) => {
    bankChange(value)
  }

  const handleNext = (e: any) => {
    bankValue && next()
  }

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
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
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
