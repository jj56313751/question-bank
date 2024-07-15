import { SearchFormItem } from '@/app/lib/types'
import { isEnabledMap } from '@/app/lib/constant'
import { mapToOptions } from '@/app/lib/utils'

export const searchItems: SearchFormItem[] = [
  {
    type: 'input',
    formItemProps: {
      label: '题库',
      name: 'name',
    },
    props: {
      placeholder: '请输入题库关键字',
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
