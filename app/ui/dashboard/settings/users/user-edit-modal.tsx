'use client'
import { useEffect, useState, useMemo } from 'react'
import { UserList } from '@/app/lib/types'
import { Modal, Form, Input, Switch, Select } from 'antd'

export default function UserEditModal({
  title,
  allRoles,
  visible,
  handleOk,
  handleCancel,
  userId,
  initialValues,
}: {
  title: string
  allRoles: any[]
  visible: boolean
  handleOk: any
  handleCancel: any
  userId?: number
  initialValues?: Pick<UserList, 'name' | 'email' | 'isEnabled'>
}) {
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }
  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    padding: '20px 10px',
  }
  const rolesOptions = useMemo(
    () =>
      allRoles &&
      allRoles.map((item) => {
        return {
          value: item.id,
          label: item.description,
        }
      }),
    [allRoles],
  )
  useEffect(() => {
    const fetchUserRoles = async (userId: number) => {
      const res: any = await fetch(`/api/users/roles?userId=${userId}`)
      // console.log('[res]-34', res)
      const data = await res.json()
      if (data && data.code === 200) {
        form.setFieldsValue({
          roles: data.result.map((item: any) => item.id),
        })
      }
    }
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
    if (userId) {
      // console.log('[userId]-40', userId)
      fetchUserRoles(userId)
    }
  }, [form, initialValues, userId])

  return (
    <Modal
      title={title}
      open={visible}
      onOk={() => handleOk(form)}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form
        {...layout}
        form={form}
        name={'user-' + title}
        initialValues={{
          isEnabled: 1,
        }}
        style={formStyle}
      >
        <Form.Item
          name="name"
          label="用户名"
          rules={[{ required: true, message: '用户名必填' }]}
        >
          <Input disabled={title === '编辑'} />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '邮箱必填' },
            { type: 'email', message: '请填写正确的邮箱' },
          ]}
        >
          <Input disabled={title === '编辑'} />
        </Form.Item>
        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '角色必填' }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={rolesOptions}
          />
        </Form.Item>
        <Form.Item name="isEnabled" label="状态">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
