'use client'
import { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
const { TextArea } = Input

export default function BankEditModal({
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
  initialValues?: {
    id?: number
    name: string
    description: string
  }
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
      console.log('[initialValues]-35', initialValues)
      form.setFieldsValue(initialValues) // reset int value
    }
  }, [initialValues, form])

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
        name="bank-edit"
        initialValues={initialValues}
        style={formStyle}
      >
        <Form.Item
          name="name"
          label="题库名称"
          rules={[{ required: true, message: '题库名称必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}