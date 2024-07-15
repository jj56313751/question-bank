'use client'
import { useState } from 'react'
import { Button, Upload, message, Alert, Spin } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadProps } from 'antd/es/upload/interface'
import mammoth from 'mammoth'
import { saveAs } from 'file-saver'
import { fileTypeMap } from '@/app/lib/constant'
import { documentProcess } from '@/app/lib/documentProcess'

const { Dragger } = Upload
const { txt, docx } = fileTypeMap
const supportTypes = '.docx,.txt'

export default function FormatContent() {
  const [messageApi, contextHolder] = message.useMessage()
  const [fileName, setFileName] = useState<string>('')
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileRead = async (file: File) => {
    setLoading(true)
    let text = ''
    try {
      const arrayBuffer = await file.arrayBuffer()
      if ([docx].includes(file.type)) {
        const { value } = await mammoth.extractRawText({ arrayBuffer })
        text = value
      } else if (file.type === txt) {
        text = new TextDecoder().decode(arrayBuffer)
      }
      setFileContent(documentProcess(text))
      setLoading(false)
    } catch (error) {
      console.log('[error]-35', error)
      messageApi.open({
        type: 'error',
        content: JSON.stringify(error),
      })
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `${fileName}.json`)
  }

  const props: UploadProps = {
    name: 'file',
    accept: supportTypes,
    multiple: false,
    showUploadList: false,
    disabled: loading,
    beforeUpload: async (file) => {
      // console.log('[file]-50', file)
      if (![txt, docx].includes(file.type)) {
        messageApi.open({
          type: 'error',
          content: `仅限上传${supportTypes.split(',').join('、')}文件`,
        })
        return Upload.LIST_IGNORE
      }
      const filePrefix = file.name.slice(0, file.name.lastIndexOf('.'))
      setFileName(filePrefix)
      await handleFileRead(file)
      return false // Prevent automatic upload
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <>
      {contextHolder}
      <div className="mb-2.5">
        <Alert
          message="提示"
          description={
            <ul>
              <li>
                1.
                选择上传题库文件（劲量删除不需要的文本、无用的特殊符号、图片、题库名称“XXX资格考试_练习”，以提高转化效率）系统将自动去除重复题目
              </li>
              <li>2. 等待系统处理完成，点击下载文件，可在题库中进行批量导入</li>
            </ul>
          }
          type="info"
        />
      </div>
      <Spin spinning={loading}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            将文件拖到此处，或<em style={{ color: '#38bdf8' }}>点击上传</em>
          </p>
          <p className="ant-upload-hint">
            仅支持单文件，类型为{supportTypes.split(',').join('、')}
          </p>
        </Dragger>
      </Spin>
      {fileContent && (
        <div className="mt-2.5 text-center">
          <pre>{`${fileName}.json`}</pre>
          <Button
            type="primary"
            onClick={handleDownload}
            style={{ marginTop: '10px' }}
          >
            下载json文件
          </Button>
        </div>
      )}
    </>
  )
}
