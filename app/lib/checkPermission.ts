export const routePermissions: Record<string, string[]> = {
  '/api/roles/all': [
    'dashboard_settings_roles',
    'dashboard_settings_users_create',
    'dashboard_settings_users_edit',
  ],
  '/api/users/roles': [
    'dashboard_settings_users_create',
    'dashboard_settings_users_edit',
  ],
}

const authApi = '/api/auth'

const whiteListedRoutes: string[] = ['/api/personal/profile']

export function checkRoutePermission(route: string, userPermissions: string[]) {
  // console.log('[userPermissions]-21', userPermissions)
  // console.log('[route]-21', route)
  if (route.startsWith(authApi)) return true
  if (whiteListedRoutes.includes(route)) return true
  const requiredPermissions = routePermissions[route] || []
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  )
}

export function hasFunctionalPermission(
  session: any,
  permission: string | string[],
) {
  if (!session) return false
  const userPermissions = session.user.permissionNames
  if (Array.isArray(permission)) {
    return permission.some((p) => userPermissions.includes(p))
  } else {
    return userPermissions.includes(permission)
  }
}
