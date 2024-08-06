import { ApiResponse } from './definitions'

export function createResponse<T>(
  code: number,
  message?: string,
  result?: T,
): ApiResponse<T> {
  return {
    code,
    result,
    message,
  }
}
