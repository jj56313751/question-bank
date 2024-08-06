import { SearchFormItem } from '@/app/lib/types'

export const searchItems: SearchFormItem[] = [
  {
    type: 'input',
    formItemProps: {
      label: '角色描述',
      name: 'description',
    },
    props: {
      placeholder: '请输入姓名关键字',
      allowClear: true,
    },
  },
]
