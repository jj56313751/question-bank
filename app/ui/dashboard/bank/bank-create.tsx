'use client'
import { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import BankEditModal from './bank-edit-modal'
import { createBank } from '@/app/lib/actions'

export default function BankCreate() {
  const [visible, setVisible] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        values.isEnabled = +values.isEnabled
        const err = await createBank(values)
        // console.log('[err]-20', err)
        if (!err) {
          messageApi.success('创建成功')
          setVisible(false)
          form.resetFields()
        } else {
          if (err.code === 'ER_DUP_ENTRY') {
            messageApi.error('题库名称已存在')
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
        新建题库
      </Button>
      <BankEditModal
        title="新建"
        visible={visible}
        handleOk={handleOk}
        handleCancel={() => setVisible(false)}
      />
    </>
  )
}
