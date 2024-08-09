'use client'
import { useState } from 'react'
import { Button, Space, Table, message, Modal } from 'antd'
import type { TableProps } from 'antd'
import { QuestionList } from '@/app/lib/types'
import { questionTypesMap } from '@/app/lib/constant'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import QuestionEditModal from './question-edit-modal'
import { updateQuestion, deleteQuestion } from '@/app/lib/actions'
import useHasPermission from '@/app/hooks/useHasPermission'

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

  const [messageApi, contextHolder] = message.useMessage()

  const canEdit = useHasPermission('dashboard_bank_questions_edit')
  const canDelete = useHasPermission('dashboard_bank_questions_delete')

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

  const columns: TableProps<QuestionList>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
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
      title: <div className="text-center">题干</div>,
      dataIndex: 'title',
      key: 'title',
      width: 300,
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {canEdit && (
            <Button type="link" onClick={onEditClick(record)}>
              编辑
            </Button>
          )}
          {canDelete && (
            <Button type="link" onClick={onDeleteClick(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const [editVisable, setEditVisible] = useState<boolean>(false)
  const [editId, setEditId] = useState<number>()
  const [initialValues, setInitialValues] =
    useState<
      Pick<QuestionList, 'type' | 'title' | 'options' | 'answer' | 'analysis'>
    >()

  const onEditClick = (record: QuestionList) => () => {
    // console.log('[record]-112', record)
    setEditId(record.id)
    setInitialValues({
      type: String(record.type),
      title: record.title,
      options: record.options,
      answer: record.answer,
      analysis: record.analysis,
    })
    setEditVisible(true)
  }

  const handleEditOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        // console.log('[editId]-18', editId)
        values.type = Number(values.type)
        const err = await updateQuestion(editId as number, values)
        if (!err) {
          messageApi.success('修改成功')
          setEditVisible(false)
        } else {
          console.log('[err]-21', err)
          messageApi.error(err.message)
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  const onDeleteClick = (record: QuestionList) => () => {
    // console.log('[record]-27', record)
    Modal.confirm({
      title: '确定要删除吗？',
      content: '删除后不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const err = await deleteQuestion(record.id, record.bankId)
        if (!err) {
          messageApi.success('删除成功')
        } else {
          console.log('[err]-32', err)
          messageApi.error(err.message)
        }
      },
      onCancel() {
        console.log('Cancel')
      },
    })
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
      {canEdit && (
        <QuestionEditModal
          title="编辑"
          initialValues={initialValues}
          visible={editVisable}
          handleOk={handleEditOk}
          handleCancel={() => setEditVisible(false)}
        />
      )}
    </>
  )
}
