'use client'
import React, { useState } from 'react'
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Breadcrumb, Menu, theme } from 'antd'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem'
import { Layout as AntLayout } from 'antd'
import { Header, Content, Footer } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'

const items2: MenuProps['items'] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1)

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1
      return {
        key: subKey,
        label: `option${subKey}`,
      }
    }),
  }
})

export default function Index({ children }: { children: React.ReactNode }) {
  // const [collapsed, setCollapsed] = useState(false)

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
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          items={items2}
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
