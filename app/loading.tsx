import { Spin } from 'antd'

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#f5f5f5' }}
    >
      <Spin size="large" tip="加载中..." />
    </div>
  )
}
