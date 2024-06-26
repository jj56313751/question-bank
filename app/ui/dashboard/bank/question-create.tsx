'use client'
import { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import QuestionEditModal from './question-edit-modal'
import { createQuestion } from '@/app/lib/actions'

export default function BankCreate({ bankId }: { bankId: number }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        console.log('[values]-18', values)
        values.type = Number(values.type)
        const err = await createQuestion(
          Object.assign(values, { bankId: Number(bankId) }),
        )
        console.log('[err]-20', err)
        if (!err) {
          messageApi.success('新建成功')
          setVisible(false)
          form.resetFields()
        } else {
          messageApi.error(err.message)
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
        新建题目
      </Button>
      <QuestionEditModal
        title="新建"
        visible={visible}
        handleOk={handleOk}
        handleCancel={() => setVisible(false)}
      />
    </>
  )
}
