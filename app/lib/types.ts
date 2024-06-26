import { User, Bank, Question } from './definitions'

type CamelCase<S extends string> = S extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : S

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<K & string>]: T[K]
}
// convert database schema undeline types to camelcase types
export type UserList = CamelCaseKeys<User>
export type BankList = CamelCaseKeys<Bank>
export type QuestionList = CamelCaseKeys<Question>

export type Page = {
  pageNumber?: number
  pageSize?: number
}

export type SearchFormItem = {
  formItemProps: any
  props?: any
  type: 'select' | 'input'
}
