import React from 'react'
import * as icons from '@ant-design/icons'
import type { PermissionItem, PermissionTrees } from '@/app/lib/definitions'

type IconType = React.ComponentType<{ className?: string }>

const iconsMap: { [key: string]: IconType } = Object.keys(icons)
  .filter((key) => {
    const icon = (icons as any)[key]
    return (
      typeof icon === 'function' || (icon && typeof icon.render === 'function')
    )
  })
  .reduce(
    (acc, key) => {
      acc[key] = (icons as any)[key]
      return acc
    },
    {} as { [key: string]: IconType },
  )

function getIconComponent(iconName: string): IconType | null {
  return iconsMap[iconName] || null
}

export const generateSideNavs = (
  permissions: PermissionItem[],
): PermissionTrees[] | void => {
  let navs: PermissionTrees[] = []
  const data = JSON.parse(JSON.stringify(permissions))
  data.sort((a: any, b: any) => a.sort - b.sort)
  const filteredData = data.filter((item: any) => item.isMenu)
  if (filteredData.length) {
    // only show menu items
    filteredData.forEach((item: any) => {
      const navItem: any = {
        key: item.path,
        label: item.name,
        icon: item.icon
          ? React.createElement(getIconComponent(item.icon) as IconType)
          : null,
      }
      if (item.children && item.children.length > 0) {
        navItem.children = generateSideNavs(item.children)
      }
      navs.push(navItem)
    })
    return navs
  }
}
