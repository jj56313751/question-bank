import { SearchFormItem } from '@/app/lib/types'

export const searchItems: SearchFormItem[] = [
  {
    type: 'input',
    formItemProps: {
      label: '题库',
      name: 'name',
    },
    props: {
      placeholder: '请输入题库关键字',
    },
  },
]
