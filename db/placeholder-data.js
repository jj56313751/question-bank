// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: 1,
    name: 'admin',
    email: 'admin@qq.com',
    password: 'admin123456',
    is_enabled: 1,
  },
  {
    id: 2,
    name: 'shane',
    email: 'shane@qq.com',
    password: '123456788',
    is_enabled: 1,
  },
  {
    id: 3,
    name: 'bank',
    email: 'bank@qq.com',
    password: '123456788',
    is_enabled: 1,
  },
  {
    id: 4,
    name: 'user',
    email: 'user@qq.com',
    password: '123456788',
    is_enabled: 1,
  },
]

const banks = [
  {
    id: 1,
    name: '测试题库1',
    description: '测试题库描述1111',
    is_enabled: 1,
    created_by: users[0].id,
  },
  {
    id: 2,
    name: '测试题库2',
    description: '测试题库描述222',
    is_enabled: 1,
    created_by: users[0].id,
  },
]

const questions = [
  {
    id: 1,
    bank_id: banks[0].id,
    created_by: users[0].id,
    type: 1,
    title: '我国（ ）最先明确了洗钱罪的罪名和定罪。',
    options: `A修订后的新宪法
B修订后的新刑法
C修订后的新中国人民银行法
D金融机构反洗钱规定`,
    answer: 'B',
    analysis: '解析111',
  },
  {
    id: 2,
    bank_id: banks[0].id,
    created_by: users[0].id,
    type: 2,
    title: '员工受纪律处分期间（   ）。',
    options: `A不得晋升职务
B不得晋升行员薪资等级
C不得参与评先评优，其违规违纪行为发生后已取得的行内荣誉应当收回
D不得调整岗位
E受到撤职、留用察看处分的，免去、解聘被处分人在我行一切职务`,
    answer: 'ABCE',
    analysis: '解析22222222',
  },
  {
    id: 3,
    bank_id: banks[0].id,
    created_by: users[0].id,
    type: 3,
    title:
      '法人金融机构应当合理划分固有风险、控制措施有效性以及剩余风险的等级。风险等级原则上应分为三级或更高。',
    options: `正确
错误`,
    answer: '错误',
    analysis: '解析111',
  },
  {
    id: 4,
    bank_id: banks[1].id,
    created_by: users[0].id,
    type: 3,
    title:
      '员工所在团队/机构负责人为员工异常行为监督管理的第一责任人，直接负责所辖团队员工异常行为的信息上报及监控帮教工作。',
    options: `正确
错误`,
    answer: '正确',
    analysis: '解析1113333333',
  },
  {
    id: 5,
    bank_id: banks[1].id,
    created_by: users[0].id,
    type: 2,
    title: '我行问责员会的主要职责：（ ）。',
    options: `A审定问责管理制度、办法、实施细则
B组织、指导、协调、检查所辖机构员工违反法律法规和本行规章制度的违规违纪行为和案件的处理
C按照问责权限审议各类问责事项，做出问责决定
D监督检查委员会会议决议的执行
E按照管理权限指导监督、检查评估下级问责委员会的工作`,
    answer: 'ABCDE',
    analysis: '解析11122222222222',
  },
]

const roles = [
  {
    id: 1,
    name: 'super_admin',
    description: '超级管理员',
    is_enabled: 1,
  },
  {
    id: 2,
    name: 'admin',
    description: '管理员',
    is_enabled: 1,
  },
  {
    id: 3,
    name: 'question_bank_admin',
    description: '题库管理员',
    is_enabled: 1,
  },
  {
    id: 4,
    name: 'user',
    description: '普通用户',
    is_enabled: 1,
  },
]

const permissions = [
  {
    id: 1,
    parentId: null,
    name: '快速搜题',
    permission: 'dashboard_operate',
    type: 1,
    path: 'operate',
    icon: 'FileSearchOutlined',
    is_menu: 1,
  },
  {
    id: 2,
    parentId: null,
    name: '题库管理',
    permission: 'dashboard_bank',
    type: 1,
    path: 'bank',
    icon: 'DatabaseOutlined',
    is_menu: 1,
  },
  {
    id: 3,
    parentId: 2,
    name: '题库列表',
    permission: 'dashboard_bank_list',
    type: 1,
    path: 'list',
    icon: null,
    is_menu: 1,
  },
  {
    id: 4,
    parentId: 2,
    name: '题目列表',
    permission: 'dashboard_bank_questions',
    type: 1,
    path: 'questions',
    icon: null,
    is_menu: 0,
  },
  {
    id: 5,
    parentId: null,
    name: '工具',
    permission: 'dashboard_tools',
    type: 1,
    path: 'tools',
    icon: 'ToolOutlined',
    is_menu: 1,
  },
  {
    id: 6,
    parentId: 5,
    name: '文档格式化',
    permission: 'dashboard_tools_format',
    type: 1,
    path: 'format',
    icon: null,
    is_menu: 1,
  },
  {
    id: 7,
    parentId: null,
    name: '设置',
    permission: 'dashboard_settings',
    type: 1,
    path: 'settings',
    icon: 'SettingOutlined',
    is_menu: 1,
  },
  {
    id: 8,
    parentId: 7,
    name: '用户管理',
    permission: 'dashboard_settings_users',
    type: 1,
    path: 'users',
    icon: null,
    is_menu: 1,
  },
  {
    id: 9,
    parentId: 7,
    name: '菜单管理',
    permission: 'dashboard_settings_menus',
    type: 1,
    path: 'menus',
    icon: null,
    is_menu: 1,
  },
  {
    id: 10,
    parentId: 7,
    name: '角色管理',
    permission: 'dashboard_settings_roles',
    type: 1,
    path: 'roles',
    icon: null,
    is_menu: 1,
  },
  {
    id: 11,
    parentId: 7,
    name: '权限管理',
    permission: 'dashboard_settings_permissions',
    type: 1,
    path: 'permissions',
    icon: null,
    is_menu: 1,
  },
]

const userRoles = [
  { user_id: users[0].id, role_id: roles[0].id },
  { user_id: users[0].id, role_id: roles[1].id },
  { user_id: users[1].id, role_id: roles[1].id },
  { user_id: users[2].id, role_id: roles[2].id },
  { user_id: users[3].id, role_id: roles[3].id },
]

const rolePermissions = [
  // 超级管理员
  { role_id: roles[0].id, permission_id: permissions[0].id },
  { role_id: roles[0].id, permission_id: permissions[1].id },
  { role_id: roles[0].id, permission_id: permissions[2].id },
  { role_id: roles[0].id, permission_id: permissions[3].id },
  { role_id: roles[0].id, permission_id: permissions[4].id },
  { role_id: roles[0].id, permission_id: permissions[5].id },
  { role_id: roles[0].id, permission_id: permissions[6].id },
  { role_id: roles[0].id, permission_id: permissions[7].id },
  { role_id: roles[0].id, permission_id: permissions[8].id },
  { role_id: roles[0].id, permission_id: permissions[9].id },
  { role_id: roles[0].id, permission_id: permissions[10].id },
  // 管理员
  { role_id: roles[1].id, permission_id: permissions[0].id },
  { role_id: roles[1].id, permission_id: permissions[1].id },
  { role_id: roles[1].id, permission_id: permissions[2].id },
  { role_id: roles[1].id, permission_id: permissions[3].id },
  { role_id: roles[1].id, permission_id: permissions[4].id },
  { role_id: roles[1].id, permission_id: permissions[5].id },
  { role_id: roles[1].id, permission_id: permissions[6].id },
  { role_id: roles[1].id, permission_id: permissions[7].id },
  // 题库管理员
  { role_id: roles[2].id, permission_id: permissions[1].id },
  { role_id: roles[2].id, permission_id: permissions[2].id },
  { role_id: roles[2].id, permission_id: permissions[3].id },
  // 普通用户
  { role_id: roles[3].id, permission_id: permissions[0].id },
]

module.exports = {
  users,
  banks,
  questions,
  roles,
  permissions,
  userRoles,
  rolePermissions,
}
