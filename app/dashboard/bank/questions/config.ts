import { SearchFormItem } from '@/app/lib/types'
import { questionTypesMap } from '@/app/lib/constant'
import { mapToOptions } from '@/app/lib/utils'

export const searchItems: SearchFormItem[] = [
  {
    type: 'input',
    formItemProps: {
      label: '题干',
      name: 'title',
    },
    props: {
      placeholder: '请输入题干关键字',
      allowClear: true,
    },
  },
  {
    type: 'select',
    formItemProps: {
      label: '类型',
      name: 'type',
    },
    props: {
      placeholder: '请选择',
      allowClear: true,
      options: mapToOptions(questionTypesMap),
    },
  },
]
