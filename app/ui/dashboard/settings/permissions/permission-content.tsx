'use client'
import { useState, useEffect, useMemo } from 'react'
import { Tree, Button, Flex, message, Divider, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import type { TreeDataNode, TreeProps } from 'antd'
import { updateRolePermissions } from '@/app/lib/actions'
import type { PermissionItem, PermissionTrees } from '@/app/lib/definitions'

interface CheckStrictly {
  checked: React.Key[]
  halfChecked: React.Key[]
}

export default function Content({
  roleId,
  // roleNestedPermissions,
  allNestedPermissions,
  rolePermissions,
}: {
  roleId: number
  // roleNestedPermissions: PermissionTrees[]
  allNestedPermissions: PermissionTrees[]
  rolePermissions: PermissionItem[]
}) {
  // const { update: sessionUpdate } = useSession()
  const [messageApi, contextHolder] = message.useMessage()
  // const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<CheckStrictly>({
    checked: [],
    halfChecked: [],
  })
  // console.log('[checkedKeys]-17', checkedKeys)
  // console.log('[roleNestedPermissions]-17', roleNestedPermissions)
  const defaultExpandedKeys = useMemo(() => {
    let keys: React.Key[] = []
    // expand second level
    allNestedPermissions.forEach((item) => {
      keys.push(item.id)
      // expand third level
      // if (item.children && item.children.length) {
      //   item.children.forEach((child) => {
      //     keys.push(child.id)
      //   })
      // }
    })
    return keys
  }, [allNestedPermissions])

  useEffect(() => {
    /*  */
    // let defaultCheckedKeys: React.Key[] = []
    // const getCheckedKeys = (treeData: PermissionTrees[]) => {
    //   treeData.forEach((item) => {
    //     if (item.children && item.children.length) {
    //       getCheckedKeys(item.children)
    //       const allChildrenChecked = item.children.every((child) =>
    //         defaultCheckedKeys.includes(child.id),
    //       )
    //       if (allChildrenChecked) {
    //         defaultCheckedKeys.push(item.id)
    //       }
    //     } else {
    //       defaultCheckedKeys.push(item.id)
    //     }
    //   })
    //   return defaultCheckedKeys
    // }
    /* checkStrictly */
    let defaultCheckedKeys: CheckStrictly = { checked: [], halfChecked: [] }
    // TODO halfChecked
    rolePermissions.forEach((item) => {
      defaultCheckedKeys.checked.push(item.id)
    })
    setCheckedKeys(defaultCheckedKeys)
  }, [rolePermissions])

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    // console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue as CheckStrictly)
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
        // console.log('checkedKeys', checkedKeys)
        const { checked } = checkedKeys
        const err = await updateRolePermissions(roleId, checked as number[])
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
        checkStrictly
        defaultExpandedKeys={defaultExpandedKeys}
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
