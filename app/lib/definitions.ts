// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
import { questionTypesMap } from './constant'
import type { Permissions } from '@prisma/client'
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
  is_enabled: number
}

export interface Bank extends CommonDate {
  id: number
  name: string
  description: string
  is_enabled: number
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

export type PermissionItem = Omit<
  Permissions,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface PermissionTrees extends PermissionItem {
  children?: PermissionTrees[]
}
