'use client'
import { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import MenuEditModal from './menu-edit-modal'
import { createPermission } from '@/app/lib/actions'

export default function Create() {
  const [visible, setVisible] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        values.isMenu = +values.isMenu
        values.type = +values.type
        const err = await createPermission(values)
        // console.log('[err]-20', err)
        if (!err) {
          messageApi.success('新增成功')
          setVisible(false)
          form.resetFields()
        } else {
          if (err.code === 'P2002') {
            messageApi.error('权限名称已存在')
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
        新增模块
      </Button>
      <MenuEditModal
        title="新建"
        visible={visible}
        handleOk={handleOk}
        handleCancel={() => setVisible(false)}
      />
    </>
  )
}
