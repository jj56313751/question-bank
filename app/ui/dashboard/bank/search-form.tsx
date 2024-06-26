'use client'
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Form, Flex, Space, Button, Row, Col, Select, Input } from 'antd'
import { SearchFormItem } from '@/app/lib/types'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchForm({
  items,
  children,
  btns,
}: {
  items: SearchFormItem[]
  children?: React.ReactNode
  btns?: any
}) {
  const searchParams = useSearchParams()
  // console.log('[searchParams]-15', searchParams)
  const pathname = usePathname()
  const { replace } = useRouter()

  const [form] = Form.useForm()
  const [expand, setExpand] = useState(false)
  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    padding: '20px 10px',
  }

  const getFields = () => {
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

  const params = new URLSearchParams(searchParams)

  const onSearch = useDebouncedCallback(() => {
    form
      .validateFields()
      .then((values) => {
        // console.log('[values]-62', values)
        for (const key in values) {
          if (values[key] === undefined || values[key] === '') {
            params.delete(key)
          } else {
            params.set(key, values[key])
          }
        }
        replace(`${pathname}?${params.toString()}`)
      })
      .catch((err) => console.log(err))
  }, 300)

  // init form values
  const entries = params.entries()
  let initialValues: any = {}
  for (const [key, value] of entries) {
    initialValues[key] = value
  }

  const onReset = () => {
    const fields = form.getFieldsValue()
    const emptyFields = Object.keys(fields).reduce((acc: any, key) => {
      acc[key] = undefined
      return acc
    }, {})
    form.setFieldsValue(emptyFields)
  }

  return (
    <Form
      form={form}
      name="advanced_search"
      initialValues={initialValues}
      style={formStyle}
    >
      <Row gutter={24}>{getFields()}</Row>
      <Flex gap="middle" justify="flex-end" align="center">
        <div className="flex-1">{children}</div>
        <Space size="small">
          <Button type="primary" htmlType="submit" onClick={onSearch}>
            搜索
          </Button>
          <Button onClick={onReset}>清空</Button>
          {btns}
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
      </Flex>
    </Form>
  )
}
