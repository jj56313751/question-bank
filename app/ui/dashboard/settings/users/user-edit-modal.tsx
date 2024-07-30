'use client'
import { UserList } from '@/app/lib/types'
import { Modal, Form, Input, Switch } from 'antd'
// import { intPassword } from '@/app/lib/constant'

export default function UserEditModal({
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
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '邮箱必填' },
            { type: 'email', message: '请填写正确的邮箱' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isEnabled" label="状态">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
