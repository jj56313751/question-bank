'use client'
import { useEffect } from 'react'
import { Modal, Form, Input, Switch } from 'antd'
import type { Roles } from '@prisma/client'

export default function EditModal({
  title,
  visible,
  handleOk,
  handleCancel,
  initialValues,
}: {
  title: string
  visible: boolean
  handleOk: any
  handleCancel: any
  initialValues?: Pick<Roles, 'name' | 'description' | 'isEnabled'>
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
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [form, initialValues])

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
        name={'role-' + title}
        initialValues={{
          isEnabled: 1,
        }}
        style={formStyle}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '角色名称必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="角色描述"
          rules={[{ required: true, message: '角色描述必填' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item name="isEnabled" label="状态">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
