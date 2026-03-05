'use client'

import { useRouter } from 'next/navigation'
import { useNavigationContext } from '@/app/ui/dashboard/layout/navigation-context'

/**
 * 在 dashboard 内使用会显示顶部导航进度条，否则与 useRouter 的 push/replace 行为一致。
 */
export function useNavigateWithProgress() {
  const router = useRouter()
  const navigation = useNavigationContext()

  return {
    push: navigation ? navigation.navigate : router.push,
    replace: navigation ? navigation.replace : router.replace,
  }
}
