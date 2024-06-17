'use client'
import { Button, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'

interface DataType {
  id: number
  name: string
  total: number
  description: string
  createdAt: string
  updatedAt: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '题库',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '题目数量',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '创建日期',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '更新日期',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="text">编辑</Button>
        <Button type="text">导入</Button>
      </Space>
    ),
  },
]

export default function ListTable({ dataSource }: { dataSource: DataType[] }) {
  return (
    <>
      <Table columns={columns} dataSource={dataSource} />
    </>
  )
}
