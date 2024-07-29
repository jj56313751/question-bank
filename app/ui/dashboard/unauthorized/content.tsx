'use client'
import { Flex, Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      className="md:h-30 h-20 w-full"
    >
      <p className="mb-2 text-base">该页面不存在或您无权访问，请联系管理员</p>
      <Button type="primary" onClick={() => router.push('/dashboard')}>
        返回首页
      </Button>
    </Flex>
  )
}
