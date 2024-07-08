'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Button, Modal } from 'antd'
import navItems from './navItems'
import { LogoutOutlined } from '@ant-design/icons'
import { signOutAction } from '@/app/lib/actions'

export default function SideBar({}) {
  const router = useRouter()
  const pathName = usePathname()
  const defaultSelectedKeys: string[] = ['operate']
  const [selectedKeys, setSelectedkeys] =
    useState<string[]>(defaultSelectedKeys)
  const [openKeys, setOpenKeys] = useState<string[]>()
  useEffect(() => {
    const path = pathName.split('/')
    const keys = path.filter((item) => item)
    keys.shift() // remove /dashboard
    setSelectedkeys(keys)
    if (keys.length > 1) {
      // open children
      setOpenKeys(keys.slice(0, -1))
    }
  }, [pathName])
  // console.log('selectedKeys', selectedKeys)
  // console.log('openKeys', openKeys)

  const onMeunClick = (e: any) => {
    const { keyPath } = e
    let path = '/dashboard'
    while (keyPath.length) {
      path += `/${keyPath.pop()}`
    }
    router.push(path)
  }

  const handleConfirm = () => {
    Modal.confirm({
      title: '退出登录',
      content: '确定要退出吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        signOutAction()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
        items={navItems}
        onClick={onMeunClick}
      />
      <form
        action={handleConfirm}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: 0,
          right: 0,
          height: '32px',
          padding: '0 16px',
        }}
      >
        <Button
          type="primary"
          block
          danger
          icon={<LogoutOutlined />}
          htmlType="submit"
        >
          退出登录
        </Button>
      </form>
    </>
  )
}
