import { Spin } from 'antd'

export default function DashboardLoading() {
  return (
    <div
      className="flex flex-1 items-center justify-center"
      style={{
        minHeight: 'calc(100vh - 20px)',
        padding: '10px',
        boxSizing: 'border-box',
        background: '#fff',
        borderRadius: '8px',
      }}
    >
      <Spin size="large" tip="加载中..." />
    </div>
  )
}
