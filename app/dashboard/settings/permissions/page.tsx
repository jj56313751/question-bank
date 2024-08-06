import React, { Suspense } from 'react'
import { Metadata } from 'next'
import SearchForm from '@/app/ui/dashboard/search-form'
import { searchItems } from './config'
import {
  fetchAllRoles,
  fetchRoleNestedPermissions,
  fetchAllNestedPermissions,
  fetchRolePermissions,
} from '@/app/lib/data'
import type { PermissionTrees } from '@/app/lib/definitions'
import PermissionContent from '@/app/ui/dashboard/settings/permissions/permission-content'

export const metadata: Metadata = {
  title: '权限管理',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    roleId?: string
  }
}) {
  // console.log('[searchParams]-29', searchParams)
  const roles = await fetchAllRoles({})
  searchItems.forEach((item) => {
    if (item.formItemProps.name === 'roleId') {
      item.props.options = roles.map((role) => {
        return {
          label: role.description,
          value: String(role.id),
        }
      })
    }
  })
  let roleNestedPermissions: PermissionTrees[] = []
  if (searchParams?.roleId) {
    roleNestedPermissions = await fetchRoleNestedPermissions({
      roleId: +searchParams.roleId,
    })
    // console.log('roleNestedPermissions', roleNestedPermissions)
  }
  const allNestedPermissions = await fetchAllNestedPermissions()
  // console.log('[allNestedPermissions]-41', allNestedPermissions)

  return (
    <>
      <SearchForm items={searchItems} hasPagination={false} />
      {roleNestedPermissions.length && searchParams && searchParams.roleId ? (
        <PermissionContent
          roleId={+searchParams.roleId}
          roleNestedPermissions={roleNestedPermissions}
          allNestedPermissions={allNestedPermissions}
        />
      ) : (
        ''
      )}
    </>
  )
}
