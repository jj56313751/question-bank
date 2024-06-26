// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
import { questionTypesMap } from './constant'
export interface CommonDate {
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface User extends CommonDate {
  id: number
  name: string
  email: string
  password: string
}

export interface Bank extends CommonDate {
  id: number
  name: string
  description: string
  created_by: number
  updated_by?: number
  deleted_by?: number
}

export interface Question extends CommonDate {
  id: number
  type: keyof typeof questionTypesMap
  title: string
  options: string
  answer: string
  analysis?: string
  bank_id: number
  created_by: number
  updated_by?: number
  deleted_by?: number
}
