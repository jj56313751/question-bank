import { SearchFormItem } from '@/app/lib/types'
import { isEnabledMap } from '@/app/lib/constant'
import { mapToOptions } from '@/app/lib/utils'

export const searchItems: SearchFormItem[] = [
  {
    type: 'input',
    formItemProps: {
      label: '用户姓名',
      name: 'name',
    },
    props: {
      placeholder: '请输入姓名关键字',
      allowClear: true,
    },
  },
  {
    type: 'input',
    formItemProps: {
      label: '邮箱',
      name: 'email',
    },
    props: {
      placeholder: '请输入邮箱关键字',
      allowClear: true,
    },
  },
  {
    type: 'select',
    formItemProps: {
      label: '状态',
      name: 'isEnabled',
    },
    props: {
      placeholder: '请选择',
      allowClear: true,
      options: mapToOptions(isEnabledMap),
    },
  },
]
