'use client'
import React, { useState } from 'react'
import { Modal, Button, Upload, message, Flex, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { fileTypeMap } from '@/app/lib/constant'

const { json } = fileTypeMap
const supportTypes = '.json'

export default function QuestionEditModal({
  visible,
  onUpload,
  handleCancel,
}: {
  visible: boolean
  onUpload: any
  handleCancel: any
}) {
  const [messageApi, contextHolder] = message.useMessage()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const maxCount = 1

  const props: UploadProps = {
    name: 'file',
    maxCount,
    accept: supportTypes,
    multiple: false,
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      if (![json].includes(file.type)) {
        messageApi.open({
          type: 'error',
          content: `仅限上传${supportTypes.split(',').join('、')}文件`,
        })
        return Upload.LIST_IGNORE
      }
      if (fileList.length >= maxCount) {
        messageApi.open({
          type: 'error',
          content: `最多只能上传${maxCount}个文件`,
        })
        return Upload.LIST_IGNORE
      } else {
        setFileList([...fileList, file])
      }
      return false
    },
  }

  const handleOk = async () => {
    setLoading(true)
    try {
      await onUpload(fileList)
      setFileList([])
      // handleCancel() // Close the modal
    } catch (error) {
      message.error('Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="导入题库"
        open={visible}
        maskClosable={false}
        closable={!loading}
        okText="确定"
        onOk={handleOk}
        okButtonProps={{
          disabled: !fileList.length,
        }}
        confirmLoading={loading}
        cancelText="取消"
        onCancel={handleCancel}
        cancelButtonProps={{
          disabled: loading,
        }}
      >
        <Spin spinning={loading}>
          <Upload {...props}>
            <Flex justify="center" align="center">
              <Button icon={<UploadOutlined />}>选择文件</Button>
              <p className="ml-2.5 text-xs text-slate-500">
                仅限上传 {supportTypes} 文件
              </p>
            </Flex>
          </Upload>
        </Spin>
      </Modal>
    </>
  )
}
