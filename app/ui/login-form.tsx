'use client'
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { authenticate } from '@/app/lib/actions'

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm()
  const handleLogin = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        const err = await authenticate(values)
        // console.log('[err]-20', err)
        if (err) {
          messageApi.error('邮箱或者密码错误')
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  return (
    // <form className="space-y-3">
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      {contextHolder}
      <h1 className={`mb-3 text-2xl`}>请登录</h1>
      <Form
        className="w-full"
        name="form"
        form={form}
        style={{ maxWidth: 600 }}
        layout="vertical"
      >
        <Form.Item
          label="账号/邮箱"
          name="name"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入账号或邮箱' }]}
        >
          <Input placeholder="请输入账号或邮箱" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" prefix={<KeyOutlined />} />
        </Form.Item>
      </Form>
      <LoginButton onLogin={handleLogin} />
      <div className="flex h-8 items-end space-x-1">
        {/* Add form errors here */}
      </div>
    </div>
    // </form>
  )
}

function LoginButton({ onLogin }: { onLogin: any }) {
  return (
    <Button className="mt-4 w-full" type="primary" onClick={onLogin}>
      登录
    </Button>
  )
}
