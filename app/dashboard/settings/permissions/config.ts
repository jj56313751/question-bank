import { SearchFormItem } from '@/app/lib/types'

export const searchItems: SearchFormItem[] = [
  {
    type: 'select',
    formItemProps: {
      label: '选择角色',
      name: 'roleId',
    },
    props: {
      placeholder: '请选择角色',
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
]
