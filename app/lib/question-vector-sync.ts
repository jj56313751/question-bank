import type { Questions } from '@prisma/client'
import {
  batchIndexQuestionVectors,
  deleteQuestionVector,
  indexQuestionVector,
  type VectorQuestionPayload,
} from '@/app/lib/vector-search'

/** 将 Prisma 题目记录转为向量索引载荷 */
export function toVectorPayload(
  question: Pick<
    Questions,
    'id' | 'bankId' | 'type' | 'title' | 'options' | 'answer' | 'analysis'
  >,
): VectorQuestionPayload {
  return {
    id: question.id,
    bankId: question.bankId,
    type: question.type,
    title: question.title,
    options: question.options,
    answer: question.answer,
    analysis: question.analysis,
  }
}

/** 同步单条题目到向量库 */
export async function syncQuestionVector(
  question: Pick<
    Questions,
    'id' | 'bankId' | 'type' | 'title' | 'options' | 'answer' | 'analysis'
  >,
): Promise<void> {
  const ok = await indexQuestionVector(toVectorPayload(question))
  if (!ok) {
    console.error('[question-vector-sync] 同步失败, questionId=', question.id)
  }
}

/** 批量同步题目到向量库 */
export async function syncQuestionsVectorBatch(
  questions: Pick<
    Questions,
    'id' | 'bankId' | 'type' | 'title' | 'options' | 'answer' | 'analysis'
  >[],
): Promise<void> {
  const ok = await batchIndexQuestionVectors(
    questions.map((q) => toVectorPayload(q)),
  )
  if (!ok) {
    console.error(
      '[question-vector-sync] 批量同步失败, count=',
      questions.length,
    )
  }
}

/** 从向量库移除题目 */
export async function removeQuestionVector(id: number): Promise<void> {
  const ok = await deleteQuestionVector(id)
  if (!ok) {
    console.error('[question-vector-sync] 删除向量失败, questionId=', id)
  }
}
