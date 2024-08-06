import '@/app/ui/global.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Metadata } from 'next'
// import { auth } from '@/auth'
// import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: {
    template: '%s | 题库管理系统',
    default: '题库管理系统',
  },
  // description: 'The official Next.js Course Dashboard, built with App Router.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await auth()

  return (
    <html lang="en">
      <body>
        {/* 待官方修复，SessionProvider中signIn需要手动刷新才能获取session 
            https://github.com/nextauthjs/next-auth/issues/9504 
        */}
        {/* <SessionProvider session={session}> */}
        <AntdRegistry>{children}</AntdRegistry>
        {/* </SessionProvider> */}
      </body>
    </html>
  )
}
