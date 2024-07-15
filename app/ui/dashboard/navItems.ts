import React from 'react'
import type { MenuProps } from 'antd'
import {
  FileSearchOutlined,
  DatabaseOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

const navItems: MenuProps['items'] = [
  {
    key: 'operate',
    icon: React.createElement(FileSearchOutlined),
    label: '快速搜题',
  },
  {
    key: 'bank',
    icon: React.createElement(DatabaseOutlined),
    label: '题库管理',
    children: [
      {
        key: 'list',
        label: '题库列表',
      },
    ],
  },
  {
    key: 'tools',
    icon: React.createElement(ToolOutlined),
    label: '工具',
    children: [
      {
        key: 'format',
        label: '文档格式化',
      },
    ],
  },
  {
    key: 'settings',
    icon: React.createElement(SettingOutlined),
    label: '设置',
    children: [
      {
        key: 'users',
        label: '用户管理',
      },
    ],
  },
  // {
  //   key: 'logout',
  //   icon: React.createElement(LogoutOutlined),
  //   label: '退出登录',
  // },
]

export default navItems
