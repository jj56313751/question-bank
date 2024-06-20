'use client'
import { Button, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { BankList } from '@/app/lib/types'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import dayjs from 'dayjs'

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
        dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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

  return (
    <Table
      className="flex-1"
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      scroll={{
        x: 1000,
      }}
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
