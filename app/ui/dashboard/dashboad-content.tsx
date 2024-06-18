'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Breadcrumb, Menu, theme } from 'antd'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem'
import { Layout as AntLayout } from 'antd'
import { Header, Content, Footer } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import navItems from './navItems'

export default function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  // const [collapsed, setCollapsed] = useState(false)
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

  return (
    <AntLayout className="ant-layout-has-sider" style={{ height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
        zeroWidthTriggerStyle={{
          top: '0',
          width: '30px',
          height: '30px',
          insetInlineEnd: '-30px',
        }}
      >
        <div
          style={{
            height: '32px',
            margin: '16px',
            background: '#fff3',
            borderRadius: '6px',
          }}
        />
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
      </Sider>
      <div
        style={{
          flex: 1,
          background: '#f5f5f5',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* <Header style={{ padding: 0, background: '#fff' }}></Header> */}
        <Content
          style={{ padding: '10px' }}
          className="box-border flex h-full flex-col"
        >
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>List</BreadcrumbItem>
            <BreadcrumbItem>App</BreadcrumbItem>
          </Breadcrumb> */}
          <div
            style={{
              padding: 10,
              minHeight: '100%',
              boxSizing: 'border-box',
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            {children}
          </div>
        </Content>
      </div>
      {/* <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer> */}
    </AntLayout>
  )
}
