import { useSession } from 'next-auth/react'

export default function useHasPermission(permission: string | string[]) {
  const { data: session }: any = useSession()
  // console.log('[session]-5', session)
  const user = session?.user
  const permissionNames = user?.permissionNames || []

  // Check if the user has the required permission
  let hasPermission = false
  if (Array.isArray(permission)) {
    hasPermission = permission.some((perm) => permissionNames.includes(perm))
  } else {
    hasPermission = permissionNames.includes(permission)
  }

  return hasPermission
}
