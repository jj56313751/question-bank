'use client'
import { useEffect } from 'react'
import { Modal, Form, Input, Select, Switch } from 'antd'
// import { intPassword } from '@/app/lib/constant'
import { PermissionItem } from '@/app/lib/definitions'
import { mapToOptions } from '@/app/lib/utils'
import { permissionTypesMap } from '@/app/lib/constant'

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
  initialValues?: Pick<
    PermissionItem,
    'type' | 'isMenu' | 'name' | 'permission' | 'path' | 'icon' | 'sort'
  >
}) {
  const [form] = Form.useForm()
  const typeValue = Form.useWatch('type', form)
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    padding: '20px 10px',
  }
  useEffect(() => {
    if (initialValues) {
      // console.log('[initialValues]-37', initialValues)
      const data = JSON.parse(JSON.stringify(initialValues))
      data.type = String(data.type)
      form.setFieldsValue(data)
    }
  }, [form, initialValues])

  return (
    <Modal
      title={title + '模块'}
      open={visible}
      onOk={() => handleOk(form)}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form
        {...layout}
        form={form}
        name={'menu-' + title}
        initialValues={{
          isMenu: 1,
        }}
        style={formStyle}
      >
        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '类型必选' }]}
        >
          <Select options={mapToOptions(permissionTypesMap)} />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '名称必填' }]}
        >
          <Input placeholder="例: 快速搜题" />
        </Form.Item>
        <Form.Item
          name="permission"
          label="权限名"
          rules={[{ required: true, message: '权限名必填' }]}
        >
          <Input placeholder="例: dashboard_operate" />
        </Form.Item>
        {typeValue === '1' && (
          <>
            <Form.Item
              name="path"
              label="路由地址"
              rules={[{ required: true, message: '路由地址必填' }]}
            >
              <Input placeholder="例: operate" />
            </Form.Item>
            <Form.Item
              name="icon"
              label="图标"
              extra="图标请参考Ant Design图标库"
            >
              <Input placeholder="例: FileSearchOutlined" />
            </Form.Item>
            <Form.Item name="isMenu" label="在侧边栏中显示">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}
