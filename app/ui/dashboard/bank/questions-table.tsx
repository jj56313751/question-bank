'use client'
import { Button, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { QuestionList } from '@/app/lib/types'
import { questionTypesMap } from '@/app/lib/constant'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const columns: TableProps<QuestionList>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 80,
  },
  {
    title: <div className="text-center">题干</div>,
    dataIndex: 'title',
    key: 'title',
    width: 300,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 150,
    render: (_, record) => questionTypesMap[String(record.type)],
  },
  {
    title: <div className="text-center">选项</div>,
    dataIndex: 'options',
    key: 'options',
    width: 300,
  },
  {
    title: <div className="text-center">正确答案</div>,
    dataIndex: 'answer',
    key: 'answer',
    width: 300,
  },
  {
    title: <div className="text-center">解析</div>,
    dataIndex: 'analysis',
    key: 'analysis',
    width: 300,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Space size="small">
        <Button type="link">编辑</Button>
        <Button type="link">删除</Button>
      </Space>
    ),
  },
]

export default function ListTable({
  dataSource,
  total,
}: {
  dataSource: QuestionList[]
  total: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

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
