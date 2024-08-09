'use client'
import { useState, useMemo } from 'react'
import { Tree, Button, Flex, message } from 'antd'
// import type { TreeDataNode, TreeProps } from 'antd'
import MenuEditModal from './menu-edit-modal'
import { createPermission, updatePermission } from '@/app/lib/actions'
// import { nestedPermissionsToAntdTrees } from '@/app/lib/utils'
import type { PermissionItem, PermissionTrees } from '@/app/lib/definitions'
import useHasPermission from '@/app/hooks/useHasPermission'

export default function Content({
  nestedPermissions,
}: {
  nestedPermissions: PermissionTrees[]
}) {
  // const treeData = useMemo(
  //   () => nestedPermissionsToAntdTrees(nestedPermissions),
  //   [nestedPermissions],
  // )

  const [messageApi, contextHolder] = message.useMessage()

  const canCreate = useHasPermission('dashboard_settings_menus_create-sub')
  const canEdit = useHasPermission('dashboard_settings_menus_edit')

  const renderTitle = (node: any) => {
    return (
      <Flex className="flex-1" align="center">
        <span className="flex-1">{node?.name}</span>
        {canCreate && (
          <Button
            type="link"
            size="small"
            onClick={() => openModal(node, 'create')}
          >
            新增
          </Button>
        )}
        {canEdit && (
          <Button
            type="link"
            size="small"
            onClick={() => openModal(node, 'edit')}
          >
            编辑
          </Button>
        )}
      </Flex>
    )
  }

  const [visible, setVisible] = useState<boolean>(false)
  const [editId, setEditId] = useState<number>()
  const [modalType, setModalType] = useState<string>('create')
  const [modalData, setModalData] =
    useState<
      Pick<
        PermissionItem,
        'type' | 'isMenu' | 'name' | 'permission' | 'path' | 'icon' | 'sort'
      >
    >()
  const openModal = (node: any, type: string) => {
    const data = JSON.parse(JSON.stringify(node))
    setModalType(type)
    if (type === 'edit') {
      // delete data.children
      setModalData(data)
    } else if (type === 'create') {
      setModalData({
        type: 1,
        isMenu: 1,
        name: '',
        permission: '',
        path: '',
        icon: '',
        sort: null,
      })
    }
    setEditId(node.id)
    setVisible(true)
  }

  const handleEditOk = async (form: any) => {
    form
      .validateFields()
      .then(async (values: any) => {
        // console.log('[values]-18', values)
        values.isMenu = values.isMenu ? +values.isMenu : 0
        values.type = +values.type
        let err: any
        if (modalType === 'create') {
          values.parentId = editId
          err = await createPermission(values)
        } else if (modalType === 'edit') {
          err = await updatePermission(editId as number, values)
        }
        // console.log('[err]-20', err)
        if (!err) {
          messageApi.success('操作成功')
          setVisible(false)
          form.resetFields()
        } else {
          if (err.code === 'P2002') {
            messageApi.error('权限名称已存在')
          } else {
            messageApi.error(err.message)
          }
        }
      })
      .catch((err: any) => console.log('err', err))
  }

  return (
    <div className="px-2.5">
      {contextHolder}
      <Tree
        fieldNames={{
          title: 'name',
          key: 'id',
          children: 'children',
        }}
        treeData={nestedPermissions}
        titleRender={renderTitle}
        blockNode
        showLine
      />
      {(canCreate || canEdit) && (
        <MenuEditModal
          title={modalType === 'create' ? '新增' : '编辑'}
          visible={visible}
          initialValues={modalData}
          handleOk={handleEditOk}
          handleCancel={() => setVisible(false)}
        />
      )}
    </div>
  )
}
