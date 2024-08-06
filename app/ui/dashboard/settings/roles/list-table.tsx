'use client'
import { useState } from 'react'
import { Button, Space, Table, message, Tag, Modal } from 'antd'
import type { TableProps } from 'antd'
import RoleEditModal from './role-edit-modal'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { updateRole } from '@/app/lib/actions'
import { isEnabledMap } from '@/app/lib/constant'
import dayjs from 'dayjs'
import type { Roles } from '@prisma/client'

export default function ListTable({
  dataSource,
  total,
}: {
  dataSource: Roles[]
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

  const columns: TableProps<Roles>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
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
        </Space>
      ),
    },
  ]

  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [editId, setEditId] = useState<number>()
  const [editInitialValues, setEditInitialValues] =
    useState<Pick<Roles, 'name' | 'description' | 'isEnabled'>>()

  const onEditClick = (record: Roles) => () => {
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
        console.log('[values]-18', values)
        console.log('[editId]-18', editId)
        // TODO: default enabled
        values.isEnabled = 1
        const err = await updateRole(editId as number, values)
        if (!err) {
          messageApi.success('修改成功')
          setEditVisible(false)
        } else {
          console.log('err', err)
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
      {/* TODO */}
      <RoleEditModal
        title="编辑"
        initialValues={editInitialValues}
        visible={editVisible}
        handleOk={handleEditOk}
        handleCancel={() => setEditVisible(false)}
      />
    </>
  )
}
