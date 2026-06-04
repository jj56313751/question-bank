/**
 * 向量检索服务客户端（对接 Python vector-service）
 */

const VECTOR_SERVICE_URL =
  process.env.VECTOR_SERVICE_URL || 'http://127.0.0.1:8001'

/** 最低相关度 0~1，低于此值不返回，默认 0.5（50%） */
export const VECTOR_MIN_SCORE = Number(process.env.VECTOR_MIN_SCORE ?? '0.5')

export interface VectorQuestionPayload {
  id: number
  bankId: number
  type?: number | null
  title: string
  options?: string | null
  answer?: string | null
  analysis?: string | null
}

export interface VectorSearchHit {
  id: number
  score: number
}

async function vectorFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${VECTOR_SERVICE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      console.error(`[vector-search] ${path} ${res.status}: ${text}`)
      return null
    }
    return (await res.json()) as T
  } catch (error) {
    console.error(`[vector-search] ${path}`, error)
    return null
  }
}

/** 写入或更新单条题目向量 */
export async function indexQuestionVector(
  question: VectorQuestionPayload,
): Promise<boolean> {
  const data = await vectorFetch<{ ok: boolean }>('/api/questions/index', {
    method: 'POST',
    body: JSON.stringify(question),
  })
  return Boolean(data?.ok)
}

/** 从向量库删除题目 */
export async function deleteQuestionVector(id: number): Promise<boolean> {
  const data = await vectorFetch<{ ok: boolean }>(`/api/questions/${id}`, {
    method: 'DELETE',
  })
  return Boolean(data?.ok)
}

/** 批量写入题目向量 */
export async function batchIndexQuestionVectors(
  questions: VectorQuestionPayload[],
): Promise<boolean> {
  if (!questions.length) return true
  const data = await vectorFetch<{ ok: boolean; count: number }>(
    '/api/questions/batch-index',
    {
      method: 'POST',
      body: JSON.stringify({ questions }),
    },
  )
  return Boolean(data?.ok)
}

/** 语义向量检索，返回题目 id 与相似度 */
export async function searchQuestionsByVector(
  query: string,
  bankId: number,
  topK = 20,
  minScore: number = VECTOR_MIN_SCORE,
): Promise<VectorSearchHit[]> {
  const data = await vectorFetch<{ results: VectorSearchHit[] }>(
    '/api/questions/search',
    {
      method: 'POST',
      body: JSON.stringify({ query, bankId, topK, minScore }),
    },
  )
  return data?.results ?? []
}

/** 检查向量服务是否可用 */
export async function isVectorServiceHealthy(): Promise<boolean> {
  const data = await vectorFetch<{ status: string }>('/health')
  return data?.status === 'ok'
}
