import { Metadata } from 'next'
import DashboardContent from '@/app/ui/dashboard/dashboad-content'

export const metadata: Metadata = {
  title: {
    template: '%s | 控制台',
    default: '控制台',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardContent>{children}</DashboardContent>
}
