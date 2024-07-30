'use client'
import { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import RoleEditModal from './role-edit-modal'
import { createRole } from '@/app/lib/actions'

export default function UserCreate() {
  const [visible, setVisible] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        console.log('[values]-18', values)
        // TODO: default enabled
        values.isEnabled = 1
        const err = await createRole(values)
        // console.log('[err]-20', err)
        if (!err) {
          messageApi.success('新增成功')
          setVisible(false)
          form.resetFields()
        } else {
          if (err.code === 'P2002') {
            messageApi.error('角色名称已存在')
          } else {
            messageApi.error(err.message)
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        新增角色
      </Button>
      <RoleEditModal
        title="新增"
        visible={visible}
        handleOk={handleOk}
        handleCancel={() => setVisible(false)}
      />
    </>
  )
}
