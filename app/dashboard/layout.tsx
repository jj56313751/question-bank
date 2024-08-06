import { Metadata } from 'next'
// import DashboardContent from '@/app/ui/dashboard/dashboad-content'
import SideNav from '@/app/ui/dashboard/layout/side-nav'
import { Layout as AntLayout, Flex } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Sider from 'antd/lib/layout/Sider'
import Image from 'next/image'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: {
    template: '%s | 控制台',
    default: '控制台',
  },
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <AntLayout className="ant-layout-has-sider" style={{ height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        zeroWidthTriggerStyle={{
          top: '0',
          width: '30px',
          height: '30px',
          insetInlineEnd: '-30px',
        }}
      >
        <div
          style={{
            overflow: 'auto',
            height: '100vh',
            paddingBottom: '42px',
            position: 'relative',
          }}
        >
          <Flex
            align="center"
            style={{
              height: '32px',
              margin: '16px',
            }}
          >
            <Image src="/logo.png" width={32} height={32} alt="Question Bank" />
            <p className="ml-1 flex-1 text-lg text-white">Question Bank</p>
          </Flex>
          <SideNav session={session} />
        </div>
      </Sider>
      <div
        style={{
          flex: 1,
          background: '#f5f5f5',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Content
          style={{ padding: '10px' }}
          className="box-border flex h-full flex-col"
        >
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
    </AntLayout>
  )
}
