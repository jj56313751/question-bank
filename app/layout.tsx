import '@/app/ui/global.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | 题库管理系统',
    default: '题库管理系统',
  },
  // description: 'The official Next.js Course Dashboard, built with App Router.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
