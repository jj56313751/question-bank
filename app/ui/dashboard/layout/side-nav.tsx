'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Button, Modal } from 'antd'
import { generateSideNavs } from './config'
import { LogoutOutlined } from '@ant-design/icons'
import { signOutAction } from '@/app/lib/actions'
import type { PermissionTrees } from '@/app/lib/definitions'
import { useSession } from 'next-auth/react'

export default function SideNav() {
  // 待官方修复，SessionProvider中需要手动刷新才能获取session https://github.com/nextauthjs/next-auth/issues/9504
  const {
    data: session,
    update: sessionUpdate,
    status: sessionStatus,
  }: any = useSession()
  const router = useRouter()
  const pathName = usePathname()
  const defaultSelectedKeys: string[] = ['operate']
  const [selectedKeys, setSelectedkeys] =
    useState<string[]>(defaultSelectedKeys)
  const [openKeys, setOpenKeys] = useState<string[]>()
  const [navItems, setNavItems] = useState<PermissionTrees[]>([])
  const [userInfo, setUserInfo] = useState<any>(null)
  const hasFetchedUserInfo = useRef(false)
  const hasUpdatedSession = useRef(false)

  useEffect(() => {
    if (sessionStatus === 'loading') return
    const getUserInfo = async () => {
      // update session
      const res: any = await fetch('/api/personal/profile')
      const data = await res.json()
      // console.log('[data]-127', data)
      if (data && data.code === 200) {
        setUserInfo(data.result)
      }
    }
    if (session && !hasFetchedUserInfo.current) {
      getUserInfo()
      hasFetchedUserInfo.current = true

      if (session && session.user && session.user.permissions) {
        setNavItems(
          generateSideNavs(session.user.permissions) as PermissionTrees[],
        )
      }
    }
    const path = pathName.split('/')
    const keys = path.filter((item) => item)
    keys.shift() // remove /dashboard
    setSelectedkeys(keys)
    if (keys.length > 1) {
      // open children
      setOpenKeys(keys.slice(0, -1))
    }
  }, [pathName, session, sessionStatus])

  useEffect(() => {
    if (userInfo && !hasUpdatedSession.current) {
      console.log('[userInfo]-59', userInfo)
      const update = async () => {
        await sessionUpdate(userInfo)
        hasUpdatedSession.current = true
      }
      update()
    }
  }, [userInfo, sessionUpdate])

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
        items={navItems as any[]}
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
