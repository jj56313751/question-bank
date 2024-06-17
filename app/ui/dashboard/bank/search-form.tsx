'use client'
import React, { useState } from 'react'
import { Metadata } from 'next'
import { DownOutlined } from '@ant-design/icons'
import { Form, Space, Button, Row, Col, Select, Input } from 'antd'
import { SearchFormItem } from '@/app/lib/types'

export const metadata: Metadata = {
  title: '题库列表',
}

export default function SearchForm({ items }: { items: SearchFormItem[] }) {
  const [form] = Form.useForm()
  const [expand, setExpand] = useState(false)
  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    padding: 24,
  }

  const getFields = () => {
    console.log('items', items)
    const count = expand ? items.length : Math.min(items.length, 3)
    const children: any[] = []
    for (let i = 0; i < count; i++) {
      const item = items[i]
      children.push(
        <Col span={8} key={i}>
          {item.type === 'select' ? (
            <Form.Item {...item.formItemProps}>
              <Select {...item.props} />
            </Form.Item>
          ) : (
            <Form.Item {...item.formItemProps}>
              <Input {...item.props} />
            </Form.Item>
          )}
        </Col>,
      )
    }

    return children
  }

  return (
    <Form form={form} name="advanced_search" style={formStyle}>
      <Row gutter={24}>{getFields()}</Row>
      <div style={{ textAlign: 'right' }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            onClick={() => {
              form.resetFields()
            }}
          >
            清空
          </Button>
          {items.length > 3 && (
            <a
              style={{ fontSize: 12 }}
              onClick={() => {
                setExpand(!expand)
              }}
            >
              <DownOutlined rotate={expand ? 180 : 0} /> Collapse
            </a>
          )}
        </Space>
      </div>
    </Form>
  )
}
