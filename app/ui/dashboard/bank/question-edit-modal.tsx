'use client'
import { mapToOptions } from '@/app/lib/utils'
import { QuestionList } from '@/app/lib/types'
import { questionTypesMap } from '@/app/lib/constant'
import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
const { TextArea } = Input

export default function QuestionEditModal({
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
    QuestionList,
    'type' | 'title' | 'options' | 'answer' | 'analysis'
  >
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
      // console.log('[initialValues]-35', initialValues)
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
      <Form {...layout} form={form} name={'qustion-' + title} style={formStyle}>
        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '类型必选' }]}
        >
          <Select options={mapToOptions(questionTypesMap)} />
        </Form.Item>
        <Form.Item
          name="title"
          label="题干"
          rules={[{ required: true, message: '题干必填' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="options"
          label="选项"
          rules={[{ required: true, message: '选项必填' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="answer"
          label="正确答案"
          rules={[{ required: true, message: '正确答案必填' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="analysis" label="解析">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
