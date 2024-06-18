'use client'
import { Button, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { Bank } from '@/app/lib/definitions'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const columns: TableProps<Bank>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: '题库',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '题目数量',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
  },
  {
    title: '创建日期',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
  },
  {
    title: '更新日期',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Space size="small">
        <Button type="link">编辑</Button>
        <Button type="link">导入</Button>
      </Space>
    ),
  },
]

export default function ListTable({
  dataSource,
  total,
}: {
  dataSource: Bank[]
  total: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const onPaginationChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams)
    console.log(page, pageSize)
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

  return (
    <Table
      className="flex-1"
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={{
        defaultCurrent: searchParams.get('pageNumber')
          ? Number(searchParams.get('pageNumber'))
          : undefined,
        defaultPageSize: searchParams.get('pageSize')
          ? Number(searchParams.get('pageSize'))
          : undefined,
        showSizeChanger: true,
        onChange: onPaginationChange,
        total: total,
      }}
    />
  )
}
