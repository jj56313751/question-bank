'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Breadcrumb, Menu, theme } from 'antd'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem'
import { Layout as AntLayout } from 'antd'
import { Header, Content, Footer } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import navItems from './navItems'

export default function Index({ children }: { children: React.ReactNode }) {
  // const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const handleMenuTo = (e: any) => {
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
          defaultSelectedKeys={['operate']}
          items={navItems}
          onClick={handleMenuTo}
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
        <Content style={{ margin: '10px 10px 0' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>List</BreadcrumbItem>
            <BreadcrumbItem>App</BreadcrumbItem>
          </Breadcrumb> */}
          <div
            style={{
              padding: 10,
              minHeight: 'calc(100vh - 20px)',
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
