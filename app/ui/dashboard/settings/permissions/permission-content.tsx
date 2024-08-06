'use client'
import { useState, useEffect } from 'react'
import { Tree, Button, Flex, message, Divider, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import type { TreeDataNode, TreeProps } from 'antd'
import { updateRolePermissions } from '@/app/lib/actions'
import type { PermissionItem, PermissionTrees } from '@/app/lib/definitions'

export default function Content({
  roleId,
  roleNestedPermissions,
  allNestedPermissions,
}: {
  roleId: number
  roleNestedPermissions: PermissionTrees[]
  allNestedPermissions: PermissionTrees[]
}) {
  const [messageApi, contextHolder] = message.useMessage()
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  // console.log('[checkedKeys]-17', checkedKeys)

  useEffect(() => {
    let defaultCheckedKeys: React.Key[] = []
    const getCheckedKeys = (treeData: PermissionTrees[]) => {
      treeData.forEach((item) => {
        if (item.children && item.children.length) {
          getCheckedKeys(item.children)
          const allChildrenChecked = item.children.every((child) =>
            defaultCheckedKeys.includes(child.id),
          )
          if (allChildrenChecked) {
            defaultCheckedKeys.push(item.id)
          }
        } else {
          defaultCheckedKeys.push(item.id)
        }
      })
      return defaultCheckedKeys
    }
    setCheckedKeys(getCheckedKeys(roleNestedPermissions))
  }, [roleNestedPermissions])

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    // console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  const { confirm } = Modal
  const onSave = async () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确定保存修改角色权限吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const err = await updateRolePermissions(roleId, checkedKeys as number[])
        if (err) {
          messageApi.error(err.message)
        } else {
          messageApi.success('保存成功')
        }
      },
      onCancel() {},
    })
  }

  return (
    <div className="px-2.5">
      {contextHolder}
      <Tree
        checkable
        blockNode
        fieldNames={{
          title: 'name',
          key: 'id',
          children: 'children',
        }}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={allNestedPermissions as any}
      />
      <Divider orientation="left" orientationMargin={20}>
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
      </Divider>
    </div>
  )
}
