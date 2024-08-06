'use client'
import { useState } from 'react'
import { Button, Space, Table, message, Tag } from 'antd'
import type { TableProps } from 'antd'
import { BankList } from '@/app/lib/types'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import BankEditModal from './bank-edit-modal'
import BankImportModal from './bank-import-modal'
import { updateBank, importQuestions } from '@/app/lib/actions'
import { isEnabledMap } from '@/app/lib/constant'
import dayjs from 'dayjs'
import { objectHavingKeys } from '@/app/lib/utils'

export default function ListTable({
  dataSource,
  total,
}: {
  dataSource: BankList[]
  total: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, push } = useRouter()

  const [messageApi, contextHolder] = message.useMessage()

  const onPaginationChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams)
    // console.log(page, pageSize)
    if (page) {
      params.set('pageNumber', page.toString())
    } else {
      params.delete('pageNumber')
    }
    if (pageSize) {
      params.set('pageSize', pageSize.toString())
    } else {
      params.delete('pageSize')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const onNameClick = (id: string) => () => {
    console.log('[id]-44', id)
    push(`/dashboard/bank/questions?bankId=${id}`)
  }

  const columns: TableProps<BankList>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: <div className="text-center">题库</div>,
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (_, record) => (
        <Button type="link" onClick={onNameClick(String(record.id))}>
          {record.name}
        </Button>
      ),
    },
    {
      title: '题目数量',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      width: 150,
    },
    {
      title: <div className="text-center">描述</div>,
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Tag
          color={!!record.isEnabled ? 'success' : 'error'}
          style={{
            marginInlineEnd: 0,
          }}
        >
          {isEnabledMap[record.isEnabled]}
        </Tag>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 200,
      render: (_, record) =>
        dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      width: 200,
      render: (_, record) =>
        dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={onEditClick(record)}>
            编辑
          </Button>
          <Button type="link" onClick={onImportClick(record)}>
            导入
          </Button>
        </Space>
      ),
    },
  ]

  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [editId, setEditId] = useState<number>()
  const [editInitialValues, setEditInitialValues] =
    useState<Pick<BankList, 'name' | 'description' | 'isEnabled'>>()

  const onEditClick = (record: BankList) => () => {
    // console.log('[record]-112', record)
    setEditId(record.id)
    setEditInitialValues({
      name: record.name,
      description: record.description,
      isEnabled: record.isEnabled,
    })
    setEditVisible(true)
  }

  const handleEditOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        // console.log('[editId]-18', editId)
        values.isEnabled = +values.isEnabled
        const err = await updateBank(editId as number, values)
        if (!err) {
          messageApi.success('修改成功')
          setEditVisible(false)
        } else {
          if (err.code === 'P2002') {
            messageApi.error('题库名称已存在')
          } else {
            messageApi.error(err.message)
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  const [importVisible, setImportVisible] = useState<boolean>(false)

  const onImportClick = (record: BankList) => () => {
    setEditId(record.id)
    setImportVisible(true)
  }
  const handleImport = async (fileList: any) => {
    // console.log('[fileList]-173', fileList)
    try {
      const file = fileList[0]
      const arrayBuffer = await file.arrayBuffer()
      const text = new TextDecoder().decode(arrayBuffer)
      const jsonContent = JSON.parse(text)
      console.log('[jsonContent]-184', jsonContent)
      const wellFormed =
        Array.isArray(jsonContent) &&
        jsonContent.every((item: any) =>
          objectHavingKeys(item, [
            'type',
            'title',
            'options',
            'answer',
            'analysis',
          ]),
        )
      if (!wellFormed) {
        return messageApi.error('导入文件格式错误')
      }
      await new Promise((resolve, reject) => {
        importQuestions(editId as number, jsonContent)
          .then((err) => {
            if (!err) {
              messageApi.success('导入成功')
              resolve(true)
            } else {
              messageApi.error(err.message)
              reject(err)
            }
          })
          .catch((err: any) => {
            console.log('err', err)
            messageApi.error(err.message)
            reject(err)
          })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {contextHolder}
      <Table
        className="flex-1"
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{
          x: 1000,
          y: 'calc(100vh - 128px - 20px - 20px - 55px - 32px - 20px)',
        }}
        pagination={{
          defaultCurrent: searchParams.get('pageNumber')
            ? Number(searchParams.get('pageNumber'))
            : undefined,
          defaultPageSize: searchParams.get('pageSize')
            ? Number(searchParams.get('pageSize'))
            : undefined,
          current: searchParams.get('pageNumber')
            ? Number(searchParams.get('pageNumber'))
            : undefined,
          pageSize: searchParams.get('pageSize')
            ? Number(searchParams.get('pageSize'))
            : undefined,
          showSizeChanger: true,
          onChange: onPaginationChange,
          total: total,
        }}
      />
      <BankEditModal
        title="编辑"
        initialValues={editInitialValues}
        visible={editVisible}
        handleOk={handleEditOk}
        handleCancel={() => setEditVisible(false)}
      />
      <BankImportModal
        visible={importVisible}
        onUpload={handleImport}
        handleCancel={() => setImportVisible(false)}
      />
    </>
  )
}
